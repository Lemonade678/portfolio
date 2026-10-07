"use client";

// ตัวช่วยที่ทุกส่วนของหน้าหลักใช้ร่วมกัน — ย้ายมาจาก app/page.tsx ตามตัวอักษร
// (แยกไฟล์เพราะตอนนี้เนื้อหาแต่ละหัวข้อไปอยู่ในหน้าต่างของตัวเอง ไม่ได้อยู่ในไฟล์เดียวกันแล้ว)

import { useEffect, useRef, type CSSProperties } from "react";
import BrandIcon, { brandOf, hostOf } from "@/components/BrandIcon";
import { ACCENT_HEX, type Accent, type L10n, type Lang } from "@/lib/content";

// ── ตัวช่วยเล็ก ๆ ─────────────────────────────────────────────

/** หยิบข้อความตามภาษาที่เลือกอยู่ */
export const t = (s: L10n, lang: Lang) => s[lang];

/** ส่งสีประจำโปรเจกต์เข้า CSS ผ่านตัวแปร --c */
export const accentVar = (a: Accent): CSSProperties =>
  ({ "--c": ACCENT_HEX[a] }) as CSSProperties;

/** ค่อย ๆ เผยขึ้นมาตอนเลื่อนถึง — เคารพ prefers-reduced-motion ผ่าน CSS */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.shown = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.shown = "true";
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

export const CHIP =
  "font-mono text-[10.5px] px-2.5 py-1 rounded-md bg-surface2 border border-line text-ink2";

/** สีหัวข้อของการ์ด soft skill — วนตามลำดับ ไม่ได้ผูกกับความหมายเหมือนสีโปรเจกต์
 *  ใช้แค่ให้สามใบไม่กลืนกันเป็นบล็อกเทาก้อนเดียว */
export const SOFT_ACCENTS: Accent[] = ["yellow", "pink", "blue"];

/**
 * ลิงก์ท้ายการ์ด — มีโลโก้ของปลายทาง และป็อปอัพบอกว่ากดแล้วไปไหน
 *
 * ทำไมต้องมีป็อปอัพ: ข้อความอย่าง "Code on GitHub →" บอกแค่ว่าไป GitHub
 * แต่ไม่ได้บอกว่า repo ไหน คนที่กำลังจะกดลิงก์ออกนอกเว็บควรเห็น host + path
 * ก่อนกด เป็นมารยาทพื้นฐานและช่วยให้ดูน่าเชื่อถือขึ้นด้วย
 *
 * ทำด้วย CSS ล้วน (group-hover / group-focus-within) ไม่มี JS ไม่มี state
 * และใส่ focus-within ด้วย เพราะคนที่ใช้คีย์บอร์ดก็ต้องเห็นป็อปอัพเหมือนกัน
 */
export function CardLink({
  href,
  children,
  color,
}: {
  href: string;
  children: React.ReactNode;
  color: string;
}) {
  // ลิงก์ที่ขึ้นต้นด้วย / คือไฟล์ในเว็บเราเอง ไม่ใช่การออกนอกเว็บ
  // ไม่ต้องมีโลโก้บริการ และไม่ต้องเตือนว่าจะไปไหน
  const internal = href.startsWith("/");
  const brand = brandOf(href);

  return (
    <span className="group relative inline-flex">
      <a
        href={href}
        target={internal ? undefined : "_blank"}
        rel={internal ? undefined : "noopener noreferrer"}
        className="inline-flex items-center gap-1.5 border-b pb-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em]"
        style={{ color }}
      >
        {!internal && <BrandIcon brand={brand} size={13} />}
        {children}
      </a>

      {!internal && (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-0 z-30 mb-2 flex translate-y-1 items-center gap-2 whitespace-nowrap rounded-lg border border-line bg-surface2 px-2.5 py-2 opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
        >
          <BrandIcon brand={brand} size={20} className="flex-none" style={{ color }} />
          <span className="font-mono text-[10.5px] normal-case tracking-normal text-ink2">
            {hostOf(href)}
          </span>
        </span>
      )}
    </span>
  );
}

/**
 * ช่อง Problem / Approach / Result
 * ช่อง Result รับ HTML ได้เพื่อให้ใส่ <strong> เน้นตัวเลขได้
 * เนื้อหามาจาก content.ts ที่เราเขียนเอง ไม่ได้รับจากผู้ใช้ จึงปลอดภัย
 */
export function Field({
  label,
  children,
  html,
}: {
  label: string;
  children?: React.ReactNode;
  html?: string;
}) {
  return (
    <div>
      <h4 className="mb-2 font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </h4>
      {html ? (
        <p
          className="result text-sm leading-relaxed text-ink2"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className="text-sm leading-relaxed text-ink2">{children}</p>
      )}
    </div>
  );
}
