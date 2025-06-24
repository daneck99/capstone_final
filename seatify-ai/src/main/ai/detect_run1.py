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
from calibration_loader import load_calibration_from_aruco

# import detect_run2

import schedule

import pickle
import torch
import torch.backends.cudnn as cudnn

import schedule
import time
import json

from seat_api_sender import send_seat_layout_if_changed

FILE = Path(__file__).resolve()
ROOT = FILE.parents[0]  # YOLOv5 root directory
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))  # add ROOT to PATH
ROOT = Path(os.path.relpath(ROOT, Path.cwd()))  # relative

from models.common import DetectMultiBackend
from utils.datasets import IMG_FORMATS, VID_FORMATS, LoadImages, LoadStreams
from utils.general import (LOGGER, check_file, check_img_size, check_imshow, check_requirements, colorstr, cv2,
                           increment_path, non_max_suppression, print_args, scale_coords, strip_optimizer, xyxy2xywh)
from utils.plots import Annotator, colors, save_one_box
from utils.torch_utils import select_device, time_sync
from calibration_loader import load_calibration_from_json

def convert_perspective(perspect_mat, x, y):
    pts = np.array([[[x, y]]], dtype=np.float32)  # (1, 1, 2) 형태
    dst = cv2.perspectiveTransform(pts, perspect_mat)
    return dst[0][0][0], dst[0][0][1]  # x, y 반환

