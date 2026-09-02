"""
ขั้นที่ 3 — ลองใช้โมเดลจริง

    python predict.py --source ../public/me.jpg     # รูปเดียว
    python predict.py --source raw/test_photos      # ทั้งโฟลเดอร์
    python predict.py --source 0                    # เว็บแคมสด กด q เพื่อออก

ผลลัพธ์เซฟไว้ที่ out/ (ยกเว้นโหมดเว็บแคมที่แสดงสดอย่างเดียว)
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import cv2

import config as C
from prepare_dataset import imread_unicode, imwrite_unicode, list_images

OUT = C.ROOT / "out"

# สีกล่อง BGR — เหลืองตัวเดียวกับ ACCENT_HEX.yellow (#F5B92E) บนหน้าเว็บ
# จะได้ดูเป็นระบบเดียวกันเวลาเอาภาพไปแปะใน portfolio
BOX_BGR = (46, 185, 245)


def default_weights() -> Path:
    return C.RUNS / C.RUN_NAME / "weights" / "best.pt"


def draw(img, boxes, names) -> None:
    """วาดกล่อง + ป้ายชื่อคลาสลงบนรูป (แก้ img ในที่)"""
    for b in boxes:
        x1, y1, x2, y2 = (int(v) for v in b.xyxy[0].tolist())
        conf = float(b.conf)
        label = f"{names[int(b.cls)]} {conf:.2f}"

        cv2.rectangle(img, (x1, y1), (x2, y2), BOX_BGR, 2)

        # พื้นทึบหลังตัวอักษร ไม่งั้นข้อความจมหายเวลากล่องไปตกบนพื้นหลังสว่าง
        (tw, th), base = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
        top = max(0, y1 - th - base - 4)
        cv2.rectangle(img, (x1, top), (x1 + tw + 6, y1), BOX_BGR, -1)
        cv2.putText(img, label, (x1 + 3, y1 - base - 2),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (26, 19, 16), 2)


def main() -> None:
    ap = argparse.ArgumentParser(description="รัน Lemon detector")
    ap.add_argument("--source", required=True, help="ไฟล์รูป / โฟลเดอร์ / 0 สำหรับเว็บแคม")
    ap.add_argument("--weights", default=None)
    ap.add_argument("--conf", type=float, default=C.CONF_THRESHOLD)
    args = ap.parse_args()

    weights = Path(args.weights) if args.weights else default_weights()
    if not weights.exists():
        sys.exit(f"ไม่เจอน้ำหนัก: {weights}\n→ รัน  python train.py  ก่อน")

    from ultralytics import YOLO

    model = YOLO(str(weights))
    names = model.names

    # ── โหมดเว็บแคม ──
    if args.source.isdigit():
        cap = cv2.VideoCapture(int(args.source))
        if not cap.isOpened():
            sys.exit("เปิดกล้องไม่ได้")
        print("กด q เพื่อออก")
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            r = model.predict(frame, conf=args.conf, iou=C.IOU_THRESHOLD,
                              imgsz=C.IMG_SIZE, verbose=False)[0]
            draw(frame, r.boxes, names)
            cv2.imshow(C.CLASS_NAME, frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break
        cap.release()
        cv2.destroyAllWindows()
        return

    # ── โหมดรูป / โฟลเดอร์ ──
    src = Path(args.source)
    targets = list_images(src) if src.is_dir() else [src]
    if not targets:
        sys.exit(f"ไม่เจอรูปที่ {src}")

    OUT.mkdir(parents=True, exist_ok=True)
    for path in targets:
        img = imread_unicode(path)
        if img is None:
            print(f"  ! อ่านไม่ได้: {path.name}")
            continue

        r = model.predict(img, conf=args.conf, iou=C.IOU_THRESHOLD,
                          imgsz=C.IMG_SIZE, verbose=False)[0]
        draw(img, r.boxes, names)

        dst = OUT / f"{path.stem}_det.jpg"
        imwrite_unicode(dst, img)

        hits = " · ".join(
            f"{names[int(b.cls)]} {float(b.conf):.2f}" for b in r.boxes
        ) or "ไม่เจออะไรเลย"
        print(f"{path.name:40s} → {hits}")

    print(f"\nรูปผลลัพธ์อยู่ที่ {OUT}")


if __name__ == "__main__":
    main()
