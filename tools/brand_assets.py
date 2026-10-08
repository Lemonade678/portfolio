"""ไอคอนเว็บ + โลโก้ร้าน Buttertteok 4U — จากไฟล์ต้นฉบับที่เจ้าของเว็บให้มา

    python tools/brand_assets.py

อ่านจาก tools/source/brand/ (gitignore — ต้นฉบับไม่ขึ้น git):
    icon-capybara.jpg       คาปิบาร่าในแก้วชามะนาว (1500×1500)
    buttertteok4u-logo.jpg  โลโก้ร้าน บนพื้นขาว (1500×1500)

เขียน:
    app/icon.png         256×256 — Next.js เห็นไฟล์ชื่อนี้ใน app/ แล้วใส่ <link rel="icon"> ให้ทุกหน้าเอง
    app/apple-icon.png   180×180 — ไอคอนตอนกด "เพิ่มไปยังหน้าจอโฮม" บน iPhone
    public/brand/buttertteok4u.webp  โลโก้ร้าน พื้นใส ด้านกว้าง 480

ทำไมครอปไอคอนแน่นกว่ารูปเต็ม: ไอคอนบนแท็บเบราว์เซอร์เหลือแค่ 16–32 px
ถ้าใช้รูปเต็ม (มีใบไม้ ขอบเขียว) ตัวคาปิบาร่าจะเล็กจนดูไม่ออก — ครอปเหลือตัวมันกับแก้วพอ

ทำไมทำพื้นโลโก้ให้ใส: เว็บพื้นน้ำตาลเข้ม โลโก้บนพื้นขาวจะกลายเป็นกล่องสี่เหลี่ยมขาวโผล่มา
ใช้ flood fill จากมุมภาพ → ลบเฉพาะพื้นขาว "ด้านนอก" โลโก้ สีขาว/ครีมข้างในโลโก้ไม่โดนลบ
"""
from pathlib import Path

from PIL import Image, ImageDraw

SRC = Path("tools/source/brand")
ICON_BOX = (230, 180, 1330, 1280)  # คาปิบาร่า + แก้ว + ฝานมะนาว (ไม่เอาใบไม้กับขอบเขียว)


def icons() -> None:
    im = Image.open(SRC / "icon-capybara.jpg").convert("RGB").crop(ICON_BOX)
    # 256 px พอสำหรับแท็บ/บุ๊กมาร์ก · ลดเหลือ 256 สี (ภาพวาดสีเรียบ ตาแยกไม่ออก) ไฟล์เล็กลงหลายเท่า
    for out, size in ((Path("app/icon.png"), 256), (Path("app/apple-icon.png"), 180)):
        small = im.resize((size, size), Image.LANCZOS)
        small.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).save(out, optimize=True)
        print(f"เขียน {out}  {size}x{size}  {out.stat().st_size // 1024} KB")


def logo() -> None:
    im = Image.open(SRC / "buttertteok4u-logo.jpg").convert("RGB")
    # ระบายพื้นขาวด้านนอกจากทั้งสี่มุมด้วยสีที่ไม่มีในภาพ แล้วเปลี่ยนสีนั้นเป็นโปร่งใส
    key = (255, 0, 255)
    for corner in ((0, 0), (im.width - 1, 0), (0, im.height - 1), (im.width - 1, im.height - 1)):
        ImageDraw.floodfill(im, corner, key, thresh=40)
    rgba = im.convert("RGBA")
    px = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            if px[x, y][:3] == key:
                px[x, y] = (0, 0, 0, 0)
    rgba = rgba.crop(rgba.getbbox())
    w = 480
    rgba = rgba.resize((w, round(rgba.height * w / rgba.width)), Image.LANCZOS)
    out = Path("public/brand/buttertteok4u.webp")
    out.parent.mkdir(parents=True, exist_ok=True)
    rgba.save(out, "WEBP", quality=88, method=6)  # ไม่ส่ง exif= → ไม่มี EXIF
    print(f"เขียน {out}  {rgba.width}x{rgba.height}  {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    icons()
    logo()
