"use client";

// ─────────────────────────────────────────────────────────────
// หน้าต่างคลิป — ข้อมูลมาจาก RSS ของช่อง (ดึงฝั่งเซิร์ฟเวอร์ใน app/ozzy/clips/page.tsx แคช 1 ชม.)
//
// แท็บ:
//   ล่าสุด        — คลิปยาว เรียงใหม่ → เก่า
//   ไฮไลต์ตามเกม — จัดกลุ่มตามชื่อเกมท้ายชื่อคลิป ในกลุ่มเรียงตามยอดวิว
//   มีม           — Shorts
//   คลิปเด่น      — รายการที่เจ้าของเว็บเลือกเอง (OZZY.featured) เพราะ RSS เห็นแค่ 15 คลิปล่าสุด
//
// RSS ล่ม (feed.ok = false) → ซ่อนสามแท็บแรก เหลือคลิปเด่น + ข้อความบอกตรง ๆ — หน้าไม่พัง
//
// ภาพปกโหลดผ่าน next/image (Vercel ดึงให้) — เบราว์เซอร์คนดูไม่ได้ยิงไปหา Google จนกว่าจะกดเล่น
// กดเล่นแล้วค่อยสร้าง iframe ของ youtube-nocookie (สูงอย่างน้อย 200 px ตามข้อกำหนด YouTube)
//
// วันที่ฟอร์แมตด้วยโซนเวลา Asia/Bangkok ตายตัว — ตอน prerender บนเซิร์ฟเวอร์ (UTC) กับในเบราว์เซอร์
// จะได้วันเดียวกันเสมอ ไม่งั้นคลิปที่ลงตอนตีหนึ่งจะโชว์คนละวันแล้ว React ฟ้อง hydration mismatch
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Lang } from "@/lib/content";
import { OZZY } from "@/lib/ozzy/content";
import type { Feed, Video } from "@/lib/ozzy/youtube";
import { useOzzy } from "./OzzyShell";
import { num, t } from "./ui";

type Tab = "latest" | "games" | "memes" | "featured";

interface Playing {
  id: string;
  short: boolean;
  title: string;
}

const fmtDate = (iso: string, lang: Lang) =>
  new Intl.DateTimeFormat(lang === "th" ? "th-TH" : "en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Bangkok",
  }).format(new Date(iso));

/** จัดกลุ่มตามเกม — กลุ่มที่มีคลิปมากขึ้นก่อน "อื่น ๆ" ไว้ท้ายสุดเสมอ */
function byGame(videos: Video[]) {
  const groups = new Map<string | null, Video[]>();
  for (const v of videos.filter((x) => !x.isShort)) {
    groups.set(v.game, [...(groups.get(v.game) ?? []), v]);
  }
  return [...groups.entries()]
    .map(([game, list]) => [game, [...list].sort((a, b) => b.views - a.views)] as const)
    .sort((a, b) => (a[0] === null ? 1 : b[0] === null ? -1 : b[1].length - a[1].length));
}

