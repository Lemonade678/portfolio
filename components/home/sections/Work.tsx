"use client";

// 01 ผลงานที่เลือกมา — การ์ดโปรเจกต์ (ย้ายมาจาก app/page.tsx ไม่แก้ markup)
// บนสุดมีการ์ด "ตอนนี้" ชวนทำแบบสอบถามของโปรเจกต์ใหม่ (components/home/NowCard.tsx)

import NowCard from "@/components/home/NowCard";
import { ACCENT_HEX, PROJECTS, UI, type Lang } from "@/lib/content";
import { CHIP, CardLink, Field, Reveal, accentVar, t } from "@/components/home/ui";

export default function Work({ lang }: { lang: Lang }) {
  return (
    <>
      <NowCard lang={lang} />

      {PROJECTS.map((p) => (
        <Reveal key={p.id}>
          <article
            style={accentVar(p.accent)}
            className="group relative mb-4 overflow-hidden rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 sm:p-7"
          >
            <span
              className="absolute inset-y-0 left-0 w-[3px]"
              style={{ background: ACCENT_HEX[p.accent] }}
            />

            <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
              <span
                className="rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em]"
                style={{
                  color: ACCENT_HEX[p.accent],
                  borderColor: `${ACCENT_HEX[p.accent]}57`,
                  background: `${ACCENT_HEX[p.accent]}29`,
                }}
              >
                {p.tag}
              </span>
              <span className="font-mono text-[10.5px] tracking-[0.1em] text-muted">
                {p.when}
              </span>
            </div>

            <h3 className="text-[clamp(19px,3vw,25px)] font-bold leading-tight tracking-[-0.02em]">
              {t(p.title, lang)}
            </h3>
            <p className="mb-5 mt-1 text-[13px] text-ink2">{t(p.org, lang)}</p>

            {/* คลิปเดโม — วางก่อนคำอธิบาย เพราะคนสาย CV ดูภาพสองวินาทีก็รู้แล้ว
                ว่าของจริงหรือเปล่า ส่วนตัวหนังสืออ่านทีหลังก็ได้

                ใช้ <img> ธรรมดาไม่ใช่ next/image ตั้งใจ — ไฟล์เป็น animated WebP
                ถ้าให้ next/image ไป optimize ต่อ ภาพเคลื่อนไหวจะหายกลายเป็นเฟรมเดียว
                loading="lazy" เพราะไฟล์ ~1.8 MB และการ์ดนี้อยู่ใต้ fold เสมอ
                aspectRatio กันหน้าเว็บกระโดดตอนไฟล์ยังโหลดไม่เสร็จ */}
            {p.media && (
              <figure className="mb-5">
                <img
                  src={p.media.src}
                  alt={t(p.media.alt, lang)}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-xl border border-line bg-surface2"
                  style={{ aspectRatio: p.media.ratio }}
                />
                {p.media.caption && (
                  <figcaption className="mt-2 text-[12px] leading-snug text-muted">
                    {t(p.media.caption, lang)}
                  </figcaption>
                )}
              </figure>
            )}

            <div className="mb-4 grid gap-4 md:grid-cols-3 md:gap-5">
              <Field label={t(UI.labels.problem, lang)}>
                {t(p.problem, lang)}
              </Field>
              <Field label={t(UI.labels.approach, lang)}>
                {t(p.approach, lang)}
              </Field>
              <Field label={t(UI.labels.result, lang)} html={t(p.result, lang)} />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <span key={s} className={CHIP}>
                  {s}
                </span>
              ))}
            </div>

            {/* ลิงก์เป็น array แล้ว — วางเรียงกันแบบ wrap ได้ เผื่อการ์ดไหน
                มีของให้ดูหลายที่ (น้องตรงปกมีทั้ง Space, adapter, dataset) */}
            {p.links && p.links.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
                {p.links.map((l) => (
                  <CardLink key={l.href} href={l.href} color={ACCENT_HEX[p.accent]}>
                    {t(l.label, lang)}
                  </CardLink>
                ))}
              </div>
            )}
          </article>
        </Reveal>
      ))}
    </>
  );
}
