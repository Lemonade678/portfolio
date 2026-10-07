"use client";

// ── หีบสมบัติบอส: การ์ดทองห้าใบ ── (เดิมอยู่หน้า teaser /next)
//
// โผล่ตอนผ่านดันเจี้ยนเท่านั้น สุ่ม 5 ใบจาก 8 หน้า (ใบไหน ลำดับไหน สุ่มจริง)
// แต่ทุกใบเป็นการ์ดทอง — "ความเฮง" ล็อกไว้ที่ 100% และหน้าเว็บเขียนบอกตรง ๆ ว่าล็อก
// เพราะนี่คือมุก: หีบของคนสายไฮโรลจะดรอปอย่างอื่นได้ยังไง
// เวลาใน JS ต้องตรงกับ CSS (.oz-card-inner 0.55s · .oz-card[data-shaking] 0.32s × 2)

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/content";
import { OZZY } from "@/lib/ozzy/content";
import { Bolt } from "@/components/NextRun";
import { reducedMotion, t } from "./ui";

const HAND = 5;
const SHAKE_MS = 640;
const STAGGER_MS = 110;

/** สุ่ม 5 จาก 8 แบบไม่ซ้ำ — Fisher–Yates แล้วตัดเอา 5 ใบแรก */
function deal(): number[] {
  const idx = OZZY.faces.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, HAND);
}

export default function Loot({ lang }: { lang: Lang }) {
  // สุ่มได้ตั้งแต่ render แรก เพราะส่วนนี้ไม่เคยถูก render บน server (โผล่หลังชนะบอสเท่านั้น)
  const [hand] = useState(deal);
  const [shaking, setShaking] = useState(!reducedMotion());
  const [flipped, setFlipped] = useState(reducedMotion());

  useEffect(() => {
    if (!shaking) return;
    const id = window.setTimeout(() => {
      setShaking(false);
      setFlipped(true);
    }, SHAKE_MS);
    return () => window.clearTimeout(id);
  }, [shaking]);

  return (
    <div className="mt-7">
      <h4 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-(--oz-sky)">🎁 {t(OZZY.run.lootTitle, lang)}</h4>
      <div className="mt-4 flex flex-wrap justify-center gap-2.5 sm:justify-start">
        {hand.map((fi, i) => {
          const f = OZZY.faces[fi];
          return (
            <div
              key={fi}
              className="oz-card aspect-[5/7] w-[clamp(76px,14vw,104px)]"
              data-flipped={flipped || undefined}
              data-shaking={shaking || undefined}
            >
              <div className="oz-card-inner" style={{ transitionDelay: `${i * STAGGER_MS}ms` }}>
                <div className="oz-back oz-cardback" aria-hidden="true">
                  <Bolt className="w-[40%]" />
                </div>
                <div className="oz-face">
                  <span className="text-[clamp(16px,3vw,24px)] font-bold leading-none tracking-[-0.02em]">{f.glyph}</span>
                  <span className="px-1.5 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.06em]">{t(f.label, lang)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[13px] text-(--oz-sky)">{t(OZZY.run.lootNote, lang)}</p>
    </div>
  );
}
