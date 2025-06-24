# YOLOv5 🚀 by Ultralytics, GPL-3.0 license
# YOLOv5 🚀 by Ultralytics, GPL-3.0 license
"""
Run inference on images, videos, directories, streams, etc.

Usage - sources:
    $ python path/to/detect.py --weights yolov5s.pt --source 0              # webcam
                                                             img.jpg        # image
                                                             vid.mp4        # video
                                                             path/          # directory
                                                             path/*.jpg     # glob
                                                             'https://youtu.be/Zgi9g1ksQHc'  # YouTube
                                                             'rtsp://example.com/media.mp4'  # RTSP, RTMP, HTTP stream

Usage - formats:
    $ python path/to/detect.py --weights yolov5s.pt                 # PyTorch
                                         yolov5s.torchscript        # TorchScript
                                         yolov5s.onnx               # ONNX Runtime or OpenCV DNN with --dnn
                                         yolov5s.xml                # OpenVINO
                                         yolov5s.engine             # TensorRT
                                         yolov5s.mlmodel            # CoreML (macOS-only)
                                         yolov5s_saved_model        # TensorFlow SavedModel
                                         yolov5s.pb                 # TensorFlow GraphDef
                                         yolov5s.tflite             # TensorFlow Lite
                                         yolov5s_edgetpu.tflite     # TensorFlow Edge TPU
"""

import argparse
import os
import sys
import cv2, numpy as np
from pathlib import Path

import pickle
import torch
import torch.backends.cudnn as cudnn

import schedule
import time
from calibration_loader import load_calibration_from_aruco
import json


FILE = Path(__file__).resolve()
ROOT = FILE.parents[0]  # YOLOv5 root directory
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))  # add ROOT to PATH
ROOT = Path(os.path.relpath(ROOT, Path.cwd()))  # relative
FONT=cv2.FONT_HERSHEY_SIMPLEX

from models.common import DetectMultiBackend
from utils.datasets import IMG_FORMATS, VID_FORMATS, LoadImages, LoadStreams
from utils.general import (LOGGER, check_file, check_img_size, check_imshow, check_requirements, colorstr, cv2,
                           increment_path, non_max_suppression, print_args, scale_coords, strip_optimizer, xyxy2xywh)
from utils.plots import Annotator, colors, save_one_box
from utils.torch_utils import select_device, time_sync
from seat_api_sender import send_seat_status


###############################################################################################
# https://docs.opencv.org/4.x/da/d54/group__imgproc__transform.html 
# 위 사이트의 warpPerspective 변환공식을 사용하였습니다.
def convert_perspective(p, x1, y1):
    result = ((p[0, 0] * x1 + p[0, 1] * y1 + p[0, 2]) / (p[2, 0] * x1 + p[2, 1] * y1 + p[2, 2]),
              (p[1, 0] * x1 + p[1, 1] * y1 + p[1, 2]) / (p[2, 0] * x1 + p[2, 1] * y1 + p[2, 2]))
    return result

def load_calibration(store_id):
    filepath = f'./calibration/store{store_id}.json'
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Calibration file not found: {filepath}")

    with open(filepath, 'r') as f:
        data = json.load(f)
    pts1 = np.float32(data['pts1'])
    pts2 = np.float32(data['pts2'])
    perspect_mat = cv2.getPerspectiveTransform(pts1, pts2)
    return perspect_mat

def find_closest_seat(x, y, seat_list, used_ids=None, min_dist_threshold=100**2):
    min_dist = float('inf')
    closest_seat = None

    for seat in seat_list:
        if used_ids and seat.seatNum in used_ids:
            continue

        dist = (seat.xPos - x) ** 2 + (seat.yPos - y) ** 2
        if dist < min_dist:
            min_dist = dist
            closest_seat = seat

    if closest_seat and min_dist < min_dist_threshold:
        return closest_seat
    else:
        return None  # 너무 멀어서 유효하지 않다고 판단

