"use client";

// ─────────────────────────────────────────────────────────────
// หน้าต่างลอยบนหน้า hub — ทุก route ลูกใน app/(home) ใช้ตัวนี้ (/work, /proof, …)
//
// พฤติกรรมเหมือนหน้าต่างของ /ozzy ที่ทดสอบมาแล้ว:
//   - เป็น dialog จริง (role="dialog" + aria-modal) เพราะหน้า hub ข้างหลังถูก inert ระหว่างเปิด
//   - เปิดมา → โฟกัสหัวหน้าต่าง (screen reader อ่านชื่อทันที คีย์บอร์ดเริ่มจากในหน้าต่าง)
//   - ปิดได้ 4 ทาง: Esc · ✕ · กดพื้นมืดรอบหน้าต่าง · ปุ่ม back ของเบราว์เซอร์ (เพราะหน้าต่างคือ URL จริง)
//
// ท้ายหน้าต่างมีปุ่ม ก่อนหน้า/ถัดไป: แทนการ "เลื่อนลงไปเรื่อย ๆ" ของหน้ายาวเดิม
// คนที่อยากอ่านครบทุกหัวข้อ กดถัดไปได้ตั้งแต่ 01 ถึง 06 โดยไม่ต้องกลับไปที่ตู้
//
// เนื้อหาแต่ละหน้าต่างเลือกจาก id ฝั่ง client (SECTIONS ข้างล่าง) ไม่ได้ส่งมาจาก page.tsx
// เพราะทุกส่วนต้องรู้ภาษาปัจจุบัน ซึ่งอยู่ใน state ของ shell — หน้า server ส่งฟังก์ชันข้ามมาไม่ได้
// ─────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHome } from "@/components/home/HomeShell";
import Snack from "@/components/home/Snack";
import Work from "@/components/home/sections/Work";
import Proof from "@/components/home/sections/Proof";
import Stack from "@/components/home/sections/Stack";
import Soft from "@/components/home/sections/Soft";
import Path from "@/components/home/sections/Path";
import Passions from "@/components/home/sections/Passions";
import { t } from "@/components/home/ui";
import { HOME, type Lang } from "@/lib/content";
import { neighbours, type WindowId } from "@/lib/home";

const SECTIONS: Record<WindowId, (p: { lang: Lang }) => React.ReactNode> = {
  work: Work,
  proof: Proof,
  stack: Stack,
  soft: Soft,
  path: Path,
  passions: Passions,
};

export default function HomeWindow({ id }: { id: WindowId }) {
  const { lang, href } = useHome();
  const router = useRouter();
  const head = useRef<HTMLHeadingElement>(null);
  const w = HOME.windows[id];
  const W = HOME.window;
  const { prev, next } = neighbours(id);
  const Body = SECTIONS[id];
  const close = useCallback(() => router.push(href("/")), [router, href]);

  useEffect(() => {
    head.current?.focus();
  }, [id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div
      className="home-backdrop"
      onMouseDown={(e) => {
        // กดที่พื้นมืด (ไม่ใช่ในหน้าต่าง) = ปิด
        if (e.target === e.currentTarget) close();
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby={`win-${id}`} className="home-window">
        <header className="home-win-bar">
          <Snack id={w.snack} className="h-9 w-9 flex-none" />
          <span className="font-mono text-[10.5px] tracking-[0.16em] text-yellow">{w.n}</span>
          <h2
            id={`win-${id}`}
            ref={head}
            tabIndex={-1}
            className="min-w-0 flex-1 truncate text-[clamp(17px,2.6vw,22px)] font-bold tracking-[-0.02em] outline-none"
          >
            {t(w.title, lang)}
          </h2>
          <Link href={href("/")} aria-label={t(W.close, lang)} className="home-win-x">
            ✕
          </Link>
        </header>

        <div className="home-win-body">
          <Body lang={lang} />

          {/* ก่อนหน้า / ถัดไป — อ่านต่อกันได้ทั้งเว็บ */}
          <nav aria-label={`${t(W.prev, lang)} / ${t(W.next, lang)}`} className="mt-10 grid gap-3 border-t border-line pt-5 sm:grid-cols-2">
            {prev ? (
              <Link href={href(`/${prev}`)} className="home-win-nav">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">← {t(W.prev, lang)}</span>
                <span className="mt-0.5 block font-semibold">
                  {HOME.windows[prev].n} · {t(HOME.windows[prev].nav, lang)}
                </span>
              </Link>
            ) : (
              <Link href={href("/")} className="home-win-nav">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">←</span>
                <span className="mt-0.5 block font-semibold">{t(W.back, lang)}</span>
              </Link>
            )}
            {next ? (
              <Link href={href(`/${next}`)} className="home-win-nav sm:text-right">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{t(W.next, lang)} →</span>
                <span className="mt-0.5 block font-semibold">
                  {HOME.windows[next].n} · {t(HOME.windows[next].nav, lang)}
                </span>
              </Link>
            ) : (
              <Link href={href("/")} className="home-win-nav sm:text-right">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">→</span>
                <span className="mt-0.5 block font-semibold">{t(W.back, lang)}</span>
              </Link>
            )}
          </nav>
        </div>
      </section>
    </div>
  );
}
