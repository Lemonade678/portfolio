"use client";

// หน้าต่างคอลเลกชัน: emote ของช่อง (เฉพาะที่ไม่ล็อกให้สมาชิก) + ตัวละครสามตัว
//
// emote ตัดมาจากภาพหน้าจอ ตัวละราว 40 px — แสดงแบบ pixelated (ขยายแบบบล็อก)
// แทนการขยายแบบปกติที่จะเบลอเป็นก้อน · กดตัวไหนเห็นตัวใหญ่ + ชื่อด้านบน
// ไม่ได้ทำ modal แยก — แผงโชว์ตัวที่เลือกอยู่บนสุดของหน้าต่าง กดตัวอื่นก็เปลี่ยนตาม

import { useState } from "react";
import { OZZY, type OzEmote } from "@/lib/ozzy/content";
import { useOzzy } from "./OzzyShell";
import { t } from "./ui";

export default function CollectionWindow() {
  const { lang } = useOzzy();
  const C = OZZY.collection;
  const [pick, setPick] = useState<OzEmote>(OZZY.emotes[0]);

  return (
    <div className="space-y-7">
      <section aria-labelledby="emotes-title">
        <h3 id="emotes-title" className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-(--oz-yellow)">
          {t(C.emotesTitle, lang)} · {OZZY.emotes.length}
        </h3>

        <div className="mt-3 flex items-center gap-4 rounded-2xl border-2 border-(--oz-ink) bg-(--oz-night) p-4" aria-live="polite">
          <img src={pick.src} alt="" className="oz-pixel h-24 w-auto" />
          <div>
            <p className="oz-title text-[24px] font-bold leading-tight">{t(pick.name, lang)}</p>
            <p className="mt-1 font-mono text-[11px] text-(--oz-sky)/70">{pick.id}</p>
          </div>
        </div>

        <ul className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-7">
          {OZZY.emotes.map((e) => {
            const on = e.id === pick.id;
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => setPick(e)}
                  aria-pressed={on}
                  aria-label={t(e.name, lang)}
                  title={t(e.name, lang)}
                  className={`grid aspect-square w-full place-items-center rounded-xl border-2 transition-transform hover:-translate-y-0.5 ${
                    on ? "border-(--oz-yellow) bg-(--oz-surface) shadow-[0_0_14px_rgba(254,197,1,.45)]" : "border-(--oz-ink) bg-(--oz-night)"
                  }`}
                >
                  <img src={e.src} alt="" className="oz-pixel h-[70%] w-auto" loading="lazy" />
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-2 text-[12px] text-(--oz-sky)/70">{t(C.note, lang)}</p>
      </section>

      <section aria-labelledby="chars-title">
        <h3 id="chars-title" className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-(--oz-yellow)">
          {t(C.charactersTitle, lang)}
        </h3>
        <ul className="mt-3 grid grid-cols-3 gap-3">
          {OZZY.heroes.map((h) => (
            <li key={h.id} className="overflow-hidden rounded-xl border-[3px] border-(--oz-ink) bg-(--oz-night) shadow-[3px_3px_0_var(--oz-ink)]">
              <img src={h.img} alt={t(h.alt, lang)} width={320} height={320} className="aspect-square w-full object-cover" loading="lazy" />
              <p className="px-2 pt-2 text-[14px] font-bold">{h.name}</p>
              <p className="px-2 pb-2.5 text-[11px] leading-snug text-(--oz-sky)">{t(h.from, lang)}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-[11.5px] leading-relaxed text-(--oz-sky)/70">{t(C.credit, lang)}</p>
    </div>
  );
}
