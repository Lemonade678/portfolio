"use client";

// ── ทาแป้ง ── (เดิมอยู่หน้า teaser /next)
//
// วงล้อหมุนได้ช่อง "ทาแป้ง" หรือซื้อ "ทาแป้งตัวเอง" ในร้าน → ทั้งเว็บโดนแป้งเด็กโปะ
// (มุกลงโทษยอดฮิตของสตรีมเมอร์ไทย)
//
// ทำงานสองชั้น:
//   1. <main> ของ shell โดน filter ให้สีซีด (คลาส oz-powdered)
//   2. แผ่นแป้ง (oz-powder) ลอยทับทั้งจอ — ต้องอยู่ "นอก" <main> เพราะ filter ของ main
//      ทำให้ position: fixed ไปยึดกับ main แทนหน้าจอ แผ่นแป้งจะยืดยาวตามความสูงทั้งหน้า
// แผ่นแป้ง pointer-events: none — โดนแป้งแล้วยังกดทุกอย่างได้ ไม่ได้ล็อกหน้าจอ
// ปุ่มล้างหน้าอยู่เหนือแผ่นแป้ง (z สูงกว่า) จะได้ไม่โดนแป้งไปด้วย

import { useState } from "react";
import type { Lang } from "@/lib/content";
import { OZZY } from "@/lib/ozzy/content";
import { reducedMotion, t } from "./ui";

/** ต้องตรงกับ animation ของ .oz-washing ใน globals.css (0.45s) */
const WASH_MS = 450;

export default function Powder({ lang, times, onWash }: { lang: Lang; times: number; onWash: () => void }) {
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
          🧼 {t(OZZY.wheel.wash, lang)}
          <span className="ml-2 opacity-70">
            · {t(OZZY.table.powdered, lang)} ×{times}
          </span>
        </button>
      </div>
    </div>
  );
}
