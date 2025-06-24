import requests
import json
import hashlib
import math
import os

HASH_CACHE_FILE = "layout_hash_cache.json"


def get_access_token_from_flask():
    try:
        res = requests.get("http://localhost:5001/get-token")
        res.raise_for_status()
        token = res.json().get("access_token")
        if not token:
            raise ValueError("No token received")
        return token
    except Exception as e:
        print(f"[❌ Token Error] {e}")
        return None

def send_seat_layout(cafe_id, seat_list):
    token = get_access_token_from_flask()
    if not token:
        print("🚫 토큰 없음 - Layout 전송 취소")
        return

    seats = [{
        "seatID": seat["seatID"],
        "x": seat["x"],
        "y": seat["y"],
        "width": seat["width"],
        "height": seat["height"]
    } for seat in seat_list]

    payload = {
        "data": json.dumps(seats)
    }

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    print(f"seats: {seats}\npayload:{payload}")

    url = f"http://localhost:8080/api/seat/{cafe_id}/layout"
    response = requests.post(url, json=payload, headers=headers)
    print(f"[Layout] {response.status_code}: {response.text}")

def normalize_seat(seat, precision=1):
    return {
        "seatID": seat["seatID"],
        "x": round(seat["x"], precision),
        "y": round(seat["y"], precision),
        "width": round(seat["width"], precision),
        "height": round(seat["height"], precision)
    }

def load_cached_hash(cafe_id):
    if not os.path.exists(HASH_CACHE_FILE):
        return None

    with open(HASH_CACHE_FILE, "r") as f:
        cache = json.load(f)
        return cache.get(str(cafe_id))

def save_cached_hash(cafe_id, hash_value):
    cache = {}
    if os.path.exists(HASH_CACHE_FILE):
        with open(HASH_CACHE_FILE, "r") as f:
            cache = json.load(f)

    cache[str(cafe_id)] = hash_value

    with open(HASH_CACHE_FILE, "w") as f:
        json.dump(cache, f, indent=4)

def send_seat_layout_if_changed(cafe_id, seat_list):
    print(f"📌 [Debug] cafe_id: {cafe_id}")
    if len(seat_list) == 0:
        print("⚠️ seat_list가 비어 있음")
        return

    normalized_seats = [normalize_seat(seat) for seat in seat_list]
    normalized_seats_sorted = sorted(normalized_seats, key=lambda s: s["seatID"])
    seats_str = json.dumps(normalized_seats_sorted, sort_keys=True)
    current_hash = hashlib.md5(seats_str.encode()).hexdigest()

    last_hash = load_cached_hash(cafe_id)

    if last_hash == current_hash:
        print("✅ 동일한 레이아웃 (오차 허용) - 전송 생략")
        return
    else:
        save_cached_hash(cafe_id, current_hash)
        print("📤 변경된 레이아웃 감지 - 서버로 전송")
        send_seat_layout(cafe_id, seat_list)


def send_seat_status(cafe_id, status_list):
    token = get_access_token_from_flask()
    if not token:
        print("🚫 토큰 없음 - Status 전송 취소")
        return

    status_entries = [{
        "seatID": seat["seatID"],
        "state": seat["state"]  # ✅ key 이름 일치시킴
    } for seat in status_list]

    payload = {
        "status_list": status_entries
    }

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    url = f"http://localhost:8080/api/seat/{cafe_id}/status"
    response = requests.post(url, json=payload, headers=headers)
    print(f"[Status] {response.status_code}: {response.text}")