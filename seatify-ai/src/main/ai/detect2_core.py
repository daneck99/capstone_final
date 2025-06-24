import torch
import cv2
import os
import pickle
import numpy as np
from pathlib import Path
from seat_api_sender import send_seat_status
from calibration_loader import load_calibration
from seat_class import seatClass
from detect3_core import detect3_from_image

@torch.no_grad()
def detect_run2_from_image(model, image_path, store_id, imgsz=(640, 640), conf_thres=0.25, iou_thres=0.45, device='cpu'):
    print(f"[INFO] detect_run2_from_image 실행 - store_id={store_id}, image_path={image_path}")

    # ✅ 사람 + 물체 감지 실행
    detections = detect3_from_image(model, image_path, imgsz, conf_thres, iou_thres, device)
    print(f"[INFO] 감지된 객체 수: {len(detections)}")

    # ✅ 좌석 정보 로딩
    try:
        with open('backup/seat_Num.p', 'rb') as f:
            seats = []
            while True:
                try:
                    entry = pickle.load(f)
                    if isinstance(entry, seatClass):
                        seats.append(entry)
                except EOFError:
                    break
    except FileNotFoundError:
        print("[ERROR] seat_Num.p not found")
        return {"message": "seat_Num.p not found"}

    perspect_mat = load_calibration(store_id)
    OFFSET_X = 300
    OFFSET_Y = 220

    # ✅ 거리 기준 분리
    proximity_threshold_person = 300  # 사람: 인식 범위 넓힘
    proximity_threshold_object = 100  # 물건: 기존 유지

    state_map = {
        "empty_table": 0,
        "using_table": 1,
        "step_out": 2
    }

    status_list = []

    for seat in seats:
        seat_cx = seat.xPos
        seat_cy = seat.yPos

        has_person = False
        has_object = False

        for obj in detections:
            px, py = obj["x"], obj["y"]
            dst = cv2.perspectiveTransform(np.array([[[px, py]]], dtype=np.float32), perspect_mat)[0][0]
            obj_x = int(dst[0]) + OFFSET_X
            obj_y = int(dst[1]) + OFFSET_Y

            dist = ((seat_cx - obj_x) ** 2 + (seat_cy - obj_y) ** 2) ** 0.5

            if obj["label"] == "person" and dist < proximity_threshold_person:
                has_person = True
            elif obj["label"] == "object" and dist < proximity_threshold_object:
                has_object = True

        # ✅ 상태 결정
        if has_person:
            state = state_map["using_table"]
        elif has_object:
            state = state_map["step_out"]
        else:
            state = state_map["empty_table"]

        seat.seatCount = state
        status_list.append({"seatID": seat.seatNum, "state": state})
        print(f"[DEBUG] 좌석 {seat.seatNum}: person={has_person}, object={has_object} → 상태={state}")

    # ✅ 서버로 상태 전송
    try:
        send_seat_status(cafe_id=int(store_id), status_list=status_list)
    except Exception as e:
        print(f"[Warning] Failed to send seat status: {e}")

    # ✅ 좌석 상태 pickle 저장
    with open('backup/seat_Num.p', 'wb') as f:
        for s in seats:
            pickle.dump(s, f)

    return {"message": "detect_run2 completed", "statusList": status_list}

