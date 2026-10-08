"use client";

// ─────────────────────────────────────────────────────────────
// ข้อความที่มีตัวอักษรลับของ LEMONADE ซ่อนอยู่ข้างใน (ตำแหน่งดูที่ lib/secret.ts)
//
// ตัวอักษรลับเป็น <span> ธรรมดา ไม่ใช่ <button> — ตั้งใจ:
//   - ไม่มี role/tabIndex → Tab ไม่ไปหยุด screen reader อ่านคำเต็มตามปกติ ("LLM" ไม่กลายเป็น "ปุ่ม L, LM")
//   - หน้าตาเหมือนตัวหนังสือรอบข้างทุกอย่าง จุดสังเกตเดียวคือเคอร์เซอร์รูปมือ (ดู .secret-char ใน globals.css)
//
// ถ้าข้อความถูกแก้จนหาคำไม่เจอ splitSecret จะ throw — ที่นี่จับไว้แล้วแสดงข้อความเฉย ๆ
// หน้าเว็บไม่พัง (ไข่แค่หายไป) ส่วนเทสต์ใน tests/home/secret.test.ts จะแดงบอกก่อนอยู่แล้ว
// ─────────────────────────────────────────────────────────────

import { useSecret } from "@/components/SecretCode";
import { SECRET_SPOTS, splitSecret, type SecretPlace, type Segment } from "@/lib/secret";

export default function SecretText({ text, place }: { text: string; place: SecretPlace }) {
  const secret = useSecret();
  if (!secret) return <>{text}</>;

  let segs: Segment[];
  try {
    segs = splitSecret(text, SECRET_SPOTS[place]);
  } catch {
    return <>{text}</>;
  }

  return (
    <>
      {segs.map((s, i) =>
        typeof s === "string" ? (
          s
        ) : (
          <span
            key={i}
            className="secret-char"
            data-lit={s.index < secret.progress || undefined}
            onClick={(e) => {
              // อยู่ในลิงก์หรือการ์ดที่กดได้เมื่อไหร่ ก็ไม่ให้คลิกนี้ไหลไปเปิดอย่างอื่น
              e.preventDefault();
              e.stopPropagation();
              secret.press(s.index);
            }}
          >
            {s.ch}
          </span>
        ),
      )}
    </>
  );
}
