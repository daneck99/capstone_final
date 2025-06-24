import cv2
import os

def extract_frames(video_path, output_dir, frame_interval=1):
    image_dir = os.path.join(output_dir, "images")
    label_dir = os.path.join(output_dir, "labels")
    os.makedirs(image_dir, exist_ok=True)
    os.makedirs(label_dir, exist_ok=True)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise IOError(f"Cannot open video: {video_path}")

    frame_count = 0
    saved_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % frame_interval == 0:
            # 현재 재생 시간(밀리초) 가져오기
            millisec = cap.get(cv2.CAP_PROP_POS_MSEC)
            seconds = int(millisec // 1000)
            minutes = seconds // 60
            secs = seconds % 60

            # "mm-ss" 형식의 이름
            time_str = f"{minutes:02d}-{secs:02d}"
            img_name = f"{time_str}.jpg"
            img_path = os.path.join(image_dir, img_name)
            cv2.imwrite(img_path, frame)

            # 빈 라벨 파일도 같은 이름으로 생성
            label_path = os.path.join(label_dir, f"{time_str}.txt")
            open(label_path, "w").close()

            saved_count += 1

        frame_count += 1

    cap.release()
    print(f"Saved {saved_count} frames to {image_dir}")

video_path = "cafe.mp4"
output_dir = "frames"
extract_frames(video_path, output_dir, frame_interval=30)
