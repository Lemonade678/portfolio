# Portfolio — Nutt Bhanidch

Personal portfolio site. Next.js (App Router) · TypeScript · Tailwind CSS v4.
Bilingual EN/TH with no page reload. Includes a YOLOv11 model that runs in the
visitor's browser, and the Python project that trained it.

เว็บ portfolio ส่วนตัว สลับภาษาไทย/อังกฤษได้โดยไม่โหลดหน้าใหม่
มีของเล่นที่รันโมเดล YOLOv11 จริงในเบราว์เซอร์ พร้อมโปรเจกต์ Python ที่ใช้เทรนโมเดลนั้น

---

## รันบนเครื่อง

```bash
npm install
npm run dev
```

ตรวจก่อน deploy ทุกครั้ง:

```bash
npm run build
```

---

## Deploy ขึ้น Vercel

**วิธีที่แนะนำ — ผูกกับ GitHub ให้ auto-deploy** (ไม่ต้องลง CLI ไม่ต้องยุ่งกับ token)

1. สร้าง repo เปล่าชื่อ `portfolio` บน GitHub — **อย่าติ๊ก "Add a README"
   และอย่าเลือก .gitignore / license** ไม่งั้นจะมี commit ค้างอยู่แล้ว push ชนกัน
2. push โฟลเดอร์นี้ขึ้นไป (PowerShell):

   ```powershell
   git remote add origin https://github.com/Lemonade678/portfolio.git; git push -u origin main
   ```

   > PowerShell 5.1 **ไม่มี `&&`** ต้องใช้ `;` คั่นแทน ถ้าอยากให้คำสั่งหลังรัน
   > เฉพาะตอนคำสั่งแรกสำเร็จ ใช้ `cmd1; if ($?) { cmd2 }`

