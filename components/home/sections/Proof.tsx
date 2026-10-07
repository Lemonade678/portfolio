"use client";

// 02 หลักฐานที่ตรวจสอบได้ — แท็บเอกสาร (ย้ายมาจาก app/page.tsx ไม่แก้ markup)

import { useRef, useState } from "react";
import { ACCENT_HEX, CREDENTIALS, UI, type Lang } from "@/lib/content";
import { CardLink, accentVar, t } from "@/components/home/ui";

export default function Proof({ lang }: { lang: Lang }) {
  return (
    <>
      <p className="mb-5 -mt-2 max-w-[62ch] text-[13.5px] text-ink2">
        {t(UI.proofNote, lang)}
      </p>
      <Credentials lang={lang} />
    </>
  );
}

/**
 * แท็บหลักฐาน
 *
 * ทำไมต้องเป็นแท็บ: ใบ certificate สัดส่วน A4 แนวนอน สูงมากเมื่อกางเต็มความกว้าง
 * ถ้าเรียงเอกสารทุกใบลงมาต่อกัน คนต้องสกรอลผ่านรูปใหญ่ ๆ กว่าจะถึงส่วนถัดไป
 * แท็บทำให้เห็นทีละใบ แต่รู้ตั้งแต่แรกว่ามีทั้งหมดกี่ใบ
 *
 * เรื่อง accessibility ที่ทำตาม WAI-ARIA tabs pattern:
 *   - ปุ่มอยู่ใน role="tablist" · แต่ละปุ่มเป็น role="tab" + aria-selected
 *   - แผงเนื้อหาเป็น role="tabpanel" ผูกกับปุ่มด้วย aria-controls / aria-labelledby
 *   - แท็บที่ไม่ได้เลือกตั้ง tabIndex={-1} เพื่อให้ Tab กระโดดข้ามทั้งกลุ่มไปเลย
 *     แล้วใช้ปุ่มลูกศรซ้าย/ขวาเลื่อนระหว่างแท็บแทน (roving tabindex)
 */
function Credentials({ lang }: { lang: Lang }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = CREDENTIALS.length - 1;
    let next = active;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const c = CREDENTIALS[active];
  const hex = ACCENT_HEX[c.accent];

  return (
    <div>
      <div
        role="tablist"
        aria-label={t(UI.sections.proof, lang)}
        onKeyDown={onKeyDown}
        className="mb-4 flex flex-wrap gap-2"
      >
        {CREDENTIALS.map((cr, i) => {
          const on = i === active;
          const h = ACCENT_HEX[cr.accent];
          return (
            <button
              key={cr.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`cred-tab-${cr.id}`}
              aria-selected={on}
              aria-controls={`cred-panel-${cr.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className="rounded-lg border px-3.5 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors"
              style={{
                color: on ? "#1A1310" : h,
                background: on ? h : `${h}1A`,
                borderColor: on ? h : `${h}4D`,
              }}
            >
              {t(cr.tab, lang)}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`cred-panel-${c.id}`}
        aria-labelledby={`cred-tab-${c.id}`}
        style={accentVar(c.accent)}
        className="overflow-hidden rounded-2xl border border-line bg-surface p-5 sm:p-7"
      >
        <h3 className="text-[clamp(17px,2.6vw,22px)] font-bold leading-tight tracking-[-0.02em]">
          {t(c.title, lang)}
        </h3>
        <p className="mt-1 text-[13px] text-ink2">{t(c.issuer, lang)}</p>
        <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
          {t(UI.labels.issued, lang)} · {c.when}
        </p>

        {/* รูปเอกสาร — บางใบมีแต่ PDF ก็ข้ามส่วนนี้ไป
            กดที่รูปแล้วเปิดไฟล์เต็มในแท็บใหม่ เผื่อคนอยากซูมอ่านลายเซ็น */}
        {c.image && (
          <a
            href={c.links?.[0]?.href ?? c.image.src}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block rounded-xl border border-line transition-transform hover:-translate-y-0.5"
          >
            <img
              src={c.image.src}
              alt={t(c.image.alt, lang)}
              loading="lazy"
              decoding="async"
              className="w-full rounded-[11px] bg-surface2"
              style={{ aspectRatio: c.image.ratio }}
            />
          </a>
        )}

        <h4 className="mb-2 mt-5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted">
          {t(UI.labels.verifies, lang)}
        </h4>
        <p
          className="result max-w-[70ch] text-sm leading-relaxed text-ink2"
          dangerouslySetInnerHTML={{ __html: t(c.verifies, lang) }}
        />

        {c.links && c.links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
            {c.links.map((l) => (
              <CardLink key={l.href} href={l.href} color={hex}>
                {t(l.label, lang)}
              </CardLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
