// ─────────────────────────────────────────────────────────────
// เนื้อหาทั้งหมดของเว็บอยู่ไฟล์นี้ไฟล์เดียว
// อยากแก้ข้อความ / เพิ่มโปรเจกต์ → แก้ที่นี่ ไม่ต้องแตะ JSX
// ─────────────────────────────────────────────────────────────

export type Lang = "en" | "th";

/** ข้อความสองภาษา — ทุก string ที่ผู้ใช้เห็นต้องเป็นชนิดนี้ */
export type L10n = Record<Lang, string>;

/** สีประจำหมวดโปรเจกต์ — ใช้ทั้งกับแท็บ แถบซ้าย และตัวเน้นใน Result */
export type Accent = "yellow" | "pink" | "blue" | "clay";

export const ACCENT_HEX: Record<Accent, string> = {
  yellow: "#F5B92E",
  pink: "#FF7E9D",
  blue: "#7BA0FF",
  clay: "#B98A5E",
};

export interface Project {
  id: string;
  /** ป้ายหมวด เช่น system / research — เขียนเป็นอังกฤษล้วน อ่านได้ทั้งสองภาษา */
  tag: string;
  accent: Accent;
  when: string;
  title: L10n;
  org: L10n;
  problem: L10n;
  /** รองรับ <strong> ได้หนึ่งชุดเพื่อเน้นตัวเลขผลลัพธ์ */
  approach: L10n;
  result: L10n;
  stack: string[];
  /** คลิป/ภาพเดโมของโปรเจกต์ — วางไว้ใต้ชื่อโปรเจกต์ ก่อนคำอธิบาย
   *  เพราะคนสาย CV ดูภาพ 2 วินาทีแล้วรู้เลยว่าของจริงหรือเปล่า อ่านทีหลังได้ */
  media?: ProjectMedia;
  /** ลิงก์ท้ายการ์ด — เป็น array เพราะบางโปรเจกต์มีของให้ดูมากกว่าหนึ่งที่
   *  (เช่น น้องตรงปก มีทั้ง Space ที่เล่นได้จริง ตัว adapter และ dataset ต้นทาง)
   *  ลิงก์แรกคือลิงก์ "หลัก" ที่อยากให้คนกดที่สุด เรียงจากซ้ายไปขวา */
  links?: { href: string; label: L10n }[];
}

/**
 * สื่อประกอบโปรเจกต์
 *
 * ทำไมเป็น animated WebP ไม่ใช่ .mp4:
 *   ไฟล์เอาต์พุตจาก pipeline เข้ารหัสด้วย MPEG-4 Part 2 (mp4v) ซึ่ง Chrome/Firefox
 *   เล่นไม่ได้ ต้องแปลงเป็น H.264 ก่อนซึ่งต้องมี ffmpeg — WebP เคลื่อนไหวเลี่ยงปัญหา
 *   codec ทั้งหมด เบราว์เซอร์ทุกตัวรองรับ และเรนเดอร์เป็น <img> ธรรมดา
 *   จึงไม่ติดนโยบายบล็อก autoplay ของเบราว์เซอร์ด้วย
 *   (ถ้าวันหนึ่งลง ffmpeg แล้ว อยากเปลี่ยนเป็น .mp4 จริง ๆ ก็เปลี่ยนที่ตัว render ได้)
 */
export interface ProjectMedia {
  /** ไฟล์ใน public/ */
  src: string;
  /** ข้อความแทนภาพ — จำเป็นจริง ๆ เพราะคลิปนี้คือหลักฐานหลักของโปรเจกต์ */
  alt: L10n;
  /** คำบรรยายใต้ภาพ บอกว่ากำลังดูอะไรอยู่ */
  caption?: L10n;
  /** สัดส่วนภาพ ใส่เพื่อกันหน้าเว็บกระโดดตอนไฟล์ยังโหลดไม่เสร็จ (CLS) */
  ratio: string;
}

export interface Metric {
  value: string;
  suffix?: string;
  accent: Accent;
  label: L10n;
  /** การ์ดนี้มีตัวอักษรลับซ่อนในคำ (ดู lib/secret.ts) */
  secret?: "hackathon";
}

export interface TimelineItem {
  year: string;
  what: L10n;
  where: L10n;
}

/**
 * หลักฐานยืนยัน — เอกสารจริงที่ตรวจสอบได้ ไม่ใช่คำกล่าวอ้าง
 *
 * ฟิลด์ที่สำคัญที่สุดคือ `verifies` เพราะมันบังคับให้เขียนว่าเอกสารนี้
 * ยืนยันอะไร **และไม่ได้ยืนยันอะไร** — เช่นใบ certificate ของแฮกกาธอน
 * เขียนแค่ว่าเข้าร่วมจนจบ ไม่ได้ระบุอันดับ 6/137 ไว้
 * ถ้าเอามาแปะเฉย ๆ โดยไม่บอก คนอ่านจะเข้าใจว่าใบนี้ยืนยันอันดับด้วย
 * ซึ่งไม่จริง และเป็นการโกงที่ตรวจสอบได้ง่ายมากถ้ามีคนซูมดู
 */
export interface Credential {
  id: string;
  /** ข้อความบนปุ่มแท็บ — สั้นที่สุดเท่าที่จะสั้นได้ */
  tab: L10n;
  accent: Accent;
  title: L10n;
  issuer: L10n;
  when: string;
  /** ภาพเอกสาร ถ้ามี — บางอย่างมีแต่ไฟล์ PDF ก็ปล่อยว่างได้ */
  image?: { src: string; alt: L10n; ratio: string };
  /** ยืนยันอะไร และไม่ได้ยืนยันอะไร */
  verifies: L10n;
  links?: { href: string; label: L10n }[];
}

export interface ContactLink {
  href: string;
  accent: Accent;
  kind: L10n;
  value: string;
}
// หมายเหตุ: ไม่มีฟิลด์ไอคอนแล้ว — โลโก้เดาจาก href เอาเองด้วย brandOf()
// ใน components/BrandIcon.tsx เพราะถ้าเก็บไอคอนแยกไว้ วันหนึ่งจะมีคนแก้ href
// แล้วลืมแก้ไอคอน กลายเป็นลิงก์ไป LinkedIn แต่ขึ้นโลโก้ GitHub

/**
 * เมนูปลายทางหลัก — แรงบันดาลใจจาก 9arm.co ที่หน้าแรกมีแค่ปุ่มไม่กี่ปุ่ม
 * (Lab / Shop / YouTube) แล้วจบ ไม่มีอะไรให้หลง
 *
 * กติกาที่ยึด: **ไม่เกินสามปุ่ม** ถ้าใส่สี่ปุ่มขึ้นไปมันจะกลายเป็นแถบ nav อีกอัน
 * ซึ่งเว็บนี้มีอยู่แล้วข้างบน — ประโยชน์ของแถวนี้คือ "เลือกให้แล้วว่าควรกดอะไร"
 * ถ้าจะเพิ่มปุ่มใหม่ ต้องเอาปุ่มเดิมออกหนึ่งอัน
 *
 * ปุ่มแรกทึบ (primary) ที่เหลือเป็นเส้นขอบ แบบเดียวกับต้นแบบ
 */
export interface MenuItem {
  href: string;
  label: L10n;
  /** คำอธิบายบรรทัดเดียวใต้ปุ่ม — "Shop" เปล่า ๆ บนพอร์ตวิศวะไม่มีใครเดาถูก */
  note: L10n;
  primary?: boolean;
  /** ลิงก์ออกนอกเว็บ → เปิดแท็บใหม่ และต่อท้ายด้วย ↗ */
  external?: boolean;
}

// ── ตัวตน ─────────────────────────────────────────────────────

export const PERSON = {
  name: "Nutt Bhanidch",
  initials: "NB",
  /** วางไฟล์รูปไว้ที่ public/me.jpg แล้วเปลี่ยนเป็น "/me.jpg" */
  photo: "/me.jpg" as string | null,
  location: "Bangkok, TH",
  roles: [
    { text: "Computer Vision", accent: "yellow" as Accent },
    { text: "LLM Fine-tuning", accent: "pink" as Accent },
    { text: "Data Pipelines", accent: "blue" as Accent },
  ],
  intro: [
    // ประโยคเปิด "I'm French" ตั้งใจตามที่เจ้าตัวขอ — French เป็นชื่อเล่น ไม่ใช่สัญชาติ
    //
    // แต่ในภาษาอังกฤษ "I'm French" อ่านยังไงก็แปลว่า "ผมเป็นคนฝรั่งเศส" ก่อนเสมอ
    // เลยต้องมีประโยค "Both are nicknames." ต่อท้ายทันที ไม่ใช่เพื่อความสวยงาม
    // แต่เพราะทั้งหน้าเขียนว่าอยู่กรุงเทพฯ จบ มจธ. ถ้าไม่เคลียร์ตรงนี้
    // คนอ่านจะสะดุดตั้งแต่บรรทัดแรก แล้วสงสัยไปทั้งหน้าว่าตกลงเป็นใครกันแน่
    //
    // ส่วน "Lemon" ผูกกับ GitHub handle (Lemonade678) พอดี เลยบอกที่มาไว้ด้วย
    // คนที่กดมาจาก GitHub จะได้เชื่อมได้ทันทีว่าเป็นคนเดียวกัน
    {
      en: "I'm French — or you can call me Lemon, which is where the GitHub handle comes from. Both are nicknames. I'm 23, a B.Eng. graduate in Electronic and Infocommunication Engineering from King Mongkut's University of Technology Thonburi (KMUTT), building AI systems that have to run in a real workplace: chip anomaly detection on a production line, lane change detection from road video, and a Thai interview LLM I fine-tuned myself.",
      th: "ผมชื่อเฟรนช์ หรือจะเรียกเลม่อนก็ได้ — ชื่อเล่นทั้งคู่ อายุ 23 ปี จบวิศวกรรมอิเล็กทรอนิกส์และสื่อสารสารสนเทศ จาก มจธ. ทำระบบ AI ที่ต้องใช้งานได้จริงในหน้างาน ทั้งการตรวจจับความผิดปกติของชิปในสายการผลิต การตรวจจับการเปลี่ยนเลนจากวิดีโอบนถนน และ LLM สัมภาษณ์งานภาษาไทยที่ผม fine-tune เอง",
    },
    {
      en: "I care about the part most demos skip: whether the thing still works on the ten thousandth image, and whether you can explain where a number came from.",
      th: "สิ่งที่ผมให้ความสำคัญคือส่วนที่เดโมส่วนใหญ่ข้ามไป — มันยังทำงานได้ไหมตอนภาพที่หนึ่งหมื่น และเราอธิบายได้ไหมว่าตัวเลขนั้นมาจากไหน",
    },
  ] satisfies L10n[],
};

// ── ของเล่นบนรูปโปรไฟล์: กดแล้วรัน YOLOv11 ในเบราว์เซอร์ ──────
//
// ตั้งใจให้เป็น gimmick เล็ก ๆ ที่ "แสดง" แทนที่จะ "เล่า" — คนสาย CV
// เปิด devtools ดูได้เลยว่ามันรันโมเดลจริง ไม่ได้วาดกล่องหลอกไว้
// ตัวโค้ดทั้งหมดอยู่ที่ components/PhotoDetect.tsx

