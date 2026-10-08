"use client";

// ─────────────────────────────────────────────────────────────
// หน้า playground — มุกล้วน ๆ เข้าได้หลังกด L E M O N A D E ครบในหน้าหลัก
//
// ประตูมีสามสถานะ: checking → locked | open
//   ต้องมี "checking" คั่นก่อน เพราะ sessionStorage อ่านได้แค่ฝั่งเบราว์เซอร์
//   ตอน Next.js prerender หน้านี้บน server ยังไม่รู้ว่าปลดล็อกหรือยัง
//   ถ้าเรนเดอร์ "ล็อกอยู่" ไปก่อนแล้วค่อยสลับเป็นเนื้อหา คนที่ปลดล็อกแล้ว
//   จะเห็นหน้าล็อกแวบขึ้นมาแวบหนึ่ง ดูเหมือนรหัสไม่ผ่าน — เลยให้ว่างไว้ก่อน
//
// ข้อความทั้งหมดอยู่ใน PLAYGROUND ใน lib/content.ts ตามกติกาเดียวกับหน้าหลัก
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import Link from "next/link";
import { LANG_KEY, UNLOCK_KEY } from "@/components/SecretCode";
import YoloLab from "@/components/YoloLab";
import { PLAYGROUND as P, type L10n, type Lang } from "@/lib/content";

const t = (s: L10n, lang: Lang) => s[lang];

type Gate = "checking" | "locked" | "open";

export default function Playground() {
  const [gate, setGate] = useState<Gate>("checking");
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(LANG_KEY);
      if (saved === "en" || saved === "th") setLang(saved);
      setGate(sessionStorage.getItem(UNLOCK_KEY) === "1" ? "open" : "locked");
    } catch {
      setGate("locked");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  if (gate === "checking") return <main className="min-h-screen" />;

  return (
    <main className="mx-auto min-h-screen max-w-[760px] px-5 py-8 sm:px-8 sm:py-12">
      {/* แถบบน: ทางกลับ + สลับภาษา */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="border-b border-transparent pb-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink2 transition-colors hover:border-yellow hover:text-yellow"
        >
          {t(P.back, lang)}
        </Link>
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

      {gate === "locked" ? <Locked lang={lang} /> : <Result lang={lang} />}
    </main>
  );
}

// ── หน้าล็อก ─────────────────────────────────────────────────
// คนที่พิมพ์ /playground ตรง ๆ จะมาเจอหน้านี้ — บอกใบ้ให้ด้วยเลย
// เพราะคนที่ขยันพิมพ์ URL เดาเองก็สมควรได้ไปต่อ

function Locked({ lang }: { lang: Lang }) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="text-6xl" aria-hidden="true">
        🍋
      </div>
      <h1 className="mt-5 text-[clamp(22px,4vw,30px)] font-bold tracking-[-0.02em]">
        🔒 {t(P.locked.title, lang)}
      </h1>
      <p className="mt-3 max-w-[38ch] text-ink2">{t(P.locked.body, lang)}</p>
    </section>
  );
}

// ── ผลลัพธ์ ───────────────────────────────────────────────────

