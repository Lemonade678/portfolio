"use client";

// ─────────────────────────────────────────────────────────────
// โต๊ะไพ่ (แบบ B — หน้าจัดเด็ค): การ์ดฮีโร่ซ้าย · ไพ่ 6 ใบเรียงตารางขวา
//
// ไพ่แต่ละใบเป็น <Link> ธรรมดา — ใช้คีย์บอร์ด/เปิดแท็บใหม่/แชร์ลิงก์ได้ตามปกติของเว็บ
// มุมไพ่สองมุมแบบ Marvel Snap: วงฟ้า = ลำดับไพ่ · หกเหลี่ยมส้ม = "ตัวเลขจริง" ของหน้าต่างนั้น
// (คลิปที่ลงใน 7 วัน · จำนวนห้อง · จำนวนช่องวงล้อ ฯลฯ) ไม่ใช่เลขสวย ๆ ที่แต่งขึ้น
// ยกเว้นใบเดียวคือคอลเลกชัน = "6/7" มุกตามที่เจ้าของเว็บขอ (OZZY.table.collectionPower)
//
// บรรทัดเครดิต "เว็บที่แฟนทำ โดยเลม่อน" เป็นลิงก์กลับไปหน้าพอร์ตของเจ้าของเว็บ (แนบ ?lang=th ถ้ากำลังเป็นไทย)
//
// ตอนหน้าต่างเปิด โต๊ะทั้งโต๊ะเป็น inert (กด/โฟกัสไม่ได้) — คีย์บอร์ดจะได้ไม่หลุดไปหลังหน้าต่าง
// ปิดหน้าต่างแล้วคืนโฟกัสให้ไพ่ใบที่เปิดมัน (opener) คนใช้คีย์บอร์ดจะได้ไม่ต้องเริ่ม Tab ใหม่จากต้นหน้า
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import Link from "next/link";
import { OZZY, type CardId } from "@/lib/ozzy/content";
import { useOzzy } from "./OzzyShell";
import type { Lang } from "@/lib/content";
import { Art, t } from "./ui";