export default function ClipsWindow({ feed }: { feed: Feed }) {
  const { lang } = useOzzy();
  const C = OZZY.clips;
  const [tab, setTab] = useState<Tab>(feed.ok ? "latest" : "featured");
  const [playing, setPlaying] = useState<Playing | null>(null);
  const player = useRef<HTMLDivElement>(null);

  // ตัวเล่นอยู่บนสุดของหน้าต่าง — กดคลิปที่อยู่ล่าง ๆ แล้วต้องเลื่อนขึ้นไปให้เห็น ไม่งั้นได้ยินแต่เสียง
  useEffect(() => {
    if (playing) player.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [playing]);

  const tabs: Tab[] = feed.ok ? ["latest", "games", "memes", "featured"] : ["featured"];
  const latest = feed.videos.filter((v) => !v.isShort);
  const memes = feed.videos.filter((v) => v.isShort);

  const play = (p: Playing) => setPlaying(p);

  return (
    <div className="space-y-5">
      {!feed.ok && <p className="rounded-xl border-2 border-(--oz-ink) bg-(--oz-night) px-4 py-3 text-[13.5px] text-(--oz-sky)">{t(C.down, lang)}</p>}

      {playing && (
        <div ref={player} className="oz-pop scroll-mt-4">
          {/* Shorts เป็นแนวตั้ง 9:16 — จำกัดความสูงไม่เกิน 60% ของจอ (แต่กว้างไม่ต่ำกว่า 200 px ตามข้อกำหนด YouTube) */}
          <div
            className={`mx-auto overflow-hidden rounded-xl border-[3px] border-(--oz-ink) bg-black ${
              playing.short ? "aspect-[9/16] w-[max(206px,min(300px,100%,calc(60dvh*9/16)))]" : "aspect-video min-h-[206px] w-full"
            }`}
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${playing.id}?autoplay=1&rel=0`}
              title={playing.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
          <div className="mt-2 flex items-start justify-between gap-3">
            <p className="text-[13.5px] font-semibold leading-snug">{playing.title}</p>
            <button
              type="button"
              onClick={() => setPlaying(null)}
              className="flex-none rounded-lg border-2 border-(--oz-ink) bg-(--oz-night) px-2.5 py-1 font-mono text-[11px] font-bold text-(--oz-sky)"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div role="tablist" aria-label={t(C.title, lang)} className="flex flex-wrap gap-2">
        {tabs.map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`rounded-lg border-2 border-(--oz-ink) px-3 py-1.5 font-mono text-[11.5px] font-bold uppercase tracking-[0.08em] ${
              tab === k ? "bg-(--oz-yellow) text-(--oz-ink)" : "bg-(--oz-night) text-(--oz-sky)"
            }`}
          >
            {t(C.tabs[k], lang)}
            {k === "latest" && ` · ${latest.length}`}
            {k === "memes" && ` · ${memes.length}`}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {tab === "latest" && <Grid videos={latest} lang={lang} onPlay={play} />}
        {tab === "memes" && <Grid videos={memes} lang={lang} onPlay={play} />}
        {tab === "games" &&
          byGame(feed.videos).map(([game, list]) => (
            <section key={game ?? "other"} className="mb-6">
              <h3 className="mb-2.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-(--oz-yellow)">
                {game ?? t(C.other, lang)} · {list.length}
              </h3>
              <Grid videos={list} lang={lang} onPlay={play} />
            </section>
          ))}
        {tab === "featured" && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {OZZY.featured.map((f) => (
              <li key={f.videoId}>
                <ClipCard
                  id={f.videoId}
                  title={f.title}
                  thumb={`https://i.ytimg.com/vi/${f.videoId}/hqdefault.jpg`}
                  tag={f.short ? "Shorts" : undefined}
                  onPlay={() => play({ id: f.videoId, short: !!f.short, title: f.title })}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-(--oz-blue)/20 pt-4">
        <a href={OZZY.links.youtube} target="_blank" rel="noopener noreferrer" className="font-mono text-[12px] font-bold text-(--oz-yellow) underline underline-offset-2">
          {t(C.all, lang)}
        </a>
        <p className="text-[11.5px] text-(--oz-sky)/70">{t(C.credit, lang)}</p>
      </div>
    </div>
  );
}

function Grid({ videos, lang, onPlay }: { videos: Video[]; lang: Lang; onPlay: (p: Playing) => void }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {videos.map((v) => (
        <li key={v.id}>
          <ClipCard
            id={v.id}
            title={v.title}
            thumb={v.thumb}
            meta={`${fmtDate(v.published, lang)} · ${num(v.views, lang)} ${t(OZZY.clips.views, lang)}`}
            tag={v.isShort ? "Shorts" : (v.game ?? undefined)}
            onPlay={() => onPlay({ id: v.id, short: v.isShort, title: v.title })}
          />
        </li>
      ))}
    </ul>
  );
}

function ClipCard({
  id,
  title,
  thumb,
  meta,
  tag,
  onPlay,
}: {
  id: string;
  title: string;
  thumb: string;
  meta?: string;
  tag?: string;
  onPlay: () => void;
}) {
  return (
    <button type="button" onClick={onPlay} className="oz-clip group block w-full text-left" data-video={id}>
      <span className="relative block aspect-video overflow-hidden border-b-[3px] border-(--oz-ink) bg-black">
        {/* ภาพปก hqdefault เป็น 4:3 มีแถบดำบนล่าง — object-cover ในกรอบ 16:9 ตัดแถบทิ้ง */}
        {thumb && <Image src={thumb} alt="" fill sizes="(max-width: 640px) 50vw, 260px" className="object-cover" />}
        <span className="absolute inset-0 grid place-items-center bg-black/0 transition-colors group-hover:bg-black/30" aria-hidden="true">
          <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-(--oz-ink) bg-(--oz-yellow) text-[14px] text-(--oz-ink) opacity-0 transition-opacity group-hover:opacity-100">
            ▶
          </span>
        </span>
        {tag && (
          <span className="absolute left-1.5 top-1.5 rounded bg-(--oz-ink)/85 px-1.5 py-0.5 font-mono text-[9.5px] font-bold text-(--oz-yellow)">{tag}</span>
        )}
      </span>
      <span className="block px-2.5 pb-2.5 pt-2">
        <span className="line-clamp-2 block text-[12.5px] font-semibold leading-snug">{title}</span>
        {meta && <span className="mt-1 block font-mono text-[10.5px] text-(--oz-sky)/80">{meta}</span>}
      </span>
    </button>
  );
}
