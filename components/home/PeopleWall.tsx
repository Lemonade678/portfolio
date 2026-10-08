"use client";

// ─────────────────────────────────────────────────────────────
// กำแพงรูป "ผู้คนที่ได้เจอ" ในหน้าต่าง 04 People — กดรูปไหนก็ขยายดูเต็ม ๆ
//
// รูปย่อครอปเป็น 3:4 เท่ากันหมดให้กำแพงเรียบ (object-cover) · กล่องขยายโชว์รูปเต็มไม่ครอป
//
// กล่องขยาย (lightbox) ซ้อนอยู่บนหน้าต่างอีกชั้น เลยต้องระวังสองเรื่อง:
//   1. Esc ต้องปิด "รูป" ก่อน ไม่ใช่ปิดทั้งหน้าต่าง — ฟังแบบ capture แล้ว preventDefault
//      หน้าต่าง (HomeWindow) เห็น defaultPrevented แล้วจะไม่ปิดตาม
//   2. วาดผ่าน portal ไปที่ <body> — ถ้าวาดในหน้าต่าง position: fixed จะไปอิงกล่องของหน้าต่าง
//      (backdrop-filter / animation transform ของหน้าต่างทำให้ fixed ไม่อิงจอ) รูปจะโผล่ผิดที่
// ปิดแล้วโฟกัสกลับไปที่รูปย่อที่กดเปิด
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { t } from "@/components/home/ui";
import { PEOPLE, type Lang } from "@/lib/content";

export default function PeopleWall({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState<number | null>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const photo = open === null ? null : PEOPLE.photos[open];

  useEffect(() => {
    if (open === null) return;
    const which = open;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setOpen(null);
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      thumbs.current[which]?.focus();
    };
  }, [open]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {PEOPLE.photos.map((p, i) => (
          <li key={p.id}>
            <figure>
              <button
                ref={(el) => {
                  thumbs.current[i] = el;
                }}
                type="button"
                onClick={() => setOpen(i)}
                className="block w-full overflow-hidden rounded-xl border border-line bg-surface2 transition-transform hover:-translate-y-0.5"
              >
                <img
                  src={p.src}
                  alt={t(p.alt, lang)}
                  width={p.w}
                  height={p.h}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/4] w-full object-cover"
                />
              </button>
              <figcaption className="mt-1.5 text-[12px] leading-snug text-muted">{t(p.caption, lang)}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {photo &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t(photo.caption, lang)}
            className="fixed inset-0 z-[60] grid place-items-center bg-black/85 p-4"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setOpen(null);
            }}
          >
            <figure className="flex max-h-full flex-col items-center">
              <img
                src={photo.src}
                alt={t(photo.alt, lang)}
                width={photo.w}
                height={photo.h}
                className="max-h-[78dvh] w-auto max-w-full rounded-xl border border-line object-contain"
              />
              <figcaption className="mt-3 text-center text-[13.5px] text-ink2">{t(photo.caption, lang)}</figcaption>
              <button
                ref={closeBtn}
                type="button"
                onClick={() => setOpen(null)}
                className="mt-3 rounded-lg border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink2 hover:border-yellow hover:text-yellow"
              >
                ✕ {t(PEOPLE.close, lang)}
              </button>
            </figure>
          </div>,
          document.body,
        )}
    </>
  );
}
