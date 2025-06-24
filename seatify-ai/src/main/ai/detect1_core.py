import torch
import cv2
import os
import pickle
import numpy as np
from pathlib import Path
from utils.datasets import LoadImages
from utils.general import non_max_suppression, scale_coords, xyxy2xywh, LOGGER, check_img_size
from utils.torch_utils import time_sync
from utils.plots import Annotator, colors, save_one_box
from models.common import DetectMultiBackend
from seat_api_sender import send_seat_layout_if_changed
from calibration_loader import load_calibration_from_aruco, load_calibration
from seat_class import seatClass

@torch.no_grad()
def detect_from_image(
        model: DetectMultiBackend,
        image_path: str,
        store_id: str,
        imgsz=(640, 640),
        conf_thres=0.75,
        iou_thres=0.45,
        device='cpu'
):
    dataset = LoadImages(image_path, img_size=imgsz, stride=model.stride, auto=model.pt)
    for path, im, im0s, _, _ in dataset:
        im = torch.from_numpy(im).to(device)
        im = im.float()  # 항상 float32로 처리
        im /= 255.0
        if len(im.shape) == 3:
            im = im[None]

        pred = model(im)
        pred = non_max_suppression(pred, conf_thres, iou_thres)

        if len(pred) == 0 or pred[0] is None:
            return {"message": "No detections"}

        det = pred[0]
        mid_x, mid_y, labels = [], [], []
        names = model.names

        for *xyxy, conf, cls in det:
            x_center = (xyxy[0] + xyxy[2]) / 2
            y_center = (xyxy[1] + xyxy[3]) / 2
            mid_x.append(x_center.item())
            mid_y.append(y_center.item())
            labels.append(names[int(cls)])

        perspect_mat = load_calibration(store_id)
        OFFSET_X = 300
        OFFSET_Y = 300
        ds = np.zeros((960, 1280, 3))
        posDict = {}

        for px, py, label in zip(mid_x, mid_y, labels):
            dst = cv2.perspectiveTransform(np.array([[[px, py]]], dtype=np.float32), perspect_mat)[0][0]
            new_x = int(dst[0]) + OFFSET_X
            new_y = int(dst[1]) + OFFSET_Y

            if label == "table":
                ds = cv2.rectangle(ds, (int(dst[0])-60, int(dst[1])-60), (int(dst[0])+60, int(dst[1])+60), (255, 255, 255), 2)
            elif label == "longtable":
                ds = cv2.rectangle(ds, (int(dst[0])-60, int(dst[1])-60), (int(dst[0])+60, int(dst[1])+120), (0, 75, 150), 2)

            posDict[(new_x, new_y)] = label

        seatList = []
        cnt = 1
        for (i, j), shape in posDict.items():
            if cnt == 1:   plus_x, plus_y = 15, -10
            elif cnt == 2: plus_x, plus_y = 1, 0
            elif cnt == 4: plus_x, plus_y = -10, -55
            elif cnt == 5: plus_x, plus_y = -29, -33
            elif cnt == 6: plus_x, plus_y = -44, 3
            elif cnt == 7: plus_x, plus_y = 0, -10
            elif cnt == 8: plus_x, plus_y = -30, 60
            else: plus_x, plus_y = 0, 0

            seat_id = cnt
            seat_x = i + 15 + plus_x
            seat_y = j - 15 + plus_y if shape == "table" else j + 15 + plus_y
            seat_w = 90
            seat_h = 90 if shape == "table" else 150

            seatList.append({
                "x": seat_x,
                "y": seat_y,
                "width": seat_w,
                "height": seat_h,
                "shape": shape,
                "seatID": seat_id,
                "additional": None,
                "state": 0
            })

            cnt += 1

        if seatList:
            with open('backup/seat_Num.p', 'wb') as f:
                for entry in seatList:
                    seat_obj = seatClass(
                        entry['x'], entry['y'], entry['width'], entry['height'],
                        entry['shape'], entry['seatID'], None, 0
                    )
                    pickle.dump(seat_obj, f)

            send_seat_layout_if_changed(store_id, seatList)
            return {"message": "Detection completed", "seatList": seatList}

        return {"message": "Detection failed: no seats detected"}