'''
def load_calibration(store_id):
    filepath = f'./calibration/store{store_id}.json'  # ✅ 수정된 경로
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"❗ Calibration file not found: {filepath}")

    with open(filepath, 'r') as f:
        data = json.load(f)
    pts1 = np.float32(data['pts1'])
    pts2 = np.float32(data['pts2'])
    perspect_mat = cv2.getPerspectiveTransform(pts1, pts2)
    return perspect_mat
'''

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
    # seatShape mean -> table
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
    cafe_id = store_id

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

        for i, det in enumerate(pred):  # per image

            mid_x = []
            mid_y = []
            box_w = []
            box_h = []

            for *xyxy, conf, cls in reversed(det):
                x1, y1, x2, y2 = xyxy  # 이건 scale_coords 적용된 원본 좌표임
                mid_x.append((x1 + x2) / 2)
                mid_y.append((y1 + y2) / 2)
                box_w.append(x2 - x1)
                box_h.append(y2 - y1)

            di = list()
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
                    # image 1/1 C:\Users\hallym\Desktop\capstone\yolov5\empty_or_using_dataset\test\images\train_161_01.jpg: 480x640 7 empty_tables,

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
                        print(label, label_c, conf.item()) # table_num , table_shape, confidence
                        di.append(label_c)
                        #print(di, label_c)
                        annotator.box_label(xyxy, label, color=colors(c, True))
                        if save_crop:
                            save_one_box(xyxy, imc, file=save_dir / 'crops' / names[c] / f'{p.stem}.jpg', BGR=True)
            else:
                print(f"[{p.name}] 감지된 객체 없음 → 프로세스 종료")
                sys.exit(1)

            # Stream results
            #print(di) # print about table_shape , di == table_shape
            im0 = annotator.result()
            if view_img:
                cv2.imshow(str(p), im0)
                cv2.waitKey(1)  # 1 millisecond


            # Save results (image with detections)
            if save_img:
                if dataset.mode == 'image':

                    # if you can need perspective image, use this coordinate
                    # pts1 = np.float32([(62 * 4, 248 * 4 ), (309 * 4, 207* 4) ,  (593 *4, 255*4), (246*4, 362*4)])
                    # # Desk coordinates based on camera position
                    # pts11 = np.float32([(62, 248), (309, 207) , (593, 255), (246, 362)])

                     # 원본 이미지 복사본 만들기
                    im0_original = im0s.copy()

                    # det은 이미 scale_coords를 통해 원본 이미지 기준으로 변환됨
                    for *xyxy, conf, cls in det:
                        x1, y1, x2, y2 = map(int, xyxy)
                        color = (255, 0, 0)  # 예: 파란색 사각형
                        cv2.rectangle(im0_original, (x1, y1), (x2, y2), color, 2)

                    # 저장 경로
                    cv2.imwrite(save_path + "original_bbox.jpg", im0_original)

                    # 원본 이미지 im0 기준으로 적용
                    height, width = im0.shape[:2]

                    # Load calibration
                    perspect_mat, shift_x, shift_y = load_calibration_from_json(store_id)

                    # 원본 이미지 im0 기준으로 적용
                    height, width = im0.shape[:2]

                    # ① perspective transform 먼저
                    dst = cv2.warpPerspective(im0, perspect_mat, (width, height))

                    # ② 그 이후 shift 적용 (좌표 이동)
                    M_shift = np.array([[1, 0, shift_x], [0, 1, shift_y]], dtype=np.float32)
                    dst_shifted = cv2.warpAffine(dst, M_shift, (width + shift_x, height + shift_y))

                    # ③ 저장
                    cv2.imwrite(save_path + "warpPerspect.jpg", dst_shifted)

                    # 1. 캔버스 확장 (2배 크기)
                    ds = np.zeros((960, 1280, 3))  # save img with larger canvas


                    posDict = dict()
                    print(f"[Debug] mid_x: {mid_x}")
                    print(f"[Debug] mid_y: {mid_y}")
                    print(f"[Debug] di: {di}")


                    # 2. 오프셋 정의 (원점 이동)
                    OFFSET_X = 300
                    OFFSET_Y = 300

                    for px, py, bw, bh, dic in zip(mid_x, mid_y, box_w, box_h, di):
                        print(f"Before perspective px={px}, py={py}, bw={bw}, bh={bh}")
                        points = [
                            (px - bw / 2, py - bh / 2),
                            (px + bw / 2, py - bh / 2),
                            (px + bw / 2, py + bh / 2),
                            (px - bw / 2, py + bh / 2),
                        ]

                        # perspective 변환
                        converted_points = [convert_perspective(perspect_mat, x, y) for (x, y) in points]
                        print(converted_points)

                        # 가로: 상단, 하단 거리 평균
                        top_width = np.linalg.norm(np.array(converted_points[0]) - np.array(converted_points[1]))
                        bottom_width = np.linalg.norm(np.array(converted_points[2]) - np.array(converted_points[3]))
                        new_w = (top_width + bottom_width) / 2

                        # 세로: 좌측, 우측 거리 평균
                        left_height = np.linalg.norm(np.array(converted_points[0]) - np.array(converted_points[3]))
                        right_height = np.linalg.norm(np.array(converted_points[1]) - np.array(converted_points[2]))
                        new_h = (left_height + right_height) / 2

                        # 중심 좌표 계산 (min, max 먼저 구함)
                        xs = [p[0] for p in converted_points]
                        ys = [p[1] for p in converted_points]

                        min_x, max_x = min(xs), max(xs)
                        min_y, max_y = min(ys), max(ys)

                        center_x = (min_x + max_x) / 2
                        center_y = (min_y + max_y) / 2

                        # 최종 오프셋 적용
                        new_x = int(center_x + OFFSET_X)
                        new_y = int(center_y + OFFSET_Y)

                        # 디버깅용 박스 그림 (optional)
                        ds = cv2.rectangle(ds,
                                           (int(min_x), int(min_y)),
                                           (int(max_x), int(max_y)),
                                           (255, 255, 255), 2)

                        posDict[(new_x, new_y, new_w, new_h)] = dic


                    cnt = 1
                    seatList = []

                    for (i, j, w, h), shape in posDict.items():
                        if cnt == 1:   plus_x = 15;  plus_y = -10
                        elif cnt == 2: plus_x = 1;   plus_y = 0
                        elif cnt == 4: plus_x = -10; plus_y = -55
                        elif cnt == 5: plus_x = -29; plus_y = -33
                        elif cnt == 6: plus_x = -44; plus_y = 3
                        elif cnt == 7: plus_x = 0;   plus_y = -10
                        elif cnt == 8: plus_x = -30; plus_y = 60
                        else: plus_x = 0; plus_y = 0

                        seat_id = cnt
                        seat_x = i + 15 + plus_x
                        seat_y = j - 15 + plus_y
                        seat_w = int(w)
                        seat_h = int(h)
                        seat_shape = shape

                        seatList.append({
                            "x": seat_x,
                            "y": seat_y,
                            "width": seat_w,
                            "height": seat_h,
                            "shape": seat_shape,
                            "seatID": seat_id,
                            "additional": None,
                            "state": 0
                        })

                        cnt += 1

                    # seat layout 보내고 난 뒤에 seatList 길이 확인
                    if len(seatList) > 0:
                        # ✅ seat_Num.p 파일로 저장 (detect_run2에서 이걸 불러옴)
                        with open('backup/seat_Num.p', 'wb') as seat_num_file:
                            for entry in seatList:
                                # seatClass 형태로 변환 후 저장
                                seat_obj = seatClass(
                                    entry['x'], entry['y'], entry['width'], entry['height'],
                                    entry['shape'], entry['seatID'], None, 0
                                )
                                pickle.dump(seat_obj, seat_num_file)
                        send_seat_layout_if_changed(cafe_id, seatList)
                        sys.exit(0)  # 감지 성공
                    else:
                        print("[detect_run1] 테이블 감지 실패 → seat layout 전송 스킵")
                        sys.exit(1)  # 감지 실패

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


    ## we must setting this parameters
    ############################################################################################################################################
    parser.add_argument('--weights', nargs='+', type=str, default = 'train/exp3_table_shape/weights/best.pt', help='model path(s)')
    parser.add_argument('--source', type=str, default= '../custom_dataset_plus_longtable/test/images', help='file/dir/URL/glob, 0 for webcam')
    parser.add_argument('--data', type=str, default= 'yolov5/data/custom_dataset_plus_longtable.yaml', help='(optional) dataset.yaml path')
    parser.add_argument('--store-id', type=str, required=True, help='Unique store identifier (e.g., store1)')
    parser.add_argument('--input-path', type=str, help='single image path for frame-based detection')
    ############################################################################################################################################

    parser.add_argument('--imgsz', '--img', '--img-size', nargs='+', type=int, default=[640], help='inference size h,w')


    # decide image confidence and IOU
    ############################################################################################################################################
    parser.add_argument('--conf-thres', type=float, default=0.75, help='confidence threshold')
    parser.add_argument('--iou-thres', type=float, default=0.45, help='NMS IoU threshold')
    ############################################################################################################################################

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

    # result dir 
    parser.add_argument('--project', default= './runs/detect', help='save results to project/name')
    parser.add_argument('--name', default='exp', help='save results to project/name')
    parser.add_argument('--exist-ok', action='store_true', help='existing project/name ok, do not increment')

    # print line thickness
    parser.add_argument('--line-thickness', default=1, type=int, help='bounding box thickness (pixels)')
    parser.add_argument('--hide-labels', default=False, action='store_true', help='hide labels')
    parser.add_argument('--hide-conf', default=False, action='store_true', help='hide confidences')
    parser.add_argument('--half', action='store_true', help='use FP16 half-precision inference')
    parser.add_argument('--dnn', action='store_true', help='use OpenCV DNN for ONNX inference')

    opt, _ = parser.parse_known_args()
    opt.imgsz *= 2 if len(opt.imgsz) == 1 else 1  # expand
    print_args(name="detect_run1.py", opt=opt)

    return opt


def main(opt):
    # store_id는 이미 opt.store_id로 포함되어 있으므로 중복 전달하지 않음
    run(**vars(opt))  # ✅ store_id 따로 넘기지 않기


def Ex1(store_id):
    opt = parse_opt()
    opt.store_id = store_id  # store_id 속성 추가
    main(opt)

    # 검증 로직 추가
def verify_pickle(filepath):
    try:
        with open(filepath, 'rb') as f:
            entries = []
            while True:
                try:
                    entry = pickle.load(f)
                    entries.append(entry)
                except EOFError:
                    break
    except FileNotFoundError:
        print(f"[Verify] {filepath} not found")




if __name__ == "__main__":
    opt = parse_opt()             # argparse로 store_id 받기
    Ex1(opt.store_id)             # 받은 인자 넘기기
