"use client";

// นิทรรศการ 05 — สิบปีของ YOLO: ปี · รุ่น · ใครทำ · หนึ่งบรรทัด
// รุ่นที่รันบนเว็บนี้ (YOLO11) ไฮไลต์ไว้ · แหล่งที่มาอยู่ท้ายรายการ (ข้อมูลใน YOLO_MUSEUM.timeline)

import Exhibit from "@/components/home/museum/Exhibit";
import { CardLink, t } from "@/components/home/ui";
import { ACCENT_HEX, YOLO_MUSEUM, type Lang } from "@/lib/content";

export default function Timeline({ lang }: { lang: Lang }) {
  const E = YOLO_MUSEUM.history;
  return (
    <Exhibit n={E.n} title={E.title} body={E.body} lang={lang} className="md:col-span-2">
      <ol className="border-t border-line">
        {YOLO_MUSEUM.timeline.map((e) => (
          <li
            key={e.name}
            className={`grid grid-cols-[48px_1fr] items-baseline gap-x-4 border-b border-line py-2.5 sm:grid-cols-[56px_150px_1fr] ${
              e.here ? "-mx-2 rounded-lg border-transparent bg-yellow/10 px-2" : ""
            }`}
          >
            <span className="font-mono text-[11.5px] text-blue">{e.year}</span>
            <span className={`text-[14px] font-semibold ${e.here ? "text-yellow" : ""}`}>
              {e.name}
              {e.here && (
                <span className="ml-2 rounded-full border border-yellow/50 px-1.5 py-px font-mono text-[9px] uppercase tracking-[0.1em] text-yellow">
                  {t(E.here, lang)}
                </span>
              )}
            </span>
            <span className="col-start-2 text-[12.5px] leading-snug text-ink2 sm:col-start-3">
              {t(e.line, lang)} <span className="text-muted">— {e.by}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10.5px] text-muted">
        <span>{t(E.sources, lang)}:</span>
        {YOLO_MUSEUM.sources.map((s) => (
          <CardLink key={s.href} href={s.href} color={ACCENT_HEX.blue}>
            {t(s.label, lang)}
          </CardLink>
        ))}
      </p>
    </Exhibit>
  );
}
