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
      en: "I'm French — or you can call me Lemon, which is where the GitHub handle comes from. Both are nicknames. I'm 23, a B.Eng. graduate in Electronics and Infocommunication Engineering from King Mongkut's University of Technology Thonburi (KMUTT), building AI systems that have to run in a real workplace: chip anomaly detection on a production line, lane change detection from road video, and a Thai interview LLM I fine-tuned myself.",
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
      ratio: "1400 / 704",
      alt: {
        en: "Official TOEIC institutional score report: Listening 480, Reading 405, total 885, CEFR level B2, tested 12 June 2026 at King Mongkut's University of Technology Thonburi. Name, date of birth, ID number, reference number and barcode are blacked out.",
        th: "ใบรายงานคะแนน TOEIC อย่างเป็นทางการ: Listening 480, Reading 405, รวม 885, CEFR ระดับ B2, สอบวันที่ 12 มิถุนายน 2026 ที่ มจธ. โดยปิดชื่อ วันเกิด เลขประจำตัวประชาชน เลขอ้างอิง และบาร์โค้ดไว้",
      },
    },
    verifies: {
      en: "<strong>Listening 480 + Reading 405 = 885, CEFR B2.</strong> Valid for two years from the test date, so through June 2028. The blacked-out fields are name, date of birth, national ID number, the report's reference number and the barcode — solid bars rather than blur, because a 13-digit number in a fixed-width font can be read back out of a blur. The script that did it is in the repo at <code>tools/censor.py</code>.",
      th: "<strong>Listening 480 + Reading 405 = 885 · CEFR B2</strong> ใบมีอายุสองปีนับจากวันสอบ คือถึงมิถุนายน 2028 · ส่วนที่ปิดคือชื่อ วันเกิด เลขบัตรประชาชน เลขอ้างอิงใบ และบาร์โค้ด — ใช้แถบทึบไม่ใช่เบลอ เพราะเลข 13 หลักที่พิมพ์ด้วยฟอนต์ความกว้างเท่ากันทุกตัว ยังอ่านย้อนกลับออกจากภาพเบลอได้ · สคริปต์ที่ใช้ปิดอยู่ใน repo ที่ <code>tools/censor.py</code>",
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
      en: "B.Eng. Electronics & Infocommunication · GPA 3.22",
      th: "วศ.บ. อิเล็กทรอนิกส์และสื่อสารสารสนเทศ · เกรดเฉลี่ย 3.22",
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
