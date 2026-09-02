"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import CoverArt from "@/components/CoverArt";
import PhotoDetect from "@/components/PhotoDetect";
import {
  ACCENT_HEX,
  CONTACTS,
  METRICS,
  PERSON,
  PROJECTS,
  SOFT_SKILLS,
  STACK,
  TIMELINE,
  UI,
  type Accent,
  type L10n,
  type Lang,
} from "@/lib/content";

// ── ตัวช่วยเล็ก ๆ ─────────────────────────────────────────────

/** หยิบข้อความตามภาษาที่เลือกอยู่ */
const t = (s: L10n, lang: Lang) => s[lang];

/** ส่งสีประจำโปรเจกต์เข้า CSS ผ่านตัวแปร --c */
const accentVar = (a: Accent): CSSProperties =>
  ({ "--c": ACCENT_HEX[a] }) as CSSProperties;

/** ค่อย ๆ เผยขึ้นมาตอนเลื่อนถึง — เคารพ prefers-reduced-motion ผ่าน CSS */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.shown = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.shown = "true";
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

const CHIP =
  "font-mono text-[10.5px] px-2.5 py-1 rounded-md bg-surface2 border border-line text-ink2";

/** สีหัวข้อของการ์ด soft skill — วนตามลำดับ ไม่ได้ผูกกับความหมายเหมือนสีโปรเจกต์
 *  ใช้แค่ให้สามใบไม่กลืนกันเป็นบล็อกเทาก้อนเดียว */
const SOFT_ACCENTS: Accent[] = ["yellow", "pink", "blue"];

// ── หน้าเว็บ ──────────────────────────────────────────────────

