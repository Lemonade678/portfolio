"use client";

// 04 วิธีทำงานร่วมกับคนอื่น — ทุกข้อมีหลักฐานประกอบ (ย้ายมาจาก app/page.tsx ไม่แก้ markup)

import { SOFT_SKILLS, type Lang } from "@/lib/content";
import { Reveal, SOFT_ACCENTS, accentVar, t } from "@/components/home/ui";

export default function Soft({ lang }: { lang: Lang }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {SOFT_SKILLS.map((s, i) => (
          <Reveal key={s.name.en}>
            <div
              className="h-full rounded-2xl border border-line bg-surface p-6"
              style={accentVar(SOFT_ACCENTS[i % SOFT_ACCENTS.length])}
            >
              <h3
                className="text-[15px] font-semibold"
                style={{ color: "var(--c)" }}
              >
                {t(s.name, lang)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink2">
                {t(s.evidence, lang)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </>
  );
}