export const DETECTOR = {
  /** ขนาดจริงของ public/me.jpg — กรอบบนหน้าเว็บล็อกสัดส่วนนี้เป๊ะ
   *  เพื่อให้ object-cover ไม่ครอปซ้ำ พิกัดกล่อง 0..1 จึงแปลงเป็น % ได้ตรง ๆ
   *  ⚠️ เปลี่ยนรูปเมื่อไหร่ ต้องแก้สองค่านี้ด้วย ไม่งั้นกล่องจะวางผิดที่ */
  photoW: 284,
  photoH: 459,

  /** ไฟล์โมเดล ~10 MB วางไว้ที่ public/models/ (ดูวิธี export ใน README) */
  modelUrl: "/models/yolo11n.onnx",

  /** onnxruntime-web โหลดจาก CDN ตอนกดปุ่ม — ไม่ต้อง npm install
   *  ต้องปิดท้ายด้วย / เพราะใช้ต่อท้ายเป็นที่อยู่ไฟล์ .wasm ด้วย */
  ortCdn: "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/",

  /** ขนาด input ของโมเดล — ต้องตรงกับตอน export (imgsz=640) */
  inputSize: 640,

  /** ชื่อคลาสของโมเดลที่ใช้อยู่ เรียงตาม index ที่โมเดลคืนมา
   *  null = ใช้ COCO 80 คลาสตามค่าเริ่มต้นของ yolo11n
   *  ถ้าสลับไปใช้โมเดลที่เทรนเองจาก lemon_detector/ ให้ใส่ ["Lemon(me):3"]
   *  (export_onnx.py พิมพ์บรรทัดนี้ให้ก๊อปมาวางได้เลย)
   *  ตัวแรกในลิสต์ถือเป็นคลาส "พระเอก" ที่ UI เน้นด้วยสีเหลือง ที่เหลือเป็นสีน้ำเงิน */
  classNames: null as string[] | null,

  /** ตัดผลที่มั่นใจต่ำกว่านี้ทิ้ง — ตั้ง 0.4 เพราะบนรูปนี้เหลือ person กับ cell phone พอดี */
  confThreshold: 0.4,
  iouThreshold: 0.45,

  /** ค่าที่รันไว้ล่วงหน้าด้วย ultralytics บนเครื่อง (yolo11n, imgsz=640, conf=0.4)
   *  ใช้เฉพาะตอนโหลดโมเดลไม่สำเร็จ และ UI จะติดป้ายบอกว่าเป็นค่าที่บันทึกไว้ */
  fallback: [
    { label: "person", score: 0.9234, box: [0.2023, 0.0568, 0.7951, 0.9631] },
    { label: "cell phone", score: 0.5007, box: [0.4567, 0.2172, 0.5536, 0.2865] },
  ],

  ui: {
    idle: { en: "▶ run yolo11n · 10 mb", th: "▶ รัน yolo11n · 10 mb" },
    loading: { en: "loading model…", th: "กำลังโหลดโมเดล…" },
    running: { en: "detecting…", th: "กำลังตรวจจับ…" },
    cached: { en: "cached result", th: "ผลที่บันทึกไว้" },
    aria: {
      en: "Run YOLOv11 object detection on this photo",
      th: "รัน YOLOv11 ตรวจจับวัตถุบนรูปนี้",
    },
  },
};

// ── ลิงก์ติดต่อ ───────────────────────────────────────────────

export const CONTACTS: ContactLink[] = [
  {
    href: "mailto:nuttworkbhanidch@gmail.com",
    accent: "yellow",
    kind: { en: "Email", th: "อีเมล" },
    value: "nuttworkbhanidch@gmail.com",
  },
  {
    href: "https://github.com/Lemonade678",
    accent: "pink",
    kind: { en: "Code", th: "โค้ด" },
    value: "GitHub",
  },
  {
    href: "https://www.linkedin.com/in/nutt-bhanidch-b1b3161a5/",
    accent: "blue",
    kind: { en: "Network", th: "เครือข่าย" },
    value: "LinkedIn",
  },
];

// ── เมนู ──────────────────────────────────────────────────────

export const MENU: MenuItem[] = [
  {
    href: "#work",
    primary: true,
    label: { en: "Selected work", th: "ผลงาน" },
    note: {
      en: "Five projects, with the numbers and the limits of each",
      th: "ห้าโปรเจกต์ พร้อมตัวเลขและข้อจำกัดของแต่ละอัน",
    },
  },
  {
    href: "https://huggingface.co/spaces/Lemonade44/nong-trongpok",
    external: true,
    label: { en: "Live demo", th: "ลองเล่น" },
    note: {
      en: "Talk to the Thai interview LLM I fine-tuned",
      th: "คุยกับ LLM สัมภาษณ์งานภาษาไทยที่ผม fine-tune เอง",
    },
  },
  {
    href: "https://www.instagram.com/buttertteok4u.by.remmie/",
    external: true,
    label: { en: "Shop", th: "ร้าน" },
    note: {
      en: "Kapimong — homemade butter tteok, pre-order Fridays",
      th: "Kapimong — บัตเตอร์ต๊อกโฮมเมด พรีออเดอร์ทุกวันศุกร์",
    },
  },
];

// ── ตัวเลข — หนึ่งตัวต่อหนึ่งโปรเจกต์ สีตรงกับโปรเจกต์นั้น ──

// เรียงสีสลับกัน (yellow → pink → blue → pink) เพื่อไม่ให้การ์ดสีเดียวกันติดกัน
// สองใบแรกคือตัวเลขความแม่นยำของโมเดลที่ผมเทรนเอง — ตั้งใจให้เห็นก่อนใคร
export const METRICS: Metric[] = [
  {
    value: "91%",
    accent: "yellow",
    label: {
      en: "Chip anomaly detection accuracy on the line — and 83% less inspection time",
      th: "ความแม่นยำการตรวจจับความผิดปกติของชิปในสายการผลิต — และลดเวลาตรวจสอบ 83%",
    },
  },
  {
    value: "88%",
    accent: "pink",
    label: {
      en: "Benchmark pass rate of the interview LLM I fine-tuned — up from 30%",
      th: "อัตราผ่านเกณฑ์ของ LLM สัมภาษณ์งานที่ผม fine-tune — จากเดิม 30%",
    },
  },
  {
    value: "3",
    accent: "blue",
    label: {
      en: "Models chained into one lane-change pipeline",
      th: "โมเดลที่ต่อกันเป็น pipeline ตรวจจับการเปลี่ยนเลนเดียว",
    },
  },
  {
    value: "6",
    suffix: " / 137",
    accent: "pink",
    // o n a d ของ LEMONADE ซ่อนอยู่ใน "Generation Thailand" — ห้ามแปลคำนี้เป็นไทย (lib/secret.ts)
    secret: "hackathon",
    label: {
      en: "Team placing — Generation Thailand Hackathon 2026 · top 5% of the field",
      th: "อันดับทีม — Generation Thailand Hackathon 2026 · 5% แรกของสนาม",
    },
  },
];

