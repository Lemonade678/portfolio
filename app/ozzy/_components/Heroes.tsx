"use client";

// ── เลือกฮีโร่ ── (ย้ายมาจาก app/next/Heroes.tsx)
//
// สามตัวโปรดของ TheOzzy: Pepe (อีโมตประจำช่อง) · Dooley (The Bazaar) · M'Baku (Marvel Snap)
// การ์ดแต่ละใบเป็น <button aria-pressed> — กดแล้วเริ่มรันใหม่ด้วยฮีโร่ตัวนั้นทันที
//
// M'Baku กดแล้วเปิดกล่องเพลงที่มุมจอ (อยู่ที่ shell เพลงเลยเล่นต่อตอนสลับหน้าต่าง)
// การ์ดเขียนบอกไว้ก่อนว่า "มีเพลงเปิดตัว" — เสียงที่ดังขึ้นเองโดยไม่บอกล่วงหน้าคือของที่คนเกลียดที่สุด

import { OZZY } from "@/lib/ozzy/content";
import { useOzzy } from "./OzzyShell";
import { t } from "./ui";

export default function Heroes() {
  const { lang, run, dispatch, setMusic } = useOzzy();
  const pick = (id: (typeof OZZY.heroes)[number]["id"], music?: boolean) => {
    dispatch({ type: "pick", hero: id });
    if (music) setMusic(true);
  };

  // ระหว่างมีรัน การ์ดฮีโร่ใหญ่ ๆ ดันตัวเกมตกไปใต้ขอบหน้าต่าง — ย่อเหลือแถบเล็ก
  // (กดตัวไหนก็ยังเริ่มรันใหม่ด้วยตัวนั้นได้เหมือนเดิม)
  if (run.status !== "pick") {
    return (
      <section aria-labelledby="heroes-title" className="flex flex-wrap items-center gap-2">
        <h3 id="heroes-title" className="mr-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-(--oz-yellow)">
          {t(OZZY.heroesTitle, lang)}
        </h3>
        {OZZY.heroes.map((h) => {
          const on = run.hero === h.id;
          return (
            <button
              key={h.id}
              type="button"
              onClick={() => pick(h.id, h.music)}
              aria-pressed={on}
              className={`flex items-center gap-2 rounded-full border-2 py-0.5 pl-0.5 pr-3 text-[13px] font-semibold ${
                on ? "border-(--oz-yellow) bg-(--oz-surface) shadow-[0_0_12px_rgba(254,197,1,.4)]" : "border-(--oz-ink) bg-(--oz-night) text-(--oz-sky)"
              }`}
            >
              <img src={h.img} alt="" width={320} height={320} className="h-7 w-7 rounded-full object-cover" />
              {h.name}
              {h.music && <span aria-hidden="true">🎵</span>}
            </button>
          );
        })}
      </section>
    );
  }

  return (
    <section aria-labelledby="heroes-title">
      <h3 id="heroes-title" className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-(--oz-yellow)">
        {t(OZZY.heroesTitle, lang)}
      </h3>
      <p className="mt-1 text-[13px] text-(--oz-sky)">{t(OZZY.heroesNote, lang)}</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {OZZY.heroes.map((h) => {
          return (
            <button
              key={h.id}
              type="button"
              onClick={() => pick(h.id, h.music)}
              aria-pressed={false}
              className="oz-hero flex gap-3 rounded-2xl p-2.5 text-left sm:flex-col sm:p-3"
            >
              <img
                src={h.img}
                alt={t(h.alt, lang)}
                width={320}
                height={320}
                className="h-16 w-16 flex-none rounded-xl border-[3px] border-(--oz-ink) bg-(--oz-night) object-cover sm:h-auto sm:w-full"
              />
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-[18px] font-bold leading-none [text-shadow:2px_2px_0_var(--oz-ink)]">{h.name}</span>
                </span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.1em] text-(--oz-sky)/80">{t(h.from, lang)}</span>
                <span className="mt-1.5 block text-[12.5px] font-semibold text-(--oz-yellow)">{t(h.perk, lang)}</span>
                <span className="block text-[12px] leading-snug text-(--oz-sky)">{t(h.perkText, lang)}</span>
                {h.music && (
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-(--oz-blue)/50 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.08em] text-(--oz-blue)">
                    🎵 {t(OZZY.musicBadge, lang)}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
