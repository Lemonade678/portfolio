"use client";

// ── ACT I: เลือกฮีโร่ ────────────────────────────────────────
//
// สามตัวโปรดของ TheOzzy: Pepe (อีโมตประจำช่อง) · Dooley (The Bazaar) · M'Baku (Marvel Snap)
// การ์ดแต่ละใบเป็น <button aria-pressed> — กดแล้วเริ่มรันใหม่ด้วยฮีโร่ตัวนั้นทันที
//
// M'Baku กดแล้วเปิดเพลง "สวัสดีอะไร??" (MV จากช่องของเขาเอง) เป็นเพลงเปิดตัว
// การ์ดเขียนบอกไว้ก่อนว่า "มีเพลงเปิดตัว" — เสียงที่ดังขึ้นมาเองโดยไม่บอกล่วงหน้า
// เป็นของที่คนเกลียดที่สุดบนเว็บ โดยเฉพาะคนที่เปิดอยู่ในที่ทำงาน

import { NEXT_RUN as N, type Lang, type OzHero, type OzHeroId } from "@/lib/content";
import { SectionTitle, t } from "./ui";

export default function Heroes({
  lang,
  hero,
  music,
  onPick,
  onStopMusic,
}: {
  lang: Lang;
  hero: OzHeroId | null;
  music: boolean;
  onPick: (h: OzHero) => void;
  onStopMusic: () => void;
}) {
  return (
    <section aria-labelledby="heroes-title" className="mt-14">
      <SectionTitle
        id="heroes-title"
        act="ACT I"
        title={t(N.heroesTitle, lang)}
        note={t(N.heroesNote, lang)}
      />

      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {N.heroes.map((h) => {
          const on = hero === h.id;
          return (
            <button
              key={h.id}
              type="button"
              onClick={() => onPick(h)}
              aria-pressed={on}
              className="oz-hero flex gap-4 rounded-2xl p-3 text-left sm:flex-col sm:p-4"
            >
              {/* มือถือ: รูปเล็กซ้าย ข้อความขวา · จอกว้าง: รูปเต็มความกว้างการ์ด ข้อความใต้รูป */}
              <img
                src={h.img}
                alt={t(h.alt, lang)}
                width={320}
                height={320}
                loading="lazy"
                decoding="async"
                className="h-20 w-20 flex-none rounded-xl border-[3px] border-(--oz-ink) bg-(--oz-night) object-cover sm:h-auto sm:w-full"
              />
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="oz-title text-[21px] font-bold leading-none">{h.name}</span>
                  {on && (
                    <span className="rounded-full bg-(--oz-yellow) px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.1em] text-(--oz-ink)">
                      ✓ {t(N.picked, lang)}
                    </span>
                  )}
                </span>
                <span className="mt-1.5 block font-mono text-[10.5px] uppercase tracking-[0.12em] text-(--oz-sky)/80">
                  {t(h.from, lang)}
                </span>
                <span className="mt-2.5 block text-[13.5px] font-semibold text-(--oz-yellow)">
                  {t(h.perk, lang)}
                </span>
                <span className="block text-[13px] leading-snug text-(--oz-sky)">
                  {t(h.perkText, lang)}
                </span>
                {h.music && (
                  <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-(--oz-blue)/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-(--oz-blue)">
                    🎵 {t(N.musicBadge, lang)}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {music && <MusicPanel lang={lang} onStop={onStopMusic} />}
    </section>
  );
}

/**
 * เพลงเปิดตัว M'Baku — YouTube embed ที่โผล่มาหลังกดการ์ดเท่านั้น
 *
 * ทำไมไม่ฝังไว้ตั้งแต่แรก: iframe ของ YouTube โหลดสคริปต์ราว 1 MB และส่งข้อมูลผู้ชมไปหา Google
 * ทันทีที่หน้าเปิด — ทั้งที่คนส่วนใหญ่ไม่ได้จะฟัง เลยสร้าง iframe ตอนกดเท่านั้น
 * และใช้โดเมน youtube-nocookie.com ที่ไม่ตั้ง cookie จนกว่าจะกดเล่น
 *
 * autoplay=1 เล่นต่อจากการกดการ์ดได้เลย เพราะเบราว์เซอร์นับว่าผู้ใช้กดอะไรสักอย่างแล้ว
 * (บางเบราว์เซอร์ เช่น Safari อาจยังไม่ยอมเล่นเอง ต้องกดปุ่ม play ในวิดีโออีกที — ไม่เป็นไร)
 *
 * ขนาดขั้นต่ำ 200 px ตามข้อกำหนดของ YouTube สำหรับ player ที่ฝังในเว็บ
 * จอแคบ ๆ เลยใช้ min-h แทนการบีบตามสัดส่วน 16:9 ล้วน ๆ — ตั้งไว้ 206 เพราะ min-h นับรวมขอบ
 * 3 px บน-ล่าง (box-sizing: border-box) ถ้าตั้ง 200 ตัววิดีโอจริงจะเหลือแค่ 194
 * อยู่ในเนื้อหน้า ไม่ลอยค้างมุมจอ — เลื่อนผ่านไปเพลงก็ยังเล่นต่อ ปิดได้จากปุ่ม 🎵 บนแถบบน
 */
function MusicPanel({ lang, onStop }: { lang: Lang; onStop: () => void }) {
  return (
    <div className="oz-panel oz-pop mt-5 grid gap-4 p-3 sm:grid-cols-[400px_1fr] sm:items-center sm:p-4">
      <div className="aspect-video min-h-[206px] w-full overflow-hidden rounded-xl border-[3px] border-(--oz-ink) bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${N.music.videoId}?autoplay=1&rel=0`}
          title={N.music.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
      <div className="px-1">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-(--oz-yellow)">
          🎵 {t(N.music.nowPlaying, lang)}
        </p>
        <p className="mt-1.5 text-[15px] font-semibold">{N.music.title}</p>
        <button
          type="button"
          onClick={onStop}
          className="mt-3 rounded-lg border-2 border-(--oz-ink) bg-(--oz-night) px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-(--oz-sky) transition-colors hover:text-white"
        >
          ✕ {t(N.music.stop, lang)}
        </button>
      </div>
    </div>
  );
}
