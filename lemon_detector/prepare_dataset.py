"""
ขั้นที่ 1 — เปลี่ยนรูปดิบให้เป็นชุดข้อมูลที่ YOLO อ่านได้

    python prepare_dataset.py

สิ่งที่สคริปต์นี้ทำ
  1. อ่านรูปจาก raw/me (รูปที่มีหน้าเรา) และ raw/not_me (รูปหน้าคนอื่น)
  2. หาใบหน้าในรูป raw/me ด้วย Haar cascade แล้วเขียนเป็น label ให้อัตโนมัติ
  3. รูปใน raw/not_me เขียน label เป็น "ไฟล์เปล่า" = บอก YOLO ว่าทั้งรูปคือพื้นหลัง
  4. แบ่ง train / val / test แล้วก๊อปเข้า dataset/
  5. เขียน data.yaml
  6. วาดกล่องทับรูปไว้ที่ review/ ให้เราตรวจด้วยตาก่อนเทรน


⚠️ ทำไมต้องมี raw/not_me — ข้อนี้สำคัญที่สุดในไฟล์นี้

โจทย์คือ "ตรวจจับเฉพาะหน้าผมเท่านั้น" ซึ่ง object detection คลาสเดียวทำไม่ได้เอง
ถ้าเทรนด้วยรูปหน้าเราอย่างเดียว โมเดลจะเรียนรู้แค่ว่า "หน้าคน = คลาส 0"
แล้วเวลาเจอหน้าคนอื่นมันก็จะตีกรอบให้เหมือนกัน เพราะไม่เคยเห็นตัวอย่างที่บอกว่า
"อันนี้เป็นหน้า แต่ไม่ใช่คลาส 0"

วิธีสอนให้มันแยกคือใส่ hard negative — รูปหน้าคนอื่นที่ label ว่างเปล่า
YOLO จะนับเป็น background แล้วโดนลงโทษทุกครั้งที่ตีกรอบลงไป
โมเดลเลยถูกบังคับให้หาความต่างระหว่างหน้าเรากับหน้าคนอื่นให้เจอ

ยิ่งใส่หน้าคนอื่นเยอะและหลากหลาย (เพศ อายุ แสง มุม) ยิ่งแยกได้ดี
เอาจากรูปกลุ่มเพื่อน รูปในเน็ต หรือ dataset ใบหน้าสาธารณะก็ได้
ตั้งเป้าอย่างน้อย ~1 เท่าของจำนวนรูปตัวเอง ถ้าได้ 2-3 เท่ายิ่งดี

**ถ้าไม่ใส่ raw/not_me เลย โมเดลจะจับหน้าใครก็ได้ ไม่ใช่แค่หน้าเรา**
สคริปต์จะเตือนตอนรัน แต่ไม่บล็อก เพราะบางทีก็อยากลองเทรนเล่นดูก่อน
"""

from __future__ import annotations

import argparse
import random
import shutil
import sys
from pathlib import Path

import cv2
import numpy as np
import yaml

import config as C


# ── ตัวช่วยอ่าน/เขียนรูปบน Windows ──────────────────────────────
#
# cv2.imread() พังเงียบ ๆ (คืน None) ถ้า path มีอักขระที่ไม่ใช่ ASCII
# ซึ่งบน Windows ภาษาไทยเจอบ่อยมาก — ชื่อไฟล์รูปจากมือถือ/Google Photos
# มักมีภาษาไทยติดมา เลยต้องอ่านเป็น bytes แล้วให้ cv2 ถอดเอง
def imread_unicode(path: Path) -> np.ndarray | None:
    try:
        buf = np.fromfile(str(path), dtype=np.uint8)
    except OSError:
        return None
    if buf.size == 0:
        return None
    return cv2.imdecode(buf, cv2.IMREAD_COLOR)


def imwrite_unicode(path: Path, img: np.ndarray) -> bool:
    ok, buf = cv2.imencode(path.suffix, img)
    if not ok:
        return False
    buf.tofile(str(path))
    return True


