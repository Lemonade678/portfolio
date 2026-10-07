"use client";

// ── ACT II: ลงดันเจี้ยน ──────────────────────────────────────
//
// สี่ห้อง (ห้องสุดท้ายเป็นบอส) สามหัวใจ ทุกห้องเลือก "เล่นเซฟ" หรือ "ลุ้นไฮโรล"
// กติกาทั้งหมดอยู่ใน game.ts — ไฟล์นี้ทำแค่สามอย่าง:
//   1. สุ่มหน้าลูกเต๋า แล้วโชว์ลูกเต๋ากลิ้ง (เลขวิ่ง) ก่อนออกผล
//   2. ส่งผลเข้า reducer
//   3. วาดสถานะ: แผนที่ห้อง · ห้องปัจจุบัน · โบนัสที่รออยู่ · บันทึกการทอย · จบรัน
//
// ส่วนนี้ถูก remount ทุกครั้งที่เริ่มรันใหม่ (page.tsx ใส่ key={run.runId})
// ลูกเต๋ากับผลทอยค้างของรันเก่าเลยหายไปเอง ไม่ต้องเขียนโค้ดล้างเอง

import { useEffect, useRef, useState, type Dispatch } from "react";
import { NEXT_RUN as N, type Lang } from "@/lib/content";
import { Bolt } from "@/components/NextRun";
import {
  BOSS_ROOM,
  pendingBonuses,
  rankOf,
  resolveRoll,
  rollD20,
  type LogEntry,
  type RollKind,
  type RollResult,
  type RunAction,
  type RunState,
} from "./game";
import Loot from "./Loot";
import { SectionTitle, reducedMotion, t } from "./ui";

/** ลูกเต๋ากลิ้งนานเท่านี้ก่อนออกผล — นานพอให้ลุ้น สั้นพอไม่ให้รำคาญเวลากดรัว ๆ */
const ROLL_MS = 700;
/** ระหว่างกลิ้ง เปลี่ยนเลขบนหน้าลูกเต๋าทุก ๆ เท่านี้ */
const FLICKER_MS = 60;

