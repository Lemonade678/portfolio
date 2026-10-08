"use client";

// 04 People — วิธีทำงานร่วมกับคนอื่น (การ์ดสามใบ ทุกข้อมีหลักฐานประกอบ · ย้ายมาจาก app/page.tsx)
// ต่อด้วยกำแพงรูป "ผู้คนที่ได้เจอ" แล้วปิดด้วยการ์ด TheOzzy คนที่กำลังทำเว็บให้ (ย้ายมาจากหน้าต่าง 05)

import NextRunCard from "@/components/NextRun";
import PeopleWall from "@/components/home/PeopleWall";
import { PEOPLE, SOFT_SKILLS, type Lang } from "@/lib/content";
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

      <h3 className="mt-12 text-[clamp(18px,2.6vw,22px)] font-bold tracking-[-0.02em]">{t(PEOPLE.title, lang)}</h3>
      <p className="mb-5 mt-1 max-w-[62ch] text-[13.5px] text-ink2">{t(PEOPLE.intro, lang)}</p>
      <PeopleWall lang={lang} />

      <p className="mt-12 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">{t(PEOPLE.next, lang)}</p>
      <Reveal>
        <NextRunCard lang={lang} />
      </Reveal>
    </>
  );
}
