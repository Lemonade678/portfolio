// ─────────────────────────────────────────────────────────────
// ข้อมูลที่หน้า /ozzy จำไว้ในเบราว์เซอร์ของคนเล่น (localStorage)
//
// เก็บแค่ของที่ "ควรอยู่ข้ามวัน": แต้มในกระเป๋า สถิติ จำนวนครั้งที่โดนแป้ง ป้าย VIP
// ไม่เก็บรันที่ยังเล่นไม่จบกับรีลิค — รีโหลดแล้วเริ่มรันใหม่ ตามแบบ roguelike
//
// ข้อมูลใน localStorage เชื่อไม่ได้ (แก้มือได้ เสียได้ เป็นเวอร์ชันเก่าได้) เลยซ่อมทีละช่อง:
// ช่องไหนผิดชนิด/ติดลบ/ไม่จำกัด → ใช้ค่าเริ่มต้นของช่องนั้น แทนที่จะทิ้งทั้งก้อน
// v ไม่ตรง = รูปแบบอื่นที่อ่านไม่เป็น → เริ่มใหม่ทั้งก้อน
//
// ทุกการแตะ localStorage อยู่ใน try/catch — โหมดส่วนตัว/บล็อก storage แล้ว
// เว็บยังเล่นได้ปกติ แค่ปิดแท็บแล้วไม่จำ
// ─────────────────────────────────────────────────────────────

export const SAVE_KEY = "ozzy:save:v1";
/** แจกครั้งแรกที่เข้าเว็บ ให้ลองร้านได้ทันทีโดยไม่ต้องเล่นก่อน */
export const STARTER_POINTS = 200;

export interface Save {
  v: 1;
  points: number;
  runs: number;
  /** แต้มจากห้องที่ดีที่สุดในรันเดียว — แรงก์คำนวณจากตัวนี้ด้วย rankOf */
  bestRunPoints: number;
  powdered: number;
  vip: boolean;
  /** รับแต้มเริ่มต้นไปแล้วหรือยัง */
  welcomed: boolean;
}

export const DEFAULT_SAVE: Save = {
  v: 1,
  points: 0,
  runs: 0,
  bestRunPoints: 0,
  powdered: 0,
  vip: false,
  welcomed: false,
};

/** จำนวนนับต้องเป็นจำนวนเต็ม ≥ 0 ที่จำกัด — นอกนั้นถือว่า 0 */
const count = (x: unknown): number =>
  typeof x === "number" && Number.isFinite(x) && x >= 0 ? Math.floor(x) : 0;

const flag = (x: unknown): boolean => x === true;

export function parseSave(raw: string | null): Save {
  if (raw === null) return DEFAULT_SAVE;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return DEFAULT_SAVE;
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) return DEFAULT_SAVE;
  const d = data as Record<string, unknown>;
  if (d.v !== 1) return DEFAULT_SAVE;
  return {
    v: 1,
    points: count(d.points),
    runs: count(d.runs),
    bestRunPoints: count(d.bestRunPoints),
    powdered: count(d.powdered),
    vip: flag(d.vip),
    welcomed: flag(d.welcomed),
  };
}

/** แต้มเริ่มต้นครั้งแรก — เรียกซ้ำกี่ทีก็ได้ ได้ครั้งเดียวเสมอ */
export function welcome(s: Save): Save {
  return s.welcomed ? s : { ...s, points: s.points + STARTER_POINTS, welcomed: true };
}

export function loadSave(): Save {
  try {
    return parseSave(localStorage.getItem(SAVE_KEY));
  } catch {
    return DEFAULT_SAVE;
  }
}

export function writeSave(s: Save): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
  } catch {
    // เต็ม/โดนบล็อก — ไม่เป็นไร รอบนี้แค่ไม่จำ
  }
}
