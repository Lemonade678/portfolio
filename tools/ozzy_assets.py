"""ทำรูปของเว็บ TheOzzy (/ozzy) จากไฟล์ต้นฉบับ: รูปถ่าย 3 รูป + emote ของช่อง

    python tools/ozzy_assets.py                      # เขียน public/ozzy/photos + public/ozzy/cards + public/ozzy/emotes
    python tools/ozzy_assets.py --sheet sheet.png    # + ภาพรวม emote ขยาย 4 เท่า ไว้ดูตอนตั้งชื่อ

อ่านจาก tools/source/ozzy/ (gitignore — ต้นฉบับไม่ขึ้น git):
    selfie.jpg · giraffe.jpg · stream.webp · duo.jpg · meetup.jpg · setup.jpg · emotes.png (ภาพหน้าจอหน้า emote ของช่อง)

ทำไมต้องผ่านสคริปต์:
  1. รูปจากมือถือ/เพจมักพก EXIF มาด้วย (บางทีมีพิกัด GPS) — Pillow ไม่เขียน EXIF ต่อให้ถ้าไม่สั่ง
  2. ย่อให้พอดีที่ใช้จริง: ต้นฉบับยีราฟ 1536×2048 ใหญ่เกินกรอบบนเว็บหลายเท่า
  3. emote มาเป็นภาพหน้าจอแผ่นเดียว ต้องตัดทีละช่องเอง

เรื่อง emote:
  - ภาพหน้าจอเป็นตาราง 8 คอลัมน์ × 3 แถว ตำแหน่งแต่ละช่องวัดจากภาพจริง (แถบที่มีพิกเซลไม่ใช่พื้นหลัง)
  - ข้ามแถว 3 คอลัมน์ 4–8: ช่อง 4 ว่าง · ช่อง 5–8 มีไอคอนกุญแจ = ของสมาชิกช่อง ไม่เอามาโชว์
  - พื้นหลังสีเทาเข้มของภาพหน้าจอถูกทำให้ใส (เทียบระยะสีกับพื้น) เพื่อให้ emote วางบนพื้นครามของเว็บได้
    ขอบอาจมีเงาเข้มติดนิดหน่อย — มองไม่ออกบนพื้นมืด ถ้าได้ไฟล์ emote ต้นฉบับมาจะคมและสะอาดกว่า
  - emote แต่ละตัวกว้างแค่ราว 40 px (ขนาดในหน้า YouTube) — บนเว็บแสดงแบบ pixelated ไม่ขยายเบลอ
"""
import argparse
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path("tools/source/ozzy")
OUT_PHOTOS = Path("public/ozzy/photos")
OUT_EMOTES = Path("public/ozzy/emotes")
OUT_CARDS = Path("public/ozzy/cards")

# ชื่อไฟล์ปลายทาง → (ไฟล์ต้นทาง, ด้านยาวสุดหลังย่อ)
PHOTOS = {
    "selfie": ("selfie.jpg", 900),  # 896×1195 สัดส่วน 3:4 อยู่แล้ว ใช้ทั้งรูป
    "giraffe": ("giraffe.jpg", 1200),
    "stream": ("stream.webp", 640),  # 640×360 ขนาดเดิม
    # สามรูปจากอัลบั้มแชร์ "OOOO…ZZY" ของเจ้าของเว็บ (ดาวน์โหลดขนาด 1600 px ด้านยาว) — ทุกคนในรูปยินยอมแล้ว
    "duo": ("duo.jpg", 1200),  # เซลฟี่สองคนในงานอีเวนต์
    "meetup": ("meetup.jpg", 1200),  # มีตติ้งแฟน ๆ ต.ค. 2022
    "setup": ("setup.jpg", 1200),  # แล็ปท็อปเปิดสตรีม พ.ค. 2022
}

# ภาพบนไพ่ในเด็ค (แฟนอาร์ต) → public/ozzy/cards/<ไพ่>.webp ขนาด 4:3 ตามช่องภาพของไพ่ (.oz-deck-art)
# ครอปเฉพาะตัวละคร ไม่เอากรอบการ์ดกับเม็ดค่าพลัง/ราคาของต้นฉบับ (ไม่งั้นซ้อนกับเม็ดบนไพ่ของเว็บ)
# เครดิตผู้วาดอยู่ใน OZZY.table.artCredits (โชว์ใต้เด็ค) — ภาพที่ไม่รู้ชื่อผู้วาด เจ้าของเว็บเลือกไม่ใช้
CARD_ART = {
    "profile": ("fanart-thanpisit.jpg", (440, 300, 1080, 780)),  # Fan art by Thanpisit
    "wheel": ("fanart-zlxwartwork.jpg", (220, 330, 800, 765)),  # Art by zlxwartwork (IG)
}
CARD_SIZE = (640, 480)

