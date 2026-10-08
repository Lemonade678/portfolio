"use client";

// นิทรรศการ 01 — มองครั้งเดียว: ตาราง S×S ของ YOLOv1 วางทับรูปโปรไฟล์
//
// ช่องที่ "รับผิดชอบ" คือช่องที่จุดกึ่งกลางของกล่องคนตกอยู่ — ลากแถบเปลี่ยนขนาดตารางแล้วดูว่าช่องย้ายไปไหน
// กล่องคนใช้ผล yolo11n ที่รันไว้ล่วงหน้าบนรูปนี้ (DETECTOR.fallback) ไม่ต้องโหลดโมเดล 10 MB แค่เพื่อเลื่อนตาราง
// (YOLOv1 จริงรับภาพจัตุรัส 448×448 — ที่นี่วางตารางบนรูปแนวตั้งตรง ๆ ช่องเลยเป็นสี่เหลี่ยมผืนผ้า เพื่อให้ดูง่าย)

import { useState } from "react";
import Exhibit, { Slider } from "@/components/home/museum/Exhibit";
import { t } from "@/components/home/ui";
import { DETECTOR, PERSON, YOLO_MUSEUM, type Lang } from "@/lib/content";

const SIZES = [7, 13, 20] as const;

export default function GridExhibit({ lang }: { lang: Lang }) {
  const E = YOLO_MUSEUM.grid;
  const [k, setK] = useState(0);
  const S = SIZES[k];
  const [x1, y1, x2, y2] = DETECTOR.fallback[0].box;
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  const col = Math.min(S - 1, Math.floor(cx * S));
  const row = Math.min(S - 1, Math.floor(cy * S));
  const pct = (v: number) => `${v * 100}%`;

  return (
    <Exhibit n={E.n} title={E.title} body={E.body} note={E.note} lang={lang}>
      <div className="flex flex-wrap items-start gap-5">
        <div
          className="relative w-[170px] flex-none overflow-hidden rounded-xl border border-line"
          style={{ aspectRatio: `${DETECTOR.photoW} / ${DETECTOR.photoH}` }}
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PERSON.photo ?? ""} alt="" className="h-full w-full object-cover" />
          {/* เส้นตาราง: พื้นหลังลายเส้นที่ซ้ำทุก 1/S ของกรอบ */}
          <span
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(245,185,46,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,185,46,.5) 1px, transparent 1px)",
              backgroundSize: `${100 / S}% ${100 / S}%`,
            }}
          />
          <span
            className="absolute bg-yellow/45 outline outline-2 outline-yellow transition-all duration-200"
            style={{ left: pct(col / S), top: pct(row / S), width: pct(1 / S), height: pct(1 / S) }}
          />
          <span
            className="absolute border-[1.5px] border-blue"
            style={{ left: pct(x1), top: pct(y1), width: pct(x2 - x1), height: pct(y2 - y1) }}
          />
          <span
            className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-bg bg-blue"
            style={{ left: pct(cx), top: pct(cy) }}
          />
        </div>

        <div className="min-w-[180px] flex-1">
          <Slider label={t(E.slider, lang)} value={k} shown={`S = ${S}`} min={0} max={SIZES.length - 1} step={1} onChange={setK} />
          <p className="mt-4 text-[13px] text-ink2">
            <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-yellow align-middle" aria-hidden="true" />
            {t(E.cell, lang)}: <span className="font-mono text-ink">({row + 1}, {col + 1})</span>{" "}
            <span className="font-mono text-muted">
              / {S}×{S} = {S * S}
            </span>
          </p>
        </div>
      </div>
    </Exhibit>
  );
}
