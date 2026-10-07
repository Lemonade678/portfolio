"use client";

// 05 เส้นทางที่ผ่านมา + การ์ดรันถัดไป (ย้ายมาจาก app/page.tsx ไม่แก้ markup)

import NextRunCard from "@/components/NextRun";
import { TIMELINE, type Lang } from "@/lib/content";
import { Reveal, t } from "@/components/home/ui";

export default function Path({ lang }: { lang: Lang }) {
  return (
    <>
      <div className="border-t border-line">
        {TIMELINE.map((r, i) => (
          <Reveal key={i}>
            <div className="grid grid-cols-[64px_1fr] items-baseline gap-x-5 border-b border-line py-4 md:grid-cols-[88px_1fr_160px]">
              <span className="font-mono text-[11.5px] tracking-[0.1em] text-blue">
                {r.year}
              </span>
              <span className="text-[14.5px] font-medium">{t(r.what, lang)}</span>
              <span className="col-start-2 -mt-2 text-[12.5px] text-muted md:col-start-3 md:mt-0 md:text-right">
                {t(r.where, lang)}
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      {/* รันถัดไป — ไทม์ไลน์เล่าว่าผ่านอะไรมา การ์ดนี้คือก้าวต่อไป (ดู components/NextRun.tsx) */}
      <Reveal>
        <NextRunCard lang={lang} />
      </Reveal>
    </>
  );
}