# ขอบเขตแถบคอลัมน์/แถวของตาราง emote (วัดจากภาพหน้าจอ 822×173)
COLS = [(6, 45), (115, 154), (225, 264), (334, 374), (443, 487), (552, 596), (662, 705), (772, 815)]
ROWS = [(8, 43), (64, 104), (124, 165)]
SKIP = {(2, c) for c in range(3, 8)}  # แถว 3 (index 2) คอลัมน์ 4–8 (index 3–7)
PAD = 2


def photos() -> list[tuple[str, int, int]]:
    OUT_PHOTOS.mkdir(parents=True, exist_ok=True)
    done = []
    for name, (src, long_side) in PHOTOS.items():
        im = Image.open(SRC / src).convert("RGB")
        im.thumbnail((long_side, long_side), Image.LANCZOS)
        out = OUT_PHOTOS / f"{name}.webp"
        im.save(out, "WEBP", quality=82, method=6)  # ไม่ส่ง exif= → ไม่มี EXIF
        done.append((name, im.width, im.height))
        print(f"เขียน {out}  {im.width}x{im.height}  {out.stat().st_size / 1024:.0f} KB")
    return done


def card_art() -> None:
    OUT_CARDS.mkdir(parents=True, exist_ok=True)
    for card, (src, box) in CARD_ART.items():
        im = Image.open(SRC / src).convert("RGB").crop(box).resize(CARD_SIZE, Image.LANCZOS)
        out = OUT_CARDS / f"{card}.webp"
        im.save(out, "WEBP", quality=82, method=6)  # ไม่ส่ง exif= → ไม่มี EXIF
        print(f"เขียน {out}  {im.width}x{im.height}  {out.stat().st_size / 1024:.0f} KB")


def emotes(sheet: Path | None) -> int:
    OUT_EMOTES.mkdir(parents=True, exist_ok=True)
    shot = Image.open(SRC / "emotes.png").convert("RGB")
    rgb = np.asarray(shot).astype(np.float32)
    bg = np.median(rgb.reshape(-1, 3), axis=0)
    crops = []
    n = 0
    for r, (y0, y1) in enumerate(ROWS):
        for c, (x0, x1) in enumerate(COLS):
            if (r, c) in SKIP:
                continue
            n += 1
            box = (x0 - PAD, y0 - PAD, x1 + PAD + 1, y1 + PAD + 1)
            cell = rgb[box[1] : box[3], box[0] : box[2]]
            # ระยะสีจากพื้นหลัง → ความทึบ: ใกล้พื้น = ใส · ห่างพื้นเกิน 40 = ทึบเต็ม
            dist = np.sqrt(((cell - bg) ** 2).sum(axis=2))
            alpha = np.clip((dist - 10) / 30, 0, 1)
            rgba = np.dstack([cell, alpha * 255]).round().astype(np.uint8)
            out = OUT_EMOTES / f"e{n:02d}.png"
            Image.fromarray(rgba).save(out, optimize=True)
            crops.append((n, Image.fromarray(rgba)))
    print(f"เขียน emote {n} ตัวใน {OUT_EMOTES}")
    if sheet:
        # ภาพรวมขยาย 4 เท่า พื้นครามแบบเว็บจริง พร้อมเลขกำกับ — ไว้ดูตอนตั้งชื่อ
        from PIL import ImageDraw

        cw = 48 * 4 + 16
        board = Image.new("RGB", (cw * 7, (48 * 4 + 40) * 3), (18, 17, 44))
        dr = ImageDraw.Draw(board)
        for i, (num, im) in enumerate(crops):
            x, y = (i % 7) * cw + 8, (i // 7) * (48 * 4 + 40) + 8
            big = im.resize((im.width * 4, im.height * 4), Image.NEAREST)
            board.paste(big, (x, y), big)
            dr.text((x, y + big.height + 4), f"e{num:02d}", fill=(255, 255, 255))
        board.save(sheet)
        print(f"ภาพรวม → {sheet}")
    return n


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sheet", type=Path, help="เขียนภาพรวม emote ขยาย 4 เท่าไว้ตรวจ")
    args = ap.parse_args()
    photos()
    card_art()
    emotes(args.sheet)


if __name__ == "__main__":
    main()