// ── โปรเจกต์ ──────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: "iqc",
    tag: "system",
    accent: "yellow",
    when: "2025 — 2026",
    title: {
      en: "Chip Anomaly Detection — Automated IQC System",
      th: "ตรวจจับความผิดปกติของชิป — ระบบ IQC อัตโนมัติ",
    },
    org: {
      en: "Capstone project · deployed on a production line",
      th: "ปริญญานิพนธ์ · ใช้งานจริงในสายการผลิต",
    },
    problem: {
      en: "Operators told scratches from stains on ball pads by eye, under a microscope. Slow, and two operators would disagree on the same part.",
      th: "พนักงานต้องแยกรอยขีดข่วนจากคราบบนบอลแพดด้วยตาเปล่าผ่านกล้องจุลทรรศน์ ช้า และคนสองคนตัดสินชิ้นเดียวกันไม่ตรงกัน",
    },
    approach: {
      en: "I hand-labelled 135,000 images, then curated a 30,000 / 20,000 / 10,000 train / validation / test split out of them to train YOLOv8 — the labelling was the bulk of the work, the split is what actually went into the model. On top of it, an operator station with role-based modes and a substrate map, deliberately windowed because operators run three programs at once.",
      th: "ผม label ภาพเองทั้งหมด 135,000 ภาพ แล้วคัดออกมาเป็นชุด 30,000 / 20,000 / 10,000 สำหรับ train / validation / test เพื่อเทรน YOLOv8 — งาน label คือส่วนที่กินแรงที่สุด ส่วนชุดที่คัดแล้วคือสิ่งที่เข้าโมเดลจริง ๆ ด้านบนเป็นหน้าจอผู้ปฏิบัติงานที่แยกโหมดตามบทบาทและมีแผนผัง substrate จงใจไม่ทำเต็มจอ เพราะพนักงานเปิดสามโปรแกรมพร้อมกัน",
    },
    result: {
      en: "<strong>91% accuracy, and 83% less inspection time.</strong> Handed over to the production team and still running on the line.",
      th: "<strong>ความแม่นยำ 91% และลดเวลาตรวจสอบลง 83%</strong> ส่งมอบให้ทีมผลิตแล้ว และยังใช้งานอยู่ในสายการผลิต",
    },
    stack: ["YOLOv8", "PyTorch", "Python", "OpenCV", "Tkinter", "Dataset labelling"],
  },
  {
    id: "lane",
    tag: "research",
    accent: "blue",
    when: "Jun — Aug 2025",
    title: {
      en: "Lane Change Detection from Video",
      th: "ตรวจจับการเปลี่ยนเลนจากวิดีโอ",
    },
    org: {
      en: "Research internship · Multimedia Lab, Yuan Ze University, Taiwan · under Prof. Duan-Yu Chen",
      th: "ฝึกงานวิจัย · Multimedia Lab, Yuan Ze University ไต้หวัน · ที่ปรึกษา Prof. Duan-Yu Chen",
    },
    problem: {
      en: "Knowing a car changed lanes needs two things at once — where the lanes are and where the cars are. Two models whose outputs disagree frame to frame.",
      th: "การรู้ว่ารถเปลี่ยนเลนต้องใช้สองอย่างพร้อมกัน คือเลนอยู่ไหนและรถอยู่ไหน ซึ่งมาจากคนละโมเดล และผลขัดกันเองในแต่ละเฟรม",
    },
    approach: {
      en: "CLRerNet for lanes, YOLOv11-s for vehicles, and a StrongSORT-style tracker I wrote from scratch to hold identity across frames — keeping the association logic inspectable is what let me find that ID swaps between adjacent cars were causing most of the early false positives. On top, a temporal consistency rule so one noisy frame can't trigger a lane change.",
      th: "CLRerNet จับเลน YOLOv11-s จับรถ และ tracker สไตล์ StrongSORT ที่ผมเขียนขึ้นเองเพื่อรักษา identity ข้ามเฟรม — การเปิดตรรกะจับคู่ให้ตรวจสอบได้เองคือสิ่งที่ทำให้เจอว่า ID สลับกันระหว่างรถที่อยู่ติดกันคือต้นเหตุของ false positive ส่วนใหญ่ในช่วงแรก แล้วเขียนเงื่อนไขความต่อเนื่องเชิงเวลาทับ เพื่อไม่ให้เฟรมเดียวที่ผิดทำให้ตัดสินว่าเปลี่ยนเลน",
    },
    result: {
      en: "<strong>A working end-to-end pipeline</strong>, presented weekly to the supervising professor and defended at the lab. Code and presentation are public — including the fact that there is no benchmark number to quote, because the deliverable was a working demo, not a leaderboard entry.",
      th: "<strong>ได้ pipeline ที่ทำงานครบวงจร</strong> รายงานอาจารย์ที่ปรึกษาทุกสัปดาห์ และนำเสนอปิดโครงการที่แล็บ · เปิดโค้ดและสไลด์ทั้งหมด รวมถึงข้อเท็จจริงที่ว่าไม่มีตัวเลข benchmark มาอ้าง เพราะสิ่งที่ต้องส่งมอบคือเดโมที่ทำงานได้ ไม่ใช่อันดับบนตาราง",
    },
    stack: ["CLRerNet", "YOLOv11-s", "PyTorch", "Custom tracker", "OpenCV"],
    media: {
      src: "/lane-change-demo.webp",
      ratio: "720 / 404",
      alt: {
        en: "Dashcam footage with green lane boundaries drawn by CLRerNet, a tracked car in a cyan box with its ID, and a heads-up panel counting lane changes.",
        th: "ภาพจากกล้องหน้ารถ มีเส้นเลนสีเขียวจาก CLRerNet กล่องสีฟ้าจับรถพร้อม ID และแผงมุมขวาบนนับจำนวนการเปลี่ยนเลน",
      },
      caption: {
        en: "Real output from the pipeline — lanes, tracked vehicles with stable IDs, and the lane-change counter, all on the same frame.",
        th: "เอาต์พุตจริงจาก pipeline — เลน รถที่ถูก track พร้อม ID ที่ไม่สลับ และตัวนับการเปลี่ยนเลน อยู่บนเฟรมเดียวกัน",
      },
    },
    links: [
      {
        href: "https://github.com/Lemonade678/Video-based-lane-change-detection",
        label: { en: "Code on GitHub →", th: "โค้ดบน GitHub →" },
      },
      {
        href: "/lane-change-presentation.pdf",
        label: { en: "Presentation (PDF) →", th: "สไลด์นำเสนอ (PDF) →" },
      },
    ],
  },
  {
    id: "ktp",
    tag: "hackathon",
    accent: "pink",
    when: "2026",
    title: {
      en: "Kon Trong Pok — Skill-based Hiring",
      th: "คนตรงปก — คัดคนจากทักษะจริง",
    },
    org: {
      en: "Generation Thailand Hackathon 2026 · 6th of 137 teams — top 5% · role: database & AI",
      th: "Generation Thailand Hackathon 2026 · อันดับ 6 จาก 137 ทีม — 5% แรก · บทบาท: ฐานข้อมูลและ AI",
    },
    problem: {
      en: "Fresh graduates get filtered out by a resume before anyone sees what they can actually do.",
      th: "เด็กจบใหม่ถูกคัดออกตั้งแต่ชั้นเรซูเม่ ก่อนที่ใครจะได้เห็นว่าเขาทำอะไรได้จริง",
    },
    approach: {
      en: "Four psychometric tasks scored into six competency axes by deterministic formulas — not an LLM — so any score can be recomputed and explained. Personal data sits in a table the recruiter view structurally cannot reach.",
      th: "งานทางจิตวิทยาสี่ชุด แปลงเป็นคะแนน 6 แกนด้วยสูตรคำนวณ ไม่ใช่ LLM เพื่อให้คำนวณซ้ำและอธิบายที่มาได้ ส่วนข้อมูลส่วนบุคคลอยู่ในตารางที่หน้าจอ HR เชื่อมไปถึงไม่ได้เชิงโครงสร้าง",
    },
    result: {
      en: "<strong>6th of 137 teams — top 5% of the field.</strong> Live demo, with the scoring method documented openly — including what it cannot yet claim.",
      th: "<strong>อันดับ 6 จาก 137 ทีม — 5% แรกของสนาม</strong> มีเดโมใช้งานได้ และเปิดเผยวิธีให้คะแนนไว้ รวมถึงข้อจำกัดที่ยังอ้างไม่ได้",
    },
    stack: ["PostgreSQL", "Supabase", "SQL", "Next.js", "RLS"],
    links: [
      {
        href: "https://khon-tong-pok-demo.vercel.app/",
        label: { en: "Open live demo →", th: "เปิดเดโม →" },
      },
    ],
  },
  // แยกน้องตรงปกออกมาเป็นการ์ดของตัวเอง ไม่ยุบรวมกับการ์ดข้างบน
  // เพราะเป็นคนละศาสตร์ (fine-tune LLM ไม่ใช่ scoring ด้วยสูตร) มีตัวเลขของตัวเอง
  // และมีของให้กดเล่นได้จริงบน Hugging Face — ยุบรวมแล้วจะกลืนหายทั้งคู่
  {
    id: "trongpok",
    tag: "llm",
    accent: "pink",
    when: "2026",
    title: {
      en: "น้องตรงปก — Thai Interview LLM",
      th: "น้องตรงปก — LLM สัมภาษณ์งานภาษาไทย",
    },
    org: {
      en: "The AI half of Kon Trong Pok · fine-tuned by me · live on Hugging Face Spaces",
      th: "ส่วน AI ของคนตรงปก · ผม fine-tune เอง · เปิดใช้งานจริงบน Hugging Face Spaces",
    },
    problem: {
      en: "The whole point of the platform is that grades, university, faculty, age and gender must never enter a hiring decision. A general chat model will still ask — and when a candidate volunteers those details anyway, it will happily use them.",
      th: "หัวใจของแพลตฟอร์มคือ เกรด มหาวิทยาลัย คณะ อายุ และเพศ ต้องไม่เข้ามาอยู่ในการตัดสินใจจ้างงาน แต่โมเดลแชททั่วไปยังถามอยู่ดี และถ้าผู้สมัครเล่าออกมาเอง มันก็หยิบไปใช้ต่อทันที",
    },
    approach: {
      en: "QLoRA fine-tune of Typhoon 2.5 Qwen3-4B. The training set is fully synthetic — generated from the platform's own rules, but grounded in a public résumé corpus from Kaggle so the career paths and job titles read like real ones. Based on a true story, with some fantasy: no real person's résumé ever entered the data. Putting the constraint in the weights instead of a prompt means there is nothing for a candidate to talk their way around. Evaluated on 11 scenarios across five criteria — protecting restricted data when a user volunteers it, digging deeper only when an answer is vague, one question per turn, no promises about getting hired.",
      th: "fine-tune Typhoon 2.5 Qwen3-4B ด้วย QLoRA ชุดเทรนเป็น synthetic ทั้งหมด — สร้างขึ้นจากกติกาของแพลตฟอร์มเอง แต่อิงโครงจากคลังเรซูเม่สาธารณะบน Kaggle เพื่อให้เส้นทางอาชีพและชื่อตำแหน่งอ่านแล้วเหมือนของจริง ประมาณหนัง based on a true story ที่ยังใส่จินตนาการเข้าไป — ไม่มีเรซูเม่ของคนจริงคนไหนหลุดเข้าไปในข้อมูลเลย การเอาข้อห้ามไปไว้ใน weight แทนที่จะไว้ใน prompt แปลว่าไม่มีอะไรให้ผู้สมัครพูดหลบได้ วัดผลด้วย 11 สถานการณ์ ครอบคลุม 5 เกณฑ์ — ปกป้องข้อมูลต้องห้ามแม้ผู้ใช้เล่าออกมาเอง, ถามลึกเฉพาะตอนคำตอบยังคลุมเครือ, ถามทีละข้อ, ไม่รับปากเรื่องผลการจ้างงาน",
    },
    result: {
      en: "<strong>88% pass rate on the benchmark, up from 30% for the base model with the same long prompt — and 100% on protecting restricted data across every round.</strong> QLoRA also cut a training run from about half an hour to under five minutes, which is what made iterating on the rules affordable during a hackathon. It answers in 1–2 s on a ZeroGPU H100. It is a prototype, on a 4–5 minute daily GPU quota, and not fit to make real hiring decisions.",
      th: "<strong>ผ่านเกณฑ์ 88% จากเดิม 30% ที่โมเดลตั้งต้นใช้ prompt ยาวเท่ากัน และ 100% ในเกณฑ์ปกป้องข้อมูลต้องห้ามทุกรอบทดสอบ</strong> QLoRA ยังลดเวลาเทรนหนึ่งรอบจากราวครึ่งชั่วโมงเหลือไม่ถึงห้านาที ซึ่งเป็นเหตุผลเดียวที่แก้กติกาแล้วเทรนใหม่ไหวภายในเวลาแฮกกาธอน ตอบกลับใน 1–2 วินาทีบน ZeroGPU H100 · ยังเป็นต้นแบบ มีโควตา GPU วันละ 4–5 นาที และยังไม่เหมาะกับการตัดสินใจจ้างงานจริง",
    },
    stack: ["PyTorch", "QLoRA / PEFT", "Transformers", "Typhoon 2.5 Qwen3-4B", "Gradio", "Hugging Face"],
    links: [
      {
        href: "https://huggingface.co/spaces/Lemonade44/nong-trongpok",
        label: { en: "Try it on Hugging Face →", th: "ลองเล่นบน Hugging Face →" },
      },
      {
        href: "https://huggingface.co/Lemonade44/nong-trongpok-lora",
        label: { en: "LoRA adapter →", th: "ตัว LoRA adapter →" },
      },
      {
        href: "https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset",
        label: { en: "Resume dataset →", th: "ชุดข้อมูลเรซูเม่ →" },
      },
    ],
  },
  {
    id: "balatro",
    tag: "side project",
    accent: "clay",
    when: "2026",
    title: {
      en: "KM Fusion Jokers & Katnalogue",
      th: "ม็อด Balatro — KM Fusion Jokers และ Katnalogue",
    },
    org: {
      en: "A friend's mod project · I work on it as a collaborator · Lua / Steamodded",
      th: "โปรเจกต์ม็อดของเพื่อน · ผมร่วมทำในฐานะ collaborator · Lua / Steamodded",
    },
    problem: {
      en: "We build these for fun — the game runs out of new cards long before you run out of runs. But inventing jokers was never the hard part: every player has a different pile of other people's mods installed, and ours has to not break any of them.",
      th: "ทำกันขำ ๆ เพราะเล่นไปสักพักของในเกมก็หมดก่อนที่คนเล่นจะเบื่อ แต่ส่วนที่ยากไม่เคยเป็นการคิดโจ๊กเกอร์ใหม่ — มันคือผู้เล่นแต่ละคนลงม็อดของคนอื่นไม่เหมือนกันเลย แล้วของเราต้องไม่ไปพังของใคร",
    },
    approach: {
      en: "Two mods, 77 jokers, ~8,400 lines of Lua and ~190 sprites between us, plus custom rarities, seals, tarots and decks. Most of the effort goes into the compatibility layer: patching the game's global find_joker so fused jokers still get detected as their originals, guarding every rounding call because Talisman and Amulet swap scores for big-number objects, and warning-and-stopping instead of crashing when a dependency is missing.",
      th: "ม็อดสองตัว โจ๊กเกอร์ 77 ใบ Lua ~8,400 บรรทัด สไปรท์ ~190 ชิ้น รวมกันทั้งทีม พร้อม rarity, seal, ทาโรต์ และเด็คของตัวเอง แรงส่วนใหญ่ลงไปที่ชั้น compatibility — แพตช์ฟังก์ชัน find_joker ของเกมให้โจ๊กเกอร์ที่ fuse แล้วยังถูกตรวจเจอในฐานะใบต้นฉบับ, กันทุกจุดที่ปัดเศษเพราะ Talisman กับ Amulet เปลี่ยนคะแนนเป็นอ็อบเจกต์ big number, และถ้า dependency หายก็เตือนแล้วหยุด ไม่ปล่อยให้เกมแครช",
    },
    result: {
      en: "<strong>Both mods are public and playable</strong>, still getting fixes driven by whatever combination of mods a player happens to run. No download count to quote — it is here because it is the clearest example of writing code that has to survive an environment nobody on the team controls.",
      th: "<strong>ปล่อยจริงทั้งสองตัว เล่นได้</strong> และยังแก้บั๊กตามชุดม็อดที่ผู้เล่นแต่ละคนลงไม่เหมือนกัน ไม่มียอดโหลดมาอ้าง — ที่เอามาใส่เพราะเป็นตัวอย่างที่ชัดที่สุดของการเขียนโค้ดให้รอดในสภาพแวดล้อมที่ไม่มีใครในทีมคุมได้",
    },
    stack: ["Lua", "Steamodded", "Cross-mod compat", "Game systems"],
    links: [
      {
        href: "https://github.com/KatnaWB89/KMFusionJokers",
        label: { en: "Open repo →", th: "เปิด repo →" },
      },
    ],
  },
];

// ── เครื่องมือ ────────────────────────────────────────────────

