"use client";

// ─────────────────────────────────────────────────────────────
// ตู้ขนม — เมนูหลักของหน้า hub (6 ชั้น = 6 หน้าต่าง)
//
// ธีม "ขนม + YOLO": ขนมแต่ละชิ้นถูก "ตีกล่อง" แบบโปรแกรม label ชุดข้อมูลเทรนโมเดล
// (กรอบเส้นประ + ป้ายชื่อคลาสที่มุม) — แต่กล่องพวกนี้ตีเองด้วยมือ ไม่ได้มาจากโมเดล
// ใต้ตู้เลยมีบรรทัดบอกตรง ๆ ว่า "ตีกล่องเอง โมเดลจริงรันบนรูปข้างบน" (เว็บนี้ขายความตรงไปตรงมา)
//
// ลูกเล่นตอนเลื่อนมาเห็นตู้ครั้งแรก: เส้นสแกนกวาดจากบนลงล่างหนึ่งรอบ แล้วกล่องโผล่ทีละชั้น
// ข้อความมุมขวาเปลี่ยนจาก "กำลังตรวจจับ…" เป็น "6 ชิ้น · ตีกล่องเอง"
// คนที่ตั้ง "ลดการเคลื่อนไหว" ไว้ เห็นกล่องครบทันที ไม่มีเส้นกวาด
//
// โครง HTML ของแต่ละชั้น: <li> ที่มีลิงก์ตัวเดียว (ชื่อหัวข้อ) ซึ่งยืด ::after คลุมทั้งชั้น
// → กดตรงไหนของชั้นก็เปิดหน้าต่าง
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SecretText from "@/components/SecretText";
import { useHome } from "@/components/home/HomeShell";
import Snack from "@/components/home/Snack";
import { t } from "@/components/home/ui";
import { HOME } from "@/lib/content";
import { HOME_WINDOWS, counts } from "@/lib/home";

/** ต้องยาวกว่า animation ทั้งชุดใน globals.css (.counter[data-scan] — กวาด 1.1 s + กล่องชั้นสุดท้าย) */
const SCAN_MS = 1400;

type Scan = "idle" | "run" | "done";

export default function Counter() {
  const { lang, href } = useHome();
  const C = HOME.counter;
  const n = counts();
  const box = useRef<HTMLDivElement>(null);
  const [scan, setScan] = useState<Scan>("idle");

  // สแกนครั้งเดียวตอนตู้โผล่ในจอ — shell ไม่ถูก mount ใหม่ตอนเปิด/ปิดหน้าต่าง เลยไม่สแกนซ้ำ
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setScan("done");
      return;
    }
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setScan("run");
        timer = window.setTimeout(() => setScan("done"), SCAN_MS);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <section aria-labelledby="counter-title" className="pt-[clamp(52px,8vw,86px)]">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <div>
          <h2 id="counter-title" className="text-[clamp(22px,3.6vw,30px)] font-bold tracking-[-0.02em]">
            {t(C.title, lang)}
          </h2>
          <p className="mt-0.5 text-[13.5px] text-ink2">{t(C.kicker, lang)}</p>
        </div>
        {/* สถานะการ "ตรวจจับ" — ของตกแต่ง เลยไม่ประกาศให้ screen reader */}
        <p aria-hidden="true" className="font-mono text-[11px] uppercase tracking-[0.14em] text-yellow">
          {scan === "done" ? `${HOME_WINDOWS.length} ${t(C.labelled, lang)}` : scan === "run" ? t(C.detecting, lang) : " "}
        </p>
      </div>

      <div ref={box} className="counter" data-scan={scan === "idle" ? undefined : scan}>
        <span className="counter-scan" aria-hidden="true" />
        <ul>
          {HOME_WINDOWS.map((id, i) => {
            const w = HOME.windows[id];
            return (
              <li key={id} className="counter-row" style={{ "--i": i } as React.CSSProperties}>
                <span className="counter-snack" aria-hidden="true">
                  <Snack id={w.snack} className="h-full w-full" />
                  <span className="anno-box">
                    <span className="anno-tag">
                      {id} · {n[id]}
                    </span>
                  </span>
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[10.5px] tracking-[0.16em] text-yellow">{w.n}</span>
                  <Link href={href(`/${id}`)} className="counter-link">
                    {t(w.title, lang)}
                  </Link>
                  <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">
                    {t(w.note, lang)}
                    <span className="sm:hidden">
                      {" · "}
                      {n[id]} {t(w.unit, lang)}
                    </span>
                  </span>
                </span>

                <span className="hidden flex-none font-mono text-[11px] uppercase tracking-[0.12em] text-ink2 sm:block">
                  {n[id]} {t(w.unit, lang)} <span className="counter-arrow">→</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* e ตัวสุดท้ายของ LEMONADE ซ่อนอยู่ในคำ "label" ของบรรทัดนี้ */}
      <p className="mt-3 max-w-[62ch] text-[12px] leading-relaxed text-muted">
        <SecretText text={t(C.honesty, lang)} place="honesty" />
      </p>
    </section>
  );
}