function Result({ lang }: { lang: Lang }) {
  const r = P.result;
  const top = P.detections[0].score;

  return (
    <>
      <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.14em] text-yellow">
        🔓 {t(P.unlocked, lang)}
      </p>
      <h1 className="mt-2 text-[clamp(28px,6vw,44px)] font-bold leading-[1.05] tracking-[-0.03em]">
        {t(P.eyebrow, lang)}
      </h1>
      <p className="mt-2 font-mono text-[11px] tracking-[0.06em] text-muted">
        {t(P.eyebrowNote, lang)}
      </p>

      {/* ── การ์ดผลลัพธ์ ── */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
        {/* ธงห้าแถบ เรียงบนลงล่าง เป็นหัวการ์ดไปในตัว */}
        <div
          role="img"
          aria-label={`${r.name} flag: ${P.flag.map((s) => t(s.label, "en").split(" — ")[0]).join(", ")}`}
          className="flex h-28 flex-col sm:h-32"
        >
          {P.flag.map((s) => (
            <div key={s.color} className="flex-1" style={{ background: s.color }} />
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {/* ดอกไม้ในกล่องตรวจจับ — ล้อกล่องบนรูปโปรไฟล์หน้าหลัก
              กรอบ + ป้ายสีเหลืองแบบเดียวกับ detbox ที่ YOLO วาดบนรูปจริง */}
          <div className="relative mt-4 inline-block border-[1.5px] border-yellow px-3 pb-1 pt-2">
            <span
              className="absolute -top-[15px] left-[-1.5px] whitespace-nowrap bg-yellow px-1 py-px font-mono text-[9px] font-semibold leading-[1.35] text-bg"
              aria-hidden="true"
            >
              {r.detection}
            </span>
            <span className="text-6xl leading-none" role="img" aria-label={t(r.emojiLabel, lang)}>
              {r.emoji}
            </span>
          </div>

          <h2 className="mt-5 text-[clamp(30px,7vw,46px)] font-bold leading-none tracking-[-0.03em] text-yellow">
            {r.name}
          </h2>
          <p className="mt-2 font-mono text-[12px] text-muted">
            {t(r.variant, lang)} · {r.pronunciation} · {t(r.pos, lang)}
          </p>
          <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-ink2">
            {t(r.definition, lang)}
          </p>

          <h3 className="mb-3 mt-7 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            {t(P.flagTitle, lang)}
          </h3>
          <ul className="space-y-2">
            {P.flag.map((s) => (
              <li key={s.color} className="flex items-start gap-3 text-sm text-ink2">
                <span
                  className="mt-[3px] h-3.5 w-6 flex-none rounded-[3px] border border-line"
                  style={{ background: s.color }}
                  aria-hidden="true"
                />
                {t(s.label, lang)}
              </li>
            ))}
          </ul>

          <h3 className="mb-3 mt-7 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            {t(P.traitsTitle, lang)}
          </h3>
          <ul className="space-y-1.5">
            {P.traits.map((tr) => (
              <li key={tr.en} className="flex gap-2.5 text-sm text-ink2">
                <span className="text-yellow" aria-hidden="true">
                  ·
                </span>
                {t(tr, lang)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── ผลตรวจจับดิบ ก่อน NMS ── */}
      <section className="mt-4 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h3 className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
          {t(P.detectionsTitle, lang)}
        </h3>
        <ol className="space-y-5">
          {P.detections.map((d) => {
            const winner = d.score === top;
            return (
              <li key={d.label}>
                <div className="flex items-baseline justify-between gap-3 font-mono text-[13px]">
                  <span className={winner ? "font-semibold text-yellow" : "text-ink2"}>
                    {d.label}
                  </span>
                  <span className={winner ? "text-yellow" : "text-muted"}>
                    {d.score.toFixed(2)}
                  </span>
                </div>
                {/* แถบความมั่นใจ — ตกแต่งล้วน ตัวเลขจริงอยู่ข้างบนแล้ว */}
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface2" aria-hidden="true">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${d.score * 100}%`,
                      background: winner ? "var(--color-yellow)" : "var(--color-muted)",
                      opacity: winner ? 1 : 0.55,
                    }}
                  />
                </div>
                <p className="mt-1.5 text-[12.5px] leading-snug text-muted">{t(d.note, lang)}</p>
              </li>
            );
          })}
        </ol>
        <p className="mt-6 border-t border-line pt-4 text-[12.5px] leading-relaxed text-ink2">
          {t(P.nmsNote, lang)}
        </p>
      </section>

      {/* ── ห้องทดลอง YOLO: ลองกับรูปของผู้ชมเอง (components/YoloLab.tsx) ── */}
      <YoloLab lang={lang} />

      <p className="mx-auto mt-10 max-w-[48ch] text-center text-[12px] leading-relaxed text-muted">
        {t(P.footnote, lang)}
      </p>
    </>
  );
}