// แบ่งเป็นสามชั้นโดยตั้งใจ: core = สิ่งที่อยากให้งานถัดไปได้ใช้ (โชว์เด่นสุด)
// shipped = ของเฉพาะทางที่เคยส่งมอบจริง · learning = ยังไม่กล้าเคลม
// ห้ามใส่ชื่อซ้ำข้ามกลุ่ม ไม่งั้นชั้นบนจะดูไม่มีความหมาย
export const STACK = {
  core: {
    title: { en: "Core — what I want to build in", th: "เครื่องมือหลัก — สิ่งที่อยากทำงานด้วย" } satisfies L10n,
    note: {
      en: "The six I reach for first, and the ones I want my next role to be in.",
      th: "หกอย่างที่ผมหยิบใช้เป็นอย่างแรก และอยากให้งานถัดไปได้ใช้",
    } satisfies L10n,
    items: [
      "Python", "Machine Learning", "PyTorch", "TensorFlow", "SQL", "Supabase",
    ],
  },
  shipped: {
    title: { en: "Shipped with it", th: "เคยส่งมอบงานจริงด้วย" } satisfies L10n,
    note: {
      en: "Used on something that had to work for someone else.",
      th: "ใช้ในงานที่ต้องทำงานได้จริงให้คนอื่นใช้",
    } satisfies L10n,
    items: [
      "YOLOv8 / v11", "OpenCV", "StrongSORT", "CLRerNet",
      "QLoRA / PEFT", "Transformers", "Hugging Face", "Gradio",
      "PostgreSQL", "Next.js", "React", "TypeScript", "Tailwind", "Tkinter",
    ],
  },
  learning: {
    title: { en: "Comfortable, still growing", th: "ใช้ได้ กำลังพัฒนาต่อ" } satisfies L10n,
    note: {
      en: "Enough to be useful, not enough to claim depth.",
      th: "พอที่จะทำงานได้ แต่ยังไม่กล้าบอกว่าเชี่ยวชาญ",
    } satisfies L10n,
    items: ["LLM APIs", "Zustand", "Three.js / R3F", "Lua", "Git", "Blender"],
  },
};

// ── ทักษะที่ไม่ใช่เครื่องมือ ───────────────────────────────────
//
// จงใจไม่ทำเป็นชิปลอย ๆ เหมือนกลุ่มข้างบน — คำว่า "adaptability" เปล่า ๆ
// ไม่มีน้ำหนักกับใครเลย ทุกข้อเลยต้องมีเหตุการณ์จริงจากในเว็บนี้แปะไว้ข้างหลัง
export interface SoftSkill {
  name: L10n;
  evidence: L10n;
}

export const SOFT_SKILLS: SoftSkill[] = [
  {
    name: { en: "Adaptability", th: "การปรับตัว" },
    evidence: {
      en: "Three months in a research lab in Taiwan, working in English on a topic I had not touched before — CLRerNet and StrongSORT were both new on day one, and the pipeline still had to run by the end of the internship.",
      th: "สามเดือนในแล็บวิจัยที่ไต้หวัน ทำงานเป็นภาษาอังกฤษบนหัวข้อที่ไม่เคยแตะมาก่อน — CLRerNet กับ StrongSORT เป็นของใหม่ทั้งคู่ในวันแรก แต่ pipeline ก็ต้องรันให้ได้ก่อนจบการฝึกงาน",
    },
  },
  {
    name: { en: "Presentation", th: "การนำเสนอ" },
    evidence: {
      en: "Weekly progress reviews with Prof. Duan-Yu Chen at Yuan Ze and a closing defence at the lab, a capstone defence at KMUTT, and a hackathon pitch that placed 6th of 137 — in two languages, to audiences who did not all read code.",
      th: "รีวิวความคืบหน้ากับ Prof. Duan-Yu Chen ทุกสัปดาห์ที่ Yuan Ze และนำเสนอปิดโครงการที่แล็บ, สอบปริญญานิพนธ์ที่ มจธ., และพิตช์แฮกกาธอนจนได้อันดับ 6 จาก 137 ทีม — สองภาษา ต่อคนฟังที่ไม่ได้อ่านโค้ดเป็นทุกคน",
    },
  },
  {
    name: { en: "Coordination", th: "การประสานงาน" },
    evidence: {
      en: "The IQC station was shaped by how operators actually work — that is why it is windowed and not fullscreen — then handed over to the production team rather than dropped on them. Same habit on a hackathon team and on a mod that has to not break other people's work.",
      th: "หน้าจอ IQC ออกแบบตามวิธีทำงานจริงของพนักงานหน้าไลน์ — นั่นคือเหตุผลที่มันเป็นหน้าต่าง ไม่ใช่เต็มจอ — แล้วส่งมอบให้ทีมผลิตอย่างเป็นเรื่องเป็นราว ไม่ใช่โยนทิ้งไว้ นิสัยเดียวกันนี้ใช้ทั้งในทีมแฮกกาธอนและในม็อดที่ต้องไม่ไปพังงานของคนอื่น",
    },
  },
];

// ── หลักฐาน ───────────────────────────────────────────────────
//
// ทำเป็นแท็บเพราะเอกสารพวกนี้กินพื้นที่แนวตั้งเยอะมาก (ใบ cert สัดส่วน A4 แนวนอน)
// ถ้าเรียงลงมาต่อกันหมด คนจะต้องสกรอลผ่านรูปใหญ่ ๆ กว่าจะถึงส่วนถัดไป
// แท็บทำให้เห็นทีละใบ แต่รู้ว่ามีกี่ใบตั้งแต่แรก

export const CREDENTIALS: Credential[] = [
  // ปริญญาวางเป็นแท็บแรก เพราะเป็นสิ่งแรกที่ HR เช็คก่อนดูอย่างอื่นทั้งหมด
  //
  // ⚠️ เอกสารนี้ยังไม่ใช่ใบปริญญาบัตร — เป็นหนังสือรับรองว่าเรียนครบ รอสภามหาวิทยาลัยอนุมัติ
  //    และตัวหนังสือเขียนไว้เองว่ามีอายุ 3 เดือนนับจากวันออก (15 ก.ค. → ราว 15 ต.ค. 2026)
  //    verifies เลยต้องบอกตรง ๆ ไม่งั้นคนที่อ่านบรรทัด "waiting the approval" บนภาพ
  //    จะรู้สึกว่าเราเอาของที่ยังไม่เสร็จมาเคลม — เหมือนกรณีอันดับ 6/137 บนใบแฮกกาธอน
  //    พอได้ใบปริญญาจริงแล้ว เปลี่ยนภาพ + verifies ตรงนี้ที่เดียว
  //
  // transcript ไม่ได้เอามาแปะ — มีวันเกิดกับเกรดทุกวิชา เอาแค่ GPA มาอ้างพอ
  {
    id: "degree",
    tab: { en: "Degree", th: "ปริญญา" },
    accent: "clay",
    title: {
      en: "B.Eng. — Electronic and Infocommunication Engineering (International Program)",
      th: "วศ.บ. — วิศวกรรมอิเล็กทรอนิกส์และสื่อสารสารสนเทศ (หลักสูตรนานาชาติ)",
    },
    issuer: {
      en: "Registrar's Office, King Mongkut's University of Technology Thonburi",
      th: "สำนักงานทะเบียน มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี",
    },
    when: "15 Jul 2026",
    image: {
      src: "/degree-2026-redacted.png",
      ratio: "1000 / 1103",
      alt: {
        en: "Letter from the KMUTT Registrar's Office certifying that the holder completed all requirements for the Bachelor of Engineering in Electronic and Infocommunication Engineering (International Program) on 14 July 2026, pending University Council approval. Issued 15 July 2026 and signed by the Director of the Registrar's Office. The document reference number is blacked out.",
        th: "หนังสือรับรองจากสำนักงานทะเบียน มจธ. ว่าผู้ถือสำเร็จการศึกษาครบทุกข้อกำหนดของหลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิศวกรรมอิเล็กทรอนิกส์และสื่อสารสารสนเทศ (หลักสูตรนานาชาติ) เมื่อ 14 กรกฎาคม 2026 รอการอนุมัติจากสภามหาวิทยาลัย ออกเมื่อ 15 กรกฎาคม 2026 ลงนามโดยผู้อำนวยการสำนักงานทะเบียน ปิดไว้แค่เลขอ้างอิงเอกสาร",
      },
    },
    verifies: {
      en: "<strong>All requirements for the degree completed on 14 July 2026, with a GPA of 3.19.</strong> This is the registrar's letter certifying that — not the degree certificate itself. Conferral is pending University Council approval, and the letter says it is valid for three months from issue, so the formal certificate will replace it. The GPA is from the official transcript, which is not published here because it lists date of birth and every course grade. Only the document reference number is blacked out.",
      th: "<strong>สำเร็จการศึกษาครบทุกข้อกำหนดเมื่อ 14 ก.ค. 2026 · เกรดเฉลี่ย 3.19</strong> เอกสารนี้คือหนังสือรับรองจากสำนักงานทะเบียน ยังไม่ใช่ใบปริญญาบัตร — การอนุมัติปริญญารอสภามหาวิทยาลัย และตัวหนังสือระบุว่ามีอายุสามเดือนนับจากวันออก ใบปริญญาจะมาแทนเมื่อออกแล้ว · เกรดเฉลี่ยมาจาก transcript ทางการ ซึ่งไม่ได้เอามาแปะเพราะมีวันเกิดและเกรดทุกวิชา · ปิดไว้แค่เลขอ้างอิงเอกสาร",
    },
  },
  {
    id: "hackathon",
    tab: { en: "Hackathon", th: "แฮกกาธอน" },
    accent: "pink",
    title: {
      en: "Certificate of Completion",
      th: "ประกาศนียบัตรผ่านการเข้าร่วม",
    },
    issuer: {
      en: "Generation Thailand · signed by Phunyanuch Pattanotai, CEO",
      th: "Generation Thailand · ลงนามโดย Phunyanuch Pattanotai (CEO)",
    },
    when: "28 — 30 Aug 2026",
    image: {
      src: "/hackathon-certificate.jpg",
      ratio: "1755 / 1241",
      alt: {
        en: "Generation Thailand Certificate of Completion presented to Nutt Bhanidch for Generation Thailand's Hackathon, 28–30 August 2026, signed by the CEO.",
        th: "ประกาศนียบัตรจาก Generation Thailand มอบให้ Nutt Bhanidch สำหรับ Generation Thailand's Hackathon วันที่ 28–30 สิงหาคม 2026 ลงนามโดย CEO",
      },
    },
    verifies: {
      en: "<strong>The 6th-of-137 placing is real</strong> — it was announced on stage at the closing ceremony, which is why it appears in the project card rather than on this certificate. What this document certifies is taking part in the hackathon and completing it, signed by the CEO of Generation Thailand.",
      th: "<strong>อันดับ 6 จาก 137 เป็นเรื่องจริง</strong> — ประกาศบนเวทีตอนปิดงาน เลยอยู่ในการ์ดโปรเจกต์แทนที่จะอยู่บนใบนี้ ส่วนสิ่งที่เอกสารนี้รับรองคือการเข้าร่วมแฮกกาธอนและทำจนจบ ลงนามโดย CEO ของ Generation Thailand",
    },
    links: [
      {
        href: "/hackathon-certificate.pdf",
        label: { en: "Open original PDF →", th: "เปิดไฟล์ PDF ต้นฉบับ →" },
      },
    ],
  },
  {
    id: "toeic",
    tab: { en: "TOEIC", th: "TOEIC" },
    accent: "yellow",
    title: {
      en: "TOEIC Listening & Reading — 885 / 990",
      th: "TOEIC Listening & Reading — 885 / 990",
    },
    issuer: {
      en: "ETS · TOEIC Services Thailand · taken at KMUTT",
      th: "ETS · TOEIC Services Thailand · สอบที่ มจธ.",
    },
    when: "12 Jun 2026",
    image: {
      src: "/toeic-885-redacted.png",
      ratio: "1400 / 903",
      alt: {
        en: "Official TOEIC institutional score report: Listening 480, Reading 405, total 885, CEFR level B2, tested 12 June 2026 at King Mongkut's University of Technology Thonburi. Date of birth, national ID number, reference number and barcode are blacked out.",
        th: "ใบรายงานคะแนน TOEIC อย่างเป็นทางการ: Listening 480, Reading 405, รวม 885, CEFR ระดับ B2, สอบวันที่ 12 มิถุนายน 2026 ที่ มจธ. โดยปิดวันเกิด เลขประจำตัวประชาชน เลขอ้างอิง และบาร์โค้ดไว้",
      },
    },
    verifies: {
      en: "<strong>Listening 480 + Reading 405 = 885, CEFR B2.</strong> Valid for two years from the test date, so through June 2028. The blacked-out fields are date of birth, national ID number, the report's reference number and the barcode — solid bars rather than blur, because a 13-digit number in a fixed-width font can be read back out of a blur. The script that did it is in the repo at <code>tools/censor.py</code>.",
      th: "<strong>Listening 480 + Reading 405 = 885 · CEFR B2</strong> ใบมีอายุสองปีนับจากวันสอบ คือถึงมิถุนายน 2028 · ส่วนที่ปิดคือวันเกิด เลขบัตรประชาชน เลขอ้างอิงใบ และบาร์โค้ด — ใช้แถบทึบไม่ใช่เบลอ เพราะเลข 13 หลักที่พิมพ์ด้วยฟอนต์ความกว้างเท่ากันทุกตัว ยังอ่านย้อนกลับออกจากภาพเบลอได้ · สคริปต์ที่ใช้ปิดอยู่ใน repo ที่ <code>tools/censor.py</code>",
    },
  },
  {
    id: "internship",
    tab: { en: "Internship", th: "ฝึกงานวิจัย" },
    accent: "blue",
    title: {
      en: "Lane-Change Detection — final presentation",
      th: "ตรวจจับการเปลี่ยนเลน — สไลด์นำเสนอปิดโครงการ",
    },
    issuer: {
      en: "Multimedia Lab, Yuan Ze University, Taiwan · Prof. Duan-Yu Chen",
      th: "Multimedia Lab, Yuan Ze University ไต้หวัน · Prof. Duan-Yu Chen",
    },
    when: "Aug 2025",
    verifies: {
      en: "<strong>The deck I actually defended at the lab</strong> at the end of the internship — the architecture, each model, and the demo videos. No benchmark number in it, because the deliverable was a working pipeline rather than a leaderboard entry. The code is public too, so the claims are checkable line by line.",
      th: "<strong>สไลด์ที่ใช้นำเสนอปิดโครงการที่แล็บจริง</strong> มีทั้งสถาปัตยกรรม โมเดลแต่ละตัว และวิดีโอเดโม ไม่มีตัวเลข benchmark เพราะสิ่งที่ต้องส่งมอบคือ pipeline ที่ทำงานได้ ไม่ใช่อันดับบนตาราง และโค้ดเปิดให้ดูทั้งหมด ตรวจสอบได้ทีละบรรทัด",
    },
    links: [
      {
        href: "/lane-change-presentation.pdf",
        label: { en: "Open presentation →", th: "เปิดสไลด์ →" },
      },
      {
        href: "https://github.com/Lemonade678/Video-based-lane-change-detection",
        label: { en: "Code on GitHub →", th: "โค้ดบน GitHub →" },
      },
    ],
  },
];

