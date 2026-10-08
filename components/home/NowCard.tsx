"use client";

// ─────────────────────────────────────────────────────────────
// "ตอนนี้" — โปรเจกต์ใหม่ที่ยังไม่มีชื่อ + ปุ่มชวนทำแบบสอบถาม · วางบนสุดของหน้าต่าง 01 ผลงาน
//
// หน้าตาต่างจากการ์ดโปรเจกต์ข้างล่างตั้งใจ (กรอบเส้นประสีเหลือง): โปรเจกต์นี้ยังไม่มีผลลัพธ์
// ถ้าใช้การ์ดแบบเดียวกัน คนจะมองหา Problem / Approach / Result แล้วไม่เจอ
// ข้อความทั้งหมดอยู่ใน NOW ท้าย lib/content.ts
// ─────────────────────────────────────────────────────────────

import BrandIcon, { brandOf } from "@/components/BrandIcon";
import { t } from "@/components/home/ui";
import { NOW, type Lang } from "@/lib/content";

export default function NowCard({ lang }: { lang: Lang }) {
  return (
    <section
      aria-labelledby="now-title"
      className="mb-6 rounded-2xl border-2 border-dashed border-yellow/60 bg-yellow/[0.06] p-5 sm:p-7"
    >
      <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-yellow">● {t(NOW.eyebrow, lang)}</p>
      <h3 id="now-title" className="mt-2 text-[clamp(19px,3vw,24px)] font-bold leading-tight tracking-[-0.02em]">
        {t(NOW.title, lang)}
      </h3>
      <p className="mt-2 max-w-[62ch] text-[14px] leading-relaxed text-ink2">{t(NOW.body, lang)}</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <a
          href={NOW.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-yellow px-4 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-bg transition-transform hover:-translate-y-0.5"
        >
          <BrandIcon brand={brandOf(NOW.href)} size={14} />
          {t(NOW.cta, lang)} ↗
        </a>
        <span className="font-mono text-[11px] text-muted">{t(NOW.note, lang)}</span>
      </div>
    </section>
  );
}