3. ไป [vercel.com/new](https://vercel.com/new) → **Import Git Repository** → เลือก repo นี้
4. Vercel ตรวจเจอว่าเป็น Next.js เอง **ไม่ต้องตั้งค่าอะไรเลย** — ไม่มี env var ที่ต้องใส่
5. กด Deploy

หลังจากนี้ push ขึ้น `main` เมื่อไหร่ Vercel จะ build ใหม่ให้อัตโนมัติ
และทุก branch/PR จะได้ preview URL ของตัวเอง

**วิธีที่สอง — ใช้ CLI** (ต้องล็อกอินผ่านเบราว์เซอร์ครั้งแรก)

```bash
npm i -g vercel && vercel
```

> **หมายเหตุเรื่องขนาด:** `public/models/yolo11n.onnx` หนัก 10.7 MB และ
> `public/lane-change-presentation.pdf` อีก 1.6 MB — ยังห่างจากลิมิตของ Vercel มาก
> แต่ถ้าวันหนึ่ง repo เริ่มอืด ให้ย้าย `.onnx` ไปโฮสต์ที่อื่นแล้วแก้ `DETECTOR.modelUrl`
> (อย่าใส่ใน `.gitignore` เฉย ๆ — Vercel build ไม่มี Python จะสร้างไฟล์ใหม่ไม่ได้)

---

## โครงสร้าง

| ที่อยู่ | หน้าที่ |
|---|---|
| `lib/content.ts` | **เนื้อหาทั้งหมด** ทั้งไทยและอังกฤษ พร้อม type — แก้ที่นี่ที่เดียว |
| `app/page.tsx` | โครงหน้าเว็บ + ปุ่มสลับภาษา |
| `app/layout.tsx` | ฟอนต์ + metadata สำหรับ SEO |
| `app/globals.css` | ชุดสีและฟอนต์ (Tailwind v4 ใช้ `@theme` ไม่มี `tailwind.config.js` แล้ว) |
| `components/CoverArt.tsx` | แบนเนอร์หัวเว็บ วาดด้วย SVG ไม่ใช้ไฟล์รูป |
| `components/PhotoDetect.tsx` | รูปโปรไฟล์ + ปุ่มรัน YOLOv11 ตรวจจับจริงในเบราว์เซอร์ |
| `public/` | `me.jpg` · `models/yolo11n.onnx` · `lane-change-presentation.pdf` · `lane-change-demo.webp` · `hackathon-certificate.jpg` / `.pdf` |
| `lemon_detector/` | โปรเจกต์ Python เทรน YOLOv11 ให้จับเฉพาะหน้าเรา — ไม่เกี่ยวกับ build ของเว็บ |
| `portfolio-preview.html` | พรีวิวไฟล์เดียวจบ เปิดด้วยดับเบิลคลิก ไม่ต้อง Node |
| `yolo11n.pt` | น้ำหนักตั้งต้นของ `lemon_detector` (5.4 MB) |

**`portfolio-preview.html` เป็นสำเนา ไม่ใช่ต้นฉบับ** — แก้ `content.ts` ก่อนเสมอ
แล้วค่อยตามมาแก้ที่นี่ ถ้าปล่อยให้ไม่ตรงกัน ตัวเลขบนเว็บกับในไฟล์ที่ส่งให้คนอื่นจะขัดกันเอง
(จงใจไม่เอาไว้ใน `public/` เพราะไม่อยากให้มันถูกเสิร์ฟออกไปเป็นเว็บซ้อนเว็บ)

---

## ตัวเลขทั้งหมดบนเว็บ — ยืนยันแล้ว

**ทุกตัวต้องตรงกับเรซูเม่เป๊ะ ๆ** แก้ที่ไหนที่หนึ่งต้องไล่แก้ให้ครบทุกจุดในตาราง

| ตัวเลข | อยู่ที่ |
|---|---|
| label เอง **135,000 ภาพ** · ชุดที่เข้าโมเดลจริง **30,000 / 20,000 / 10,000** (train/val/test) | `PROJECTS[iqc].approach` |
| **91%** ความแม่นยำ · ลดเวลาตรวจสอบ **83%** | `PROJECTS[iqc].result` · `METRICS[0]` |
| **88%** ผ่านเกณฑ์ (จากเดิม 30%) · 100% เกณฑ์ข้อมูลต้องห้าม · เทรน 30 นาที → <5 นาที | `PROJECTS[trongpok].result` · `METRICS[1]` |
| **3** โมเดลใน pipeline เปลี่ยนเลน | `METRICS[2]` |
| อันดับ **6 / 137** (top 5%) | `METRICS[3]` · `PROJECTS[ktp]` · `TIMELINE` |
| **TOEIC 885** · GPA 3.22 | `TIMELINE` |

**ที่มาของ training data น้องตรงปก:** synthetic ทั้งหมด สร้างจากกติกาแพลตฟอร์ม
โดยอิงโครงจากคลังเรซูเม่สาธารณะบน Kaggle — เหมือนหนัง based on a true story
ที่ยังใส่จินตนาการ ไม่มีเรซูเม่ของคนจริงเข้าไปในข้อมูล
ถ้อยคำนี้ต้องตรงกับ README บน Hugging Face Space ด้วย **แก้ที่ไหนต้องแก้ทั้งสองที่**

---

## ลิงก์ภายนอกทั้งหมด

ไล่เช็คลิงก์ตายก่อนปล่อยทุกครั้ง — แก้ `content.ts` แล้วต้องตามไปแก้ `portfolio-preview.html`

| ที่ | ปลายทาง |
|---|---|
| `CONTACTS` | `mailto:nuttworkbhanidch@gmail.com` · `github.com/Lemonade678` · LinkedIn |
| `PROJECTS[lane]` | `github.com/Lemonade678/Video-based-lane-change-detection` · `/lane-change-presentation.pdf` |
| `PROJECTS[ktp]` | `khon-tong-pok-demo.vercel.app` |
| `PROJECTS[trongpok]` | HF Space `Lemonade44/nong-trongpok` · HF `nong-trongpok-lora` · Kaggle resume dataset |
| `PROJECTS[balatro]` | `github.com/KatnaWB89/KMFusionJokers` |
| `CREDENTIALS[hackathon]` | `/hackathon-certificate.pdf` |
| `CREDENTIALS[internship]` | `/lane-change-presentation.pdf` · repo เดียวกับ `PROJECTS[lane]` |

**path ของ PDF จงใจไม่เหมือนกันสองที่ อย่าไปแก้ให้ตรงกัน:**
`content.ts` ใช้ `/lane-change-presentation.pdf` (absolute จาก web root)
`portfolio-preview.html` ใช้ `public/lane-change-presentation.pdf` (relative)
เพราะไฟล์พรีวิวเปิดด้วย `file://` ซึ่งไม่มี web root ให้อ้าง

---

## ระบบสี

สีทั้งสี่มีหน้าที่ ไม่ได้ใส่เพื่อความสวย — เพิ่มโปรเจกต์ใหม่ให้เลือกสีตามประเภทงาน

| สี | ใช้กับ |
|---|---|
| เหลือง `#F5B92E` | ระบบที่ส่งมอบใช้งานจริง + ปุ่มและลิงก์ทั้งเว็บ |
| ชมพู `#FF7E9D` | การแข่งขัน / แฮกกาธอน |
| น้ำเงิน `#7BA0FF` | งานวิจัย + ตัวเลขในไทม์ไลน์ |
| น้ำตาลอ่อน `#B98A5E` | โปรเจกต์ส่วนตัว |

มีการ์ดสีชมพูสองใบ (`ktp` กับ `trongpok`) — **จงใจ** เพราะมาจากงานเดียวกันคนละครึ่ง
ใบแรกคือฝั่งฐานข้อมูล/ให้คะแนนด้วยสูตร ใบหลังคือ LLM ที่ fine-tune เอง
การ์ดตัวเลขวางสลับสีไม่ให้ชนกัน: เหลือง → ชมพู → น้ำเงิน → ชมพู

---

## เครื่องมือ กับ การทำงาน

`STACK` แบ่งสามชั้น เรียงตามน้ำหนักที่อยากให้คนเห็น

| กลุ่ม | ความหมาย | หน้าตา |
|---|---|---|
| `STACK.core` | หกอย่างที่อยากให้งานถัดไปได้ใช้ (Python · ML · PyTorch · TensorFlow · SQL · Supabase) | กล่องเหลืองเต็มความกว้าง ชิปตัวใหญ่ |
| `STACK.shipped` | ของเฉพาะทางที่เคยส่งมอบงานจริงด้วย | ชิปเทาปกติ |
| `STACK.learning` | ใช้ได้แต่ยังไม่กล้าเคลม | ชิปเทาปกติ |

**ห้ามใส่ชื่อซ้ำข้ามกลุ่ม** ไม่งั้น `core` หมดความหมายทันที

`SOFT_SKILLS` จงใจไม่ทำเป็นชิปลอย ๆ — คำว่า "adaptability" เปล่า ๆ ไม่มีน้ำหนักกับใคร
ทุกข้อบังคับให้มีฟิลด์ `evidence` เป็นเหตุการณ์จริงที่ตรวจสอบได้จากที่อื่นในเว็บนี้
(ไต้หวัน 3 เดือน / รายงาน Prof. Duan-Yu Chen ทุกสัปดาห์ / หน้าจอ IQC ที่ออกแบบตามพนักงานหน้าไลน์)
จะเพิ่มข้อใหม่ ต้องหาหลักฐานมาก่อน ไม่ใช่หาคำสวย ๆ มาก่อน

---

## หลักฐาน (section 02) กับตัวแท็บ

`CREDENTIALS` ใน `content.ts` เก็บเอกสารจริงที่ตรวจสอบได้ ตอนนี้มีสองใบ:
ประกาศนียบัตรแฮกกาธอนจาก Generation Thailand และสไลด์ปิดโครงการฝึกงานที่ Yuan Ze

**ฟิลด์ที่สำคัญที่สุดคือ `verifies`** เพราะมันบังคับให้เขียนว่าเอกสารนี้ยืนยันอะไร
ตัวอย่างที่ชัดที่สุดคือใบ certificate — บนใบเขียนแค่ว่า "เข้าร่วมและทำจนจบ"
ไม่ได้พิมพ์อันดับ 6/137 ไว้ (อันดับประกาศบนเวทีตอนปิดงาน)
ถ้าเอามาแปะเฉย ๆ คนอ่านจะเข้าใจว่าใบนี้รับรองอันดับด้วย ซึ่งไม่ตรงกับเอกสาร
และเป็นสิ่งที่ใครซูมดูก็จับได้ทันที — การ์ดเลยเขียนบอกไว้ตรง ๆ ว่าอันดับมาจากไหน

**ทำไมต้องเป็นแท็บ:** ใบ cert สัดส่วน A4 แนวนอน (1755×1241) สูงมากเมื่อกางเต็มความกว้าง
ถ้าเรียงเอกสารทุกใบต่อกัน คนต้องสกรอลผ่านรูปใหญ่ ๆ กว่าจะถึงส่วนถัดไป

ตัวแท็บทำตาม [WAI-ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) ทั้งสองไฟล์:

| สิ่งที่ทำ | เพราะอะไร |
|---|---|
| `role="tablist"` / `role="tab"` / `role="tabpanel"` + `aria-controls` / `aria-labelledby` | screen reader อ่านออกว่าเป็นกลุ่มแท็บ ไม่ใช่ปุ่มลอย ๆ |
| `tabIndex` เป็น `0` เฉพาะแท็บที่เลือก ที่เหลือ `-1` (roving tabindex) | กด Tab แล้วข้ามทั้งกลุ่มไปเลย ไม่ต้องกดผ่านทีละใบ |
| ลูกศรซ้าย/ขวา + Home/End เลื่อนระหว่างแท็บ | เป็นวิธีที่คนใช้คีย์บอร์ดคาดหวังจากแท็บ |

ถ้าเพิ่มเอกสารใบใหม่ **แก้แค่ `CREDENTIALS` ใน `content.ts`** ตัว UI วนสร้างเองทั้งหมด
(แล้วตามไปเพิ่มใน `portfolio-preview.html` ให้ตรงกันด้วย)

**เอกสารที่ยังไม่ได้ใส่:** ใบคะแนน TOEIC 885 — ใส่ได้ถ้าอยาก แต่ในใบมีข้อมูลส่วนตัว
(ชื่อเต็ม วันสอบ เลขอ้างอิง) ที่จะกลายเป็นของสาธารณะถาวร เลยไม่ใส่ให้เอง ต้องตัดสินใจก่อน

---

## ของเล่น YOLO บนรูปโปรไฟล์

กดกรอบรูปโปรไฟล์ → โหลด `yolo11n.onnx` แล้ว **รัน inference จริงในเบราว์เซอร์**
วาดกล่อง `person 0.92` (บวก `cell phone` ถ้าคะแนนถึงเกณฑ์) ทับบนรูป

เหตุผลที่ทำ: หน้าเว็บ *เล่า* ว่าทำ computer vision ได้ — อันนี้ *แสดง* ให้ดูเลย
คนสาย CV เปิด devtools ดูได้ว่ามันโหลดโมเดลกับรันจริง ไม่ได้วาดกล่องหลอกไว้

| ขั้น | เกิดอะไรขึ้น |
|---|---|
| กดปุ่ม | inject `<script>` ของ `onnxruntime-web` จาก CDN (ไม่ต้อง `npm install`) |
| | สร้าง `InferenceSession` จาก `/models/yolo11n.onnx` แล้ว cache ไว้ที่ module scope |
| preprocess | letterbox รูปเป็น 640×640 เติมเทา `rgb(114,114,114)` → NCHW → หาร 255 |
| run | `session.run()` บน wasm (บังคับ 1 thread เพื่อเลี่ยง SharedArrayBuffer/COOP-COEP) |
| postprocess | อ่าน tensor `[1, 84, 8400]` แบบ `data[c * 8400 + i]` → ถอด letterbox → NMS แยกคลาส |
| วาด | กล่องเป็น `<span>` วางด้วย `%` จากพิกัดสัดส่วน 0..1 |

**ทำไมพิกัดแปลงเป็น % ได้ตรง ๆ:** `public/me.jpg` สัดส่วน 284:459 และกรอบบนหน้าเว็บ
ล็อก `aspect-ratio` ตัวเดียวกัน → `object-cover` ไม่ครอปซ้ำ เลยไม่ต้องคำนวณชดเชย

**ตอนโหลดโมเดลไม่ได้** จะ fallback ไปใช้ผลที่บันทึกไว้ใน `DETECTOR.fallback`
แล้ว **ติดป้ายบนปุ่มว่า `cached result`** ไม่เนียนว่าเพิ่งรันสด —
ทั้งเว็บขายเรื่องความซื่อสัตย์กับตัวเลข ตรงนี้ก็ต้องซื่อด้วย

### เปลี่ยนรูปโปรไฟล์ ต้องทำ 3 อย่าง

1. วางรูปทับที่ `public/me.jpg`
2. แก้ `DETECTOR.photoW` / `photoH` ให้เป็นขนาดจริงของรูปใหม่
   (**ข้อนี้ลืมบ่อยที่สุด** ลืมแล้วกล่องจะเพี้ยนไปคนละที่)
3. รันคำสั่งข้างล่างเพื่ออัปเดต `DETECTOR.fallback`

```bash
python -c "from ultralytics import YOLO; from PIL import Image; W,H=Image.open('public/me.jpg').size; r=YOLO('yolo11n.pt').predict('public/me.jpg',imgsz=640,conf=0.4)[0]; [print(f'{{ label: \"{r.names[int(b.cls)]}\", score: {float(b.conf):.4f}, box: [{b.xyxy[0][0]/W:.4f}, {b.xyxy[0][1]/H:.4f}, {b.xyxy[0][2]/W:.4f}, {b.xyxy[0][3]/H:.4f}] }},') for b in r.boxes]"
```

### สลับไปใช้โมเดลที่เทรนเอง (`Lemon(me):3`)

ตอนนี้ปุ่มนี้รัน `yolo11n` ซึ่งเป็น**โมเดลสำเร็จรูปของคนอื่น**
ถ้าเปลี่ยนไปใช้โมเดลจาก `lemon_detector/` จะกลายเป็น `Lemon(me):3 0.9x`
ต่างกันคนละเรื่องในสายตาคนดู — จาก "รันโมเดลเป็น" เป็น "เทรนโมเดลเป็น"

ทำตาม [`lemon_detector/README.md`](lemon_detector/README.md) จนถึง `python export_onnx.py`
สคริปต์จะพิมพ์บล็อกที่ก๊อปมาวางทับใน `DETECTOR` ได้เลย มี 4 ค่า:
`modelUrl` · `classNames` · `photoW`/`photoH` · `fallback`

**`classNames` คือตัวที่ลืมแล้วพังเงียบที่สุด** — ไม่ใส่แล้วเว็บจะถอยไปอ่านชื่อจากตาราง
COCO แล้วขึ้นว่า `person` ทั้งที่โมเดลตรวจถูกแล้ว (คลาส 0 ของ COCO ก็คือ person พอดี)
ตัวแรกในลิสต์ถือเป็นคลาส "พระเอก" ที่ UI เน้นด้วยสีเหลือง

`PhotoDetect.tsx` ไม่ต้องแก้ — `decode()` อ่านจำนวนคลาสจาก `dims[1]` ตามจริง
โมเดล 1 คลาสได้ tensor `[1, 5, 8400]` แทน `[1, 84, 8400]` แล้ววนลูปตามขนาดนั้น

### ข้อจำกัดของ gimmick นี้

- **10.7 MB** ที่ผู้กดปุ่มต้องโหลด (+ wasm อีก ~2 MB) — เลยออกแบบให้ *กดก่อนถึงโหลด*
- inference บน wasm 1 thread ใช้เวลา **~300–900 ms** ไม่ใช่ realtime
- คะแนนต่างจากที่รันด้วย ultralytics ราว 0.01 (canvas กับ OpenCV resize คนละวิธี) — กล่องต่างกัน <0.5% ของกรอบ
- ต้องเป็น **same-origin** ถ้าย้ายรูปไปโฮสต์อื่น `canvas.getImageData()` จะโดน taint แล้ว throw

---

## สิ่งที่ยังเหลือ

1. 🔴 **push repo `Video-based-lane-change-detection`** — สำคัญที่สุด
   ทั้ง `PROJECTS[lane]` และ `CREDENTIALS[internship]` ชี้ไป
   `github.com/Lemonade678/Video-based-lane-change-detection`
   repo นั้น**มีอยู่จริงแล้วบน GitHub แต่ยังมีแค่ `.gitignore` กับ `LICENSE`**
   ปล่อยเว็บตอนนี้ ลิงก์จะพาไปเจอ repo เปล่า ๆ
   ของทั้งหมดเตรียมไว้แล้วที่ `../Video-based-lane-change-detection` (commit แล้ว 60 MB)
   ต่อยอดจาก commit แรกของ remote เรียบร้อย **push ได้เลยไม่ต้อง force**

2. ~~**คลิป lane change ในหน้าเว็บ**~~ ✅ ใส่แล้ว — `public/lane-change-demo.webp`
   118 เฟรม 720×404 · 1.8 MB · โหลดแบบ lazy

   **ทำไมเป็น WebP ไม่ใช่ .mp4:** ไฟล์เอาต์พุตจาก pipeline เข้ารหัสด้วย
   MPEG-4 Part 2 (mp4v) ซึ่งเป็นค่าเริ่มต้นของ `cv2.VideoWriter` และ **เบราว์เซอร์เล่นไม่ได้**
   ต้องแปลงเป็น H.264 ก่อน ซึ่งต้องมี ffmpeg (เครื่องนี้ยังไม่มี) และ OpenCV บนเครื่องนี้
   ก็เขียน H.264 ไม่ได้เพราะ openh264 DLL เวอร์ชันไม่ตรง —
   animated WebP เลยเลี่ยงปัญหา codec ทั้งหมด เรนเดอร์เป็น `<img>` ธรรมดา
   และไม่ติดนโยบายบล็อก autoplay ของเบราว์เซอร์ด้วย

   ถ้าวันหนึ่งลง ffmpeg แล้วอยากได้ `.mp4` จริง ๆ:

   ```powershell
   ffmpeg -i "D:\10-ไมเกี่ยวข้องงง\data6_new_output_good.mp4" -vf "scale=720:-2,fps=20" -an -c:v libx264 -crf 28 -movflags +faststart public/lane-demo.mp4
   ```

   แล้วเปลี่ยน `<img>` ใน `page.tsx` เป็น `<video autoPlay muted loop playsInline>`
   (ต้องมี `muted` ไม่งั้น browser บล็อก autoplay · ต้องมี `playsInline` ไม่งั้น iOS เปิดเต็มจอ)

   > ⚠️ **ไฟล์วิดีโอต้นทางบางไฟล์เสีย** — `data4_new_output_good.mp4`,
   > `data3_new_output_good.mp4`, `data2_new.mp4`, `data3_new.mp4` เปิดไม่ได้เลย
   > (header/mdat ถูกตัด) ตัวที่ใช้อยู่คือ `data6_new_output_good.mp4` ซึ่งอ่านได้ปกติ

3. **IQC ยังมีแต่คำบรรยาย** — เป็นงานในโรงงาน อาจติดเรื่อง NDA
   ถ้าเปิดรูปไม่ได้ ใส่ภาพ mock-up ของหน้าจอผู้ปฏิบัติงานแทนก็ยังดีกว่าไม่มีอะไรเลย

4. **เทรน `lemon_detector` ให้เสร็จ** — ต้องมีรูปใน `raw/me/` และ **`raw/not_me/`**
   ข้อหลังคือหัวใจ ไม่มีแล้วโมเดลจะจับหน้าใครก็ได้ ไม่ใช่แค่หน้าเรา

5. **ไดรฟ์ C: เคยเต็ม 100%** ตอนหนึ่งระหว่างทำงานนี้ จน `next build` เขียน cache ไม่ได้
   เคลียร์ไฟล์ชั่วคราวออกไปแล้วเหลือ ~1 GB ซึ่งยังตึงมาก — `node_modules` ของโปรเจกต์นี้
   อย่างเดียว 383 MB ควรเคลียร์เพิ่มก่อนเจอปัญหาแปลก ๆ ที่หาสาเหตุยาก

---

## หมายเหตุการทำงาน

- เนื้อหาทุกบรรทัดที่ผู้ใช้เห็นต้องเป็นชนิด `L10n` (`{ en, th }`) — TypeScript จะฟ้องเองถ้าลืม
- ช่อง `result` ของโปรเจกต์รับ HTML ได้ชุดเดียวคือ `<strong>` เพื่อเน้นตัวเลข
  เนื้อหามาจาก `content.ts` ที่เราเขียนเอง ไม่ได้รับจากผู้ใช้ จึงปลอดภัยที่จะใช้ `dangerouslySetInnerHTML`
- **Windows:** ถ้าเจอ `EPERM` ตอน `npm run dev` ให้เพิ่ม exception ให้โฟลเดอร์นี้ใน antivirus
  และอย่าวางโปรเจกต์ในโฟลเดอร์ที่ sync (OneDrive/Dropbox)
