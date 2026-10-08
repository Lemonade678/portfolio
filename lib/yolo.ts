// ─────────────────────────────────────────────────────────────
// โค้ดรัน YOLOv11 ในเบราว์เซอร์ — ใช้ร่วมกันสามที่:
//   รูปโปรไฟล์หน้าแรก (components/PhotoDetect.tsx)
//   ห้องทดลองขนมในหน้า playground (components/YoloLab.tsx)
//   นิทรรศการสดในพิพิธภัณฑ์ YOLO (components/home/museum/LiveExhibit.tsx)
// ย้ายมาจาก PhotoDetect.tsx ตามตัวอักษร (พฤติกรรมเดิม) แล้วแยกส่วนคำนวณล้วนออกมาให้เทสต์ได้
//
// ทำไมโหลด onnxruntime-web จาก CDN ด้วย <script> แทน npm:
//   ไม่ต้องแตะ bundler เรื่องไฟล์ .wasm เลย และโหลดเฉพาะตอนมีคนกดรันจริง
// session เก็บไว้ที่ module scope — ทั้งสามที่ใช้โมเดลก้อนเดียวกัน กดที่ไหนก่อนก็โหลดครั้งเดียว
// ─────────────────────────────────────────────────────────────

import { DETECTOR } from "@/lib/content";

/** กล่องเก็บเป็นสัดส่วน 0..1 ของรูปจริง [x1, y1, x2, y2] — ไม่ผูกกับขนาดจอ */
export type Box = [number, number, number, number];
export interface Det {
  label: string;
  score: number;
  box: Box;
}
/** ข้อมูลที่ต้องใช้ถอดพิกัดกลับหลัง letterbox */
export interface LetterboxMeta {
  scale: number;
  dx: number;
  dy: number;
  iw: number;
  ih: number;
}

// COCO 80 คลาส เรียงตาม index ที่ YOLO คืนมา — ลำดับต้องตรงเป๊ะ ห้ามสลับ
export const COCO = [
  "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck",
  "boat", "traffic light", "fire hydrant", "stop sign", "parking meter", "bench",
  "bird", "cat", "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra",
  "giraffe", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee",
  "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove",
  "skateboard", "surfboard", "tennis racket", "bottle", "wine glass", "cup",
  "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange",
  "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair", "couch",
  "potted plant", "bed", "dining table", "toilet", "tv", "laptop", "mouse",
  "remote", "keyboard", "cell phone", "microwave", "oven", "toaster", "sink",
  "refrigerator", "book", "clock", "vase", "scissors", "teddy bear",
  "hair drier", "toothbrush",
];

// ── โหลด onnxruntime-web + โมเดล ─────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    ort?: any;
  }
}

let ortPromise: Promise<any> | null = null;
let sessionPromise: Promise<any> | null = null;

export function loadOrt(): Promise<any> {
  if (window.ort) return Promise.resolve(window.ort);
  if (ortPromise) return ortPromise;

  ortPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `${DETECTOR.ortCdn}ort.min.js`;
    s.async = true;
    s.onload = () => {
      const ort = window.ort;
      if (!ort) {
        reject(new Error("ort missing after load"));
        return;
      }
      // ชี้ที่อยู่ไฟล์ .wasm ไป CDN เดียวกัน ไม่ต้องก๊อปไฟล์เข้ามาใน public/
      ort.env.wasm.wasmPaths = DETECTOR.ortCdn;
      // บังคับ 1 thread: multi-thread ต้องใช้ SharedArrayBuffer ซึ่งต้องตั้ง header
      // COOP/COEP ทั้งเว็บ ไม่คุ้มกับของเล่นชิ้นเดียว
      ort.env.wasm.numThreads = 1;
      resolve(ort);
    };
    s.onerror = () => {
      // ล้างไว้ให้ลองใหม่ได้ (เน็ตหลุดครั้งเดียวไม่ควรพังไปตลอดทั้ง session)
      ortPromise = null;
      reject(new Error("failed to load onnxruntime-web"));
    };
    document.head.appendChild(s);
  });
  return ortPromise;
}