def list_images(folder: Path) -> list[Path]:
    if not folder.is_dir():
        return []
    return sorted(p for p in folder.iterdir() if p.suffix.lower() in C.IMAGE_EXTS)


# ── หาใบหน้า ────────────────────────────────────────────────────

def load_face_detector() -> cv2.CascadeClassifier:
    """
    ใช้ Haar cascade ที่แถมมากับ opencv-python — ข้อดีคือไม่ต้องโหลดอะไรเพิ่มเลย
    ข้อเสียที่ต้องรู้: มันเก่งเฉพาะหน้าตรง ถ้าเอียงมากหรือหันข้างจะหาไม่เจอ
    เพราะงั้นขั้นตอน review/ ข้างล่างไม่ใช่ของประดับ ต้องเปิดดูจริง ๆ
    """
    xml = Path(cv2.data.haarcascades) / "haarcascade_frontalface_default.xml"
    clf = cv2.CascadeClassifier(str(xml))
    if clf.empty():
        sys.exit(f"โหลด cascade ไม่สำเร็จ: {xml}")
    return clf


def detect_faces(clf: cv2.CascadeClassifier, img: np.ndarray) -> list[tuple[int, int, int, int]]:
    """คืนกล่องหน้าเป็น (x, y, w, h) กรองอันที่เล็กเกินไปออกแล้ว"""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # equalizeHist ช่วยเยอะกับรูปที่ย้อนแสงหรือถ่ายในที่มืด
    gray = cv2.equalizeHist(gray)

    h, w = gray.shape
    min_side = int(min(h, w) * C.MIN_FACE_RATIO)

    faces = clf.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=6,       # สูงกว่าค่า default 3 เพื่อลด false positive
        minSize=(min_side, min_side),
    )
    return [tuple(int(v) for v in f) for f in faces]


def to_yolo_label(box: tuple[int, int, int, int], img_w: int, img_h: int) -> str:
    """
    แปลง (x, y, w, h) พิกเซล → บรรทัด label ของ YOLO
        "<class_id> <cx> <cy> <w> <h>"  ทุกค่าเป็นสัดส่วน 0..1 ของขนาดรูป

    ขยายกล่องออกตาม BOX_PADDING ก่อน แล้วค่อย clamp ให้ไม่หลุดขอบรูป
    (ถ้าไม่ clamp ค่าจะเกิน 1.0 แล้ว ultralytics จะเตือน label ไม่ถูกต้อง)
    """
    x, y, w, h = box
    pad_x = w * C.BOX_PADDING
    pad_y = h * C.BOX_PADDING

    x1 = max(0.0, x - pad_x)
    y1 = max(0.0, y - pad_y)
    x2 = min(float(img_w), x + w + pad_x)
    y2 = min(float(img_h), y + h + pad_y)

    cx = (x1 + x2) / 2 / img_w
    cy = (y1 + y2) / 2 / img_h
    bw = (x2 - x1) / img_w
    bh = (y2 - y1) / img_h
    return f"{C.CLASS_ID} {cx:.6f} {cy:.6f} {bw:.6f} {bh:.6f}"


# ── สร้างชุดข้อมูล ──────────────────────────────────────────────