def map_detections_to_seats(detections, perspective_matrix, seat_list, min_dist_threshold=100**2):
    """
    감지된 객체를 실제 좌석에 매핑하여 seatID 포함한 상태 리스트 반환
    :param detections: [(x, y, class_label)]
    :param perspective_matrix: OpenCV perspective 변환 행렬
    :param seat_list: 사전에 저장된 좌석 객체 리스트
    :param min_dist_threshold: 좌석과 감지 좌표 간 최대 거리 제곱값
    :return: [{"seatID": int, "state": int}, ...]
    """
    mapped = []
    used_seat_ids = set()  # 중복 매핑 방지용

    for x, y, label in detections:
        px, py = convert_perspective(perspective_matrix, x, y)

        # 가장 가까운 좌석 찾되, 이미 매핑된 좌석 제외
        closest_seat, dist = None, float('inf')
        for seat in seat_list:
            if seat.seatNum in used_seat_ids:
                continue
            d = (seat.xPos - px) ** 2 + (seat.yPos - py) ** 2
            if d < dist:
                dist = d
                closest_seat = seat

        # 너무 멀면 무시
        if dist >= min_dist_threshold or closest_seat is None:
            print(f"[WARN] ({px:.1f}, {py:.1f})는 어떤 좌석과도 충분히 가깝지 않음 → 매핑 생략")
            continue

        used_seat_ids.add(closest_seat.seatNum)

        state_map = {
            "empty_table": 0,
            "using_table": 1,
            "step_out": 2,
            "long_step_out": 3
        }

        mapped.append({
            "seatID": closest_seat.seatNum,
            "state": state_map.get(label, 0)  # 기본값 empty_table
        })

    return mapped


class seatSave:
    def __init__(self, xPos, yPos, width, height, seatShape, seatNum, seatInfo, seatCount):
        self.xPos = xPos
        self.yPos = yPos
        self.width = width
        self.height = height
        self.seatShape = seatShape
        self.seatNum = seatNum
        self.seatInfo = seatInfo
        self.seatCount = seatCount
        #self.count = count

    def print(self):
        print(f'xPos: {self.xPos}')
        print(f'yPos: {self.yPos}')
        print(f'width: {self.width}')
        print(f'height: {self.height}')
        print(f'seatShape: {self.seatShape}')
        print(f'seatNum: {self.seatNum}')
        print(f'seatInfo: {self.seatInfo}')
        print(f'seatCount: {self.seatCount}')

class seatClass:
    # seatShape mean -> table or longtable
    # seatNum is Number of Seat
    # seatInfo is state of table

    # count
    def __init__(self, xPos, yPos, width, height, seatShape, seatNum, seatInfo, seatCount):
        self.xPos = xPos
        self.yPos = yPos
        self.width = width
        self.height = height
        self.seatShape = seatShape
        self.seatNum = seatNum
        self.seatInfo = seatInfo
        self.seatCount = seatCount

    def print(self):
        print(f'xPos: {self.xPos}')
        print(f'yPos: {self.yPos}')
        print(f'width: {self.width}')
        print(f'height: {self.height}')
        print(f'seatShape: {self.seatShape}')
        print(f'seatNum: {self.seatNum}')
        print(f'seatInfo: {self.seatInfo}')
        print(f'seatCount: {self.seatCount}')

    def count(self, seatCount):
        # if self
        pass

    def __getitem__(self, idx):
        return [
            self.xPos, self.yPos, self.width, self.height,
            self.seatShape, self.seatNum, self.seatInfo, self.seatCount
        ][idx]


