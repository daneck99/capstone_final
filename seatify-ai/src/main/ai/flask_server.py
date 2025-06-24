from flask import Flask, request, jsonify
from flask_cors import CORS
import os, re, threading, time, glob, cv2, json, numpy as np, subprocess, base64, traceback

from model_loader import load_model_instance
from detect1_core import detect_from_image
from detect2_core import detect_run2_from_image

app = Flask(__name__)
CORS(app)

HASH_CACHE_FILE = "layout_hash_cache.json"

# ✅ 테이블 탐지 모델
MODEL, DEVICE = load_model_instance(
    weights_path='train/exp3_table_shape/weights/best.pt',
    data_path='yolov5/data/custom_dataset_plus_longtable.yaml',
    imgsz=(640, 640),
    device_str=''
)

# ✅ 사람+물체 탐지 모델
MODEL_RUN3, DEVICE_RUN3 = load_model_instance(
    weights_path='train/exp8_table_shape/weights/best.pt',
    data_path='yolov5/data/data.yaml',
    imgsz=(720, 720),  # 변경: 원본 이미지 해상도 반영
    device_str=''
)

detect_thread = None
stop_flag = threading.Event()
access_token = None

@app.route('/set-token', methods=['POST'])
def set_token():
    global access_token
    access_token = request.json.get("token")
    return jsonify({"message": "Token received!"})

@app.route('/get-token', methods=['GET'])
def get_token():
    if access_token:
        return jsonify({"access_token": access_token})
    return jsonify({"error": "No token set"}), 404

def find_nearest_existing_frame(base_time_str, frames_dir="frames", max_attempts=5):
    """
    'mm-ss' 포맷 기준으로 요청한 프레임이 있으면 우선 반환하고,
    없으면 과거 프레임 중 가장 가까운 것 반환
    """
    minute, second = map(int, base_time_str.split("-"))
    total_seconds = minute * 60 + second

    # 먼저 요청한 프레임이 존재하는지 확인
    filename = f"{minute:02d}-{second:02d}.jpg"
    frame_path = os.path.join(frames_dir, filename)
    if os.path.exists(frame_path):
        return base_time_str, frame_path

    # 없으면 과거 프레임 탐색
    for offset in range(1, max_attempts + 1):
        check_time = total_seconds - offset
        if check_time < 0:
            break
        mm = check_time // 60
        ss = check_time % 60
        candidate_time_str = f"{mm:02d}-{ss:02d}"
        candidate_path = os.path.join(frames_dir, f"{candidate_time_str}.jpg")
        if os.path.exists(candidate_path):
            return candidate_time_str, candidate_path

    return None, None


@app.route('/detect-frame-run1', methods=['GET'])
def detect_frame_run1():
    time_str = request.args.get("time")
    store_id = request.args.get("store_id", "20")
    if not time_str:
        return jsonify({"error": "time is required"}), 400

    adjusted_time_str, frame_path = find_nearest_existing_frame(time_str)
    if not frame_path:
        return jsonify({"error": f"No available frame near {time_str}"}), 404

    print(f"[DEBUG] 분석에 사용할 프레임: {frame_path}")
    try:
        result, annotated_img = detect_from_image(
            model=MODEL,
            image_path=frame_path,
            store_id=store_id,
            device=DEVICE
        )
        return jsonify(result), 200
    except Exception as e:
        print("[ERROR] Exception occurred!")
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/detect-frame-run2', methods=['GET'])
def detect_frame_run2():
    time_str = request.args.get("time")
    store_id = request.args.get("store_id", "20")
    if not time_str:
        return jsonify({"error": "time is required"}), 400

    adjusted_time_str, frame_path = find_nearest_existing_frame(time_str)
    if not frame_path:
        return jsonify({"error": f"No available frame near {time_str}"}), 404

    print(f"[DEBUG] Run2 분석 프레임: {frame_path}")
    try:
        result = detect_run2_from_image(
            model=MODEL_RUN3,
            image_path=frame_path,
            store_id=store_id,
            device=DEVICE_RUN3
        )

        annotated_img = result.get("annotated_img")
        if annotated_img is not None:
            save_path = os.path.join("results", f"annotated_run2_{adjusted_time_str}.jpg")
            cv2.imwrite(save_path, annotated_img)
            with open(save_path, "rb") as f:
                result["annotated_image_base64"] = base64.b64encode(f.read()).decode()
                result["annotated_image"] = save_path

        return jsonify(result), 200

    except Exception as e:
        print(f"[ERROR] detect-frame-run2에서 예외 발생:\n{e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/stop-detect', methods=['POST'])
def stop_detect():
    stop_flag.set()
    return jsonify({"message": "Detection stopping..."})

if __name__ == '__main__':
    if os.path.exists(HASH_CACHE_FILE):
        os.remove(HASH_CACHE_FILE)
    app.run(port=5001)