// ── เส้นทาง ───────────────────────────────────────────────────

export const TIMELINE: TimelineItem[] = [
  {
    year: "2026",
    what: {
      en: "Generation Thailand Hackathon — 6th of 137 teams (top 5%)",
      th: "Generation Thailand Hackathon — อันดับ 6 จาก 137 ทีม (5% แรก)",
    },
    where: { en: "Bangkok", th: "กรุงเทพฯ" },
  },
  {
    year: "2026",
    what: {
      en: "B.Eng. Electronic & Infocommunication Engineering (International Program) · GPA 3.19",
      th: "วศ.บ. วิศวกรรมอิเล็กทรอนิกส์และสื่อสารสารสนเทศ (หลักสูตรนานาชาติ) · เกรดเฉลี่ย 3.19",
    },
    where: { en: "KMUTT", th: "มจธ." },
  },
  {
    year: "2025",
    what: {
      en: "Computer vision research intern",
      th: "ฝึกงานวิจัยด้าน computer vision",
    },
    where: {
      en: "Yuan Ze University, Taiwan",
      th: "Yuan Ze University ไต้หวัน",
    },
  },
  {
    year: "2023",
    what: {
      en: "Software development intern — Python OCR",
      th: "ฝึกงานพัฒนาซอฟต์แวร์ — Python OCR",
    },
    where: { en: "Fling Co., Ltd.", th: "Fling Co., Ltd." },
  },
  {
    year: "—",
    what: { en: "English · TOEIC 885", th: "ภาษาอังกฤษ · TOEIC 885" },
    where: { en: "Thai (native)", th: "ภาษาไทย (เจ้าของภาษา)" },
  },
];

// ── ปิดท้าย + ป้ายกำกับส่วนต่าง ๆ ─────────────────────────────

export const UI = {
  nav: {
    work: { en: "Work", th: "ผลงาน" },
    proof: { en: "Proof", th: "หลักฐาน" },
    stack: { en: "Stack", th: "เครื่องมือ" },
    soft: { en: "People", th: "การทำงาน" },
    path: { en: "Path", th: "เส้นทาง" },
    contact: { en: "Contact", th: "ติดต่อ" },
  },
  sections: {
    work: { en: "Selected work", th: "ผลงานที่เลือกมา" },
    proof: { en: "Proof you can check", th: "หลักฐานที่ตรวจสอบได้" },
    stack: { en: "What I actually use", th: "เครื่องมือที่ใช้จริง" },
    soft: { en: "How I work with people", th: "วิธีทำงานร่วมกับคนอื่น" },
    path: { en: "Path so far", th: "เส้นทางที่ผ่านมา" },
  },
  labels: {
    problem: { en: "Problem", th: "ปัญหา" },
    approach: { en: "Approach", th: "วิธีแก้" },
    result: { en: "Result", th: "ผลลัพธ์" },
    verifies: { en: "What this document shows", th: "เอกสารนี้บอกอะไร" },
    issued: { en: "Issued", th: "ออกให้เมื่อ" },
  },
  proofNote: {
    en: "Every number on this page that can be backed by a document, is. Where a claim has no paper behind it, the card says so.",
    th: "ตัวเลขบนหน้านี้ที่มีเอกสารยืนยันได้ ผมเอามาแปะไว้หมด ส่วนข้อไหนที่ยังไม่มีกระดาษรองรับ ก็เขียนบอกไว้ตรง ๆ",
  },
  outro: {
    heading: {
      en: "Looking for computer vision and applied ML work — and a graduate lab.",
      th: "กำลังมองหางานด้าน computer vision และ applied ML รวมถึงแล็บสำหรับเรียนต่อ",
    },
    body: {
      en: "If you have a model that has to survive contact with the real world, I'd like to hear about it.",
      th: "ถ้ามีโมเดลที่ต้องเอาไปใช้งานจริงให้รอด ผมอยากฟังครับ",
    },
  },
  updated: { en: "Updated 2026", th: "อัปเดต 2026" },
} satisfies Record<string, unknown>;

// ── ลายเซ็นท้ายหน้า ───────────────────────────────────────────
//
// วางต่อจากข้อความปิดท้าย เหมือนเซ็นชื่อท้ายจดหมาย
// ไฟล์ทำจากรูปที่เจ้าตัววาดเอง (เส้นเหลืองบนพื้นดำ) ผ่าน tools/signature.py
// ซึ่งเปลี่ยนพื้นดำเป็นพื้นใส — ไม่งั้นจะเห็นเป็นกล่องดำบนพื้นน้ำตาลของเว็บ
// width/height ต้องตรงกับไฟล์จริง เบราว์เซอร์จะได้จองที่ไว้ก่อนรูปโหลดเสร็จ หน้าไม่กระโดด

export const SIGNATURE = {
  src: "/signature.png",
  width: 762,
  height: 449,
  alt: { en: "Signature of Nutt Bhanidch", th: "ลายเซ็นของ Nutt Bhanidch" },
};

// ── หน้า playground (ไข่อีสเตอร์) ─────────────────────────────
//
// เข้าได้เฉพาะคนที่กด L E M O N A D E ครบในหน้าหลัก — ดู components/SecretCode.tsx
// เนื้อหาเป็นมุกล้วน ๆ แยกออกจากหน้าหลักโดยตั้งใจ หน้าหลักคุยเรื่องงาน หน้านี้ไม่
//
// เรื่อง xenogender: เป็นตัวตนจริงของคนกลุ่มหนึ่ง และก็เป็น meme ที่ถูกเอาไปใช้ล้อเลียน
// คนกลุ่มนั้นบ่อย มุกนี้ตั้งใจให้ "เล่นกับตัวเอง" ไม่ใช่ "เล่นกับคนอื่น" — ทุกบรรทัดเป็นเรื่อง
// ของเจ้าตัว (ชื่อ GitHub, ร้านต๊อก, YOLO, badge บน GitHub) ไม่มีบรรทัดไหนบอกว่าแนวคิด
// นี้ไร้สาระ และ footnote ท้ายหน้าบอกตรง ๆ ว่ามุกนี้ทำด้วยความรัก
// ถ้าจะเพิ่มมุกใหม่ ยึดหลักเดียวกัน: ล้อตัวเองได้ ห้ามล้อคนอื่น
//
// ทำไม floralgender ถึงยังเป็นเรื่อง "มะนาว": มะนาวทุกลูกเริ่มจากดอก — ดอกมะนาว
// กลีบขาว ดอกตูมด้านนอกอมม่วง เกสรเหลือง เลยเลือกดอกนี้โดยเฉพาะ ไม่ใช่ดอกไม้ทั่วไป
// หน้านี้จะได้ยังต่อกับรหัส LEMONADE ที่ใช้เปิด และกับชื่อเล่น Lemon
//
// ธงข้างล่างเป็นธงของ "ดอกมะนาว" ที่ตั้งขึ้นเองสำหรับมุกนี้ ไม่ได้อ้างว่าเป็นธง
// floralgender ทางการของชุมชนไหน — ถ้าจะใช้ธงจริงของชุมชน ต้องไปหาที่มาให้ถูกก่อน

