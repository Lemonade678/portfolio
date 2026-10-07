"use client";

// แถบบน (sticky) ค้างอยู่ทุกหน้าต่าง: ทางกลับพอร์ต · สถานะ · สลับภาษา
// สถานะโชว์ของที่ต้องรู้ระหว่างเลื่อนดูส่วนอื่น: หัวใจ (ตอนมีรัน) · แต้ม · โดนแป้งกี่ครั้ง · VIP · ปุ่มปิดเพลง

import Link from "next/link";
import { OZZY } from "@/lib/ozzy/content";
import { useOzzy } from "./OzzyShell";
import { Clover, num, t } from "./ui";

export default function TopBar() {
  const { lang, setLang, run, save, music, setMusic, href } = useOzzy();
  const T = OZZY.table;
  const hero = OZZY.heroes.find((h) => h.id === run.hero);
  const inRun = run.status !== "pick" && hero;

  return (
    <div className="sticky top-0 z-40 border-b-2 border-(--oz-ink) bg-(--oz-night)/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1080px] items-center justify-between gap-2 px-3 sm:px-8">
        <Link
          href="/"
          className="flex-none border-b border-transparent pb-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-(--oz-sky) transition-colors hover:border-(--oz-yellow) hover:text-(--oz-yellow) sm:text-[11px]"
        >
          {t(T.back, lang)}
        </Link>

        <div className="flex min-w-0 items-center gap-2">
          <Link
            href={href("/ozzy/run")}
            className="flex min-w-0 items-center gap-2 rounded-full border-2 border-(--oz-ink) bg-(--oz-surface) py-0.5 pl-1 pr-3 font-mono text-[12px]"
          >
            {inRun && (
              <>
                <img src={hero.img} alt="" width={320} height={320} className="h-7 w-7 flex-none rounded-full object-cover" />
                <span aria-label={`${run.hp}/${run.maxHp} ${t(T.hearts, lang)}`}>
                  {Array.from({ length: run.maxHp }, (_, i) => (
                    <span key={i} className={i < run.hp ? "text-white" : "text-(--oz-sky)/30"}>
                      ♥
                    </span>
                  ))}
                </span>
              </>
            )}
            <span className="flex items-center gap-1 font-bold text-[#7ee08a]" aria-label={`${run.points} ${t(OZZY.points.name, lang)}`}>
              <Clover className="h-3.5 w-3.5" />
              {num(run.points, lang)}
            </span>
            {save.powdered > 0 && (
              <span className="hidden text-(--oz-sky) sm:inline" aria-label={`${t(T.powdered, lang)} ${save.powdered}`}>
                🧴×{save.powdered}
              </span>
            )}
            {save.vip && <span className="rounded bg-(--oz-yellow) px-1 text-[10px] font-bold text-(--oz-ink)">🎟 VIP</span>}
          </Link>
          {music && (
            <button
              type="button"
              onClick={() => setMusic(false)}
              aria-label={t(T.stopMusic, lang)}
              title={t(T.stopMusic, lang)}
              className="grid h-8 w-8 flex-none place-items-center rounded-full border-2 border-(--oz-ink) bg-(--oz-surface) text-[13px]"
            >
              🎵
            </button>
          )}
        </div>

        <div role="group" aria-label="Language" className="flex flex-none overflow-hidden rounded-full border-2 border-(--oz-ink) bg-(--oz-surface)">
          {(["en", "th"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                lang === l ? "bg-(--oz-yellow) text-(--oz-ink)" : "text-(--oz-sky)"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
