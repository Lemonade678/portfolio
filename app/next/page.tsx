"use client";

// ─────────────────────────────────────────────────────────────
// หน้า teaser งานชิ้นถัดไป — เว็บไซต์สำหรับ TheOzzy
//
// ทั้งหน้าใช้สีจากช่อง YouTube ของเขา (ตัวแปร --oz-* ใต้คลาส .oz ใน globals.css)
// ไม่ใช่สีของพอร์ต — ตั้งใจให้รู้สึกว่าเดินผ่านประตูไปอีกโลก
//
// เขาเล่นเกมการ์ดกับ roguelike และชอบลุ้นไฮโรล หน้านี้เลยทำเป็นรันสั้น ๆ สามองก์:
//   ACT I   เลือกฮีโร่ — สามตัวโปรดของเขา (Heroes.tsx) · M'Baku มีเพลงเปิดตัว
//   ACT II  ลงดันเจี้ยน 4 ห้อง เลือกเซฟหรือไฮโรลทุกห้อง (RunGame.tsx · กติกาใน game.ts)
//   ACT III วงล้อ — โดน "ทาแป้ง" แล้วทั้งหน้าโดนแป้ง (Wheel.tsx · Powder.tsx)
// แถบบนโชว์หัวใจกับทองตลอด เลื่อนไปอ่านส่วนไหนก็ยังรู้ว่ารันอยู่ถึงไหน
//
// state ทั้งหมดอยู่ที่ไฟล์นี้ไฟล์เดียว เพราะส่วนต่าง ๆ คุยกันข้ามองก์:
// วงล้อเติมทอง/โบนัสให้ดันเจี้ยน · เลือก M'Baku เปิดเพลง · ทาแป้งกระทบทั้งหน้า
// ─────────────────────────────────────────────────────────────

import { useEffect, useReducer, useState } from "react";
import Link from "next/link";
import BrandIcon from "@/components/BrandIcon";
import { Bolt } from "@/components/NextRun";
import { NEXT_RUN as N, type Lang, type OzHero, type OzSliceId } from "@/lib/content";
import { initialRun, MAX_HP, runReducer, type RunState } from "./game";
import Heroes from "./Heroes";
import Powder from "./Powder";
import RunGame from "./RunGame";
import Wheel from "./Wheel";
import { t } from "./ui";

/** สีพื้นของหน้านี้ — ต้องตรงกับ --oz-night ใน globals.css */
const NIGHT = "#12112c";

export default function NextRunPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [run, dispatch] = useReducer(runReducer, initialRun);
  const [music, setMusic] = useState(false);
  const [powdered, setPowdered] = useState(false);
  const [timesPowdered, setTimesPowdered] = useState(0);

  // ภาษามาจาก ?lang=th (การ์ดบนหน้าหลักแนบมาให้) — อ่านใน effect เพราะตอน prerender ไม่มี URL
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q === "th" || q === "en") setLang(q);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // พื้นของ body เป็นน้ำตาลของหน้าหลัก (ตั้งใน globals.css) — เลื่อนเกินขอบบนมือถือ
  // จะเห็นแถบน้ำตาลโผล่ เลยเปลี่ยนเป็นครามระหว่างอยู่หน้านี้ แล้วคืนค่าเดิมตอนออก
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = NIGHT;
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);

  const switchLang = (l: Lang) => {
    setLang(l);
    // เก็บภาษาไว้ใน URL ด้วย ลิงก์ที่ก๊อปไปแชร์จะได้เปิดเป็นภาษาเดียวกัน
    window.history.replaceState(null, "", l === "th" ? "?lang=th" : window.location.pathname);
  };

  const pick = (h: OzHero) => {
    dispatch({ type: "pick", hero: h.id });
    if (h.music) setMusic(true);
  };

  const onWheel = (id: OzSliceId) => {
    if (id === "powder") {
      setPowdered(true);
      setTimesPowdered((n) => n + 1);
    } else if (id === "gold") dispatch({ type: "gold", amount: 100 });
    else if (id === "jackpot") dispatch({ type: "gold", amount: 300 });
    else if (id === "luck") dispatch({ type: "luck" });
  };

  return (
    <>
      <main className={`oz oz-grid oz-main min-h-screen ${powdered ? "oz-powdered" : ""}`}>
        <TopBar
          lang={lang}
          onLang={switchLang}
          run={run}
          music={music}
          onStopMusic={() => setMusic(false)}
        />

        <div className="mx-auto max-w-[960px] px-5 pb-16 sm:px-8">
          <Header lang={lang} />

          <Heroes
            lang={lang}
            hero={run.hero}
            music={music}
            onPick={pick}
            onStopMusic={() => setMusic(false)}
          />

          {/* key = เลขรัน → เริ่มรันใหม่เมื่อไหร่ ส่วนนี้ remount ล้างลูกเต๋า/ผลค้างให้เอง */}
          <RunGame key={run.runId} run={run} dispatch={dispatch} lang={lang} />

          <Wheel lang={lang} onResult={onWheel} />

          <About lang={lang} />
        </div>
      </main>

      {powdered && (
        <Powder lang={lang} times={timesPowdered} onWash={() => setPowdered(false)} />
      )}
    </>
  );
}

// ── แถบบน: ทางกลับ · สถานะรัน · สลับภาษา ─────────────────────

