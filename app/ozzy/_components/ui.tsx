// ชิ้นส่วนเล็ก ๆ ที่ทุกส่วนของเว็บ TheOzzy ใช้ร่วมกัน
// (โฟลเดอร์ _components ขึ้นต้นด้วยขีดล่าง = Next.js ไม่เอาไปทำเป็น route)

import type { L10n, Lang } from "@/lib/content";

/** หยิบข้อความตามภาษาที่เลือกอยู่ */
export const t = (s: L10n, lang: Lang) => s[lang];

/**
 * คนที่ตั้งค่า "ลดการเคลื่อนไหว" ไว้ — ข้ามการรอ animation ฝั่ง JS ทั้งหมด ผลออกทันที
 * (CSS ตัดความยาว animation ให้แล้วใน globals.css แต่ setTimeout ยังรออยู่ถ้าไม่เช็กตรงนี้)
 */
export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** ตัวเลขแบบมีคอมม่า ตามภาษา */
export const num = (n: number, lang: Lang) => n.toLocaleString(lang === "th" ? "th-TH" : "en-US");

/**
 * ไอคอนแต้ม ☘ — โคลเวอร์สามใบวาดเอง (ไม่ใช่โลโก้แพลตฟอร์มไหน)
 * สีเขียวอ่อนเลียนหน้า Channel Points ของช่องที่คนดูคุ้นตา
 */
export function Clover({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`inline-block ${className}`} aria-hidden="true" focusable="false">
      <g fill="#7ee08a" stroke="#131014" strokeWidth="1.2">
        <circle cx="10" cy="6" r="4.2" />
        <circle cx="5.6" cy="12.6" r="4.2" />
        <circle cx="14.4" cy="12.6" r="4.2" />
      </g>
    </svg>
  );
}

/** ภาพบนไพ่ — ขึ้นต้นด้วย "/" เป็นรูป นอกนั้นเป็นอีโมจิ */
export function Art({ art, className = "" }: { art: string; className?: string }) {
  if (art.startsWith("/")) {
    return <img src={art} alt="" className={`h-full w-full object-cover ${className}`} />;
  }
  return (
    <span className={`grid h-full w-full place-items-center text-[2.2em] ${className}`} aria-hidden="true">
      {art}
    </span>
  );
}
