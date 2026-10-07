"use client";

// หน้าต่างโปรไฟล์: รูป 3 รูป (กดดูใหญ่) · แนะนำตัว · ช่วงนี้เล่นอะไร · ช่องทางติดตาม + โดเนท
// ไม่ใส่ยอดผู้ติดตาม (เปลี่ยนทุกวัน) และไม่ใส่ตารางไลฟ์ (ยืนยันไม่ได้) — ดูเหตุผลใน lib/ozzy/content.ts

import { useEffect, useState } from "react";
import BrandIcon, { brandOf } from "@/components/BrandIcon";
import { OZZY, type OzPhoto } from "@/lib/ozzy/content";
import { useOzzy } from "./OzzyShell";
import { t } from "./ui";

export default function ProfileWindow({ games }: { games: string[] }) {
  const { lang } = useOzzy();
  const P = OZZY.profile;
  const [big, setBig] = useState<OzPhoto | null>(null);

  const links = [
    { key: "youtube", href: OZZY.links.youtube },
    { key: "facebook", href: OZZY.links.facebook },
    { key: "instagram", href: OZZY.links.instagram },
    { key: "donate", href: OZZY.links.donate },
  ] as const;

  return (
    <div className="space-y-7">
      <ul className="grid grid-cols-3 gap-3">
        {OZZY.photos.map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => setBig(p)} className="oz-photo block w-full" aria-label={t(p.alt, lang)}>
              <img src={p.src} alt="" width={p.w} height={p.h} className="aspect-[3/4] w-full object-cover" loading="lazy" />
            </button>
          </li>
        ))}
      </ul>

      <section>
        <p className="text-[15px] leading-relaxed">{t(P.about, lang)}</p>
        <p className="mt-3 text-[13.5px] text-(--oz-sky)">
          {t(P.hello, lang)} <q className="font-semibold text-white">{P.helloQuote}</q>
        </p>
      </section>

      {games.length > 0 && (
        <section>
          <h3 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-(--oz-yellow)">{t(P.gamesTitle, lang)}</h3>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {games.map((g) => (
              <li key={g} className="rounded-lg border-2 border-(--oz-ink) bg-(--oz-night) px-3 py-1 text-[13px] font-semibold">
                {g}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-(--oz-yellow)">{t(P.linksTitle, lang)}</h3>
        <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {links.map((l) => (
            <li key={l.key}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 rounded-xl border-2 border-(--oz-ink) px-3.5 py-3 text-[14px] font-semibold shadow-[3px_3px_0_var(--oz-ink)] transition-transform hover:-translate-y-0.5 ${
                  l.key === "donate" ? "bg-(--oz-yellow) text-(--oz-ink)" : "bg-(--oz-night)"
                }`}
              >
                {l.key === "donate" ? <span aria-hidden="true">☕</span> : <BrandIcon brand={brandOf(l.href)} size={18} />}
                {t(P.linkLabels[l.key], lang)}
                <span className="ml-auto opacity-70">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-[11.5px] text-(--oz-sky)/70">{t(P.credit, lang)}</p>

      {big && <Lightbox photo={big} onClose={() => setBig(null)} />}
    </div>
  );
}

/** รูปขยาย — Esc ปิดตัวนี้ก่อน (capture + preventDefault) หน้าต่างข้างหลังจะไม่ปิดตาม */
function Lightbox({ photo, onClose }: { photo: OzPhoto; onClose: () => void }) {
  const { lang } = useOzzy();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t(photo.alt, lang)}
      className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-4"
      onMouseDown={onClose}
    >
      <img
        src={photo.src}
        alt={t(photo.alt, lang)}
        width={photo.w}
        height={photo.h}
        className="max-h-[86vh] w-auto max-w-full rounded-2xl border-[3px] border-(--oz-ink) shadow-[8px_8px_0_var(--oz-ink)]"
      />
      <p className="mt-3 max-w-[60ch] text-center text-[13px] text-white/80">{t(photo.alt, lang)}</p>
    </div>
  );
}