export default function RunGame({
  run,
  dispatch,
  lang,
}: {
  run: RunState;
  dispatch: Dispatch<RunAction>;
  lang: Lang;
}) {
  const [rolling, setRolling] = useState(false);
  const [face, setFace] = useState<number | null>(null);
  const [last, setLast] = useState<RollResult | null>(null);
  const timers = useRef<number[]>([]);

  // ผลทอยต้องคำนวณจากสถานะ "ตอนลูกเต๋าหยุด" ไม่ใช่ตอนกดปุ่ม
  // เพราะระหว่าง 0.7 วินาทีนั้นคนอาจไปหมุนวงล้อได้ช่อง "ไฮโรล" (+5) พอดี
  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  }, [run]);

  // ออกจากหน้า/เริ่มรันใหม่กลางคันการกลิ้ง → เคลียร์ timer ที่ค้างอยู่ทั้งหมด
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((id) => window.clearTimeout(id));
  }, []);

  const roll = (kind: RollKind) => {
    if (rolling || run.status !== "playing") return;
    const d20 = rollD20();
    const finish = () => {
      const result = resolveRoll(runRef.current, kind, d20);
      setFace(result.face);
      setLast(result);
      setRolling(false);
      dispatch({ type: "roll", result });
    };
    if (reducedMotion()) {
      finish();
      return;
    }
    setRolling(true);
    setLast(null);
    // clearTimeout ใช้หยุด setInterval ได้ด้วย (ใช้ตาราง timer ชุดเดียวกันตามสเปก HTML)
    const flicker = window.setInterval(() => setFace(rollD20()), FLICKER_MS);
    timers.current.push(flicker);
    timers.current.push(
      window.setTimeout(() => {
        window.clearInterval(flicker);
        finish();
      }, ROLL_MS),
    );
  };

  const floor = N.floors[Math.min(run.room, BOSS_ROOM)];
  const b = pendingBonuses(run);
  const roomLabel = (i: number) =>
    i === BOSS_ROOM ? t(N.run.boss, lang) : `${t(N.run.room, lang)} ${i + 1}`;

  return (
    <section id="run" aria-labelledby="run-title" className="mt-16 scroll-mt-20">
      <SectionTitle
        id="run-title"
        act="ACT II"
        title={t(N.run.title, lang)}
        note={t(N.run.intro, lang)}
      />

      <RoomMap room={run.room} status={run.status} />

      <div className="oz-panel mt-5 p-5 sm:p-7">
        {run.status === "pick" && (
          <p className="py-6 text-center text-[15px] text-(--oz-sky)">
            ↑ {t(N.run.pickFirst, lang)}
          </p>
        )}

        {run.status === "playing" && (
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-(--oz-yellow)">
                {roomLabel(run.room)} · {run.room + 1}/{N.floors.length}
              </p>
              <p className="mt-2 flex items-center gap-3">
                <span className="text-[44px] leading-none" aria-hidden="true">
                  {floor.emoji}
                </span>
                <span className="oz-title text-[clamp(22px,3.4vw,30px)] font-bold leading-tight">
                  {t(floor.name, lang)}
                </span>
              </p>
              {run.room === BOSS_ROOM && run.rolls > BOSS_ROOM && (
                <p className="mt-2 text-[13px] text-(--oz-sky)">{t(N.run.bossStays, lang)}</p>
              )}

              {/* สองทางเลือก — ปุ่มไฮโรลตัวใหญ่และสว่างกว่าโดยตั้งใจ เพราะนั่นคือทางของเขา */}
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => roll("safe")}
                  disabled={rolling}
                  className="rounded-xl border-[3px] border-(--oz-ink) bg-(--oz-night) px-4 py-2.5 text-left shadow-[4px_4px_0_var(--oz-ink)] transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_var(--oz-ink)] disabled:opacity-60"
                >
                  <span className="block font-mono text-[12px] font-bold uppercase tracking-[0.12em]">
                    {t(N.run.safe, lang)}
                  </span>
                  <span className="mt-0.5 block font-mono text-[11px] text-(--oz-sky)">
                    {t(N.run.need, lang)} {floor.safe}+ · +{floor.safeGold} 🪙
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => roll("high")}
                  disabled={rolling}
                  className="oz-button rounded-xl px-5 py-2.5 text-left"
                >
                  <span className="flex items-center gap-1.5 font-mono text-[13px] font-bold uppercase tracking-[0.12em]">
                    <Bolt className="h-4 w-4" /> {t(N.run.high, lang)}
                  </span>
                  <span className="mt-0.5 block font-mono text-[11px] opacity-80">
                    {t(N.run.need, lang)} {floor.high}+ · +{floor.highGold} 🪙
                  </span>
                </button>
              </div>

              <Bonuses b={b} hero={run.hero} lang={lang} />
            </div>

            <Dice face={face} rolling={rolling} last={last} lang={lang} />
          </div>
        )}

        {run.status === "won" && <Won run={run} dispatch={dispatch} lang={lang} />}
        {run.status === "lost" && <Lost run={run} dispatch={dispatch} lang={lang} />}

        {/* บอก screen reader ว่าทอยได้เท่าไหร่ ผ่านไหม — ตาเห็นจากลูกเต๋า หูต้องได้ยินจากตรงนี้ */}
        <p aria-live="polite" className="sr-only">
          {last && describe(last, lang)}
        </p>

        {run.log.length > 0 && <Log entries={run.log} lang={lang} roomLabel={roomLabel} />}
      </div>
    </section>
  );
}

