// ─────────────────────────────────────────────────────────────
// หน้าหลักแบบ hub — ทะเบียนหน้าต่างและตัวช่วยเรื่องเส้นทาง
//
// แยกเป็นฟังก์ชันล้วน ๆ (ไม่แตะ DOM ไม่แตะ router) เพื่อเทสต์ได้โดยไม่ต้องเปิดเบราว์เซอร์
// ส่วนที่แตะเบราว์เซอร์ (อ่าน location.hash · router.replace) อยู่ใน components/home/HomeShell.tsx
// ─────────────────────────────────────────────────────────────

import {
  CREDENTIALS,
  HOME,
  PROJECTS,
  SOFT_SKILLS,
  STACK,
  TIMELINE,
  type Lang,
  type WindowId,
} from "@/lib/content";

export type { WindowId };

/** ลำดับชั้นในตู้ = ลำดับหน้าต่าง = ลำดับปุ่มก่อนหน้า/ถัดไป */
export const HOME_WINDOWS = ["work", "proof", "stack", "soft", "path", "passions"] as const satisfies readonly WindowId[];

const isWindow = (s: string): s is WindowId => (HOME_WINDOWS as readonly string[]).includes(s);

/**
 * ลิงก์เก่าของหน้ายาว (เช่น /#proof ที่เคยแชร์ไป หรือใน portfolio-preview.html) → หน้าต่างที่ตรงกัน
 * #contact ไม่ใช่หน้าต่าง (ข้อความปิดท้ายยังอยู่บนหน้า hub) เลยคืน null ให้เบราว์เซอร์เลื่อนไปเองตามปกติ
 */
export function windowFromHash(hash: string): WindowId | null {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  return isWindow(id) ? id : null;
}

/** หน้าต่างก่อนหน้า/ถัดไป — อ่านต่อกันได้ทั้งเว็บโดยไม่ต้องกลับไปที่ตู้ */
export function neighbours(id: WindowId): { prev: WindowId | null; next: WindowId | null } {
  const i = HOME_WINDOWS.indexOf(id);
  return {
    prev: i > 0 ? HOME_WINDOWS[i - 1] : null,
    next: i < HOME_WINDOWS.length - 1 ? HOME_WINDOWS[i + 1] : null,
  };
}

/** ตัวเลขบนแต่ละชั้น — นับจากข้อมูลจริง เพิ่มโปรเจกต์เมื่อไหร่ เลขบนชั้นขยับตามเอง */
export function counts(): Record<WindowId, number> {
  return {
    work: PROJECTS.length,
    proof: CREDENTIALS.length,
    stack: STACK.core.items.length + STACK.shipped.items.length + STACK.learning.items.length,
    soft: SOFT_SKILLS.length,
    path: TIMELINE.length,
    passions: HOME.passions.cards.length,
  };
}

/** แนบ ?lang=th ให้ลิงก์ภายใน — ภาษาอยู่ใน URL จะได้แชร์ลิงก์หน้าต่างไหนก็เปิดมาเป็นภาษาเดิม */
export const withLang = (path: string, lang: Lang) => (lang === "th" ? `${path}?lang=th` : path);
