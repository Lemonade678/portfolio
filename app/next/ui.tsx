// ชิ้นส่วนเล็ก ๆ ที่ทุกส่วนของหน้า /next ใช้ร่วมกัน

import type { L10n, Lang } from "@/lib/content";

/** หยิบข้อความตามภาษาที่เลือกอยู่ */
export const t = (s: L10n, lang: Lang) => s[lang];

/**
 * คนที่ตั้งค่า "ลดการเคลื่อนไหว" ไว้ในเครื่อง — ข้ามการรอ animation ทั้งหมด ผลออกทันที
 * CSS ใน globals.css ตัดความยาว animation เหลือ ~0 ให้อยู่แล้ว แต่ setTimeout ฝั่ง JS
 * ยังรออยู่ดี ถ้าไม่เช็กตรงนี้ คนกลุ่มนี้จะเห็นหน้าจอนิ่งไป 4 วินาทีโดยไม่รู้ว่าเกิดอะไรขึ้น
 */
export const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * หัวข้อแต่ละส่วน — ใช้คำว่า ACT แบบเกม roguelike ที่แบ่งด่านเป็นองก์
 * (ไม่แปลเป็นไทย ตั้งใจให้เป็นป้ายกราฟิกมากกว่าเป็นข้อความ)
 */
export function SectionTitle({
  id,
  act,
  title,
  note,
}: {
  id: string;
  act: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-(--oz-yellow)">
          {act}
        </span>
        <h2
          id={id}
          className="oz-title text-[clamp(22px,3.6vw,30px)] font-bold tracking-[-0.02em]"
        >
          {title}
        </h2>
        <span className="h-[2px] flex-1 rounded-full bg-(--oz-blue)/25" />
      </div>
      {note && (
        <p className="mt-2 max-w-[62ch] text-[14px] leading-relaxed text-(--oz-sky)">{note}</p>
      )}
    </div>
  );
}