export default function Table({
  weeklyClips,
  inert,
  opener,
  onFocused,
}: {
  weeklyClips: number;
  inert: boolean;
  opener: CardId | null;
  onFocused: () => void;
}) {
  const { lang, href, setOpener } = useOzzy();
  const refs = useRef<Partial<Record<CardId, HTMLAnchorElement | null>>>({});
  const T = OZZY.table;
  const selfie = OZZY.photos.find((p) => p.id === "selfie")!;

  // ตัวเลขจริงบนมุมขวาของไพ่แต่ละใบ
  const power: Record<CardId, number | string> = {
    profile: OZZY.photos.length,
    clips: weeklyClips,
    run: OZZY.floors.length,
    wheel: OZZY.wheel.slices.length,
    collection: T.collectionPower,
    shop: OZZY.relics.length + OZZY.fun.length,
  };

  // คืนโฟกัสเฉพาะจังหวะ "หน้าต่างเพิ่งปิด" (inert: true → false) เท่านั้น
  // ถ้าคืนทันทีที่ opener ถูกตั้ง จะไปโดนจังหวะกดไพ่ (ก่อน route เปลี่ยน) แล้ว opener ถูกล้างทิ้งก่อนเวลา
  const wasOpen = useRef(inert);
  useEffect(() => {
    if (wasOpen.current && !inert && opener) {
      refs.current[opener]?.focus();
      onFocused();
    }
    wasOpen.current = inert;
  }, [inert, opener, onFocused]);

  return (
    <div inert={inert} className="mx-auto max-w-[1080px] px-4 pb-16 pt-8 sm:px-8 sm:pt-12">
      <div className="grid gap-8 md:grid-cols-[minmax(200px,260px)_1fr] md:gap-10">
        {/* ── การ์ดฮีโร่ ──
            มือถือ: รูปเล็กซ้าย ข้อความขวา (ไม่งั้นรูปกินจอจนเด็คตกไปใต้ขอบจอ)
            จอกว้าง: รูปเต็มคอลัมน์ ข้อความใต้รูป */}
        <section className="flex items-center gap-4 md:flex-col md:items-stretch md:gap-0">
          <div className="oz-herocard w-28 flex-none sm:w-40 md:w-full">
            <img src={selfie.src} alt={t(selfie.alt, lang)} width={selfie.w} height={selfie.h} className="aspect-[3/4] w-full object-cover" />
          </div>
          <div className="min-w-0">
            <h1 className="oz-title text-[clamp(28px,5vw,40px)] font-bold leading-none tracking-[-0.02em] md:mt-5">
              The<span className="oz-glow">Ozzy</span>
            </h1>
            <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-(--oz-sky)/80">{OZZY.streamer.handle}</p>
            <p className="mt-1.5 text-[14px] text-(--oz-sky) md:mt-2 md:text-[15px]">{t(OZZY.streamer.tagline, lang)}</p>
            <a
              href={OZZY.links.donate}
              target="_blank"
              rel="noopener noreferrer"
              className="oz-button mt-3 inline-flex items-center gap-2 rounded-xl px-3.5 py-2 font-mono text-[11.5px] font-bold uppercase tracking-[0.1em] md:mt-4 md:px-4 md:py-2.5 md:text-[12px]"
            >
              ☕ {t(T.donate, lang)} ↗
            </a>
            <p className="mt-4 hidden max-w-[34ch] text-[11.5px] leading-relaxed text-(--oz-sky)/70 md:block">
              <FanNote lang={lang} />
            </p>
          </div>
        </section>

        {/* ── เด็ค 6 ใบ ── */}
        <section aria-labelledby="deck-title">
          <h2 id="deck-title" className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-(--oz-yellow)">
            {t(T.deckTitle, lang)}
          </h2>
          <p className="mt-1 text-[13px] text-(--oz-sky)/80">{t(T.deckHint, lang)}</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 sm:gap-x-5">
            {OZZY.cards.map((c, i) => (
              <li key={c.id}>
                <Link
                  href={href(`/ozzy/${c.id}`)}
                  ref={(el) => {
                    refs.current[c.id] = el;
                  }}
                  onClick={() => setOpener(c.id)}
                  className="oz-deck-card group"
                >
                  <span className="oz-cost">{i + 1}</span>
                  <span className={`oz-power ${String(power[c.id]).length > 2 ? "oz-power-sm" : ""}`}>{power[c.id]}</span>
                  <span className="oz-deck-art">
                    <Art art={c.art} />
                  </span>
                  <span className="block px-2 pt-2 text-center text-[15px] font-bold leading-tight [text-shadow:2px_2px_0_var(--oz-ink)]">
                    {t(c.name, lang)}
                  </span>
                  <span className="block px-2 pb-3 pt-0.5 text-center text-[11.5px] leading-snug text-(--oz-sky)">{t(c.blurb, lang)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[11.5px] leading-relaxed text-(--oz-sky)/70 md:hidden">
            <FanNote lang={lang} />
          </p>
        </section>
      </div>
    </div>
  );
}

/** "เว็บที่แฟนทำ โดยเลม่อน" → กดแล้วกลับไปหน้าพอร์ต · ต่อด้วยข้อความธรรมดา */
function FanNote({ lang }: { lang: Lang }) {
  const N = OZZY.table.fanNote;
  return (
    <>
      <Link
        href={lang === "th" ? "/?lang=th" : "/"}
        className="font-semibold text-(--oz-yellow) underline decoration-(--oz-yellow)/40 underline-offset-2 hover:decoration-(--oz-yellow)"
      >
        {t(N.link, lang)} ↩
      </Link>{" "}
      {t(N.rest, lang)}
    </>
  );
}
