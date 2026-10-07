"""ทำรูปประจำตัวละคร 3 ตัวของเว็บ /ozzy (Pepe · Dooley · M'Baku) จากรูปต้นฉบับ

    python tools/characters.py

อ่านจาก tools/source/next/{pepe,dooley,mbaku}.jpg  (gitignore ไว้ — ไฟล์ต้นทางไม่ขึ้น git)
เขียนไปที่ public/ozzy/characters/{pepe,dooley,mbaku}.webp  สี่เหลี่ยมจัตุรัส 320×320

ทำไมต้องผ่านสคริปต์ ไม่เอารูปที่โหลดมาใส่ตรง ๆ:
  1. รูปต้นฉบับขนาดไม่เท่ากันเลย (593×517, 320², 554²) — บนหน้าเว็บวางในกรอบจัตุรัส
     ถ้าปล่อยให้ object-cover ครอปเอง หน้าคนจะโดนตัดตรงไหนก็ไม่รู้ เลยกำหนดกรอบเองทีละรูป
  2. WebP เล็กกว่า JPG ราวครึ่งหนึ่งที่คุณภาพใกล้กัน และไม่พก EXIF ต่อ
  3. วันหนึ่งได้รูปใหม่ (เช่นไฟล์อีโมตตัวจริงจากช่อง) แค่วางทับใน tools/source/next/ แล้วรันใหม่

⚠️ รูปทั้งสามเป็นของเจ้าของลิขสิทธิ์ (Pepe — Matt Furie · Dooley — The Bazaar ·
M'Baku — Marvel ภาพจากการ์ดในเกม Marvel Snap) ใช้ในฐานะแฟนเพจ ให้เครดิตไว้ท้ายหน้า /next แล้ว
"""
from pathlib import Path

from PIL import Image

SRC = Path("tools/source/next")
OUT = Path("public/ozzy/characters")
SIZE = 320

# กรอบครอป (ซ้าย, บน, ขวา, ล่าง) ในพิกัดของรูปต้นฉบับ — ต้องเป็นสี่เหลี่ยมจัตุรัส
CROPS = {
    # หน้าเต็มเกือบทั้งรูปอยู่แล้ว ตัดขอบซ้ายขวาเท่า ๆ กันให้เป็นจัตุรัส
    "pepe": (38, 0, 555, 517),
    # ไฟล์จาก wiki เป็นจัตุรัส 320 พอดี ใช้ทั้งรูป
    "dooley": (0, 0, 320, 320),
    # ภาพจากการ์ด Marvel Snap (554² มีพื้นขาว เลขพลัง/ค่าร่าย และโลโก้ชื่อ)
    # เอาเฉพาะช่วงหัวถึงอก หน้าอยู่ราว (270, 140) — ตัดเลข 1 / 3 กับโลโก้ M'BAKU ทิ้ง
    # เพราะการ์ดฮีโร่บนหน้าเว็บมีชื่อกับค่าพลังของตัวเองอยู่แล้ว
    # ขอบขวาหยุดที่ 383 ก่อนถึงเลข 3 (เริ่มที่ x≈385) · ขอบบนเริ่ม 100 ให้เหลือที่เหนือหัวนิดหนึ่ง
    # (เลข 1 ยังติดมุมซ้ายบนราว 15×18 px — ถ้าดันลงอีกจะตัดหัว)
    "mbaku": (163, 100, 383, 320),
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, box in CROPS.items():
        w, h = box[2] - box[0], box[3] - box[1]
        assert w == h, f"{name}: กรอบไม่ใช่จัตุรัส ({w}x{h})"
        im = Image.open(SRC / f"{name}.jpg").convert("RGB").crop(box)
        im = im.resize((SIZE, SIZE), Image.LANCZOS)
        out = OUT / f"{name}.webp"
        im.save(out, "WEBP", quality=82, method=6)
        print(f"เขียน {out}  {SIZE}x{SIZE}  {out.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
