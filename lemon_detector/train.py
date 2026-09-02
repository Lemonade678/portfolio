"""
ขั้นที่ 2 — เทรน YOLOv11 คลาสเดียว

    python train.py                  # ใช้ค่าใน config.py
    python train.py --epochs 200     # แก้เฉพาะรอบนี้
    python train.py --device cpu     # บังคับใช้ CPU (ช้ามาก แต่รันได้)

ทำไมเริ่มจาก yolo11n.pt ไม่เทรนจากศูนย์
  ชุดข้อมูลเราหลักร้อยรูป ถ้าเทรนจากน้ำหนักสุ่มมันจะไม่มีวันลู่เข้า
  yolo11n.pt ผ่าน COCO มาแล้ว รู้จัก "ขอบ ผิว รูปทรงคน" อยู่ก่อน
  เราแค่สอนต่อว่าหน้าแบบไหนคือคลาส 0 — คือ transfer learning ตามปกติ

ทำไมใช้รุ่น n (nano) ไม่ใช่ s/m
  1. ชุดข้อมูลเล็ก โมเดลใหญ่ยิ่ง overfit เร็ว
  2. ปลายทางคือ export เป็น .onnx ไปรันในเบราว์เซอร์บนหน้าเว็บ portfolio
     รุ่น n ออกมาราว 10 MB ซึ่งพอรับได้ ส่วน s จะพุ่งไป ~40 MB
"""

from __future__ import annotations

import argparse
import sys

import config as C


def main() -> None:
    ap = argparse.ArgumentParser(description="เทรน Lemon detector")
    ap.add_argument("--epochs", type=int, default=C.EPOCHS)
    ap.add_argument("--batch", type=int, default=C.BATCH)
    ap.add_argument("--imgsz", type=int, default=C.IMG_SIZE)
    ap.add_argument("--device", default=None,
                    help='"0" = GPU ตัวแรก, "cpu" = ซีพียู, ปล่อยว่าง = ให้ ultralytics เลือกเอง')
    ap.add_argument("--resume", action="store_true", help="เทรนต่อจากรอบที่ค้างไว้")
    args = ap.parse_args()

    if not C.DATA_YAML.exists():
        sys.exit(f"ไม่เจอ {C.DATA_YAML}\n→ รัน  python prepare_dataset.py  ก่อน")

    from ultralytics import YOLO  # import ในฟังก์ชันเพราะตัวนี้โหลดช้า (ลาก torch มาด้วย)

    weights = C.BASE_WEIGHTS if C.BASE_WEIGHTS.exists() else "yolo11n.pt"
    print(f"น้ำหนักตั้งต้น: {weights}")
    model = YOLO(str(weights))

    model.train(
        data=str(C.DATA_YAML),
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch,
        device=args.device,
        patience=C.PATIENCE,
        seed=C.SEED,
        project=str(C.RUNS),
        name=C.RUN_NAME,
        exist_ok=True,
        resume=args.resume,

        # ── augmentation ──
        # ชุดข้อมูลเล็ก เลยพึ่ง augmentation หนักกว่าปกติเพื่อกัน overfit
        # แต่ห้ามพลิกแนวตั้ง (flipud) เพราะไม่มีใครถ่ายรูปหน้ากลับหัว
        # การสอนสิ่งที่ไม่มีวันเจอจริง = เอา capacity ของโมเดลไปทิ้งเปล่า ๆ
        fliplr=0.5,
        flipud=0.0,
        degrees=10.0,      # เอียงหัวเล็กน้อย เกิดขึ้นจริงตอนถ่ายเซลฟี่
        translate=0.10,
        scale=0.40,        # หน้าใหญ่/เล็กต่างกันตามระยะกล้อง
        hsv_h=0.015,       # แสงไฟคนละโทน (ฟลูออเรสเซนต์ / แดด / ไฟส้ม)
        hsv_s=0.7,
        hsv_v=0.4,
        mosaic=1.0,
        close_mosaic=10,   # ปิด mosaic ช่วง 10 epoch สุดท้าย ให้เห็นรูปจริงก่อนจบ
    )

    print("\n── วัดผลบนชุด test (ชุดที่โมเดลไม่เคยเห็นเลย) ──")
    metrics = model.val(data=str(C.DATA_YAML), split="test", imgsz=args.imgsz)

    # box.map50 = mAP@0.5 · box.map = mAP@0.5:0.95 (ตัวหลังโหดกว่ามาก)
    print(f"  mAP@0.5      : {metrics.box.map50:.4f}")
    print(f"  mAP@0.5:0.95 : {metrics.box.map:.4f}")
    print(f"  precision    : {metrics.box.mp:.4f}")
    print(f"  recall       : {metrics.box.mr:.4f}")

    best = C.RUNS / C.RUN_NAME / "weights" / "best.pt"
    print(f"\nน้ำหนักที่ดีที่สุด → {best}")
    print("ขั้นถัดไป:  python predict.py --source <รูป>   แล้วค่อย  python export_onnx.py")
    print(
        "\n⚠️  ตัวเลขข้างบนวัดจากชุด test ของเราเอง ซึ่งเป็นรูปคนละใบแต่คนเดิม\n"
        "    ถ้าจะเคลมว่า 'แยกตัวบุคคลได้' ต้องเทสต์กับหน้าคนที่ไม่เคยอยู่ใน raw/ เลย"
    )


if __name__ == "__main__":
    main()
