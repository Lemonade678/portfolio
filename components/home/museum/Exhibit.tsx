"use client";

// กรอบของนิทรรศการหนึ่งชิ้นในพิพิธภัณฑ์ YOLO — เลข · ชื่อ · คำอธิบายสั้น · ส่วนที่เล่นได้ · หมายเหตุที่มาของข้อมูล
// ทุกชิ้นใช้กรอบเดียวกัน ให้ดูเป็นห้องจัดแสดงชุดเดียว ไม่ใช่ของเล่นห้าชิ้นที่หน้าตาไม่เข้ากัน

import { t } from "@/components/home/ui";
import type { L10n, Lang } from "@/lib/content";

export default function Exhibit({
  n,
  title,
  body,
  note,
  lang,
  className = "",
  children,
}: {
  n: string;
  title: L10n;
  body: L10n;
  /** บอกว่าข้อมูลในนิทรรศการนี้มาจากไหน (ผลจริง / ค่าที่บันทึกไว้ / ภาพประกอบ) */
  note?: L10n;
  lang: Lang;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article className={`flex flex-col rounded-2xl border border-line bg-surface p-5 sm:p-6 ${className}`}>
      <span className="font-mono text-[10.5px] tracking-[0.16em] text-yellow">{n}</span>
      <h4 className="mt-1 text-[16px] font-bold tracking-[-0.01em]">{t(title, lang)}</h4>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink2">{t(body, lang)}</p>
      <div className="mt-4 flex-1">{children}</div>
      {note && <p className="mt-3 font-mono text-[10.5px] leading-snug text-muted">{t(note, lang)}</p>}
    </article>
  );
}

/** แถบเลื่อนแบบเดียวกันทุกนิทรรศการ — ป้าย + ค่าปัจจุบัน + range */
export function Slider({
  label,
  value,
  shown,
  min,
  max,
  step,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  /** ค่าที่โชว์ข้างป้าย (เช่น "S = 13" หรือ "0.45") */
  shown: string;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <label className={`mt-3 block ${disabled ? "opacity-50" : ""}`}>
      <span className="flex items-baseline justify-between font-mono text-[11px] text-muted">
        <span>{label}</span>
        <span className="text-ink">{shown}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-yellow"
      />
    </label>
  );
}
