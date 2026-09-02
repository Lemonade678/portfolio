"""
ขั้นที่ 4 — export เป็น .onnx แล้วเอาไปวางบนหน้าเว็บ portfolio

    python export_onnx.py

สิ่งที่สคริปต์นี้ทำ
  1. export best.pt → .onnx (opset 12, imgsz ตรงกับตอนเทรน)
  2. ก๊อปไปวางที่ ../public/models/lemon.onnx
  3. รันโมเดลบน ../public/me.jpg แล้วพิมพ์ค่า DETECTOR.fallback ให้ก๊อปวางใน content.ts

ทำไมต้อง opset 12
  onnxruntime-web ที่หน้าเว็บโหลดจาก CDN รองรับ opset นี้แน่นอน
  เลขสูงกว่านี้บางตัว build wasm ยังไม่รองรับ แล้วจะ error ตอน createSession
  ซึ่งเป็น error ที่อ่านไม่รู้เรื่องเลย — ล็อกไว้ที่ 12 ตั้งแต่แรกง่ายกว่ามานั่งไล่

ทำไม fallback ถึงสำคัญ
  ไฟล์โมเดล ~10 MB ถ้าเน็ตคนดูช้าหรือ CDN ล่ม ปุ่มจะกดแล้วค้าง
  หน้าเว็บเลยมีค่าที่รันไว้ล่วงหน้าสำรองไว้ พร้อมติดป้ายว่า "cached result"
  ไม่เนียนว่าเพิ่งรันสด — ทั้งเว็บขายเรื่องความซื่อสัตย์กับตัวเลข ตรงนี้ก็ต้องซื่อ
"""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

import config as C
from prepare_dataset import imread_unicode

WEB_MODELS = C.ROOT.parent / "public" / "models"
WEB_MODEL_NAME = "lemon.onnx"
PROFILE_PHOTO = C.ROOT.parent / "public" / "me.jpg"


def main() -> None:
    best = C.RUNS / C.RUN_NAME / "weights" / "best.pt"
    if not best.exists():
        sys.exit(f"ไม่เจอน้ำหนัก: {best}\n→ รัน  python train.py  ก่อน")

    from ultralytics import YOLO

    model = YOLO(str(best))

    print("กำลัง export เป็น ONNX…")
    onnx_path = Path(
        model.export(format="onnx", imgsz=C.IMG_SIZE, opset=12, simplify=True)
    )

    WEB_MODELS.mkdir(parents=True, exist_ok=True)
    dst = WEB_MODELS / WEB_MODEL_NAME
    shutil.copy2(onnx_path, dst)
    size_mb = dst.stat().st_size / 1024 / 1024
    print(f"→ {dst}  ({size_mb:.1f} MB)")

    # ── สร้างค่า fallback จากรูปโปรไฟล์จริง ──
    if not PROFILE_PHOTO.exists():
        print(f"\nข้ามการสร้าง fallback เพราะไม่เจอ {PROFILE_PHOTO}")
        return

    img = imread_unicode(PROFILE_PHOTO)
    if img is None:
        print(f"\nอ่าน {PROFILE_PHOTO} ไม่ได้ ข้ามการสร้าง fallback")
        return

    h, w = img.shape[:2]
    r = model.predict(img, conf=C.CONF_THRESHOLD, iou=C.IOU_THRESHOLD,
                      imgsz=C.IMG_SIZE, verbose=False)[0]

    print("\n" + "─" * 70)
    print("ก๊อปบล็อกข้างล่างไปวางทับใน lib/content.ts")
    print("─" * 70)
    print(f"""
  // ── ค่าที่ต้องแก้ใน DETECTOR ──
  modelUrl: "/models/{WEB_MODEL_NAME}",
  photoW: {w},
  photoH: {h},

  /** ชื่อคลาสของโมเดลนี้ — เรียงตาม index ที่โมเดลคืนมา */
  classNames: [{", ".join(f'"{n}"' for n in model.names.values())}],

  fallback: [""")
    if len(r.boxes) == 0:
        print("    // โมเดลไม่เจออะไรบนรูปนี้เลย — ลองลด CONF_THRESHOLD ดู")
    for b in r.boxes:
        x1, y1, x2, y2 = b.xyxy[0].tolist()
        print(
            f'    {{ label: "{model.names[int(b.cls)]}", score: {float(b.conf):.4f}, '
            f"box: [{x1 / w:.4f}, {y1 / h:.4f}, {x2 / w:.4f}, {y2 / h:.4f}] }},"
        )
    print("  ],")
    print("─" * 70)
    print(
        "\nหมายเหตุ: ค่าที่รันด้วย .pt กับที่รันด้วย .onnx ในเบราว์เซอร์จะต่างกันราว 0.01\n"
        "เพราะวิธี resize ของ canvas กับ OpenCV ไม่เหมือนกัน — ไม่ใช่บั๊ก"
    )


if __name__ == "__main__":
    main()
