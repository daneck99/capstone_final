import torch
import cv2
import numpy as np
from utils.datasets import LoadImages
from utils.general import non_max_suppression
from models.common import DetectMultiBackend
import os

@torch.no_grad()
def detect3_from_image(model, image_path, imgsz=(640, 640), conf_thres=0.25, iou_thres=0.45, device='cpu'):
    dataset = LoadImages(image_path, img_size=imgsz, stride=model.stride, auto=model.pt)

    results = []  # [{"label": str, "x": int, "y": int}]
    print(f"[DEBUG] model.names: {model.names}")

    for path, im, im0s, _, _ in dataset:
        im = torch.from_numpy(im).to(device)
        im = im.float() / 255.0
        if len(im.shape) == 3:
            im = im[None]

        pred = model(im)
        pred = non_max_suppression(pred, conf_thres, iou_thres)

        if len(pred) == 0 or pred[0] is None:
            print("[DEBUG] No detections")
            return []

        det = pred[0]
        names = model.names

        # 이미지 복사하여 시각화용
        debug_img = im0s.copy()

        for *xyxy, conf, cls in det:
            label = names[int(cls)]
            x_center = int((xyxy[0] + xyxy[2]) / 2)
            y_center = int((xyxy[1] + xyxy[3]) / 2)

            print(f"[DEBUG] 감지된 객체: {label} @ ({x_center}, {y_center})")

            if label not in ['person', 'object']:
                continue

            results.append({
                "label": label,
                "x": x_center,
                "y": y_center
            })

            # ✅ 시각화: 중심점 원으로 표시
            color = (0, 255, 0) if label == 'person' else (0, 0, 255)
            cv2.circle(debug_img, (x_center, y_center), 10, color, -1)
            cv2.putText(debug_img, label, (x_center + 5, y_center - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)

        # ✅ 결과 이미지 저장
        debug_path = os.path.join("results", "debug_output.jpg")
        os.makedirs("results", exist_ok=True)
        cv2.imwrite(debug_path, debug_img)
        print(f"[DEBUG] 시각화 결과 저장: {debug_path}")

    return results
