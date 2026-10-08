# Hidden letters · YOLO lab · People photos · YOLO museum

**Status:** decisions from the owner in chat (2026-10-08) · branch `egg-people-museum` (from `main`) · nothing pushed

## 0. Owner decisions this spec follows

| Question | Answer |
|---|---|
| How hidden are the letters? | Look exactly like the text; the only tell is the hand cursor; a correct press glows yellow |
| Keyboard unlock (type "lemonade")? | No — pressing the letters only |
| Playground addition | YOLO lab: detect snacks in your own photo, on-device |
| Where is the YOLO museum? | Inside the `/stack` window, after the tool lists |
| People / connecting with people | Extend window 04 (People): soft skills + photo wall + the TheOzzy card |
| Other people's faces | Everyone agreed — use the photos as they are |
| Stage photo | A concert with friends (not the owner on stage) |
| Google Photos links | Not accessible (private, needs the owner's login) — use the four photos supplied; more can be added later |

## 1. Letters hidden inside words

- Remove the eight standalone `SecretLetter` buttons (top bar L, name E, above-metrics M, counter rows O N A D E) and their CSS.
- New hiding spots, identical in EN and TH, top → bottom:

| # | Letter | Where | Word / char |
|---|---|---|---|
| 0 | L | roles line | `LLM` char 0 (in "LLM Fine-tuning") |
| 1 | E | roles line | `Fine` char 3 |
| 2 | M | intro paragraph 1 | `LLM` char 2 |
| 3 | O | metric 4 label | `Generation` char 8 |
| 4 | N | metric 4 label | `Generation` char 9 |
| 5 | A | metric 4 label | `Thailand` char 2 |
| 6 | D | metric 4 label | `Thailand` char 7 |
| 7 | E | honesty line under the counter | `label` char 3 (EN "hand-labelled", TH "label") |

- `lib/secret.ts`: `SECRET_SPOTS` (the table above, keyed by place) and `splitSecret(text, spots) → (string | { ch, index })[]` — finds each word in order, splits out the one character. Pure; tested.
- `components/SecretText.tsx`: renders the segments; secret characters are `<span class="secret-char">` with `onClick` → the existing `SecretProvider.press(index)`. No role, no tabIndex (decision: no keyboard path), so screen readers read the word normally.
- `.secret-char`: inherits everything; `cursor: pointer`; invisible hit-area padding (`padding: .35em .12em; margin: -.35em -.12em`) for touch; `[data-lit]` → yellow + glow.
- Locked-page hint: EN "Eight letters are hidden inside the words on the main page. Press them in order, top to bottom." / TH "มีตัวอักษร 8 ตัวซ่อนอยู่ในคำบนหน้าหลัก กดให้ครบตามลำดับ จากบนลงล่าง".
- `SecretLetter` (button) and `.secret-letter` CSS are deleted.

## 2. YOLO lab on `/playground`

- Section after the NMS note: title "YOLO lab — what's on your plate?" / "ห้องทดลอง YOLO — ในจานคุณมีอะไร?".
- One `<input type="file" accept="image/*">` styled as a button ("Choose a photo" / "เลือกรูป"); phones offer camera or gallery.
- Privacy line: "The photo never leaves your device — the model runs in your browser." / "รูปไม่ออกจากเครื่องคุณ — โมเดลรันในเบราว์เซอร์".
- Shows the photo with boxes (label + score), then one verdict line for the best **food/drink** class from a fixed map (`banana, apple, sandwich, orange, broccoli, carrot, hot dog, pizza, donut, cake, cup, bowl, bottle, wine glass, spoon, fork, knife, dining table`), each pointing at a counter shelf where it fits (e.g. cup → "same shelf as the lemonade"). Person only → "a person — not on the menu". Nothing → "no snacks detected — the model is hungry".
- States: idle · loading model · running · done · error (not an image / model failed). Object URLs revoked when replaced.
- Model code shared with the profile photo via `lib/yolo.ts` (§5).

## 3. People (window 04)

Order inside the window:
1. The three soft-skill cards (unchanged).
2. **"Connecting with people" / "ผู้คนที่ได้เจอ"** — photo wall, 2 columns on phones, 4 on desktop; tap → enlarge (lightbox, Esc closes the photo first, not the window).
3. The TheOzzy "next run" card, introduced by one line: "Who I'm building for next" / "คนที่ผมกำลังทำงานให้ต่อไป".

Photos (from `C:\Users\User\Downloads`, copied to gitignored `tools/source/people/`, converted by `tools/people_assets.py` → `public/people/*.webp`, EXIF dropped):

| id | source | caption EN | caption TH |
|---|---|---|---|
| yzu | 20250729_173056.jpg | Yuan Ze University, Taiwan — internship, 2025 | มหาวิทยาลัย Yuan Ze ไต้หวัน — ช่วงฝึกงาน 2025 |
| presentation | 20250729_170429.jpg | KMUTT × YZU internship presentation | นำเสนองานฝึกงาน KMUTT × YZU |
| dinner | 20250729_202410.jpg | Dinner with everyone in Taiwan, 2025 | มื้อเย็นกับทุกคนที่ไต้หวัน 2025 |
| concert | 20260909_214407.jpg | A concert with friends, 2026 | ไปคอนเสิร์ตกับเพื่อน ๆ 2026 |

(The source → id mapping is confirmed by looking at each file during conversion.)

- `PEOPLE` in `content.ts`: title, intro line, photos (src, w, h, alt EN/TH, caption EN/TH), ozzy lead-in.
- Path window (05) loses the TheOzzy card; its counter note becomes "Degree and internships" / "ปริญญาและการฝึกงาน".
- People counter note: "Stories, photos, and who I'm building for next" / "เรื่องจริง รูปถ่าย และคนที่กำลังทำงานให้".

## 4. YOLO museum (inside `/stack`)

After the three tool groups: heading "A small YOLO museum" / "พิพิธภัณฑ์ YOLO ขนาดเล็ก", one line on why ("YOLO is the tool I've shipped with most — here's how it sees").

Five exhibits, each a card with a number, a title, 1–2 sentences and an interaction:

| # | Exhibit | Interaction | Data |
|---|---|---|---|
| 1 | Look once — the grid | slider S = 7 / 13 / 20; grid over my photo; the cell holding the person's centre lights up | person box from `DETECTOR.fallback` (precomputed yolo11n, labelled as such) |
| 2 | IoU — how much two boxes agree | sliders move/resize the predicted box; overlap shaded; live IoU = intersection ÷ union; marks 0.45 (this site's NMS threshold) | synthetic boxes |
| 3 | Letterbox — fitting any photo into 640×640 | slider for photo aspect; shows scale, padding and the grey 114 bars | same math as `lib/yolo.ts` |
| 4 | Live — confidence and NMS | "Run yolo11n on my photo" → sliders for confidence (0.05–0.90) and NMS IoU (0.10–0.90) refilter the **real** raw candidates; counts raw → above threshold → after NMS | `lib/yolo.ts` raw decode (no NMS) |
| 5 | Timeline | list v1 → YOLO26, the one this site runs (YOLO11) highlighted; sources linked | see below |

Timeline (years and makers only — sourced from Wikipedia "You Only Look Once" and Ultralytics docs):

| Year | Version | By | One line |
|---|---|---|---|
| 2015 | YOLOv1 | Redmon, Divvala, Girshick, Farhadi | one pass over an S×S grid |
| 2016 | YOLOv2 / YOLO9000 | Redmon, Farhadi | anchor boxes, batch norm |
| 2018 | YOLOv3 | Redmon, Farhadi | last version by the original authors |
| 2020 | YOLOv4 | Bochkovskiy, Wang, Liao | CSP backbone, training tricks |
| 2020 | YOLOv5 | Ultralytics | PyTorch, easy to train |
| 2022 | YOLOv6 | Meituan (Li et al.) | built for industrial deployment |
| 2022 | YOLOv7 | Wang, Bochkovskiy, Liao | E-ELAN, re-parameterisation |
| 2023 | YOLOv8 | Ultralytics | detection + segmentation + pose in one toolkit |
| 2024 | YOLOv9 | Wang, Liao (Academia Sinica) | PGI, GELAN |
| 2024 | YOLOv10 | Tsinghua University | trained to skip NMS |
| 2024 | YOLO11 | Ultralytics | **the one running on this site** (yolo11n) |
| 2025 | YOLOv12 | Tian et al. | attention-centric |
| 2026 | YOLO26 | Ultralytics | end-to-end, NMS optional |

- `YOLO_MUSEUM` in `content.ts` (copy + timeline); exhibits in `components/home/museum/*.tsx`; the Stack window renders `<Museum />` after its lists.
- Stack counter note: "Grouped by how well I know them — plus a small YOLO museum" / "แบ่งตามว่ารู้จริงแค่ไหน — แถมพิพิธภัณฑ์ YOLO".
- Reduced motion: nothing animates on its own; all exhibits are slider-driven.

## 5. `lib/yolo.ts` (shared model code)

Moved out of `components/PhotoDetect.tsx` without behaviour change: `COCO`, `loadOrt`, `getSession`, `letterbox(img, size)`, `decode(data, dims, meta, conf)`, `nms(dets, iou)`, `iou(a, b)`, plus pure `letterboxGeometry(iw, ih, size) → { scale, dx, dy, dw, dh }` (used by `letterbox` and exhibit 3) and `decodeRaw(...)` (candidates above a floor, before NMS, for exhibit 4). PhotoDetect imports from it and must still run live.

## 6. Tests (vitest)

- `tests/home/secret.test.ts`: for EN and TH texts from `content.ts`, the spots spell `LEMONADE` in order; joining segments gives back the original text; a missing word throws (so a copy edit can't silently break the egg).
- `tests/yolo.test.ts`: `iou` (identical = 1, disjoint = 0, half overlap), `nms` keeps per class, `letterboxGeometry` (tall + wide images), `decodeRaw/decode` on a tiny synthetic tensor.
- `tests/home/content.test.ts`: every People photo and museum string has EN + TH; timeline years never go backwards; YOLO11 is the highlighted entry.
- Build + browser: egg unlock end to end; clicking a secret letter doesn't follow links; lab on a real photo; People lightbox Esc; museum sliders; PhotoDetect still live; 375 px.

## 7. Out of scope

Importing from Google Photos · face blurring (owner confirmed consent) · keyboard unlock · more museum exhibits · `portfolio-preview.html` (it has no egg and no windows — unchanged).