function TopBar({
  lang,
  onLang,
  run,
  music,
  onStopMusic,
}: {
  lang: Lang;
  onLang: (l: Lang) => void;
  run: RunState;
  music: boolean;
  onStopMusic: () => void;
}) {
  const hero = N.heroes.find((h) => h.id === run.hero);
  return (
    <div className="sticky top-0 z-40 border-b-2 border-(--oz-ink) bg-(--oz-night)/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[960px] items-center justify-between gap-3 px-4 sm:px-8">
        <Link
          href="/"
          className="flex-none border-b border-transparent pb-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-(--oz-sky) transition-colors hover:border-(--oz-yellow) hover:text-(--oz-yellow)"
        >
          {t(N.page.back, lang)}
        </Link>

        {/* สถานะรัน — โผล่หลังเลือกฮีโร่ กดแล้วเลื่อนไปที่ดันเจี้ยน */}
        <div className="flex min-w-0 items-center gap-2.5">
          {hero && (
            <a
              href="#run"
              className="flex min-w-0 items-center gap-2 rounded-full border-2 border-(--oz-ink) bg-(--oz-surface) py-0.5 pl-0.5 pr-3 font-mono text-[12px]"
            >
              <img
                src={hero.img}
                alt=""
                width={320}
                height={320}
                className="h-7 w-7 flex-none rounded-full object-cover"
              />
              <span aria-label={`${run.hp}/${MAX_HP} ${t(N.hud.hearts, lang)}`} className="tracking-[0.05em]">
                {Array.from({ length: MAX_HP }, (_, i) => (
                  <span key={i} className={i < run.hp ? "text-white" : "text-(--oz-sky)/30"}>
                    ♥
                  </span>
                ))}
              </span>
              <span aria-label={`${run.gold} ${t(N.hud.gold, lang)}`} className="text-(--oz-yellow)">
                🪙 {run.gold}
              </span>
            </a>
          )}
          {music && (
            <button
              type="button"
              onClick={onStopMusic}
              aria-label={t(N.music.stop, lang)}
              title={t(N.music.stop, lang)}
              className="grid h-8 w-8 flex-none place-items-center rounded-full border-2 border-(--oz-ink) bg-(--oz-surface) text-[13px]"
            >
              🎵
            </button>
          )}
        </div>

        <div
          role="group"
          aria-label="Language"
          className="flex flex-none overflow-hidden rounded-full border-2 border-(--oz-ink) bg-(--oz-surface)"
        >
          {(["en", "th"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => onLang(l)}
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

// ── หัวเรื่อง ─────────────────────────────────────────────────

function Header({ lang }: { lang: Lang }) {
  return (
    <header className="pt-12 sm:pt-16">
      <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-(--oz-yellow)">
        <Bolt className="h-4 w-4" />
        {t(N.page.eyebrow, lang)}
      </p>
      <h1 className="oz-title mt-3 text-[clamp(34px,7vw,64px)] font-bold leading-[1.05] tracking-[-0.03em]">
        {t(N.page.titleLead, lang)} <span className="oz-glow">{N.streamer.name}</span>
      </h1>
      <p className="mt-4 max-w-[62ch] text-[clamp(15px,2vw,17px)] leading-relaxed text-(--oz-sky)">
        {t(N.page.lede, lang)}
      </p>
      {/* ช่องทางของเขา — YouTube กับเพจ Facebook */}
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
        {[
          { href: N.streamer.youtube, brand: "youtube" as const, label: `${t(N.page.watch, lang)} · ${N.streamer.handle}` },
          { href: N.streamer.facebook, brand: "facebook" as const, label: t(N.page.facebook, lang) },
        ].map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-b-2 border-(--oz-blue) pb-0.5 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:text-(--oz-blue)"
          >
            <BrandIcon brand={l.brand} size={18} />
            {l.label} ↗
          </a>
        ))}
      </div>
    </header>
  );
}

// ── สถานะงาน · ชุดสี · เครดิต ─────────────────────────────────

function About({ lang }: { lang: Lang }) {
  return (
    <>
      <section className="mt-16 grid gap-4 md:grid-cols-[1fr_1.5fr]">
        <div className="oz-panel p-6">
          <h2 className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-(--oz-sky)">
            {t(N.page.statusTitle, lang)}
          </h2>
          <p className="mt-3 flex items-center gap-2.5 text-[18px] font-semibold">
            {/* จุดกะพริบ = กำลังทำอยู่ (คนที่ปิด animation จะเห็นเป็นจุดนิ่ง) */}
            <span className="relative flex h-2.5 w-2.5 flex-none">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--oz-yellow) opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-(--oz-yellow)" />
            </span>
            {t(N.page.status, lang)}
          </p>
        </div>

        <div className="oz-panel p-6">
          <h2 className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-(--oz-sky)">
            {t(N.page.paletteTitle, lang)}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {N.palette.map((c) => (
              <li key={c.hex} className="flex items-start gap-3 text-[13.5px] text-(--oz-sky)">
                <span
                  className="mt-0.5 h-5 w-8 flex-none rounded-md border-2 border-(--oz-ink) ring-1 ring-white/25"
                  style={{ background: c.hex }}
                  aria-hidden="true"
                />
                <span>
                  <span className="font-mono text-[12px] text-white">{c.hex}</span> · {t(c.label, lang)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="mx-auto mt-12 max-w-[64ch] space-y-2 text-center text-[12px] leading-relaxed text-(--oz-sky)/75">
        <p>{t(N.page.footnote, lang)}</p>
        <p>{t(N.page.credits, lang)}</p>
      </footer>
    </>
  );
}
