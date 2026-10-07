"use client";

// ─────────────────────────────────────────────────────────────
// กล่องเพลงมุมจอ — MV "สวัสดีอะไร??" จากช่องของเขาเอง
//
// อยู่ที่ shell ไม่ใช่ในหน้าต่างดันเจี้ยน: สลับหน้าต่างแล้วเพลงเล่นต่อ (หน้าต่างถูก unmount ทุกครั้งที่สลับ)
// iframe สร้างตอนสั่งเปิดเท่านั้น (กดการ์ด M'Baku หรือซื้อในร้าน) ก่อนหน้านั้นไม่มี request ไป YouTube
// ใช้ youtube-nocookie.com ที่ไม่ตั้ง cookie จนกว่าจะกดเล่น
//
// ขนาด: ตัววิดีโอสูงอย่างน้อย 200 px ตามข้อกำหนดของ YouTube สำหรับ player ที่ฝังในเว็บ
// มือถือเลยกินที่ด้านล่างพอสมควร — ปิดได้จากปุ่ม ✕ ที่นี่ หรือ 🎵 บนแถบบน
// autoplay=1 เล่นต่อจากการกดได้ เพราะเบราว์เซอร์นับว่าผู้ใช้เพิ่งกดอะไรบางอย่าง
// (Safari อาจยังไม่ยอมเล่นเอง ต้องกด play ในวิดีโออีกที — ไม่เป็นไร)
// ─────────────────────────────────────────────────────────────

import type { Lang } from "@/lib/content";
import { OZZY } from "@/lib/ozzy/content";
import { t } from "./ui";

export default function MusicDock({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const M = OZZY.music;
  return (
    <aside
      aria-label={t(M.nowPlaying, lang)}
      className="oz fixed inset-x-2 bottom-2 z-[65] overflow-hidden rounded-2xl border-[3px] border-(--oz-ink) bg-(--oz-surface) shadow-[6px_6px_0_var(--oz-ink)] sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-[372px]"
    >
      <div className="flex items-center gap-2 border-b-[3px] border-(--oz-ink) px-3 py-2">
        <p className="min-w-0 flex-1 truncate text-[12.5px]">
          <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-(--oz-yellow)">🎵 {t(M.nowPlaying, lang)}</span>{" "}
          {M.title}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label={t(M.stop, lang)}
          className="grid h-7 w-7 flex-none place-items-center rounded-lg border-2 border-(--oz-ink) bg-(--oz-night) text-[12px] font-bold text-(--oz-sky)"
        >
          ✕
        </button>
      </div>
      <div className="aspect-video min-h-[200px] w-full bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${M.videoId}?autoplay=1&rel=0`}
          title={M.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    </aside>
  );
}