export default function Page() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <>
      {/* ───── แถบบน ───── */}
      <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-[54px] max-w-[1120px] items-center justify-between px-5 sm:px-8 lg:px-16">
          <span className="font-mono text-[13px] font-semibold tracking-[0.2em]">
            NUTT<span className="text-yellow">.</span>
          </span>

          <div className="flex items-center gap-5">
            <nav className="hidden gap-5 md:flex">
              {(["work", "stack", "soft", "path", "contact"] as const).map((k) => (
                <a
                  key={k}
                  href={`#${k}`}
                  className="border-b border-transparent pb-[3px] font-mono text-[11px] uppercase tracking-[0.12em] text-ink2 transition-colors hover:border-yellow hover:text-yellow"
                >
                  {t(UI.nav[k], lang)}
                </a>
              ))}
            </nav>

            <div
              role="group"
              aria-label="Language"
              className="flex overflow-hidden rounded-full border border-line"
            >
              {(["en", "th"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={`px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                    lang === l ? "bg-yellow text-bg" : "text-muted"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <CoverArt />

      <main className="mx-auto max-w-[1120px] px-5 pb-20 sm:px-8 lg:px-16">
        {/* ───── หัวเรื่อง ───── */}
        <section className="-mt-14">
          {/* มีรูป → ใช้กรอบที่กดรัน YOLO ได้ / ไม่มีรูป → กลับไปเป็นวงกลมอักษรย่อเหมือนเดิม */}
          {PERSON.photo ? (
            <PhotoDetect lang={lang} />
          ) : (
            <div className="relative z-10 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-[3px] border-bg bg-surface2 font-mono text-2xl font-semibold text-yellow shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
              {PERSON.initials}
            </div>
          )}

          <h1 className="mt-6 text-[clamp(38px,8vw,74px)] font-bold leading-[1.02] tracking-[-0.03em]">
            {PERSON.name}
          </h1>

          <p className="mt-3 text-[clamp(17px,3.2vw,26px)] font-semibold tracking-[-0.01em]">
            {PERSON.roles.map((r, i) => (
              <span key={r.text}>
                {i > 0 && <span className="px-1.5 font-normal text-muted">|</span>}
                <span style={{ color: ACCENT_HEX[r.accent] }}>{r.text}</span>
              </span>
            ))}
          </p>

          {PERSON.intro.map((p, i) => (
            <p
              key={i}
              className="mt-5 max-w-[62ch] text-[clamp(15px,2.1vw,17px)] text-ink2"
            >
              {t(p, lang)}
            </p>
          ))}

          <ContactCards lang={lang} className="mt-8" />

          {/* ตัวเลขมี 4 ตัว → 1 / 2 / 4 คอลัมน์ ถ้าใช้ 3 คอลัมน์เหมือนเดิม
              ใบสุดท้ายจะเหลือค้างแถวล่างใบเดียว และบนมือถือยังเป็นคอลัมน์เดียว
              เพราะคำบรรยายยาวเกินกว่าจะบีบสองใบต่อแถวได้ */}
          <div className="mt-3.5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {METRICS.map((m) => (
              <Reveal key={m.value + m.accent}>
                <div className="rounded-xl border border-line bg-surface p-[18px]">
                  <div
                    className="text-[clamp(24px,4.4vw,34px)] font-bold leading-none tracking-[-0.02em]"
                    style={{ color: ACCENT_HEX[m.accent] }}
                  >
                    {m.value}
                    {m.suffix && (
                      <span className="text-[0.55em] text-muted">{m.suffix}</span>
                    )}
                  </div>
                  <p className="mt-2 text-xs leading-snug text-muted">
                    {t(m.label, lang)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ───── ผลงาน ───── */}
        <section id="work" className="pt-[clamp(52px,8vw,86px)]">
          <SectionHead n="01" title={t(UI.sections.work, lang)} />

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
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                    {p.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border-b pb-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em]"
                        style={{ color: ACCENT_HEX[p.accent] }}
                      >
                        {t(l.label, lang)}
                      </a>
                    ))}
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </section>

        {/* ───── เครื่องมือ ───── */}
        <section id="stack" className="pt-[clamp(52px,8vw,86px)]">
          <SectionHead n="02" title={t(UI.sections.stack, lang)} />

          {/* กลุ่ม core กินเต็มความกว้างและใช้ชิปสีเหลืองตัวใหญ่กว่า
              เพื่อให้คนกวาดตาผ่านแล้วเห็นหกอย่างนี้ก่อนอย่างอื่น */}
          <Reveal>
            {/* ใช้ hex + alpha ผ่าน inline style แบบเดียวกับแท็บหมวดโปรเจกต์ข้างบน
                แทนที่จะใช้ opacity modifier ของ Tailwind — เว็บนี้ทำแบบนี้อยู่แล้วทั้งไฟล์ */}
            <div
              className="mb-4 rounded-2xl border p-6"
              style={{
                borderColor: `${ACCENT_HEX.yellow}40`,
                background: `${ACCENT_HEX.yellow}0F`,
              }}
            >
              <h3 className="text-[15px] font-semibold text-yellow">
                {t(STACK.core.title, lang)}
              </h3>
              <p className="mb-4 mt-0.5 text-[12.5px] text-ink2">
                {t(STACK.core.note, lang)}
              </p>
              <div className="flex flex-wrap gap-2">
                {STACK.core.items.map((s) => (
                  <span
                    key={s}
                    className="rounded-lg border px-3 py-1.5 font-mono text-[12px] font-medium"
                    style={{
                      color: ACCENT_HEX.yellow,
                      borderColor: `${ACCENT_HEX.yellow}57`,
                      background: `${ACCENT_HEX.yellow}1F`,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">
            {[STACK.shipped, STACK.learning].map((col) => (
              <div
                key={col.title.en}
                className="rounded-2xl border border-line bg-surface p-6"
              >
                <h3 className="text-[15px] font-semibold">{t(col.title, lang)}</h3>
                <p className="mb-4 mt-0.5 text-[12.5px] text-muted">
                  {t(col.note, lang)}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {col.items.map((s) => (
                    <span key={s} className={CHIP}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ───── ทักษะที่ไม่ใช่เครื่องมือ ─────
            แยกออกมาเป็น section ของตัวเอง ไม่ยัดเป็นชิปรวมกับข้างบน
            เพราะแต่ละข้อต้องมีที่ให้เขียนหลักฐานประกอบ ไม่งั้นเป็นแค่คำโฆษณา */}
        <section id="soft" className="pt-[clamp(52px,8vw,86px)]">
          <SectionHead n="03" title={t(UI.sections.soft, lang)} />
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
        </section>

        {/* ───── เส้นทาง ───── */}
        <section id="path" className="pt-[clamp(52px,8vw,86px)]">
          <SectionHead n="04" title={t(UI.sections.path, lang)} />
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
        </section>

        {/* ───── ปิดท้าย ───── */}
        <section id="contact" className="pt-[clamp(52px,8vw,86px)]">
          <h2 className="max-w-[20ch] text-[clamp(24px,5vw,42px)] font-bold leading-[1.1] tracking-[-0.03em] text-yellow">
            {t(UI.outro.heading, lang)}
          </h2>
          <p className="mb-6 mt-3 max-w-[48ch] text-ink2">{t(UI.outro.body, lang)}</p>
          <ContactCards lang={lang} />
        </section>

        <footer className="mt-[clamp(48px,7vw,72px)] flex flex-wrap justify-between gap-2.5 border-t border-line pt-[18px] font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          <span>
            {PERSON.name} — {PERSON.location}
          </span>
          <span>{t(UI.updated, lang)}</span>
        </footer>
      </main>
    </>
  );
}

// ── ชิ้นส่วนย่อย ──────────────────────────────────────────────

function SectionHead({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="font-mono text-[10.5px] tracking-[0.16em] text-yellow">
        {n}
      </span>
      <h2 className="text-[clamp(22px,3.6vw,30px)] font-bold tracking-[-0.02em]">
        {title}
      </h2>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

/**
 * ช่อง Problem / Approach / Result
 * ช่อง Result รับ HTML ได้เพื่อให้ใส่ <strong> เน้นตัวเลขได้
 * เนื้อหามาจาก content.ts ที่เราเขียนเอง ไม่ได้รับจากผู้ใช้ จึงปลอดภัย
 */
function Field({
  label,
  children,
  html,
}: {
  label: string;
  children?: React.ReactNode;
  html?: string;
}) {
  return (
    <div>
      <h4 className="mb-2 font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </h4>
      {html ? (
        <p
          className="result text-sm leading-relaxed text-ink2"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className="text-sm leading-relaxed text-ink2">{children}</p>
      )}
    </div>
  );
}

function ContactCards({
  lang,
  className = "",
}: {
  lang: Lang;
  className?: string;
}) {
  return (
    <div className={`grid gap-3 sm:grid-cols-3 ${className}`}>
      {CONTACTS.map((c) => (
        <a
          key={c.value}
          href={c.href}
          target={c.href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-yellow hover:bg-surface2"
        >
          <span
            className="grid h-7 w-7 flex-none place-items-center rounded-md font-mono text-[11px] font-semibold"
            style={{
              color: ACCENT_HEX[c.accent],
              background: `${ACCENT_HEX[c.accent]}29`,
            }}
          >
            {c.icon}
          </span>
          <span className="min-w-0">
            <span className="block font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
              {t(c.kind, lang)}
            </span>
            <span className="block truncate text-[13.5px]">{c.value}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
