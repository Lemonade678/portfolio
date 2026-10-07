"use client";

// ─────────────────────────────────────────────────────────────
// วงล้อ (เดิมอยู่หน้า teaser /next) — ช่องเด็ดคือ "ทาแป้ง": หมุนโดนเมื่อไหร่ ทั้งเว็บโดนแป้ง
//
// ความยุติธรรม (ตรงไปตรงมาเหมือนตัวเลขทุกตัวในเว็บ):
//   1. สุ่ม "ช่อง" ก่อน แบบเท่ากันทุกช่อง (Math.random × 8) — ทาแป้งมีสองช่อง = 25% จริง
//   2. แล้วค่อยคำนวณมุมให้วงล้อหมุนไปหยุดที่ช่องนั้น
//   ไม่ได้หมุนมั่วแล้วดูว่าไปหยุดตรงไหน (แบบนั้นผลจะขึ้นกับ easing ของ animation)
//
// เรื่องมุม: SVG วาดช่องแรกที่ 12 นาฬิกา เวียนตามเข็ม · ลูกศรชี้ 12 นาฬิกา
//   อยากให้ "กลางช่อง i" มาอยู่ใต้ลูกศร → มุมรวม ≡ −(กลางช่อง) (mod 360)
//   + 5 รอบเต็มให้ดูหมุนแรง ๆ + เหลื่อมจากกลางช่องนิดหน่อย (jitter) ให้ดูเป็นธรรมชาติ
//
// ผลของแต่ละช่องไปที่ shell: แต้ม → reducer · แป้ง → powder() · ไฮโรล → โบนัสทอยครั้งหน้า
// ออกจากหน้าต่างกลางคันการหมุน → timer ถูกเคลียร์ ผลรอบนั้นไม่ถูกนับ (ยังไม่ได้ส่งออกไป)
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { OZZY, type OzSliceId } from "@/lib/ozzy/content";
import { Bolt } from "@/components/NextRun";
import { useOzzy } from "./OzzyShell";
import { reducedMotion, t } from "./ui";

const SLICES = OZZY.wheel.slices;
const SEG = 360 / SLICES.length;
/** ต้องตรงกับ transition ของ .oz-wheel ใน globals.css (4.2s) */
const SPIN_MS = 4200;

/** สีพื้นแต่ละช่อง — ทาแป้งเป็นสีขาวแป้ง ช่องติดกันไม่ซ้ำสี · ตัวหนังสือบนพื้นสว่างใช้สีหมึก */
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
const pt = (deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [C + R * Math.cos(a), C + R * Math.sin(a)] as const;
};

export default function Wheel() {
  const { lang, dispatch, powder } = useOzzy();
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

  const apply = (id: OzSliceId) => {
    if (id === "powder") powder();
    else if (id === "gold") dispatch({ type: "earn", amount: 100 });
    else if (id === "jackpot") dispatch({ type: "earn", amount: 300 });
    else if (id === "luck") dispatch({ type: "luck" });
  };

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
      apply(SLICES[idx].id);
    };
    if (instant) {
      done();
      return;
    }
    setSpinning(true);
    timer.current = window.setTimeout(done, SPIN_MS + 80);
  };

  const result = landed === null ? null : SLICES[landed];
  const pepe = OZZY.heroes[0];

  return (
    <div>
      <p className="max-w-[60ch] text-[13.5px] text-(--oz-sky)">{t(OZZY.wheel.note, lang)}</p>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
        {/* เงาทึบอยู่ที่กล่องนี้ (ไม่หมุน) ไม่ใช่ที่วงล้อ — ไม่งั้นเงาจะหมุนวนตามวงล้อไปด้วย */}
        <div className="relative w-[min(300px,74vw)] flex-none drop-shadow-[6px_6px_0_var(--oz-ink)]">
          {/* ลูกศรชี้ที่ 12 นาฬิกา — อยู่นอกวงล้อ ไม่หมุนตาม */}
          <svg viewBox="0 0 28 30" className="absolute left-1/2 top-[-10px] z-10 w-8 -translate-x-1/2" aria-hidden="true">
            <path d="M3 3h22L14 27z" style={{ fill: "var(--oz-yellow)", stroke: "var(--oz-ink)" }} strokeWidth="3" strokeLinejoin="round" />
          </svg>

          <svg viewBox="0 0 200 200" className="oz-wheel block w-full" style={{ transform: `rotate(${rot}deg)` }} aria-hidden="true">
            {SLICES.map((s, i) => {
              const a0 = i * SEG - 90;
              const a1 = a0 + SEG;
              const [x0, y0] = pt(a0);
              const [x1, y1] = pt(a1);
              const mid = a0 + SEG / 2;
              // ช่องฝั่งซ้ายของวง ตัวหนังสือจะกลับหัว — หมุนกลับอีก 180° ให้อ่านได้ (ก่อนหมุน)
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
                      style={{ fill: f.ink ? "var(--oz-ink)" : "#fff", fontFamily: "var(--font-anuphan), sans-serif" }}
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
            {spinning ? t(OZZY.wheel.spinning, lang) : t(OZZY.wheel.spin, lang)}
          </button>

          {/* ผลการหมุน — ประกาศให้ screen reader ด้วย */}
          <div aria-live="polite" className="min-h-[72px]">
            {result && (
              <div key={`${landed}-${rot}`} className="oz-pop flex items-center gap-3">
                {result.id === "feelsbad" && (
                  <img src={pepe.img} alt="" width={320} height={320} className="h-12 w-12 flex-none rounded-lg border-2 border-(--oz-ink) object-cover" />
                )}
                <div>
                  <p className="oz-glow-yellow text-[22px] font-bold leading-tight">{t(result.label, lang)}</p>
                  <p className="mt-1 text-[13.5px] text-(--oz-sky)">{t(OZZY.wheel.results[result.id], lang)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
