"""รูปของกำแพง "ผู้คนที่ได้เจอ" ในหน้าต่าง 04 People — แปลงเป็น WebP สำหรับเว็บ

    python tools/people_assets.py

อ่านจาก tools/source/people/ (gitignore — ต้นฉบับไม่ขึ้น git) → เขียน public/people/<id>.webp

ทำไมต้องผ่านสคริปต์:
  1. ทิ้ง EXIF ทั้งหมด — รูปจากมือถือบางทีพกพิกัด GPS เวลา และรุ่นเครื่องมาด้วย
     Pillow ไม่เขียน EXIF ต่อให้ถ้าไม่สั่ง (ไม่ส่ง exif= ตอน save)
  2. ย่อด้านยาวไม่เกิน 1200 px — บนเว็บรูปกว้างสุดแค่ราว 300 px (ขยายในกล่องดูรูปได้ถึง ~900)
  3. WebP q82 เล็กกว่า JPEG ราวครึ่งหนึ่งที่ตาแยกไม่ออก

ทุกคนในรูปยินยอมให้ลงเว็บแล้ว (เจ้าของเว็บยืนยัน 8 ต.ค. 2026) — เพิ่มรูปใหม่เมื่อไหร่ ถามคนในรูปก่อน
เพิ่มรูป: วางไฟล์ใน tools/source/people/ · เพิ่มบรรทัดใน PHOTOS ข้างล่าง · เพิ่มคำบรรยายใน PEOPLE ใน lib/content.ts
"""
from pathlib import Path

from PIL import Image, ImageOps

SRC = Path("tools/source/people")
OUT = Path("public/people")
MAX_SIDE = 1200

# id บนเว็บ → ไฟล์ต้นฉบับ (ชื่อไฟล์จากมือถือ = วันเวลาที่ถ่าย)
PHOTOS = {
    "yzu": "20250729_173056.jpg",
    "presentation": "20250729_170429.jpg",
    "dinner": "20250729_202410.jpg",
    "concert": "20260909_214407.jpg",
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for pid, name in PHOTOS.items():
        im = Image.open(SRC / name)
        # หมุนตามที่ EXIF บอกก่อน แล้วค่อยทิ้ง EXIF — ไม่งั้นรูปถ่ายแนวตั้งบางรูปจะนอนตะแคง
        im = ImageOps.exif_transpose(im).convert("RGB")
        im.thumbnail((MAX_SIDE, MAX_SIDE), Image.Resampling.LANCZOS)
        out = OUT / f"{pid}.webp"
        im.save(out, "WEBP", quality=82, method=6)
        print(f"{out}  {im.width}x{im.height}  {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