/** แผนที่ห้องแบบ roguelike: ① ─ ② ─ ③ ─ 👑 */
function RoomMap({ room, status }: { room: number; status: RunState["status"] }) {
  return (
    <ol className="flex items-center" aria-hidden="true">
      {N.floors.map((f, i) => {
        const done = status === "won" || i < room;
        const here = status === "playing" && i === room;
        return (
          <li key={i} className="flex flex-1 items-center last:flex-none">
            <span
              className={`grid h-10 w-10 flex-none place-items-center rounded-full border-[3px] border-(--oz-ink) font-mono text-[13px] font-bold transition-colors ${
                here
                  ? "bg-(--oz-yellow) text-(--oz-ink) shadow-[0_0_18px_rgba(254,197,1,.6)]"
                  : done
                    ? "bg-(--oz-blue) text-(--oz-ink)"
                    : "bg-(--oz-surface) text-(--oz-sky)"
              }`}
            >
              {i === BOSS_ROOM ? "👑" : i + 1}
            </span>
            {i < N.floors.length - 1 && (
              <span
                className={`mx-1.5 h-[3px] flex-1 rounded-full ${done ? "bg-(--oz-blue)" : "bg-(--oz-blue)/20"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** โบนัสที่รออยู่สำหรับทอยครั้งหน้า — โชว์ก่อนกด จะได้เลือกทางได้ถูก */
function Bonuses({
  b,
  hero,
  lang,
}: {
  b: ReturnType<typeof pendingBonuses>;
  hero: RunState["hero"];
  lang: Lang;
}) {
  const items: string[] = [];
  if (b.mbaku) items.push(`M'Baku +${b.mbaku}`);
  if (b.pepe) items.push(`Pepe +${b.pepe}`);
  if (b.luck) items.push(`🍀 +${b.luck}`);
  if (b.natural) items.push(`⚡ ${t(N.run.natural, lang)}`);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11.5px]">
      {items.length > 0 && (
        <span className="text-(--oz-yellow)">
          {t(N.run.bonuses, lang)}: {items.join(" · ")}
        </span>
      )}
      {hero === "dooley" && !b.natural && (
        // ขีดชาร์จของ Dooley — ครบสองขีด ทอยถัดไปได้ 20
        <span className="text-(--oz-sky)" aria-label={`${t(N.run.charge, lang)} ${b.charge}/2`}>
          {t(N.run.charge, lang)} {"●".repeat(b.charge)}
          {"○".repeat(2 - b.charge)}
        </span>
      )}
    </div>
  );
}

/** ลูกเต๋า d20 — หกเหลี่ยมมีสามเหลี่ยมด้านในพอให้ดูออกว่าเป็น d20 */
function Dice({
  face,
  rolling,
  last,
  lang,
}: {
  face: number | null;
  rolling: boolean;
  last: RollResult | null;
  lang: Lang;
}) {
  const tone = rolling ? "rolling" : last ? (last.hit ? "hit" : "miss") : "idle";
  return (
    <div className="flex flex-col items-center gap-2 justify-self-center">
      <svg
        viewBox="0 0 100 100"
        className="oz-dice h-28 w-28 sm:h-32 sm:w-32"
        data-rolling={rolling || undefined}
        data-tone={tone}
        aria-hidden="true"
      >
        <polygon points="50,4 92,27 92,73 50,96 8,73 8,27" className="oz-dice-body" />
        <polygon points="50,25 77,68 23,68" className="oz-dice-facet" />
        <text x="50" y="53" textAnchor="middle" dominantBaseline="middle" className="oz-dice-num">
          {face ?? 20}
        </text>
      </svg>
      <p className="h-6 text-center font-mono text-[12px] font-bold uppercase tracking-[0.14em]">
        {rolling ? (
          <span className="text-(--oz-sky)">{t(N.run.rolling, lang)}</span>
        ) : last ? (
          last.hit ? (
            <span className="oz-glow-yellow text-[15px]">
              {last.kind === "high" ? t(N.run.highHit, lang) : t(N.run.hit, lang)}
            </span>
          ) : (
            <span className="text-(--oz-sky)">{t(N.run.miss, lang)} · ♥−1</span>
          )
        ) : null}
      </p>
    </div>
  );
}

/** บันทึกการทอย — ทุกตัวเลขมีที่มา: หน้าลูกเต๋า + โบนัส = รวม เทียบกับเป้า */
function Log({
  entries,
  lang,
  roomLabel,
}: {
  entries: LogEntry[];
  lang: Lang;
  roomLabel: (i: number) => string;
}) {
  return (
    <ol className="mt-6 space-y-1.5 border-t-2 border-(--oz-blue)/20 pt-4 font-mono text-[11.5px] text-(--oz-sky)">
      {entries.map((e, i) => (
        <li key={e.id} className={i === 0 ? "text-white" : "opacity-70"}>
          <span className="text-(--oz-sky)/70">{roomLabel(e.room)}</span> ·{" "}
          {e.kind === "high" ? "⚡" : "🛡"} 🎲 {e.face}
          {e.natural && " (⚡20)"}
          {e.bonus > 0 && ` +${e.bonus}`} = {e.total} / {e.target}+ ·{" "}
          {e.hit ? (
            <span className="text-(--oz-yellow)">
              {t(N.run.hit, lang)} +{e.gold} 🪙
            </span>
          ) : (
            <span>{t(N.run.miss, lang)} ♥−1</span>
          )}
        </li>
      ))}
    </ol>
  );
}

function describe(r: RollResult, lang: Lang) {
  const verdict = r.hit ? t(N.run.hit, lang) : t(N.run.miss, lang);
  return `${r.face}${r.bonus ? ` + ${r.bonus}` : ""} = ${r.total}, ${t(N.run.need, lang)} ${r.target}. ${verdict}.`;
}

/** สถิติท้ายรัน — ใช้ทั้งตอนชนะและตอนแพ้ */
function Stats({ run, lang }: { run: RunState; lang: Lang }) {
  const rows = [
    [t(N.run.earned, lang), `${run.runGold} 🪙`],
    [t(N.run.highRate, lang), `${run.highHits} / ${run.highTries}`],
  ];
  return (
    <dl className="mt-5 grid grid-cols-2 gap-3 sm:max-w-[420px]">
      {rows.map(([k, v]) => (
        <div key={k} className="rounded-xl border-2 border-(--oz-ink) bg-(--oz-night) px-4 py-3">
          <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-(--oz-sky)/80">{k}</dt>
          <dd className="mt-1 text-[20px] font-bold">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function AgainButton({ dispatch, lang }: { dispatch: Dispatch<RunAction>; lang: Lang }) {
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: "restart" })}
      className="oz-button mt-6 rounded-xl px-5 py-2.5 font-mono text-[13px] font-bold uppercase tracking-[0.12em]"
    >
      ↻ {t(N.run.again, lang)}
    </button>
  );
}

function Won({ run, dispatch, lang }: { run: RunState; dispatch: Dispatch<RunAction>; lang: Lang }) {
  const rank = rankOf(run.runGold);
  return (
    <div className="oz-pop">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-(--oz-yellow)">
        👑 {t(N.run.won, lang)}
      </p>
      <p className="oz-title mt-2 text-[clamp(26px,4.4vw,38px)] font-bold leading-tight">
        {t(N.run.rank, lang)}: <span className="oz-glow-yellow">{t(rank.label, lang)}</span>
      </p>
      <Stats run={run} lang={lang} />
      <Loot lang={lang} />
      <AgainButton dispatch={dispatch} lang={lang} />
    </div>
  );
}

function Lost({ run, dispatch, lang }: { run: RunState; dispatch: Dispatch<RunAction>; lang: Lang }) {
  const pepe = N.heroes[0];
  return (
    <div className="oz-pop">
      <div className="flex items-center gap-4">
        {/* แพ้แล้วเจอ Pepe หน้าเศร้า — อีโมตประจำช่องที่ใช้กันตอนดวงตกพอดี */}
        <img
          src={pepe.img}
          alt={t(pepe.alt, lang)}
          width={320}
          height={320}
          className="h-20 w-20 flex-none rounded-xl border-[3px] border-(--oz-ink) object-cover"
        />
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-(--oz-sky)">
            {t(N.run.lost, lang)}
          </p>
          <p className="oz-title mt-1 text-[clamp(24px,4vw,34px)] font-bold">{t(N.run.lostNote, lang)}</p>
        </div>
      </div>
      <Stats run={run} lang={lang} />
      <AgainButton dispatch={dispatch} lang={lang} />
    </div>
  );
}