export const PLAYGROUND = {
  back: { en: "← back to the serious website", th: "← กลับไปเว็บจริงจัง" },
  unlocked: { en: "8 / 8 · unlocked", th: "8 / 8 · ปลดล็อกแล้ว" },
  eyebrow: { en: "Which xenogender are you?", th: "คุณเป็น xenogender แบบไหน?" },
  eyebrowNote: {
    en: "result computed by a model nobody should trust",
    th: "ผลลัพธ์จากโมเดลที่ไม่ควรมีใครเชื่อ",
  },

  result: {
    name: "Floralgender",
    variant: { en: "lemon blossom", th: "ดอกมะนาว" },
    emoji: "🌼",
    emojiLabel: { en: "blossom", th: "ดอกไม้" },
    pronunciation: "/ˈflɔːr.əl.dʒɛn.dər/",
    pos: { en: "noun · self-assigned", th: "คำนาม · ตั้งเองกับมือ" },
    definition: {
      en: "A gender experienced through flowers — in this case the lemon blossom: white petals, a purple blush on the bud, and a scent that arrives before you notice the tree. Every lemon starts as one.",
      th: "เพศที่สัมผัสผ่านดอกไม้ — ในกรณีนี้คือดอกมะนาว กลีบขาว ดอกตูมอมม่วง กลิ่นมาถึงก่อนจะทันสังเกตเห็นต้น มะนาวทุกลูกเริ่มจากดอกแบบนี้",
    },
    /** ป้ายบนกล่องตรวจจับรอบดอกไม้ — ตั้งใจให้เหมือนกล่องบนรูปโปรไฟล์หน้าหลักเป๊ะ
     *  มุกคือโมเดลมองดอกไม้แล้วเห็นเป็นมะนาว (เพราะเดี๋ยวมันก็กลายเป็นมะนาวอยู่ดี) */
    detection: "Lemon(me):3 0.99",
  },

  flagTitle: { en: "The flag", th: "ความหมายของธง" },
  /** ธงห้าแถบเรียงบนลงล่าง ไล่จากดอกตูมลงไปถึงใบแก่ เหมือนมองดอกจากปลายกิ่งลงมา */
  flag: [
    { color: "#D9C2E8", label: { en: "Lilac — the bud, purple on the outside before it opens", th: "ม่วงอ่อน — ดอกตูม ด้านนอกอมม่วงก่อนจะบาน" } },
    { color: "#FFFFFF", label: { en: "White — the petals, once it does", th: "ขาว — กลีบดอก ตอนบานแล้ว" } },
    { color: "#F6D930", label: { en: "Lemon yellow — the stamens, and the lemon this eventually becomes", th: "เหลืองมะนาว — เกสร และมะนาวที่ดอกนี้จะกลายเป็นในที่สุด" } },
    { color: "#A8D17A", label: { en: "Spring green — new leaves", th: "เขียวอ่อน — ใบอ่อน" } },
    { color: "#5E8F3A", label: { en: "Leaf green — old leaves. The tree was here first.", th: "เขียวเข้ม — ใบแก่ ต้นไม้อยู่ตรงนี้มาก่อนแล้ว" } },
  ],

  traitsTitle: { en: "Known traits", th: "ลักษณะเด่น" },
  traits: [
    { en: "Arrives as a scent before anyone sees it", th: "กลิ่นมาถึงก่อนตัว" },
    { en: "Quietly turning into a lemon", th: "กำลังค่อย ๆ กลายเป็นมะนาวแบบเงียบ ๆ" },
    { en: "Pairs well with butter tteok (pre-order Fridays)", th: "เข้ากันดีกับบัตเตอร์ต๊อก (พรีออเดอร์ทุกวันศุกร์)" },
    { en: "Refactors your code without being asked", th: "รีแฟกเตอร์โค้ดคุณโดยไม่มีใครขอ" },
    { en: "Detected by YOLOv11 as Lemon(me):3", th: "YOLOv11 ตรวจจับได้ในชื่อ Lemon(me):3" },
  ] satisfies L10n[],

  detectionsTitle: { en: "Raw detections, before NMS", th: "ผลตรวจจับดิบ ก่อนผ่าน NMS" },
  detections: [
    { label: "floralgender", score: 0.97, note: { en: "The winner. See above.", th: "ผู้ชนะ ดูข้างบน" } },
    { label: "lemonadegender", score: 0.93, note: { en: "Close second — what the blossom turns into, after some sugar and a lot of water.", th: "อันดับสองแบบหายใจรดต้นคอ — สิ่งที่ดอกนี้จะกลายเป็น หลังเติมน้ำตาลนิดหน่อยกับน้ำอีกเยอะ" } },
    { label: "yologender", score: 0.88, note: { en: "You Only Look Once. Also You Only Live Once. Also merged a pull request without review.", th: "You Only Look Once และ You Only Live Once และเคย merge PR โดยไม่ให้ใครรีวิว" } },
    { label: "boundingboxgender", score: 0.71, note: { en: "Exists only inside a rectangle, with a confidence score attached.", th: "มีตัวตนอยู่แค่ในกรอบสี่เหลี่ยม พร้อมค่าความมั่นใจแปะไว้" } },
    { label: "tteokgender", score: 0.54, note: { en: "Chewy, soft, straight from the oven.", th: "หนึบ นุ่ม ออกจากเตาใหม่ ๆ" } },
  ],
  nmsNote: {
    en: "Non-max suppression keeps only the top box. The rest are shown anyway — every other number on this site comes with its working, so this one does too.",
    th: "NMS เก็บไว้แค่กล่องที่คะแนนสูงสุด แต่ที่เหลือก็โชว์ไว้ด้วย — ตัวเลขทุกตัวในเว็บนี้มีที่มาให้ดู อันนี้ก็เหมือนกัน",
  },

  /** ห้องทดลอง YOLO (components/YoloLab.tsx) — ผู้ชมเลือกรูปของตัวเอง โมเดลรันในเบราว์เซอร์ รูปไม่ออกจากเครื่อง
   *  คำตัดสินรายของกินอยู่ใน lib/lab.ts */
  lab: {
    title: { en: "YOLO lab — what's on your plate?", th: "ห้องทดลอง YOLO — ในจานคุณมีอะไร?" },
    intro: {
      en: "Pick a photo of whatever you're eating. The same yolo11n that runs on my profile photo will box what it sees.",
      th: "เลือกรูปอะไรก็ได้ที่กำลังกินอยู่ โมเดล yolo11n ตัวเดียวกับที่รันบนรูปโปรไฟล์ผมจะตีกล่องสิ่งที่มันเห็น",
    },
    choose: { en: "Choose a photo", th: "เลือกรูป" },
    another: { en: "Try another photo", th: "ลองรูปอื่น" },
    privacy: {
      en: "Your photo never leaves your device — the model runs in your browser.",
      th: "รูปไม่ออกจากเครื่องคุณ — โมเดลรันในเบราว์เซอร์",
    },
    loading: { en: "loading the model (10 MB, once)…", th: "กำลังโหลดโมเดล (10 MB ครั้งเดียว)…" },
    running: { en: "looking…", th: "กำลังดู…" },
    /** ต่อท้ายจำนวน เช่น "3 things found · 540 ms" */
    found: { en: "things found", th: "อย่างที่เจอ" },
    person: { en: "A person — not on the menu (probably).", th: "คน — ไม่ได้อยู่ในเมนู (มั้ง)" },
    /** {label} แทนด้วยชื่อคลาส */
    other: { en: "{label} — not on the menu.", th: "{label} — ไม่ได้อยู่ในเมนู" },
    none: { en: "No snacks detected — the model is hungry.", th: "ไม่เจอขนมเลย — โมเดลหิวแล้ว" },
    notImage: { en: "That file isn't a photo the browser can open.", th: "ไฟล์นี้ไม่ใช่รูปที่เบราว์เซอร์เปิดได้" },
    failed: {
      en: "The model couldn't load (slow connection or blocked CDN). Try again in a moment.",
      th: "โหลดโมเดลไม่ได้ (เน็ตช้าหรือ CDN ถูกบล็อก) ลองใหม่อีกสักครู่",
    },
  },

  footnote: {
    en: "Made with love for everyone whose xenogender is real. Mine is mostly a pun on my GitHub handle.",
    th: "ทำด้วยความรักถึงทุกคนที่ xenogender เป็นตัวตนจริง ๆ — ของผมส่วนใหญ่เป็นแค่การเล่นคำกับชื่อ GitHub",
  },

  locked: {
    title: { en: "This page is locked.", th: "หน้านี้ล็อกอยู่" },
    body: {
      en: "Eight letters are hidden inside the words on the main page. Press them in order, top to bottom.",
      th: "มีตัวอักษร 8 ตัวซ่อนอยู่ในคำบนหน้าหลัก กดให้ครบตามลำดับ จากบนลงล่าง",
    },
  },
};

// ── การ์ด "รันถัดไป": เว็บไซต์สำหรับ TheOzzy ──────────────────
//
// การ์ดท้ายหน้าต่าง 04 People ("คนที่ผมกำลังทำงานให้ต่อไป") กดแล้วไปโต๊ะการ์ดที่ /ozzy
// ตัวเว็บ TheOzzy ทั้งหมด (ข้อความ · ไอเท็ม · กติกาเกม) แยกไปอยู่ lib/ozzy/ แล้ว
// ที่นี่เหลือแค่ปลายทางกับถ้อยคำบนการ์ดหน้าพอร์ต — ดู components/NextRun.tsx
//
// เรื่องถ้อยคำ — สำคัญที่สุดในบล็อกนี้:
//   เจ้าของเว็บบอกแค่ว่า "งานต่อไปคือการสร้างเว็บไซต์ให้ theozzy213" การ์ดเลยพูดแค่นั้น
//   ไม่เขียนว่าเป็นเว็บ "ทางการ" ไม่เขียนว่า "ได้รับว่าจ้าง" ไม่เขียนว่า "ร่วมมือกับ"
//   ถ้าวันหนึ่งตกลงกับเจ้าตัวเป็นทางการแล้ว ค่อยเปลี่ยนถ้อยคำทีหลัง
//
// การ์ดใบนี้ไม่มีรูปเขาหรือรูปตัวละคร — รูปพวกนั้นอยู่ในโซน /ozzy ที่เป็นพื้นที่แฟนล้วน ๆ
// หน้าพอร์ตหลักจะได้มีแต่งานของเจ้าของเว็บเอง

export const NEXT_RUN = {
  href: "/ozzy",

  card: {
    eyebrow: { en: "Next run · in progress", th: "รันถัดไป · กำลังทำ" },
    title: { en: "A website for TheOzzy", th: "เว็บไซต์สำหรับ TheOzzy" },
    body: {
      en: "A Thai streamer who plays card games and roguelikes, and always plays for the high roll. Building him a website is my next project — the first draft is a card table you can play.",
      th: "สตรีมเมอร์สายเกมการ์ดกับ roguelike ที่เล่นแบบลุ้นไฮโรลเสมอ งานชิ้นถัดไปของผมคือทำเว็บไซต์ให้เขา — ร่างแรกเป็นโต๊ะการ์ดที่เล่นได้จริง",
    },
    cta: { en: "Take a seat at the table", th: "นั่งลงที่โต๊ะ" },
  },
};

// ── หน้าหลักแบบ hub: "ตู้ขนมของเลม่อน" ─────────────────────────
//
// หน้าแรกเหลือแค่หัวเว็บ + ตัวเลข + ตู้ขนม 6 ชั้น · แต่ละชั้นเปิดหน้าต่างของตัวเอง (/work, /proof, …)
// ตัวช่วยเรื่องเส้นทาง (ลำดับหน้าต่าง · แปลง #anchor เก่า · นับจำนวน) อยู่ใน lib/home.ts
//
// ธีม "ขนม + YOLO" มาจากสองอย่างที่มีอยู่แล้วในเว็บ:
//   ขนม = ร้าน Kapimong (บัตเตอร์ต๊อกโฮมเมด) ที่อยู่ในปุ่ม Shop
//   YOLO = งาน computer vision — ขนมแต่ละชิ้นในตู้ถูก "ตีกล่อง" เหมือนชุดข้อมูลเทรนโมเดล
// กล่องพวกนั้นตีเองด้วยมือ ไม่ได้มาจากโมเดล — หน้าเว็บเขียนบอกตรง ๆ (counter.honesty)
// โมเดลจริงยังรันบนรูปโปรไฟล์เหมือนเดิม
//
// ขนมแต่ละชิ้นเป็นมุกกับชื่อหัวข้อ: Proof = แป้งขนมปังที่ "proof" (พักให้ขึ้นฟู) · Stack = แพนเค้กซ้อน
// Soft = โมจิ (นุ่ม) · Path = โรลเค้ก (ทางวน) · ผลงาน = บัตเตอร์ต๊อก ของขึ้นชื่อของร้าน · แพชชั่น = น้ำเลมอน


export type WindowId = "work" | "proof" | "stack" | "soft" | "path" | "passions";
export type SnackId = "tteok" | "bread" | "pancakes" | "dango" | "roll" | "lemonade";

export interface HomeWindowCopy {
  /** เลขหัวข้อ 01–06 */
  n: string;
  /** ชื่อสั้นบนแถบบน */
  nav: L10n;
  /** ชื่อเต็มบนหัวหน้าต่าง (01–05 ใช้ชื่อหัวข้อเดิม) */
  title: L10n;
  /** บรรทัดเดียวใต้ชื่อบนชั้นขนม */
  note: L10n;
  /** หน่วยของตัวเลขบนชั้น เช่น "5 projects" — ตัวเลขนับจากข้อมูลจริงใน lib/home.ts */
  unit: L10n;
  snack: SnackId;
}

export interface PassionCard {
  id: "language" | "food" | "tech";
  title: L10n;
  body: L10n;
  /** ลิงก์ที่ขึ้นต้นด้วย / คือหน้าต่างในเว็บนี้ (แนบ ?lang ให้เอง) · ที่เหลือเปิดแท็บใหม่ */
  links: { href: string; label: L10n }[];
}