@torch.no_grad()
def run(
        weights=ROOT / 'yolov5s.pt',  # model.pt path(s)
        source=ROOT / 'data/images',  # file/dir/URL/glob, 0 for webcam
        data=ROOT / 'data/coco128.yaml',  # dataset.yaml path
        imgsz=(640, 640),  # inference size (height, width)
        conf_thres=0.25,  # confidence threshold
        iou_thres=0.45,  # NMS IOU threshold
        max_det=1000,  # maximum detections per image
        device='',  # cuda device, i.e. 0 or 0,1,2,3 or cpu
        view_img=False,  # show results
        save_txt=False,  # save results to *.txt
        save_conf=False,  # save confidences in --save-txt labels
        save_crop=False,  # save cropped prediction boxes
        nosave=False,  # do not save images/videos
        classes=None,  # filter by class: --class 0, or --class 0 2 3
        agnostic_nms=False,  # class-agnostic NMS
        augment=False,  # augmented inference
        visualize=False,  # visualize features
        update=False,  # update all models
        project=ROOT / 'runs/detect',  # save results to project/name
        name='exp',  # save results to project/name
        exist_ok=False,  # existing project/name ok, do not increment
        line_thickness=3,  # bounding box thickness (pixels)
        hide_labels=False,  # hide labels
        hide_conf=False,  # hide confidences
        half=False,  # use FP16 half-precision inference
        dnn=False,  # use OpenCV DNN for ONNX inference
        store_id=None,  # ✅ store_id 인자 추가
        input_path=None
):
    source = str(source)
    save_img = not nosave and not source.endswith('.txt')  # save inference images
    is_file = Path(source).suffix[1:] in (IMG_FORMATS + VID_FORMATS)
    is_url = source.lower().startswith(('rtsp://', 'rtmp://', 'http://', 'https://'))
    webcam = source.isnumeric() or source.endswith('.txt') or (is_url and not is_file)
    if is_url and is_file:
        source = check_file(source)  # download

    # Directories
    save_dir = increment_path(Path(project) / name, exist_ok=exist_ok)  # increment run
    (save_dir / 'labels' if save_txt else save_dir).mkdir(parents=True, exist_ok=True)  # make dir

    # Load model
    device = select_device(device)
    model = DetectMultiBackend(weights, device=device, dnn=dnn, data=data)
    stride, names, pt = model.stride, model.names, model.pt
    imgsz = check_img_size(imgsz, s=stride)  # check image size -> 480 x 640
    # 이미지 보간법. 2560 x 1920 사이즈일 경우 ratioX = 0.25, 0.33333


    # print(imgsz)

    # Dataloader
    if input_path:  # ✅ 새로 추가: 단일 이미지 입력 시
        dataset = LoadImages(input_path, img_size=imgsz, stride=stride, auto=pt)
        bs = 1
    else:  # 기존처럼 source 사용
        if webcam:
            view_img = check_imshow()
            cudnn.benchmark = True  # set True to speed up constant image size inference
            dataset = LoadStreams(source, img_size=imgsz, stride=stride, auto=pt)
            bs = len(dataset)
        else:
            dataset = LoadImages(source, img_size=imgsz, stride=stride, auto=pt)
            bs = 1
    vid_path, vid_writer = [None] * bs, [None] * bs
    vid_path, vid_writer = [None] * bs, [None] * bs

    # Run inference
    model.warmup(imgsz=(1 if pt else bs, 3, *imgsz))  # warmup
    dt, seen = [0.0, 0.0, 0.0], 0
    for path, im, im0s, vid_cap, s in dataset:
        t1 = time_sync()
        im = torch.from_numpy(im).to(device)
        im = im.half() if model.model.half() else im.float()  # uint8 to fp16/32
        im /= 255  # 0 - 255 to 0.0 - 1.0
        if len(im.shape) == 3:
            im = im[None]  # expand for batch dim
        t2 = time_sync()
        dt[0] += t2 - t1

        # Inference
        visualize = increment_path(save_dir / Path(path).stem, mkdir=True) if visualize else False
        pred = model(im, augment=augment, visualize=visualize)
        t3 = time_sync()
        dt[1] += t3 - t2

        # NMS
        pred = non_max_suppression(pred, conf_thres, iou_thres, classes, agnostic_nms, max_det=max_det)
        dt[2] += time_sync() - t3

        # Second-stage classifier (optional)
        # pred = utils.general.apply_classifier(pred, classifier_model, im, im0s)

        # Process predictions

        perspec = pred[0]
        # print(perspec) # show about tensor
        mid_x = []; mid_y = []
        for i in perspec:
            li = []
            for val in i:
                value = round(val.item(), 2)
                li.append(value)

            mid_x.append((li[0]+li[2])/2)
            mid_y.append((li[1]+li[3])/2)
        mid_x.reverse()
        mid_y.reverse()

        for i, det in enumerate(pred):  # per image
            di = list() # store about label name
            seen += 1
            if webcam:  # batch_size >= 1
                p, im0, frame = path[i], im0s[i].copy(), dataset.count
                s += f'{i}: '
            else:
                p, im0, frame = path, im0s.copy(), getattr(dataset, 'frame', 0)

            p = Path(p)  # to Path
            save_path = str(save_dir / p.name)  # im.jpg
            txt_path = str(save_dir / 'labels' / p.stem) + ('' if dataset.mode == 'image' else f'_{frame}')  # im.txt
            s += '%gx%g ' % im.shape[2:]  # print string
            gn = torch.tensor(im0.shape)[[1, 0, 1, 0]]  # normalization gain whwh
            imc = im0.copy() if save_crop else im0  # for save_crop
            annotator = Annotator(im0, line_width=line_thickness, example=str(names))
            if len(det):
                # Rescale boxes from img_size to im0 size
                det[:, :4] = scale_coords(im.shape[2:], det[:, :4], im0.shape).round()

                # Print results
                for c in det[:, -1].unique():
                    n = (det[:, -1] == c).sum()  # detections per class
                    s += f"{n} {names[int(c)]}{'s' * (n > 1)}, "  # add to string s-> class 이름 저장
                    # image 1/1 C:\Users\hallym\Desktop\capstone\yolov5\empty_or_using_dataset-\test\images\train_161_01.jpg: 480x640 7 empty_tables, 1 using_table,

                # Write results, 좌표값과 신뢰도 출력!
                cnt = 0
                for *xyxy, conf, cls in reversed(det):

                    if save_txt:  # Write to file
                        xywh = (xyxy2xywh(torch.tensor(xyxy).view(1, 4)) / gn).view(-1).tolist()  # normalized xywh
                        line = (cls, *xywh, conf) if save_conf else (cls, *xywh)  # label format
                        with open(txt_path + '.txt', 'a') as f:
                            f.write(('%g ' * len(line)).rstrip() % line + '\n')

                    if save_img or save_crop or view_img:  # Add bbox to image
                        c = int(cls)  # integer class 0, 1, 2 .. 과 같은 형태.

                        # print_about label + number + confidence
                        label = None if hide_labels else (names[c] if hide_conf else f'{names[c]}{cnt}{"_"}{conf:.2f}')
                        label_c = None if hide_labels else (names[c] if hide_conf else f'{names[c]}')

                        cnt+=1
                        # di.update({label_c : round(conf.item(), 10)})
                        di.append(label_c)
                        annotator.box_label(xyxy, label, color=colors(c, True))
                        if save_crop:
                            save_one_box(xyxy, imc, file=save_dir / 'crops' / names[c] / f'{p.stem}.jpg', BGR=True)

            # Stream results
            # print(di) # print about table_shape , di == table_shape
            im0 = annotator.result()
            if view_img:
                cv2.imshow(str(p), im0)
                cv2.waitKey(1)  # 1 millisecond

            string = []
            seat_num_cnt = []

            with open('backup/seatData.p', 'rb') as file:
                try:
                    while True:
                        item = pickle.load(file)
                        # seatData.p가 string 리스트라면 string 리스트에 저장
                        # 이 부분은 기존 로직 유지
                        string += [item]
                except:
                    pass

            with open('backup/seat_Num.p', 'rb') as seat_num_file:
                try:
                    while True:
                        item = pickle.load(seat_num_file)
                        if isinstance(item, list):
                            # 리스트를 seatClass로 변환
                            seat = seatClass(*item[:6], item[6], item[7])
                            seat_num_cnt.append(seat)
                        elif isinstance(item, seatClass):
                            seat_num_cnt.append(item)
                except EOFError:
                    pass

            # ✅ 디버깅: 읽어온 seatNum 내용 출력
            print(f"[디버깅] seat_Num.p 로드 완료 → 총 {len(seat_num_cnt)}개 좌석")
            for idx, seat in enumerate(seat_num_cnt):
                print(f"  [{idx}] seatID: {seat.seatNum}, (x: {seat.xPos}, y: {seat.yPos}), shape: {seat.seatShape}")

            # Save results (image with detections)
            if save_img:
                if dataset.mode == 'image':

                    OFFSET_X = 300
                    OFFSET_Y = 300

                    # store_id가 argparse로 넘어온다는 가정
                    perspect_mat = load_calibration(store_id)
                    dst = cv2.warpPerspective(im0, perspect_mat, (640, 480))

                    cv2.imwrite(save_path + "warpPerspect.jpg", dst)

                    ds = np.zeros((480, 640, 3), dtype=np.uint8)

                    posDict = dict()


                    countnum =0
                    seat_status_list = []
                    for px, py, dic in zip(mid_x, mid_y, di):
                        # ✅ 좌표 보정 적용
                        dst = convert_perspective(perspect_mat, px, py)
                        px, py = dst[0], dst[1]

                        countnum+=1

                        #### draw and projection coordinate ############
                        # perspective coordinate
                        dst = (dst[0] + OFFSET_X, dst[1] + OFFSET_Y - 80)

                        distance = []
                        for idx in range(len(seat_num_cnt)):
                            dist_val = (np.power(seat_num_cnt[idx].xPos - int(dst[0]), 2) +
                                        np.power(seat_num_cnt[idx].yPos - int(dst[1]), 2))
                            distance.append((dist_val, seat_num_cnt[idx]))

                            # 디버깅: 거리값 찍기
                            print(f"[디버그] bbox {(px, py)} → seatID {seat_num_cnt[idx].seatNum}, 좌표 ({seat_num_cnt[idx].xPos},{seat_num_cnt[idx].yPos}), 거리 제곱: {dist_val}")

                        state_of_table = min(distance, key=lambda x: x[0])[1]

                        # 디버깅: 최종 선택된 seatID 출력
                        print(f"[디버그] bbox {(px, py)} → 선택된 seatID: {state_of_table.seatNum}")

                        if state_of_table[6] == "long_step_out": table_cnt = 3
                        elif state_of_table[6] == "step_out" : table_cnt = 2
                        elif state_of_table[6] == "using_table": table_cnt = 1
                        else : table_cnt = 0 # empty_table

                        if state_of_table[5] == 1:   dst = (dst[0] + 15, dst[1]-10)
                        elif state_of_table[5] == 2: dst = (dst[0] + 1, dst[1])
                        elif state_of_table[5] == 4: dst = (dst[0] - 10, dst[1] - 55)
                        elif state_of_table[5] == 5: dst = (dst[0] - 29, dst[1] - 33)
                        elif state_of_table[5] == 6: dst = (dst[0] - 44, dst[1] + 3)
                        elif state_of_table[5] == 7: dst = (dst[0], dst[1] - 10)
                        elif state_of_table[5] == 8: dst = (dst[0] - 30, dst[1] + 60)

                        #           xpos        ypos        box_width     box_height  table_shape  num  table_state
                        if dic == "step_out":
                            ##################################################################################################
                            # send server format                                                                             #
                            ##################################################################################################

                            ##################################################################################################
                            # Detection for a period of time                                                                 #
                            ##################################################################################################

                            if state_of_table[6] == None: # 처음 시작할 때, None
                                seat_status_list += [[state_of_table[0], state_of_table[1], state_of_table[2], state_of_table[3], state_of_table[4],
                                                      state_of_table[5], "empty_table", state_of_table[7]+1]]
                                # seatClass(state_of_table[0], state_of_table[1], state_of_table[2], state_of_table[3], state_of_table[4], state_of_table[5], dic, state_of_table[7])
                            elif state_of_table[6] == dic or state_of_table[6] == "long_step_out": #step_out
                                if state_of_table[7] >= 3 and state_of_table[7] <= 5:
                                    seat_status_list += [[state_of_table[0], state_of_table[1], state_of_table[2], state_of_table[3], state_of_table[4],
                                                          state_of_table[5], state_of_table[6], state_of_table[7]+1]]
                                    # seatClass(state_of_table[0], state_of_table[1], state_of_table[2], state_of_table[3], state_of_table[4], state_of_table[5], dic, state_of_table[7])

                                elif state_of_table[7] >= 5: # 5초 x 100 -> 500초 -> 5분
                                    seat_status_list += [[state_of_table[0], state_of_table[1], state_of_table[2], state_of_table[3], state_of_table[4], state_of_table[5],
                                                          "long_step_out", state_of_table[7]+1]]

                                else:
                                    seat_status_list += [[state_of_table[0], state_of_table[1], state_of_table[2], state_of_table[3],
                                                          state_of_table[4], state_of_table[5], state_of_table[6], state_of_table[7]+1]]

                            else:

                                if state_of_table[7] >= 3:
                                    seat_status_list += [[state_of_table[0], state_of_table[1], state_of_table[2], state_of_table[3], state_of_table[4], state_of_table[5], "step_out", 0]]
                                else:
                                    seat_status_list += [[state_of_table[0], state_of_table[1], state_of_table[2], state_of_table[3], state_of_table[4],
                                                          state_of_table[5], state_of_table[6], state_of_table[7]+1]]


                        elif dic == "empty_table":
                            ##################################################################################################
                            # send server format
                            ##################################################################################################
                            # seatClass(state_of_table[0], state_of_table[1], state_of_table[2], state_of_table[3], state_of_table[4], state_of_table[5], dic, False)

                            if state_of_table[6] == None: # 처음 시작할 때, None
                                seat_status_list += [[state_of_table[0], state_of_table[1], state_of_table[2], state_of_table[3], state_of_table[4], state_of_table[5], "empty_table", 0]]
                                # seatClass(state_of_table[0], state_of_table[1], state_of_table[2], state_of_table[3], state_of_table[4], state_of_table[5], dic, state_of_table[7])
                            elif state_of_table[6] == dic: #empty_table
                                seat_status_list += [[state_of_table[0], state_of_table[1], state_of_table[2], state_of_table[3], state_of_table[4], state_of_table[5], state_of_table[6], 0]]
                                # seatClass(state_of_table[0], state_of_table[1], state_of_table[2], state_of_table[3], state_of_table[4], state_of_table[5], dic, state_of_table[7]
                            else:
                                seat_status_list += [[state_of_table[0], state_of_table[1], state_of_table[2], state_of_table[3], state_of_table[4], state_of_table[5], dic, 0]]

                        elif dic == "using_table":
                            ##################################################################################################
                            # send server format
                            ##################################################################################################
                            if state_of_table[6] == None: # 처음 시작할 때, None
                                # print(state_of_table[5])
                                # print(state_of_table[5]-1)
                                seat_status_list += [[state_of_table[0], state_of_table[1], state_of_table[2], state_of_table[3], state_of_table[4],
                                                      state_of_table[5], "using_table", state_of_table[7]+1]]

                            elif state_of_table[6] == dic: #step_out
                                seat_status_list += [[state_of_table[0], state_of_table[1], state_of_table[2], state_of_table[3], state_of_table[4], state_of_table[5], state_of_table[6], 0]]
                                # seatClass(state_of_table[0], state_of_table[1], state_of_table[2], state_of_table[3], state_of_table[4], state_of_table[5], dic, state_of_table[7]

                            else:
                                seat_status_list += [[state_of_table[0], state_of_table[1], state_of_table[2], state_of_table[3], state_of_table[4], state_of_table[5], dic, 0]]


                        posDict[(int(dst[0]), int(dst[1]))] = dic


                        color_map = {
                            "empty_table": (255, 255, 255),      # white
                            "using_table": (17, 121, 191),          # coffee
                            "step_out": (0, 255, 255),           # yellow
                            "long_step_out": (0, 0, 255)         # red
                        }
                        # 상태에 따른 색상 지정 (없으면 회색)
                        color = color_map.get(dic, (128, 128, 128))

                        # 사각형 그리기
                        ds = cv2.rectangle(ds,
                                           (int(dst[0]) - 30, int(dst[1]) - 30),
                                           (int(dst[0]) + 30, int(dst[1]) + 30),
                                           color, 2)

                        # 텍스트 작성: "좌석번호: 상태"
                        label = f"{state_of_table[5]}: {dic.replace('_', ' ')}"
                        ds = cv2.putText(ds,
                                         label,
                                         (int(dst[0]) - 30, int(dst[1]) - 35),
                                         FONT, 0.7, color, 2)
                    print(seat_status_list)

                    # seat_status_list → status_list 형식 변환
                    statusList = []
                    for entry in seat_status_list:
                        seat_id = entry[5]
                        state_str = entry[6]
                        state_map = {
                            "empty_table": 0,
                            "using_table": 1,
                            "step_out": 2,
                            "long_step_out": 3
                        }
                        statusList.append({
                            "seatID": seat_id,
                            "state": state_map.get(state_str, 0)  # 기본값: empty
                        })

                    # pickle로 상태 저장 (누적 상태 유지용)
                    with open('backup/seat_Num.p', 'wb') as seat_num_file:
                        for entry in seat_status_list:
                            seat_obj = seatClass(entry[0], entry[1], entry[2], entry[3], entry[4], entry[5], entry[6], entry[7])
                            pickle.dump(seat_obj, seat_num_file)

                    # 서버 전송
                    store_id_int = int(store_id) if isinstance(store_id, str) and store_id.isdigit() else 1
                    send_seat_status(cafe_id=store_id_int, status_list=statusList)

                    cv2.imwrite(save_path + "dst.jpg", ds)
                    cv2.imwrite(save_path, im0)

                else:  # 'video' or 'stream'
                    if vid_path[i] != save_path:  # new video
                        vid_path[i] = save_path
                        if isinstance(vid_writer[i], cv2.VideoWriter):
                            vid_writer[i].release()  # release previous video writer
                        if vid_cap:  # video
                            fps = vid_cap.get(cv2.CAP_PROP_FPS)
                            w = int(vid_cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                            h = int(vid_cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                        else:  # stream
                            fps, w, h = 30, im0.shape[1], im0.shape[0]
                        save_path = str(Path(save_path).with_suffix('.mp4'))  # force *.mp4 suffix on results videos
                        vid_writer[i] = cv2.VideoWriter(save_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (w, h))
                    vid_writer[i].write(im0)

        # Print time (inference-only)
        LOGGER.info(f'{s}Done. ({t3 - t2:.3f}s)')

    # Print results
    t = tuple(x / seen * 1E3 for x in dt)  # speeds per image
    LOGGER.info(f'Speed: %.1fms pre-process, %.1fms inference, %.1fms NMS per image at shape {(1, 3, *imgsz)}' % t)
    if save_txt or save_img:
        s = f"\n{len(list(save_dir.glob('labels/*.txt')))} labels saved to {save_dir / 'labels'}" if save_txt else ''
        LOGGER.info(f"Results saved to {colorstr('bold', save_dir)}{s}")
    if update:
        strip_optimizer(weights)  # update model (to fix SourceChangeWarning)


def parse_opt():
    parser = argparse.ArgumentParser()
    parser.add_argument('--weights', nargs='+', type=str, default = 'train/exp8_table_state/weights/best.pt', help='model path(s)')
    parser.add_argument('--source', type=str, default= '../custom_dataset_plus_longtable/test/images', help='file/dir/URL/glob, 0 for webcam')
    parser.add_argument('--data', type=str, default= './data/custom_dataset_plus_longtable.yaml', help='(optional) dataset.yaml path')
    parser.add_argument('--store-id', type=str, required=True, help='Unique store identifier (e.g., store1)')
    parser.add_argument('--input-path', type=str, help='single image path for frame-based detection')

    parser.add_argument('--imgsz', '--img', '--img-size', nargs='+', type=int, default=[640], help='inference size h,w')
    parser.add_argument('--conf-thres', type=float, default=0.25, help='confidence threshold')
    parser.add_argument('--iou-thres', type=float, default=0.45, help='NMS IoU threshold')
    parser.add_argument('--max-det', type=int, default=1000, help='maximum detections per image')
    parser.add_argument('--device', default='', help='cuda device, i.e. 0 or 0,1,2,3 or cpu')
    parser.add_argument('--view-img', action='store_true', help='show results')
    parser.add_argument('--save-txt', action='store_true', help='save results to *.txt')
    parser.add_argument('--save-conf', action='store_true', help='save confidences in --save-txt labels')
    parser.add_argument('--save-crop', action='store_true', help='save cropped prediction boxes')
    parser.add_argument('--nosave', action='store_true', help='do not save images/videos')
    parser.add_argument('--classes', nargs='+', type=int, help='filter by class: --classes 0, or --classes 0 2 3')
    parser.add_argument('--agnostic-nms', action='store_true', help='class-agnostic NMS')
    parser.add_argument('--augment', action='store_true', help='augmented inference')
    parser.add_argument('--visualize', action='store_true', help='visualize features')
    parser.add_argument('--update', action='store_true', help='update all models')
    parser.add_argument('--project', default='../runs/detect', help='save results to project/name')
    parser.add_argument('--name', default='exp', help='save results to project/name')
    parser.add_argument('--exist-ok', action='store_true', help='existing project/name ok, do not increment')
    parser.add_argument('--line-thickness', default=1, type=int, help='bounding box thickness (pixels)')
    parser.add_argument('--hide-labels', default=False, action='store_true', help='hide labels')
    parser.add_argument('--hide-conf', default=False, action='store_true', help='hide confidences')
    parser.add_argument('--half', action='store_true', help='use FP16 half-precision inference')
    parser.add_argument('--dnn', action='store_true', help='use OpenCV DNN for ONNX inference')
    opt, _ = parser.parse_known_args()
    opt.imgsz *= 2 if len(opt.imgsz) == 1 else 1  # expand
    print_args(name="detect_run2.py", opt=opt)

    return opt


def main(opt):
    if not opt.store_id:
        raise ValueError("❗ 'store_id' is required. Use --store-id argument.")
    run(**vars(opt))  # store_id 포함됨


def Ex2(store_id):
    opt = parse_opt()
    opt.store_id = store_id  # store_id 수동 삽입
    main(opt)


if __name__ == "__main__":
    opt = parse_opt()
    main(opt)