export function getSession(): Promise<any> {
  if (sessionPromise) return sessionPromise;
  sessionPromise = loadOrt()
    .then((ort) =>
      ort.InferenceSession.create(DETECTOR.modelUrl, {
        executionProviders: ["wasm"],
        graphOptimizationLevel: "all",
      }),
    )
    .catch((e) => {
      sessionPromise = null;
      throw e;
    });
  return sessionPromise;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ── pre-processing ───────────────────────────────────────────

/**
 * เรขาคณิตของ letterbox: ย่อรูปให้พอดีจัตุรัส size×size โดยคงสัดส่วน แล้ววางกลาง
 * (ด้านที่เหลือเติมสีเทาตอนวาดจริง) — แยกเป็นฟังก์ชันล้วนเพื่อเทสต์ และให้นิทรรศการ letterbox ใช้เลขชุดเดียวกัน
 */
export function letterboxGeometry(iw: number, ih: number, size: number) {
  const scale = Math.min(size / iw, size / ih);
  const dw = Math.round(iw * scale);
  const dh = Math.round(ih * scale);
  const dx = Math.floor((size - dw) / 2);
  const dy = Math.floor((size - dh) / 2);
  return { scale, dw, dh, dx, dy };
}

/** ขนาดจริงของรูป — <img> ใช้ naturalWidth (ขนาดไฟล์) ไม่ใช่ขนาดที่โชว์บนจอ */
function sizeOf(src: HTMLImageElement | HTMLCanvasElement | ImageBitmap) {
  if (src instanceof HTMLImageElement) return [src.naturalWidth, src.naturalHeight] as const;
  return [src.width, src.height] as const;
}

/**
 * letterbox: ย่อรูปให้พอดี 640×640 โดยคงสัดส่วนเดิม แล้วเติมสีเทาตรงขอบ
 * ถ้ายืดรูปให้เต็มจัตุรัสเฉย ๆ คนในรูปจะผิดสัดส่วนแล้ว accuracy ตก
 * คืน scale/dx/dy กลับไปด้วย เพราะต้องใช้ถอดพิกัดกลับตอน postprocess
 */
export function letterbox(img: HTMLImageElement | HTMLCanvasElement | ImageBitmap, size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "rgb(114,114,114)"; // ค่าเดียวกับที่ ultralytics ใช้ตอนเทรน
  ctx.fillRect(0, 0, size, size);

  const [iw, ih] = sizeOf(img);
  const { scale, dw, dh, dx, dy } = letterboxGeometry(iw, ih, size);
  ctx.drawImage(img, dx, dy, dw, dh);

  const { data } = ctx.getImageData(0, 0, size, size);
  // จัดเป็น NCHW + ตัด alpha ทิ้ง + หาร 255 ตามที่โมเดลคาดหวัง
  const input = new Float32Array(3 * size * size);
  const plane = size * size;
  for (let i = 0; i < plane; i++) {
    input[i] = data[i * 4] / 255;
    input[plane + i] = data[i * 4 + 1] / 255;
    input[plane * 2 + i] = data[i * 4 + 2] / 255;
  }
  const meta: LetterboxMeta = { scale, dx, dy, iw, ih };
  return { input, ...meta };
}

// ── post-processing ──────────────────────────────────────────

export function iou(a: Box, b: Box) {
  const x1 = Math.max(a[0], b[0]);
  const y1 = Math.max(a[1], b[1]);
  const x2 = Math.min(a[2], b[2]);
  const y2 = Math.min(a[3], b[3]);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  if (inter <= 0) return 0;
  const areaA = (a[2] - a[0]) * (a[3] - a[1]);
  const areaB = (b[2] - b[0]) * (b[3] - b[1]);
  return inter / (areaA + areaB - inter);
}

/** NMS แยกตามคลาส — โทรศัพท์ที่ทับอยู่บนตัวคนไม่ควรถูกตัดทิ้งเพราะซ้อนกับคน */
export function nms(dets: Det[], thr: number) {
  const kept: Det[] = [];
  for (const d of [...dets].sort((a, b) => b.score - a.score)) {
    if (kept.some((k) => k.label === d.label && iou(k.box, d.box) > thr)) continue;
    kept.push(d);
  }
  return kept;
}

/**
 * ถอดผลดิบ "ก่อน NMS" — ทุกตำแหน่งที่คะแนนคลาสสูงสุดถึง floor
 *
 * เอาต์พุตของ YOLOv11 เป็น tensor รูปทรง [1, 84, 8400]
 *   แถว 0-3  = cx, cy, w, h (พิกัดในสเกล 640 หลัง letterbox)
 *   แถว 4-83 = คะแนนของ 80 คลาส (v11 ไม่มี objectness แยกเหมือน v5)
 * ข้อมูลเรียงแบบ channel-major อ่านด้วย data[c * N + i]
 *
 * แยกออกจาก decode() เพราะพิพิธภัณฑ์อยากโชว์ "ก่อน NMS" ให้เห็นกับตาว่ากล่องซ้อนกันเยอะแค่ไหน
 */
export function decodeRaw(
  data: Float32Array,
  dims: readonly number[],
  meta: LetterboxMeta,
  floor: number,
  classNames: readonly string[] = COCO,
): Det[] {
  const ch = dims[1];
  const n = dims[2];
  const out: Det[] = [];

  for (let i = 0; i < n; i++) {
    let bestScore = 0;
    let bestCls = -1;
    for (let c = 4; c < ch; c++) {
      const s = data[c * n + i];
      if (s > bestScore) {
        bestScore = s;
        bestCls = c - 4;
      }
    }
    if (bestScore < floor || bestCls < 0) continue;

    const cx = data[i];
    const cy = data[n + i];
    const w = data[2 * n + i];
    const h = data[3 * n + i];

    // ถอด letterbox: ลบ padding ก่อน แล้วหารสเกล → ได้พิกัดบนรูปจริง
    // จากนั้นหารด้วยขนาดรูป → เก็บเป็นสัดส่วน 0..1 เอาไปวางกล่องด้วย % ได้เลย
    const x1 = (cx - w / 2 - meta.dx) / meta.scale / meta.iw;
    const y1 = (cy - h / 2 - meta.dy) / meta.scale / meta.ih;
    const x2 = (cx + w / 2 - meta.dx) / meta.scale / meta.iw;
    const y2 = (cy + h / 2 - meta.dy) / meta.scale / meta.ih;

    out.push({
      label: classNames[bestCls] ?? `class ${bestCls}`,
      score: bestScore,
      box: [Math.max(0, x1), Math.max(0, y1), Math.min(1, x2), Math.min(1, y2)],
    });
  }
  return out;
}

/** ผลที่ใช้แสดงจริง = ผลดิบที่ผ่านเกณฑ์ความมั่นใจ แล้วผ่าน NMS */
export function decode(
  data: Float32Array,
  dims: readonly number[],
  meta: LetterboxMeta,
  conf: number,
  iouThr: number,
  classNames: readonly string[] = COCO,
): Det[] {
  return nms(decodeRaw(data, dims, meta, conf, classNames), iouThr);
}