def build_records(multi: str) -> tuple[list[tuple[Path, str]], dict[str, int]]:
    """
    คืนรายการ (path รูป, เนื้อหา label) พร้อมสถิติ
    label เป็น "" หมายถึงรูปพื้นหลัง (hard negative)
    """
    clf = load_face_detector()
    records: list[tuple[Path, str]] = []
    stats = {"me_ok": 0, "me_no_face": 0, "me_multi": 0, "not_me": 0}

    REVIEW_OK = C.REVIEW / "ok"
    REVIEW_BAD = C.REVIEW / "no_face_or_ambiguous"
    for d in (REVIEW_OK, REVIEW_BAD):
        d.mkdir(parents=True, exist_ok=True)

    for path in list_images(C.RAW_ME):
        img = imread_unicode(path)
        if img is None:
            print(f"  ! อ่านไม่ได้ ข้าม: {path.name}")
            continue

        h, w = img.shape[:2]
        faces = detect_faces(clf, img)

        if not faces:
            stats["me_no_face"] += 1
            imwrite_unicode(REVIEW_BAD / f"noface_{path.stem}.jpg", img)
            continue

        if len(faces) > 1:
            # รูปหมู่ = ไม่รู้ว่าหน้าไหนคือเรา การเดาแล้ว label ผิดทำให้โมเดลพังหนัก
            # กว่าการมีรูปน้อยลงหนึ่งใบ default เลยเป็น "ข้าม" ไม่ใช่ "เดา"
            stats["me_multi"] += 1
            vis = img.copy()
            for (x, y, fw, fh) in faces:
                cv2.rectangle(vis, (x, y), (x + fw, y + fh), (0, 0, 255), 2)
            imwrite_unicode(REVIEW_BAD / f"multi_{path.stem}.jpg", vis)
            if multi != "largest":
                continue
            faces = [max(faces, key=lambda f: f[2] * f[3])]

        box = faces[0]
        line = to_yolo_label(box, w, h)
        records.append((path, line))
        stats["me_ok"] += 1

        # รูปตรวจทาน: วาดกล่องที่ "ขยายแล้ว" ตัวเดียวกับที่จะเขียนลง label
        _, cx, cy, bw, bh = line.split()
        cx, cy, bw, bh = float(cx), float(cy), float(bw), float(bh)
        p1 = (int((cx - bw / 2) * w), int((cy - bh / 2) * h))
        p2 = (int((cx + bw / 2) * w), int((cy + bh / 2) * h))
        vis = img.copy()
        cv2.rectangle(vis, p1, p2, (0, 255, 0), 2)
        cv2.putText(vis, C.CLASS_NAME, (p1[0], max(20, p1[1] - 8)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        imwrite_unicode(REVIEW_OK / f"{path.stem}.jpg", vis)

    for path in list_images(C.RAW_NOT_ME):
        # ไม่ต้องหาหน้าเลย ทั้งรูปคือพื้นหลัง label จึงเป็นไฟล์เปล่า
        records.append((path, ""))
        stats["not_me"] += 1

    return records, stats


def split_and_copy(records: list[tuple[Path, str]]) -> dict[str, int]:
    """แบ่งชุดแล้วก๊อปไฟล์เข้า dataset/ ตามโครงที่ ultralytics ต้องการ"""
    if C.DATASET.exists():
        shutil.rmtree(C.DATASET)  # สร้างใหม่ทุกครั้ง กันของเก่าค้างแล้วงง

    rng = random.Random(C.SEED)
    shuffled = records[:]
    rng.shuffle(shuffled)

    n = len(shuffled)
    n_train = int(n * C.SPLIT[0])
    n_val = int(n * C.SPLIT[1])
    parts = {
        "train": shuffled[:n_train],
        "val": shuffled[n_train:n_train + n_val],
        "test": shuffled[n_train + n_val:],
    }

    counts = {}
    for split, items in parts.items():
        img_dir = C.DATASET / "images" / split
        lbl_dir = C.DATASET / "labels" / split
        img_dir.mkdir(parents=True, exist_ok=True)
        lbl_dir.mkdir(parents=True, exist_ok=True)

        for i, (src, line) in enumerate(items):
            # เปลี่ยนชื่อเป็น ASCII ล้วน — กันปัญหา unicode path ในทุกเครื่องมือถัดไป
            stem = f"{split}_{i:05d}"
            shutil.copy2(src, img_dir / f"{stem}{src.suffix.lower()}")
            (lbl_dir / f"{stem}.txt").write_text(
                (line + "\n") if line else "", encoding="utf-8"
            )
        counts[split] = len(items)
    return counts


def write_data_yaml() -> None:
    """
    ปล่อยให้ yaml.safe_dump จัดการ quote ให้ เพราะชื่อคลาสมี ":" อยู่
    ถ้าต่อ string เองจะได้ `0: Lemon(me):3` ซึ่ง YAML อ่านแล้วพังทันที
    """
    data = {
        # as_posix() → ใช้ / แทน \ แม้บน Windows เพราะ ultralytics เขียน data.yaml
        # แบบนี้เหมือนกัน และ path ที่มี \ ในไฟล์ YAML เป็นบ่อเกิดปัญหาข้ามเครื่อง
        "path": C.DATASET.as_posix(),
        "train": "images/train",
        "val": "images/val",
        "test": "images/test",
        "names": {C.CLASS_ID: C.CLASS_NAME},
    }
    with C.DATA_YAML.open("w", encoding="utf-8") as f:
        yaml.safe_dump(data, f, allow_unicode=True, sort_keys=False)


def main() -> None:
    ap = argparse.ArgumentParser(description="เตรียมชุดข้อมูลสำหรับเทรน Lemon detector")
    ap.add_argument(
        "--multi",
        choices=["skip", "largest"],
        default="skip",
        help="รูปที่เจอหลายหน้าจะทำยังไง: skip = ข้าม (ค่าเริ่มต้น ปลอดภัยกว่า), "
             "largest = เดาว่าหน้าที่ใหญ่สุดคือเรา",
    )
    args = ap.parse_args()

    for d in (C.RAW_ME, C.RAW_NOT_ME):
        d.mkdir(parents=True, exist_ok=True)

    if not list_images(C.RAW_ME):
        sys.exit(
            f"ยังไม่มีรูปใน {C.RAW_ME}\n"
            "→ โหลดรูปตัวเองจาก Google Photos มาวางในโฟลเดอร์นี้ก่อน"
        )

    if C.REVIEW.exists():
        shutil.rmtree(C.REVIEW)

    print("กำลังหาใบหน้าและสร้าง label…")
    records, stats = build_records(args.multi)

    if stats["not_me"] == 0:
        print(
            "\n" + "=" * 68 + "\n"
            "⚠️  ไม่มีรูปใน raw/not_me เลย\n"
            "    โมเดลที่ได้จะจับ 'หน้าคน' ไม่ใช่ 'หน้าคุณ' โดยเฉพาะ\n"
            "    เพราะไม่มีตัวอย่างให้เรียนรู้ว่าหน้าแบบไหนไม่ใช่คุณ\n"
            "    เทรนต่อได้ แต่อย่าเอาไปเคลมว่าแยกตัวบุคคลได้\n"
            + "=" * 68 + "\n"
        )

    counts = split_and_copy(records)
    write_data_yaml()

    print("\n── สรุป ─────────────────────────────────────────")
    print(f"  รูปเรา label สำเร็จ      : {stats['me_ok']}")
    print(f"  หาหน้าไม่เจอ (ข้าม)      : {stats['me_no_face']}")
    print(f"  เจอหลายหน้า ({args.multi})   : {stats['me_multi']}")
    print(f"  รูปคนอื่น (hard negative) : {stats['not_me']}")
    print(f"  train / val / test        : "
          f"{counts['train']} / {counts['val']} / {counts['test']}")
    print(f"\n  data.yaml → {C.DATA_YAML}")
    print(f"  รูปตรวจทาน → {C.REVIEW}")
    print(
        "\n👉 เปิด review/ok/ ดูก่อนเทรน ถ้ากล่องไหนวางผิด ให้ลบรูปต้นทางใน raw/me\n"
        "   แล้วรันสคริปต์นี้ใหม่ — label ผิดหนึ่งใบเสียหายกว่ารูปน้อยลงหนึ่งใบ"
    )


if __name__ == "__main__":
    main()
