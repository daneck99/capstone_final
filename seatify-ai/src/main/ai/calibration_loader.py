
import json
import os
import argparse
import numpy as np
import cv2

def load_calibration(store_id):
    with open(f'./calibration/store{store_id}.json', 'r') as f:
        data = json.load(f)
    pts1 = np.float32(data['pts1'])
    pts2 = np.float32(data['pts2'])
    perspect_mat = cv2.getPerspectiveTransform(pts1, pts2)
    return perspect_mat

def load_calibration_from_aruco(image_path, padding=50):
    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError(f"Image not found: {image_path}")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    aruco_dict = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
    parameters = cv2.aruco.DetectorParameters()
    detector = cv2.aruco.ArucoDetector(aruco_dict, parameters)

    corners, ids, _ = detector.detectMarkers(gray)

    if ids is not None and len(ids) >= 4:
        ids = ids.flatten()
        ref_pts = {}

        for i in range(len(ids)):
            if ids[i] in [0, 1, 2, 3]:
                ref_pts[ids[i]] = corners[i][0].mean(axis=0)

        if len(ref_pts) == 4:
            pts1 = np.float32([
                ref_pts[0],
                ref_pts[1],
                ref_pts[2],
                ref_pts[3],
            ])

            width = 640 + 2 * padding
            height = 480 + 2 * padding
            pts2 = np.float32([
                [padding, padding],
                [padding + 640, padding],
                [padding + 640, padding + 480],
                [padding, padding + 480]
            ])

            perspect_mat = cv2.getPerspectiveTransform(pts1, pts2)
            return pts1.tolist(), pts2.tolist(), perspect_mat, img, (width, height)

        else:
            raise ValueError("Required ArUco markers not found.")
    else:
        raise ValueError("Insufficient ArUco markers.")
def save_calibration(store_id, pts1, pts2):
    calibration_data = {
        "pts1": pts1,
        "pts2": pts2
    }
    os.makedirs("calibration", exist_ok=True)
    path = os.path.join("calibration", f"{store_id}.json")
    with open(path, "w") as f:
        json.dump(calibration_data, f, indent=4)
    print(f"Calibration data saved to {path}")

def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument('--image', type=str, required=True)
    parser.add_argument('--store-id', type=str, required=True)
    parser.add_argument('--padding', type=int, default=50)
    return parser.parse_args()

if __name__ == "__main__":
    args = parse_arguments()
    try:
        pts1, pts2, mat, img, size = load_calibration_from_aruco(args.image, args.padding)
        save_calibration(args.store_id, pts1, pts2)

        warped = cv2.warpPerspective(img, mat, size)
        output_path = f"warped_{args.store_id}.jpg"
        cv2.imwrite(output_path, warped)
        print(f"Warped image saved: {output_path}")
    except Exception as e:
        print(e)
        exit(1)