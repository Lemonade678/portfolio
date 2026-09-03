#!/usr/bin/env python3
"""
censor.py — ปิดข้อมูลส่วนบุคคลบนเอกสารก่อนเอาขึ้นเว็บสาธารณะ

    # 1) หาพิกัด — วาดกริดทับรูปแล้วเปิดดูว่าฟิลด์ที่ต้องปิดอยู่ตรงไหน
    python tools/censor.py grid  ~/Downloads/toeic.jpg  -o grid.png

    # 2) ลองวางกรอบ — วาดเป็นเส้นขอบสีแดงพร้อมเลขกำกับ ยังไม่ทับจริง
    python tools/censor.py apply tools/recipes/toeic-885.json --preview

    # 3) ปิดจริง
    python tools/censor.py apply tools/recipes/toeic-885.json


ทำไมใช้แถบทึบ ไม่ใช่ blur หรือ pixelate
───────────────────────────────────────
เอกสารราชการมีฟิลด์ที่ "เดาได้" เยอะมาก เลขบัตรประชาชนไทยมี 13 หลัก
ตัวเลขบนใบพิมพ์ด้วยฟอนต์ความกว้างเท่ากันทุกตัว และหลักแรกกับหลักตรวจสอบ
มีกติกาตายตัวอยู่แล้ว การเบลอหรือ pixelate ทิ้ง "เงา" ของความเข้มและความกว้าง
ไว้พอที่จะไล่เดาทีละหลัก หรือทำ deconvolution ย้อนกลับได้
งานวิจัยด้าน image forensics ทำแบบนี้ได้มาหลายปีแล้ว

แถบทึบเขียนทับค่าพิกเซลจริง ๆ ข้อมูลเดิมหายไปจากไฟล์ ไม่มีอะไรให้กู้

**และห้ามใช้วิธีวาดสี่เหลี่ยมทับใน PDF โดยไม่ flatten** เพราะข้อความเดิม
ยังอยู่ใน content stream ใต้สี่เหลี่ยมนั้น ก๊อปวางออกมาได้เลย —
สคริปต์นี้จึง render PDF เป็น bitmap ก่อนเสมอ แล้วค่อยทาสีทับ


เรื่อง metadata
───────────────
รูปถ่ายจากมือถือพก EXIF มาด้วย ซึ่งอาจมีพิกัด GPS ของบ้าน รุ่นเครื่อง
และเวลาถ่ายที่แม่นระดับวินาที สคริปต์เซฟเป็น PNG ผ่าน Pillow โดยไม่ส่ง
EXIF ต่อ ข้อมูลพวกนี้จึงหลุดออกไปตั้งแต่ต้นทาง
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw

# สีแถบ — เทาเข้มอมน้ำตาล เข้ากับโทนเว็บ และอ่านออกทันทีว่าจงใจปิด ไม่ใช่ภาพเสีย
BAR_RGB = (58, 46, 38)


# ── โหลดเอกสาร ────────────────────────────────────────────────

def load(path: Path, dpi: int = 300, page: int = 0) -> Image.Image:
    """เปิดรูป หรือ render หน้า PDF เป็น bitmap

    PDF ต้อง render เป็น bitmap ก่อนเสมอ ห้ามวาดทับบน PDF ตรง ๆ
    เพราะข้อความเดิมจะยังอยู่ใต้สี่เหลี่ยมที่วาด ก๊อปออกมาอ่านได้
    """
    if path.suffix.lower() == ".pdf":
        try:
            import fitz  # PyMuPDF
        except ImportError:
            sys.exit("ต้องมี PyMuPDF ก่อน:  pip install pymupdf")
        doc = fitz.open(path)
        pix = doc[page].get_pixmap(dpi=dpi)
        return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    return Image.open(path).convert("RGB")


# ── โหมดหาพิกัด ───────────────────────────────────────────────

def draw_grid(img: Image.Image, step: int = 100) -> Image.Image:
    """วาดกริดพร้อมเลขพิกัด เพื่อให้จดตำแหน่งฟิลด์ที่ต้องปิดได้"""
    out = img.copy()
    d = ImageDraw.Draw(out)
    for x in range(0, out.width, step):
        d.line([(x, 0), (x, out.height)], fill=(255, 0, 0), width=2)
        d.text((x + 4, 6), str(x), fill=(255, 0, 0))
    for y in range(0, out.height, step):
        d.line([(0, y), (out.width, y)], fill=(0, 120, 255), width=2)
        d.text((6, y + 4), str(y), fill=(0, 120, 255))
    return out


# ── โหมดปิดข้อมูล ─────────────────────────────────────────────

def censor(img: Image.Image, recipe: dict, preview: bool = False) -> Image.Image:
    """ตัดกรอบตาม crop แล้วทาแถบทับตาม boxes

    พิกัดใน recipe อ้างอิงกับ **ภาพเต็มก่อน crop** เสมอ
    จะได้ไม่ต้องคำนวณใหม่ทุกครั้งที่ขยับกรอบ crop
    """
    boxes = [tuple(b["box"]) for b in recipe.get("boxes", [])]
    labels = [b.get("what", "") for b in recipe.get("boxes", [])]

    out = img.copy()
    d = ImageDraw.Draw(out)
    for i, (box, what) in enumerate(zip(boxes, labels), 1):
        if preview:
            d.rectangle(box, outline=(255, 0, 0), width=4)
            d.text((box[0] + 6, box[1] + 6), f"{i}", fill=(255, 0, 0))
        else:
            d.rectangle(box, fill=BAR_RGB)
        print(f"  {'กรอบ' if preview else 'ปิด '} {i}. {what or '(ไม่ระบุ)':38s} {box}")

    if crop := recipe.get("crop"):
        # crop ทีหลัง เพราะพิกัดกล่องอ้างอิงภาพเต็ม
        # และการ crop คือวิธีตัดสิ่งที่ไม่อยากให้เห็นออกที่ปลอดภัยที่สุด —
        # พิกเซลนอกกรอบไม่ได้ถูกทาทับ แต่ไม่ได้ถูกเขียนลงไฟล์เลย
        out = out.crop(tuple(crop))
        print(f"  ตัดกรอบ {tuple(crop)} → {out.width}x{out.height}")

    if w := recipe.get("resize_width"):
        out = out.resize((w, round(w * out.height / out.width)), Image.LANCZOS)
        print(f"  ย่อเหลือกว้าง {w} → {out.width}x{out.height}")

    return out


def save(img: Image.Image, path: Path) -> None:
    """เซฟเป็น PNG โดยไม่พก EXIF ต่อ (Pillow ไม่เขียน EXIF ให้ PNG อยู่แล้ว)"""
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG", optimize=True)
    print(f"\nเขียน {path}  {img.width}x{img.height}  {path.stat().st_size/1024:.0f} KB")


# ── CLI ───────────────────────────────────────────────────────

def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[1],
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    g = sub.add_parser("grid", help="วาดกริดพิกัดทับรูป เพื่อหาตำแหน่งฟิลด์")
    g.add_argument("input", type=Path)
    g.add_argument("-o", "--output", type=Path, default=Path("grid.png"))
    g.add_argument("--step", type=int, default=100)
    g.add_argument("--dpi", type=int, default=300)
    g.add_argument("--page", type=int, default=0)

    a = sub.add_parser("apply", help="ปิดข้อมูลตาม recipe")
    a.add_argument("recipe", type=Path, help="ไฟล์ JSON")
    a.add_argument("--preview", action="store_true",
                   help="วาดเป็นเส้นขอบแทนแถบทึบ เพื่อตรวจตำแหน่งก่อนปิดจริง")

    args = ap.parse_args()

    if args.cmd == "grid":
        img = load(args.input, dpi=args.dpi, page=args.page)
        print(f"ภาพต้นทาง {img.width}x{img.height}")
        save(draw_grid(img, args.step), args.output)
        print("→ เปิดไฟล์นี้ดู แล้วจดพิกัดของฟิลด์ที่ต้องปิดลง recipe")
        return

    recipe = json.loads(args.recipe.read_text(encoding="utf-8"))
    src = Path(recipe["input"]).expanduser()
    if not src.exists():
        sys.exit(f"ไม่เจอไฟล์ต้นทาง: {src}")

    img = load(src, dpi=recipe.get("dpi", 300), page=recipe.get("page", 0))
    print(f"ภาพต้นทาง {img.width}x{img.height}")

    out = censor(img, recipe, preview=args.preview)
    dst = Path(recipe["output"])
    if args.preview:
        dst = dst.with_name(dst.stem + "-preview.png")
    save(out, dst)

    if not args.preview:
        print("\n⚠️  เปิดไฟล์ผลลัพธ์ตรวจด้วยตาก่อนเอาขึ้นเว็บทุกครั้ง")
        print("    แถบเลื่อนไปแค่ไม่กี่พิกเซลก็เหลือข้อมูลโผล่ขอบได้")
        print("    และอย่า commit ไฟล์ต้นทางเข้า git — ดู .gitignore")


if __name__ == "__main__":
    main()
