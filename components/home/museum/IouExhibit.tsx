"use client";

// นิทรรศการ 02 — IoU: สองกล่องตรงกันแค่ไหน
//
// กล่องเฉลยอยู่กับที่ กล่องที่ทายเลื่อน/ย่อขยายได้ · พื้นที่ทับกันระบายเหลือง · ตัวเลข IoU คำนวณสดด้วย iou()
// ตัวเดียวกับที่เว็บใช้ทำ NMS จริง (lib/yolo.ts) — ไม่ได้เขียนสูตรแยกไว้โชว์
// ขีดที่ 0.45 คือเกณฑ์ NMS ของเว็บนี้ (DETECTOR.iouThreshold) เกินขีดเมื่อไหร่ = ถือว่าเป็นกล่องซ้ำ

import { useState } from "react";
import Exhibit, { Slider } from "@/components/home/museum/Exhibit";
import { t } from "@/components/home/ui";
import { DETECTOR, YOLO_MUSEUM, type Lang } from "@/lib/content";
import { iou, type Box } from "@/lib/yolo";

/** พิกัดในกรอบ SVG 100×64 */
const TRUTH: Box = [30, 14, 62, 50];
const W = TRUTH[2] - TRUTH[0];
const H = TRUTH[3] - TRUTH[1];

export default function IouExhibit({ lang }: { lang: Lang }) {
  const E = YOLO_MUSEUM.iou;
  const [move, setMove] = useState(14); // เริ่มที่ IoU ≈ 0.39 (ต่ำกว่าเกณฑ์) — เลื่อนเข้าหากันแล้วจะเห็นข้ามขีด 0.45
  const [size, setSize] = useState(1);

  const cx = (TRUTH[0] + TRUTH[2]) / 2 + move;
  const cy = (TRUTH[1] + TRUTH[3]) / 2;
  const pred: Box = [cx - (W * size) / 2, cy - (H * size) / 2, cx + (W * size) / 2, cy + (H * size) / 2];
  const v = iou(TRUTH, pred);
  const ox1 = Math.max(TRUTH[0], pred[0]);
  const oy1 = Math.max(TRUTH[1], pred[1]);
  const ox2 = Math.min(TRUTH[2], pred[2]);
  const oy2 = Math.min(TRUTH[3], pred[3]);
  const dup = v > DETECTOR.iouThreshold;
  const rect = (b: Box) => ({ x: b[0], y: b[1], width: b[2] - b[0], height: b[3] - b[1] });

  return (
    <Exhibit n={E.n} title={E.title} body={E.body} note={E.note} lang={lang}>
      <svg viewBox="0 0 100 64" className="w-full max-w-[320px] rounded-xl border border-line bg-bg" aria-hidden="true">
        <rect {...rect(TRUTH)} fill="none" stroke="#7BA0FF" strokeWidth="1" />
        {ox2 > ox1 && oy2 > oy1 && <rect x={ox1} y={oy1} width={ox2 - ox1} height={oy2 - oy1} fill="rgba(245,185,46,.38)" />}
        <rect {...rect(pred)} fill="none" stroke="#F5B92E" strokeWidth="1" strokeDasharray="2 1.2" />
      </svg>
      <p className="mt-2 flex flex-wrap gap-x-4 font-mono text-[10.5px] text-muted">
        <span>
          <span className="text-blue">▭</span> {t(E.truth, lang)}
        </span>
        <span>
          <span className="text-yellow">⬚</span> {t(E.pred, lang)}
        </span>
      </p>

      <p className="mt-3 font-mono text-[28px] font-bold leading-none text-yellow" aria-live="polite">
        IoU {v.toFixed(2)}
      </p>
      {/* แถบ 0 → 1 พร้อมขีดที่เกณฑ์ NMS */}
      <div className="relative mt-2 h-1.5 rounded-full bg-surface2" aria-hidden="true">
        <div className="h-full rounded-full bg-yellow" style={{ width: `${v * 100}%` }} />
        <span className="absolute -top-1 h-3.5 w-px bg-ink" style={{ left: `${DETECTOR.iouThreshold * 100}%` }} />
      </div>
      <p className={`mt-2 text-[12.5px] ${dup ? "text-pink" : "text-ink2"}`}>{t(dup ? E.dup : E.keep, lang)}</p>

      <Slider label={t(E.move, lang)} value={move} shown={`${move > 0 ? "+" : ""}${move}`} min={-34} max={34} step={1} onChange={setMove} />
      <Slider label={t(E.size, lang)} value={size} shown={`×${size.toFixed(2)}`} min={0.5} max={1.6} step={0.05} onChange={setSize} />
    </Exhibit>
  );
}
