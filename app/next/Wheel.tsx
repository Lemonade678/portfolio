"use client";

// ── ACT III: วงล้อ ───────────────────────────────────────────
//
// วงล้อลงโทษสไตล์สตรีมเมอร์ไทย — ช่องเด็ดคือ "ทาแป้ง": หมุนโดนเมื่อไหร่ ทั้งหน้าเว็บโดนทาแป้ง
//
// ความยุติธรรมของวงล้อ (ตรงไปตรงมาเหมือนตัวเลขทุกตัวในเว็บนี้):
//   1. สุ่ม "ช่อง" ก่อน แบบเท่ากันทุกช่อง (Math.random × 8) — ทาแป้งมีสองช่อง = 25% จริง
//   2. แล้วค่อยคำนวณมุมให้วงล้อหมุนไปหยุดที่ช่องนั้น
//   ไม่ได้หมุนมั่ว ๆ แล้วดูว่าไปหยุดตรงไหน เพราะแบบนั้นผลจะขึ้นกับ easing ของ animation
//   และทุกช่องกว้างเท่ากันจริง ไม่มีช่องไหนแอบแคบกว่า
//
// เรื่องมุม: SVG วาดช่องแรกเริ่มที่ 12 นาฬิกา เวียนตามเข็ม · ลูกศรชี้อยู่ที่ 12 นาฬิกา
//   ถ้าอยากให้ "กลางช่อง i" มาอยู่ใต้ลูกศร ต้องหมุนวงล้อให้มุมรวม ≡ −(กลางช่อง) (mod 360)
//   บวกเพิ่มอีก 5 รอบเต็มให้ดูหมุนแรง ๆ และเหลื่อมจากกลางช่องนิดหน่อย (jitter) ให้ดูเป็นธรรมชาติ

import { useEffect, useRef, useState } from "react";
import { NEXT_RUN as N, type Lang, type OzSliceId } from "@/lib/content";
import { Bolt } from "@/components/NextRun";
import { SectionTitle, reducedMotion, t } from "./ui";

const SLICES = N.wheel.slices;
const SEG = 360 / SLICES.length;
/** ต้องตรงกับ transition ของ .oz-wheel ใน globals.css (4.2s) */
const SPIN_MS = 4200;

/** สีพื้นของแต่ละช่อง (ไล่ตามลำดับใน content) — ทาแป้งเป็นสีขาวแป้ง ช่องติดกันไม่ซ้ำสี
 *  ตัวหนังสือบนพื้นสว่างใช้สีหมึก บนพื้นเข้มใช้สีขาว */
const FILL: Record<OzSliceId, { bg: string; ink: boolean }> = {
  powder: { bg: "#F4F2FF", ink: true },
  gold: { bg: "#FEC501", ink: true },
  luck: { bg: "#1EA8F8", ink: true },
  feelsbad: { bg: "#4C8199", ink: false },
  again: { bg: "#5454C1", ink: false },
  jackpot: { bg: "#FEC501", ink: true },
  nothing: { bg: "#2A2763", ink: false },
};

const R = 96;
const C = 100;
const pt = (deg: number, r = R) => {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
};