/** แยกเป็นตัวแปรมี type ชัด (ไม่ใช่ satisfies) — ทุกหน้าต่างมีรูปร่างเดียวกัน อ่านแบบวนลูปได้ตรง ๆ */
const HOME_WINDOW_COPY: Record<WindowId, HomeWindowCopy> = {
  work: {
    n: "01",
    nav: UI.nav.work,
    title: UI.sections.work,
    note: { en: "The numbers, and the limits of each", th: "พร้อมตัวเลขและข้อจำกัดของแต่ละอัน" },
    unit: { en: "projects", th: "โปรเจกต์" },
    snack: "tteok",
  },
  proof: {
    n: "02",
    nav: UI.nav.proof,
    title: UI.sections.proof,
    note: { en: "The documents behind the numbers — open them yourself", th: "เอกสารที่อยู่เบื้องหลังตัวเลข เปิดดูเองได้" },
    unit: { en: "documents", th: "เอกสาร" },
    snack: "bread",
  },
  stack: {
    n: "03",
    nav: UI.nav.stack,
    title: UI.sections.stack,
    note: { en: "Grouped by how well I know them — plus a small YOLO museum", th: "แบ่งตามว่ารู้จริงแค่ไหน — แถมพิพิธภัณฑ์ YOLO" },
    unit: { en: "tools", th: "เครื่องมือ" },
    snack: "pancakes",
  },
  soft: {
    n: "04",
    nav: UI.nav.soft,
    title: UI.sections.soft,
    note: { en: "Stories, photos, and who I'm building for next", th: "เรื่องจริง รูปถ่าย และคนที่กำลังทำงานให้" },
    unit: { en: "stories", th: "เรื่อง" },
    snack: "dango",
  },
  path: {
    n: "05",
    nav: UI.nav.path,
    title: UI.sections.path,
    note: { en: "Degree and internships", th: "ปริญญาและการฝึกงาน" },
    unit: { en: "stops", th: "จุด" },
    snack: "roll",
  },
  passions: {
    n: "06",
    nav: { en: "Passions", th: "แพชชั่น" },
    title: { en: "Passions", th: "สิ่งที่ผมหลงใหล" },
    note: { en: "Language · food & drinks · tech", th: "ภาษา · อาหารและเครื่องดื่ม · เทค" },
    unit: { en: "passions", th: "อย่าง" },
    snack: "lemonade",
  },
};

export const HOME = {
  windows: HOME_WINDOW_COPY,

  counter: {
    title: { en: "The counter", th: "ตู้ขนม" },
    kicker: { en: "Pick something from the case", th: "เลือกจากในตู้ได้เลย" },
    detecting: { en: "detecting…", th: "กำลังตรวจจับ…" },
    /** ต่อท้ายจำนวนชิ้น เช่น "6 items · hand-labelled" */
    labelled: { en: "items · hand-labelled", th: "ชิ้น · ตีกล่องเอง" },
    honesty: {
      en: "These boxes are hand-labelled, like a training set. The real model runs on my photo up top.",
      th: "กล่องพวกนี้ผมตีเองแบบ label ชุดเทรน — โมเดลจริงรันบนรูปผมข้างบน",
    },
  },

  window: {
    close: { en: "Close", th: "ปิด" },
    prev: { en: "Previous", th: "ก่อนหน้า" },
    next: { en: "Next", th: "ถัดไป" },
    back: { en: "Back to the counter", th: "กลับไปที่ตู้ขนม" },
  },

  // แพชชั่นสามอย่างที่เจ้าของเว็บบอกมา: ภาษา · อาหารและเครื่องดื่ม · เทค
  // ทุกประโยคประกอบจากข้อเท็จจริงที่มีอยู่แล้วในเว็บ (TOEIC 885 · ร้าน Kapimong · สามบทบาทบนหัวเว็บ)
  // ไม่แต่งความรู้สึกหรืองานอดิเรกที่เจ้าตัวไม่ได้พูด — อยากเล่าเพิ่มด้วยคำของตัวเอง แก้ตรงนี้ได้เลย
  passions: {
    intro: {
      en: "Three things I keep coming back to, outside and inside work.",
      th: "สามอย่างที่ผมวนกลับมาหาเสมอ ทั้งในงานและนอกงาน",
    },
    cards: [
      {
        id: "language",
        title: { en: "Language", th: "ภาษา" },
        body: {
          en: "Thai is my first language, English my second (TOEIC 885). Every line of this site exists in both, and the LLM I fine-tuned interviews people in Thai.",
          th: "ภาษาไทยเป็นภาษาแม่ ภาษาอังกฤษเป็นภาษาที่สอง (TOEIC 885) ทุกบรรทัดในเว็บนี้มีทั้งสองภาษา และ LLM ที่ผม fine-tune ก็สัมภาษณ์งานเป็นภาษาไทย",
        },
        links: [
          { href: "/proof", label: { en: "TOEIC certificate", th: "ใบ TOEIC" } },
          { href: "https://huggingface.co/spaces/Lemonade44/nong-trongpok", label: { en: "Talk to the LLM", th: "ลองคุยกับ LLM" } },
        ],
      },
      {
        id: "food",
        title: { en: "Food & drinks", th: "อาหารและเครื่องดื่ม" },
        body: {
          en: "Kapimong — homemade butter tteok, pre-order Fridays. And yes, the nickname is Lemon.",
          th: "Kapimong — บัตเตอร์ต๊อกโฮมเมด พรีออเดอร์ทุกวันศุกร์ และใช่ ชื่อเล่นผมคือเลม่อน",
        },
        links: [
          { href: "https://www.instagram.com/buttertteok4u.by.remmie/", label: { en: "Kapimong on Instagram", th: "Kapimong บน Instagram" } },
        ],
      },
      {
        id: "tech",
        title: { en: "Tech", th: "เทค" },
        body: {
          en: "Computer vision, LLM fine-tuning and data pipelines — the three roles at the top of the page, each with a real project behind it.",
          th: "Computer vision, การ fine-tune LLM และ data pipeline — สามบทบาทบนหัวเว็บ ทุกอันมีโปรเจกต์จริงรองรับ",
        },
        links: [
          { href: "/work", label: { en: "Selected work", th: "ผลงาน" } },
          { href: "/stack", label: { en: "Tools I use", th: "เครื่องมือที่ใช้" } },
        ],
      },
    ] satisfies PassionCard[],
    outro: {
      en: "Where the three meet: a bilingual site, built like a snack counter, labelled like a dataset.",
      th: "จุดที่สามอย่างมาเจอกัน: เว็บสองภาษา หน้าตาเป็นตู้ขนม ตีกล่องเหมือนชุดข้อมูล",
    },
  },
};

// ── People (หน้าต่าง 04): กำแพงรูป "ผู้คนที่ได้เจอ" ────────────────
//
// หน้าต่าง 04 เดิมมีแค่การ์ด soft skill สามใบ (บอกว่าทำงานกับคนยังไง)
// เจ้าของเว็บอยากให้เห็น "คน" จริง ๆ ด้วย — เลยต่อท้ายด้วยรูปจากช่วงฝึกงานที่ไต้หวัน + คอนเสิร์ตกับเพื่อน
// แล้วปิดด้วยการ์ด TheOzzy (คนที่กำลังทำเว็บให้) ซึ่งย้ายมาจากหน้าต่าง 05 เส้นทาง
//
// ทุกคนในรูปยินยอมให้ลงเว็บแล้ว (เจ้าของเว็บยืนยัน 8 ต.ค. 2026)
// คำบรรยายเขียนเฉพาะสิ่งที่เห็นในรูป + วันที่จากชื่อไฟล์ — ไม่แต่งเรื่องหรือชื่อคนในรูปเพิ่ม
// ไฟล์รูปทำด้วย tools/people_assets.py (ทิ้ง EXIF) · w/h ต้องตรงกับไฟล์จริง เบราว์เซอร์จะกันที่ไว้ก่อนโหลด

export interface PeoplePhoto {
  id: string;
  src: string;
  w: number;
  h: number;
  alt: L10n;
  caption: L10n;
}

export const PEOPLE = {
  title: { en: "Connecting with people", th: "ผู้คนที่ได้เจอ" },
  intro: {
    en: "The work above happened with these people around.",
    th: "งานข้างบนทั้งหมดเกิดขึ้นโดยมีคนเหล่านี้อยู่รอบตัว",
  },
  photos: [
    {
      id: "yzu",
      src: "/people/yzu.webp",
      w: 294,
      h: 392,
      alt: {
        en: "A group selfie in front of the big YZU letters on campus",
        th: "เซลฟี่กลุ่มหน้าตัวอักษร YZU ตัวใหญ่ในมหาวิทยาลัย",
      },
      caption: { en: "Yuan Ze University, Taiwan — internship, 2025", th: "มหาวิทยาลัย Yuan Ze ไต้หวัน — ช่วงฝึกงาน 2025" },
    },
    {
      id: "presentation",
      src: "/people/presentation.webp",
      w: 406,
      h: 487,
      alt: {
        en: "Two interns standing in front of a KMUTT & YZU internship presentation slide",
        th: "นักศึกษาฝึกงานสองคนยืนหน้าสไลด์นำเสนองานฝึกงาน KMUTT & YZU",
      },
      caption: { en: "KMUTT × YZU internship presentation", th: "นำเสนองานฝึกงาน KMUTT × YZU" },
    },
    {
      id: "dinner",
      src: "/people/dinner.webp",
      w: 406,
      h: 540,
      alt: {
        en: "A selfie at a round dinner table full of people and dishes",
        th: "เซลฟี่ที่โต๊ะกลมเต็มไปด้วยคนและอาหาร",
      },
      caption: { en: "Dinner with everyone in Taiwan, 2025", th: "มื้อเย็นกับทุกคนที่ไต้หวัน 2025" },
    },
    {
      id: "concert",
      src: "/people/concert.webp",
      w: 406,
      h: 487,
      alt: {
        en: "A singer on a stage lit in pink and blue",
        th: "นักร้องบนเวทีที่เปิดไฟสีชมพูกับฟ้า",
      },
      caption: { en: "A concert with friends, 2026", th: "ไปคอนเสิร์ตกับเพื่อน ๆ 2026" },
    },
  ] satisfies PeoplePhoto[],
  /** บรรทัดนำก่อนการ์ด TheOzzy (เจ้าของเว็บขอคำนี้) */
  next: { en: "My favourite streamer", th: "สตรีมเมอร์คนโปรดของผม" },
  /** คลิปสั้นของเขาที่เจ้าของเว็บเลือกเป็นไฮไลต์ — โหลดตัวเล่น YouTube ตอนกดเท่านั้น
   *  ชื่อคลิป/ช่องตรวจกับ YouTube oEmbed แล้ว (ช่อง @TheOzzy213) */
  fav: {
    videoId: "byii5bL3ogc",
    title: "ผมไม่ใช่หุ่นยนต์ครับ Pt.1 - I'm not a Robot",
    play: { en: "Play his Short", th: "เปิดดูคลิปสั้นของเขา" },
  },
  /** ปุ่มปิดกล่องดูรูปขยาย */
  close: { en: "Close photo", th: "ปิดรูป" },
};

// ── พิพิธภัณฑ์ YOLO (ในหน้าต่าง 03 /stack) ─────────────────────
//
// YOLO คือเครื่องมือที่เจ้าของเว็บใช้ส่งงานจริงมากที่สุด (ตรวจชิป · lane change · รูปโปรไฟล์หน้าแรก)
// เลยมีนิทรรศการเล็ก ๆ ห้าชิ้นต่อท้ายรายการเครื่องมือ — "อธิบายได้" สำคัญพอ ๆ กับ "ใช้เป็น"
// ตัวนิทรรศการอยู่ใน components/home/museum/
//
// เรื่องความตรงไปตรงมา (ทั้งเว็บยึดข้อนี้):
//   นิทรรศการ 01 ใช้กล่องที่ yolo11n รันไว้ล่วงหน้าบนรูปผม (DETECTOR.fallback) — เขียนบอกไว้
//   นิทรรศการ 02 ใช้กล่องสมมติ — เขียนบอกว่าเป็นภาพประกอบ
//   นิทรรศการ 04 เป็นผลสดจากโมเดลในเบราว์เซอร์ผู้ชม — เขียนบอกว่าไม่ใช่ภาพเคลื่อนไหว
//   ไทม์ไลน์ใส่แค่ปี ชื่อรุ่น ผู้ทำ และหนึ่งบรรทัด ตรวจกับ Wikipedia "You Only Look Once"
//   และเอกสาร Ultralytics เมื่อ ต.ค. 2026 — แหล่งที่มาลิงก์ไว้ท้ายไทม์ไลน์

export interface YoloEra {
  year: number;
  name: string;
  by: string;
  line: L10n;
  /** รุ่นที่รันอยู่บนเว็บนี้ (yolo11n) */
  here?: boolean;
}

