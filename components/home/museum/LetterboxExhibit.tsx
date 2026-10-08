"use client";

// นิทรรศการ 03 — Letterbox: ยัดรูปสัดส่วนไหนก็ได้ลงช่อง 640×640 โดยไม่บิดรูป
//
// ตัวเลขมาจาก letterboxGeometry() ตัวเดียวกับที่รันจริงก่อนส่งรูปเข้าโมเดล (lib/yolo.ts)
// รูปสมมติด้านยาว 1920 px (ขนาดรูปจากมือถือทั่วไป) แล้วเลือกสัดส่วนด้วยแถบเลื่อน

import { useState } from "react";
import Exhibit, { Slider } from "@/components/home/museum/Exhibit";
import { t } from "@/components/home/ui";
import { YOLO_MUSEUM, type Lang } from "@/lib/content";
import { letterboxGeometry } from "@/lib/yolo";

const SHAPES = [
  { name: "9:16", r: 9 / 16 },
  { name: "3:4", r: 3 / 4 },
  { name: "1:1", r: 1 },
  { name: "4:3", r: 4 / 3 },
  { name: "16:9", r: 16 / 9 },
  { name: "21:9", r: 21 / 9 },
];
const SIZE = 640;
const LONG = 1920;
/** กรอบบนจอแทน 640 px */
const BOX = 176;

export default function LetterboxExhibit({ lang }: { lang: Lang }) {
  const E = YOLO_MUSEUM.letterbox;
  const [k, setK] = useState(0);
  const shape = SHAPES[k];
  const iw = shape.r >= 1 ? LONG : Math.round(LONG * shape.r);
  const ih = shape.r >= 1 ? Math.round(LONG / shape.r) : LONG;
  const g = letterboxGeometry(iw, ih, SIZE);
  const f = BOX / SIZE;
  const pad = g.dx > 0 ? g.dx : g.dy;

  return (
    <Exhibit n={E.n} title={E.title} body={E.body} lang={lang}>
      <div className="flex flex-wrap items-start gap-5">
        {/* จัตุรัส 640 สีเทา 114 + รูปที่ย่อแล้ววางกลาง */}
        <div className="relative mb-5 flex-none rounded-md" style={{ width: BOX, height: BOX, background: "rgb(114,114,114)" }} aria-hidden="true">
          <div
            className="absolute grid place-items-center rounded-[3px] font-mono text-[10px] text-bg transition-all duration-200"
            style={{
              left: g.dx * f,
              top: g.dy * f,
              width: g.dw * f,
              height: g.dh * f,
              background: "linear-gradient(135deg, #f5b92e, #ff7e9d)",
            }}
          >
            {shape.name}
          </div>
          <span className="absolute -bottom-5 left-0 font-mono text-[10px] text-muted">640 × 640</span>
        </div>

        <div className="min-w-[180px] flex-1">
          <Slider label={t(E.slider, lang)} value={k} shown={shape.name} min={0} max={SHAPES.length - 1} step={1} onChange={setK} />
          <dl className="mt-4 space-y-1 font-mono text-[12px] text-ink2">
            <div>
              {iw} × {ih} → {g.dw} × {g.dh}
            </div>
            <div>
              <dt className="inline text-muted">{t(E.scale, lang)} </dt>
              <dd className="inline">× {g.scale.toFixed(3)}</dd>
            </div>
            <div>
              <dt className="inline text-muted">{t(E.padding, lang)} </dt>
              <dd className="inline">
                {pad} px {pad > 0 ? t(E.each, lang) : ""}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Exhibit>
  );
}
