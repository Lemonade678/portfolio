"use client";

// ── ทาแป้ง ──────────────────────────────────────────────────
//
// วงล้อหมุนได้ช่อง "ทาแป้ง" → ทั้งหน้าเว็บโดนแป้งเด็กโปะ (มุกลงโทษยอดฮิตของสตรีมเมอร์ไทย)
//
// ทำงานสองชั้น:
//   1. <main> ของหน้าโดน filter ให้สีซีด (คลาส oz-powdered — ตั้งที่ page.tsx)
//   2. แผ่นแป้งสีขาว (คลาส oz-powder) ลอยทับทั้งจอ — ฝุ่นแป้งเม็ดเล็กจาก SVG noise
//      กับคราบแป้งก้อนใหญ่จาก radial-gradient
//
// แผ่นแป้งเป็น position: fixed เลยต้องอยู่ "นอก" <main> — ถ้าอยู่ข้างใน filter ของ main
// จะทำให้ fixed กลายเป็นยึดกับ main แทนหน้าจอ แผ่นแป้งจะยืดยาวตามความสูงทั้งหน้า
// และ pointer-events: none — โดนแป้งแล้วยังกดทุกอย่างได้ตามปกติ ไม่ได้ล็อกหน้าจอ
//
// ปุ่มล้างหน้าอยู่เหนือแผ่นแป้ง (z-index สูงกว่า) จะได้ไม่โดนแป้งไปด้วย และกดง่าย

import { useState } from "react";
import { NEXT_RUN as N, type Lang } from "@/lib/content";
import { reducedMotion, t } from "./ui";

/** ต้องตรงกับ animation ของ .oz-washing ใน globals.css (0.45s) */
const WASH_MS = 450;

export default function Powder({
  lang,
  times,
  onWash,
}: {
  lang: Lang;
  times: number;
  onWash: () => void;
}) {
  const [washing, setWashing] = useState(false);

  const wash = () => {
    if (washing) return;
    if (reducedMotion()) {
      onWash();
      return;
    }
    setWashing(true);
    window.setTimeout(onWash, WASH_MS);
  };

  return (
    <div className="oz">
      <div className={`oz-powder ${washing ? "oz-washing" : ""}`} aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-5 z-[70] flex justify-center px-4">
        <button
          type="button"
          onClick={wash}
          className="oz-button rounded-xl px-5 py-3 font-mono text-[13px] font-bold uppercase tracking-[0.12em]"
        >
          🧼 {t(N.wheel.wash, lang)}
          <span className="ml-2 opacity-70">
            · {t(N.wheel.powderedTimes, lang)} ×{times}
          </span>
        </button>
      </div>
    </div>
  );
}