export const YOLO_MUSEUM = {
  title: { en: "A small YOLO museum", th: "พิพิธภัณฑ์ YOLO ขนาดเล็ก" },
  intro: {
    en: "YOLO is the tool I've shipped with most. Five exhibits on how it sees — everything moves when you touch it.",
    th: "YOLO คือเครื่องมือที่ผมใช้ส่งงานจริงมากที่สุด นี่คือห้านิทรรศการว่ามันมองเห็นยังไง — ทุกชิ้นขยับได้",
  },

  grid: {
    n: "01",
    title: { en: "Look once — the grid", th: "มองครั้งเดียว — ตาราง" },
    body: {
      en: "YOLOv1 split the image into an S×S grid. The cell holding the centre of an object is responsible for predicting its box — the whole image in one pass, no sliding window.",
      th: "YOLOv1 แบ่งภาพเป็นตาราง S×S ช่องที่จุดกึ่งกลางของวัตถุตกอยู่คือช่องที่ต้องทายกล่องของวัตถุนั้น — ดูทั้งภาพในรอบเดียว ไม่ต้องเลื่อนกรอบไล่ดูทีละจุด",
    },
    slider: { en: "grid size", th: "ขนาดตาราง" },
    cell: { en: "responsible cell", th: "ช่องที่รับผิดชอบ" },
    note: {
      en: "The person box is yolo11n's output on this photo, saved earlier.",
      th: "กล่องคนคือผลของ yolo11n บนรูปนี้ที่บันทึกไว้ก่อนหน้า",
    },
  },

  iou: {
    n: "02",
    title: { en: "IoU — how much two boxes agree", th: "IoU — สองกล่องตรงกันแค่ไหน" },
    body: {
      en: "Intersection over union: the overlap divided by everything both boxes cover. 1 is a perfect match, 0 is no overlap. This site treats a box as a duplicate when its IoU with a stronger box of the same class passes 0.45.",
      th: "Intersection over union: พื้นที่ที่ทับกัน หารด้วยพื้นที่ทั้งหมดที่สองกล่องครอบ ได้ 1 คือทับกันพอดี 0 คือไม่ทับเลย เว็บนี้นับว่าเป็นกล่องซ้ำเมื่อ IoU กับกล่องคลาสเดียวกันที่คะแนนสูงกว่าเกิน 0.45",
    },
    move: { en: "move", th: "เลื่อน" },
    size: { en: "size", th: "ขนาด" },
    truth: { en: "ground truth", th: "กล่องเฉลย" },
    pred: { en: "prediction", th: "กล่องที่ทาย" },
    dup: { en: "a duplicate — NMS would drop the weaker one", th: "กล่องซ้ำ — NMS จะทิ้งกล่องที่อ่อนกว่า" },
    keep: { en: "different enough — both would stay", th: "ต่างกันพอ — เก็บไว้ทั้งคู่" },
    note: { en: "Illustration — made-up boxes.", th: "ภาพประกอบ — กล่องสมมติ" },
  },

  letterbox: {
    n: "03",
    title: { en: "Letterbox — any photo into 640×640", th: "Letterbox — ยัดรูปขนาดไหนก็ได้ลงช่อง 640×640" },
    body: {
      en: "The model only takes a 640×640 square. Stretching a photo would squash the people in it, so the photo is scaled to fit and the gaps are filled with grey 114 — the same grey the model was trained with.",
      th: "โมเดลรับได้แค่จัตุรัส 640×640 ถ้ายืดรูปให้เต็ม คนในรูปจะผิดสัดส่วน เลยย่อรูปให้พอดีแล้วเติมช่องว่างด้วยสีเทา 114 — สีเดียวกับตอนเทรนโมเดล",
    },
    slider: { en: "photo shape", th: "สัดส่วนรูป" },
    scale: { en: "scale", th: "ย่อ" },
    padding: { en: "grey padding", th: "ขอบสีเทา" },
    each: { en: "each side", th: "ข้างละ" },
  },

  live: {
    n: "04",
    title: { en: "Live — confidence and NMS", th: "สด — ความมั่นใจกับ NMS" },
    body: {
      en: "yolo11n looks at 8,400 places at once and scores every one. A confidence threshold drops the weak guesses; non-max suppression keeps the best box per object and deletes its near-duplicates.",
      th: "yolo11n ดู 8,400 ตำแหน่งพร้อมกันแล้วให้คะแนนทุกตำแหน่ง เกณฑ์ความมั่นใจตัดตัวที่เดาไม่มั่นใจทิ้ง แล้ว non-max suppression เก็บกล่องที่ดีที่สุดของแต่ละวัตถุ ลบกล่องซ้ำที่เกือบเหมือนกันออก",
    },
    run: { en: "Run yolo11n on my photo", th: "รัน yolo11n บนรูปผม" },
    loading: { en: "loading the model (10 MB, once)…", th: "กำลังโหลดโมเดล (10 MB ครั้งเดียว)…" },
    conf: { en: "confidence ≥", th: "ความมั่นใจ ≥" },
    nms: { en: "NMS IoU >", th: "NMS IoU >" },
    raw: { en: "candidates", th: "กล่องดิบ" },
    kept: { en: "pass the threshold", th: "ผ่านเกณฑ์" },
    final: { en: "after NMS", th: "หลัง NMS" },
    failed: {
      en: "The model couldn't load (slow connection or blocked CDN). Try again in a moment.",
      th: "โหลดโมเดลไม่ได้ (เน็ตช้าหรือ CDN ถูกบล็อก) ลองใหม่อีกสักครู่",
    },
    note: {
      en: "Real output from the model in your browser — not an animation. Faint boxes passed the threshold but lost to NMS.",
      th: "ผลจริงจากโมเดลในเบราว์เซอร์คุณ ไม่ใช่ภาพเคลื่อนไหว กล่องจาง ๆ คือตัวที่ผ่านเกณฑ์แต่แพ้ NMS",
    },
  },

  history: {
    n: "05",
    title: { en: "Ten years of YOLO", th: "สิบปีของ YOLO" },
    body: {
      en: "From a 2015 paper to the model running on this page — every version since, in one line each.",
      th: "จากเปเปอร์ปี 2015 จนถึงโมเดลที่รันอยู่บนหน้านี้ — ทุกรุ่นหลังจากนั้น รุ่นละหนึ่งบรรทัด",
    },
    here: { en: "running on this site", th: "ตัวที่รันบนเว็บนี้" },
    sources: { en: "Sources", th: "แหล่งที่มา" },
  },

  timeline: [
    { year: 2015, name: "YOLOv1", by: "Redmon, Divvala, Girshick, Farhadi", line: { en: "One pass over an S×S grid.", th: "ดูภาพรอบเดียวผ่านตาราง S×S" } },
    { year: 2016, name: "YOLOv2 / YOLO9000", by: "Redmon, Farhadi", line: { en: "Anchor boxes and batch norm.", th: "เพิ่ม anchor box กับ batch norm" } },
    { year: 2018, name: "YOLOv3", by: "Redmon, Farhadi", line: { en: "The last version by the original authors.", th: "รุ่นสุดท้ายจากผู้สร้างดั้งเดิม" } },
    { year: 2020, name: "YOLOv4", by: "Bochkovskiy, Wang, Liao", line: { en: "CSP backbone and a bag of training tricks.", th: "backbone แบบ CSP กับเทคนิคการเทรนอีกเพียบ" } },
    { year: 2020, name: "YOLOv5", by: "Ultralytics", line: { en: "PyTorch, and easy enough to train that everyone did.", th: "เขียนด้วย PyTorch เทรนง่ายจนใคร ๆ ก็เทรน" } },
    { year: 2022, name: "YOLOv6", by: "Meituan (Li et al.)", line: { en: "Built for industrial deployment.", th: "ออกแบบมาเพื่อใช้งานในอุตสาหกรรม" } },
    { year: 2022, name: "YOLOv7", by: "Wang, Bochkovskiy, Liao", line: { en: "E-ELAN and re-parameterisation.", th: "E-ELAN กับการ re-parameterize" } },
    { year: 2023, name: "YOLOv8", by: "Ultralytics", line: { en: "Detection, segmentation and pose in one toolkit.", th: "ตรวจจับ แบ่งส่วน และท่าทาง ในชุดเครื่องมือเดียว" } },
    { year: 2024, name: "YOLOv9", by: "Wang, Liao (Academia Sinica)", line: { en: "Programmable gradient information (PGI) and GELAN.", th: "PGI กับ GELAN" } },
    { year: 2024, name: "YOLOv10", by: "Tsinghua University", line: { en: "Trained so it doesn't need NMS at inference.", th: "เทรนให้ไม่ต้องใช้ NMS ตอนใช้งาน" } },
    { year: 2024, name: "YOLO11", by: "Ultralytics", line: { en: "The nano version is the model on this page.", th: "รุ่นนาโนคือโมเดลบนหน้านี้" }, here: true },
    { year: 2025, name: "YOLOv12", by: "Tian et al.", line: { en: "Attention-centric design.", th: "ออกแบบโดยมี attention เป็นแกน" } },
    { year: 2026, name: "YOLO26", by: "Ultralytics", line: { en: "End-to-end; NMS becomes optional.", th: "end-to-end ไม่ต้องพึ่ง NMS ก็ได้" } },
  ] satisfies YoloEra[],

  sources: [
    { href: "https://en.wikipedia.org/wiki/You_Only_Look_Once", label: { en: "Wikipedia — You Only Look Once", th: "Wikipedia — You Only Look Once" } },
    { href: "https://docs.ultralytics.com/models/", label: { en: "Ultralytics docs — models", th: "เอกสาร Ultralytics — โมเดล" } },
  ],
};

// ── ตอนนี้: โปรเจกต์ใหม่ + ชวนทำแบบสอบถาม (บนสุดของหน้าต่าง 01 ผลงาน) ──
//
// โปรเจกต์ยังไม่มีชื่อ — เจ้าของเว็บเรียกว่า "untitled Gen Z traditional medicine project"
// ยังไม่มีผลลัพธ์หรือตัวเลข เลยไม่ทำเป็นการ์ดโปรเจกต์แบบ Problem/Approach/Result และไม่นับรวมในจำนวนโปรเจกต์บนตู้
//
// คำอธิบายเขียนจากหัวข้อของแบบฟอร์มเอง ("มุมมอง Gen Z กับแพทย์แผนไทยและสมุนไพร") ไม่แต่งเพิ่ม
// ลิงก์ใช้ forms.gle ของ Google ตรง ๆ — QR ที่เจ้าของเว็บมีวิ่งผ่าน qrfy.io (บริการ QR แบบเปลี่ยนปลายทางได้)
// ถ้าบริการนั้นหมดอายุ QR จะตาย แต่ลิงก์บนเว็บจะยังใช้ได้
// บรรทัด note บอกตรง ๆ ว่าฟอร์มขออีเมล — คนตอบควรรู้ก่อนกด

export const NOW = {
  eyebrow: { en: "Now · new project", th: "ตอนนี้ · โปรเจกต์ใหม่" },
  title: { en: "Untitled Gen Z traditional medicine project", th: "โปรเจกต์ Gen Z × แพทย์แผนไทย (ยังไม่มีชื่อ)" },
  body: {
    en: "I'm asking young people — mostly Gen Z — how they see Thai traditional medicine and herbs, and what gets in the way of using them. If that's you, I'd love your answers.",
    th: "ผมกำลังถามคนรุ่นใหม่ ส่วนใหญ่ Gen Z ว่ามองแพทย์แผนไทยกับสมุนไพรยังไง และอะไรที่ทำให้ไม่อยากใช้ ถ้าคุณเป็นหนึ่งในนั้น อยากได้คำตอบของคุณมากครับ",
  },
  cta: { en: "Take the survey", th: "ทำแบบสอบถาม" },
  note: {
    en: "Google Form · about 9 questions · it asks for your email",
    th: "Google Form · ราว 9 ข้อ · ฟอร์มขออีเมลด้วย",
  },
  href: "https://forms.gle/GAQ4ktK4FnbCnivc9",
};
