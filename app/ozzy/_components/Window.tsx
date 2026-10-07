"use client";

// ─────────────────────────────────────────────────────────────
// หน้าต่างลอยบนโต๊ะ — ทุก route ลูกใต้ /ozzy ห่อเนื้อหาด้วยตัวนี้
//
// เป็น dialog จริง (role="dialog" + aria-modal) เพราะระหว่างเปิด โต๊ะข้างหลังถูก inert แล้ว
// เปิดมา → โฟกัสไปที่หัวหน้าต่าง (screen reader อ่านชื่อหน้าต่างทันที คีย์บอร์ดเริ่มจากในหน้าต่าง)
// ปิดได้สามทาง: ✕ · Esc · กดพื้นมืดรอบหน้าต่าง — ทุกทางคือ "ไปที่ /ozzy"
// ปุ่ม back ของเบราว์เซอร์ก็ได้ผลเดียวกันโดยไม่ต้องเขียนอะไร เพราะหน้าต่างคือ URL จริง
//
// ลูกในหน้าต่าง (เช่น รูปขยายในโปรไฟล์) ที่อยากใช้ Esc ปิดตัวเองก่อน ให้เรียก e.preventDefault()
// ในตัวฟังแบบ capture — หน้าต่างจะเห็น defaultPrevented แล้วไม่ปิดตาม
// ─────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OZZY, type CardId } from "@/lib/ozzy/content";
import { useOzzy } from "./OzzyShell";
import { Art, t } from "./ui";

export default function Window({
  card,
  extra,
  children,
}: {
  card: CardId;
  /** ของเสริมบนแถบชื่อ (เช่น ยอดแต้มในร้าน) */
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { lang, href } = useOzzy();
  const router = useRouter();
  const head = useRef<HTMLHeadingElement>(null);
  const c = OZZY.cards.find((x) => x.id === card)!;
  const close = useCallback(() => router.push(href("/ozzy")), [router, href]);

  useEffect(() => {
    head.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div
      className="oz-backdrop"
      onMouseDown={(e) => {
        // กดที่พื้นมืด (ไม่ใช่ในหน้าต่าง) = ปิด
        if (e.target === e.currentTarget) close();
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby={`win-${card}`} className="oz-window">
        <header className="oz-win-bar">
          <span className="oz-win-art">
            <Art art={c.art} />
          </span>
          <h2 id={`win-${card}`} ref={head} tabIndex={-1} className="min-w-0 flex-1 truncate text-[18px] font-bold outline-none [text-shadow:2px_2px_0_var(--oz-ink)]">
            {t(c.name, lang)}
          </h2>
          {extra}
          <Link href={href("/ozzy")} aria-label={t(OZZY.table.close, lang)} className="oz-win-x">
            ✕
          </Link>
        </header>
        <div className="oz-win-body">{children}</div>
      </section>
    </div>
  );
}
