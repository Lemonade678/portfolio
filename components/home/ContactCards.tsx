"use client";

import BrandIcon, { brandOf } from "@/components/BrandIcon";
import { ACCENT_HEX, CONTACTS, type Lang } from "@/lib/content";
import { t } from "@/components/home/ui";

export default function ContactCards({
  lang,
  className = "",
}: {
  lang: Lang;
  className?: string;
}) {
  return (
    <div className={`grid gap-3 sm:grid-cols-3 ${className}`}>
      {CONTACTS.map((c) => (
        <a
          key={c.value}
          href={c.href}
          target={c.href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-yellow hover:bg-surface2"
        >
          {/* โลโก้เดาจาก href ไม่ได้เก็บแยกใน content.ts — กัน href กับไอคอนหลุดจากกัน */}
          <span
            className="grid h-7 w-7 flex-none place-items-center rounded-md"
            style={{
              color: ACCENT_HEX[c.accent],
              background: `${ACCENT_HEX[c.accent]}29`,
            }}
          >
            <BrandIcon brand={brandOf(c.href)} size={15} />
          </span>
          <span className="min-w-0">
            <span className="block font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
              {t(c.kind, lang)}
            </span>
            <span className="block truncate text-[13.5px]">{c.value}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
