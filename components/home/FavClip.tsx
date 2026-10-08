"use client";

// ─────────────────────────────────────────────────────────────
// คลิปสั้นของสตรีมเมอร์คนโปรด (TheOzzy) — วางข้างการ์ด TheOzzy ท้ายหน้าต่าง 04 People
//
// ก่อนกด: โชว์แค่ภาพปก ผ่าน next/image (เซิร์ฟเวอร์ของเว็บดึงภาพให้) — เบราว์เซอร์คนดูยังไม่ได้คุยกับ YouTube เลย
// กดแล้ว: ค่อยสร้าง iframe ของ youtube-nocookie แบบเดียวกับหน้าต่างคลิปใน /ozzy
// ตัวเล่น 9:16 กว้าง 206 px (เกินขั้นต่ำ 200 px ของ YouTube แม้หักขอบแล้ว)
// ภาพปก hqdefault ของ Shorts เป็น 4:3 มีแถบดำซ้ายขวา — object-cover ในกรอบแนวตั้งครอปเหลือแต่ตัวคลิป
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import Image from "next/image";
import { t } from "@/components/home/ui";
import { PEOPLE, type Lang } from "@/lib/content";

export default function FavClip({ lang }: { lang: Lang }) {
  const F = PEOPLE.fav;
  const [playing, setPlaying] = useState(false);

  return (
    <div className="w-[206px] flex-none">
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl border border-line bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${F.videoId}?autoplay=1&rel=0`}
            title={F.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="h-full w-full"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 block" aria-label={`${t(F.play, lang)} — ${F.title}`}>
            <Image
              src={`https://i.ytimg.com/vi/${F.videoId}/hqdefault.jpg`}
              alt=""
              fill
              sizes="206px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 grid place-items-center bg-black/25 transition-colors group-hover:bg-black/10" aria-hidden="true">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-yellow text-[18px] text-bg shadow-lg">▶</span>
            </span>
            <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-yellow">Shorts</span>
          </button>
        )}
      </div>
      <p className="mt-2 line-clamp-2 text-[12px] leading-snug text-muted">{F.title}</p>
    </div>
  );
}