export default function Wheel({
  lang,
  onResult,
}: {
  lang: Lang;
  onResult: (id: OzSliceId) => void;
}) {
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState<number | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const spin = () => {
    if (spinning) return;
    const idx = Math.floor(Math.random() * SLICES.length);
    // เหลื่อมได้ไม่เกิน ±35% ของความกว้างช่อง — ไม่มีทางเลยเส้นแบ่งไปโดนช่องข้าง ๆ
    const jitter = (Math.random() - 0.5) * SEG * 0.7;
    const target = idx * SEG + SEG / 2 + jitter;
    const delta = (((-target - rot) % 360) + 360) % 360;
    const instant = reducedMotion();

    setLanded(null);
    setRot(rot + (instant ? 0 : 360 * 5) + delta);

    const done = () => {
      setSpinning(false);
      setLanded(idx);
      onResult(SLICES[idx].id);
    };
    if (instant) {
      done();
      return;
    }
    setSpinning(true);
    timer.current = window.setTimeout(done, SPIN_MS + 80);
  };

  const result = landed === null ? null : SLICES[landed];

  return (
    <section aria-labelledby="wheel-title" className="mt-16">
      <SectionTitle
        id="wheel-title"
        act="ACT III"
        title={t(N.wheel.title, lang)}
        note={t(N.wheel.note, lang)}
      />

      <div className="oz-panel flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-center sm:gap-10 sm:p-8">
        {/* เงาทึบอยู่ที่กล่องนี้ (ไม่หมุน) ไม่ใช่ที่วงล้อ — ไม่งั้นเงาจะหมุนวนตามวงล้อไปด้วย */}
        <div className="relative w-[min(300px,78vw)] flex-none drop-shadow-[6px_6px_0_var(--oz-ink)]">
          {/* ลูกศรชี้ที่ 12 นาฬิกา — อยู่นอกวงล้อ ไม่หมุนตาม */}
          <svg
            viewBox="0 0 28 30"
            className="absolute left-1/2 top-[-10px] z-10 w-8 -translate-x-1/2"
            aria-hidden="true"
          >
            <path
              d="M3 3h22L14 27z"
              style={{ fill: "var(--oz-yellow)", stroke: "var(--oz-ink)" }}
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </svg>

          <svg
            viewBox="0 0 200 200"
            className="oz-wheel block w-full"
            style={{ transform: `rotate(${rot}deg)` }}
            aria-hidden="true"
          >
            {SLICES.map((s, i) => {
              const a0 = i * SEG - 90;
              const a1 = a0 + SEG;
              const [x0, y0] = pt(a0);
              const [x1, y1] = pt(a1);
              const mid = a0 + SEG / 2;
              // ช่องฝั่งซ้ายของวง ตัวหนังสือจะกลับหัว — หมุนกลับอีก 180° ให้อ่านได้
              const flip = mid > 90 && mid < 270;
              const f = FILL[s.id];
              return (
                <g key={i}>
                  <path
                    d={`M${C} ${C} L${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1} Z`}
                    fill={f.bg}
                    style={{ stroke: "var(--oz-ink)" }}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <g transform={`rotate(${mid} ${C} ${C})`}>
                    <text
                      x={C + 58}
                      y={C}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={flip ? `rotate(180 ${C + 58} ${C})` : undefined}
                      style={{
                        fill: f.ink ? "var(--oz-ink)" : "#fff",
                        fontFamily: "var(--font-anuphan), sans-serif",
                      }}
                      fontSize="10.5"
                      fontWeight="700"
                    >
                      {t(s.label, lang)}
                    </text>
                  </g>
                </g>
              );
            })}
            <circle cx={C} cy={C} r={R} fill="none" style={{ stroke: "var(--oz-ink)" }} strokeWidth="5" />
            <circle cx={C} cy={C} r="15" style={{ fill: "var(--oz-ink)" }} />
            <circle cx={C} cy={C} r="9" style={{ fill: "var(--oz-yellow)" }} />
          </svg>
        </div>

        <div className="flex max-w-[300px] flex-col items-center gap-4 text-center sm:items-start sm:text-left">
          <button
            type="button"
            onClick={spin}
            disabled={spinning}
            className="oz-button inline-flex items-center gap-2 rounded-xl px-7 py-3 font-mono text-[14px] font-bold uppercase tracking-[0.14em]"
          >
            <Bolt className="h-4 w-4" />
            {spinning ? t(N.wheel.spinning, lang) : t(N.wheel.spin, lang)}
          </button>

          {/* ผลการหมุน — ประกาศให้ screen reader ด้วย */}
          <div aria-live="polite" className="min-h-[72px]">
            {result && (
              <div key={`${landed}-${rot}`} className="oz-pop flex items-center gap-3">
                {result.id === "feelsbad" && (
                  <img
                    src={N.heroes[0].img}
                    alt=""
                    width={320}
                    height={320}
                    className="h-12 w-12 flex-none rounded-lg border-2 border-(--oz-ink) object-cover"
                  />
                )}
                <div>
                  <p className="oz-glow-yellow text-[22px] font-bold leading-tight">
                    {t(result.label, lang)}
                  </p>
                  <p className="mt-1 text-[13.5px] text-(--oz-sky)">
                    {t(N.wheel.results[result.id], lang)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
