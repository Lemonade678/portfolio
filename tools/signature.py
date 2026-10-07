"""แปลงรูปลายเซ็น (เส้นสีบนพื้นดำ) เป็น PNG พื้นใส สำหรับวางท้ายหน้าเว็บ

    python tools/signature.py tools/source/signature.jpg
    python tools/signature.py tools/source/signature.jpg --color "#F5B92E"   # เปลี่ยนสีเส้น

ทำไมต้องแปลง ไม่ใช้ไฟล์ที่วาดมาตรง ๆ:
  ไฟล์ต้นฉบับเป็น JPG พื้นดำสนิท วางบนเว็บที่พื้นเป็นน้ำตาลเข้ม (#1A1310)
  จะเห็นเป็นกล่องดำทึบรอบลายเซ็น — ต้องเปลี่ยนพื้นดำให้เป็นโปร่งใสก่อน

วิธีคิด:
  1. ความสว่างของแต่ละพิกเซล (ช่องที่สว่างที่สุดใน R/G/B) บอกได้ว่าตรงนั้นเป็นเส้นแค่ไหน
     พื้นดำ ≈ 3 · กลางเส้น ≈ 244 · ขอบเส้นที่ anti-alias ไว้อยู่ระหว่างนั้น
  2. แปลงความสว่างเป็นค่าโปร่งใส (alpha) ตรง ๆ ขอบเส้นเลยยังนุ่มเหมือนต้นฉบับ
     ตัดค่าต่ำ ๆ ทิ้ง (< FLOOR) เพราะ JPG มีเม็ดสัญญาณรบกวนรอบเส้น ถ้าไม่ตัดจะเห็นเป็นฝ้า
  3. ทาสีเส้นเป็นสีเดียวทั้งหมด แทนที่จะใช้สีจากไฟล์ — สีใน JPG เพี้ยนไปมาตามบล็อกบีบอัด
     สีตั้งต้นคือค่ากลางของเส้นในไฟล์ต้นฉบับ (เหลืองมะนาวที่เจ้าตัววาดมา)

ผลลัพธ์ไม่มี EXIF (Pillow ไม่พกต่อให้ถ้าไม่สั่ง) และ optimize ขนาดไฟล์ให้แล้ว
"""
import argparse
from pathlib import Path

import numpy as np
from PIL import Image

FLOOR = 24     # ต่ำกว่านี้ถือเป็นพื้นหลัง (ฝ้าจาก JPG)
CEIL = 200     # สูงกว่านี้ถือเป็นเส้นทึบเต็มที่


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("src", help="รูปลายเซ็น เส้นสว่างบนพื้นมืด")
    ap.add_argument("-o", "--out", default="public/signature.png")
    ap.add_argument("--color", help="สีเส้น เช่น #F5B92E (ไม่ใส่ = ใช้สีจากต้นฉบับ)")
    args = ap.parse_args()

    rgb = np.asarray(Image.open(args.src).convert("RGB")).astype(np.float32)
    bright = rgb.max(axis=2)

    alpha = np.clip((bright - FLOOR) / (CEIL - FLOOR), 0, 1)

    if args.color:
        h = args.color.lstrip("#")
        color = np.array([int(h[i : i + 2], 16) for i in (0, 2, 4)], dtype=np.float32)
    else:
        core = bright > 220  # กลางเส้นจริง ๆ ไม่ใช่ขอบที่ผสมกับพื้นดำ
        color = np.median(rgb[core], axis=0)

    out = np.zeros((*alpha.shape, 4), dtype=np.uint8)
    out[..., :3] = np.round(color).astype(np.uint8)
    out[..., 3] = np.round(alpha * 255).astype(np.uint8)

    # ตัดขอบว่างรอบนอกทิ้ง ให้กรอบรูปพอดีกับตัวลายเซ็น
    ys, xs = np.nonzero(out[..., 3])
    out = out[ys.min() : ys.max() + 1, xs.min() : xs.max() + 1]

    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(out).save(args.out, optimize=True)  # array 4 ช่อง uint8 → Pillow รู้เองว่าเป็น RGBA

    hexcol = "#%02X%02X%02X" % tuple(int(round(c)) for c in color)
    kb = Path(args.out).stat().st_size / 1024
    print(f"เขียน {args.out}  {out.shape[1]}x{out.shape[0]}  สีเส้น {hexcol}  {kb:.0f} KB")


if __name__ == "__main__":
    main()
