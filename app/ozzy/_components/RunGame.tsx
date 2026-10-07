"use client";

// ─────────────────────────────────────────────────────────────
// ดันเจี้ยน (ย้ายมาจาก app/next/RunGame.tsx แล้วเพิ่มรีลิค · พ่อค้า · ปฏิกิริยา emote)
//
// กติกาทั้งหมดอยู่ใน lib/ozzy/game.ts — ไฟล์นี้ทำแค่:
//   1. สุ่มลูกเต๋า (สองลูก: ลูกหลัก + ลูกสำรองให้รีลิค "เสก") แล้วโชว์ลูกเต๋ากลิ้งก่อนออกผล
//   2. ถ้าเพิ่งจะพ้นห้องที่ 2 สุ่มของให้พ่อค้าแนบไปด้วย (reducer ไม่สุ่มเอง)
//   3. วาดสถานะ: แผนที่ · ห้องปัจจุบัน · โบนัส · รีลิค · พ่อค้า · บันทึก · จบรัน
//
// ส่วนนี้ remount ทุกครั้งที่เริ่มรันใหม่ (RunWindow ใส่ key={run.runId}) ลูกเต๋าค้างของรันเก่าหายเอง
// ออกจากหน้าต่างกลางคันการกลิ้ง → timer ถูกเคลียร์ตอน unmount และผลทอยนั้นไม่ถูกนับ
// (ยังไม่ได้ dispatch) กลับมาก็เล่นต่อจากห้องเดิมได้ ไม่มีสถานะ "กำลังทอย" ค้าง
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/content";
import { OZZY } from "@/lib/ozzy/content";
import {
  BOSS_ROOM,
  MERCHANT_AFTER,
  drawOffer,
  pendingBonuses,
  rankOf,
  resolveRoll,
  rollD20,
  type LogEntry,
  type RollKind,
  type RollResult,
  type RunState,
} from "@/lib/ozzy/game";
import { Bolt } from "@/components/NextRun";
import Loot from "./Loot";
import Merchant from "./Merchant";
import { useOzzy } from "./OzzyShell";
import RelicBar from "./RelicBar";
import { Clover, reducedMotion, t } from "./ui";

/** ลูกเต๋ากลิ้งนานเท่านี้ก่อนออกผล — นานพอให้ลุ้น สั้นพอไม่ให้รำคาญเวลากดรัว ๆ */
const ROLL_MS = 700;
const FLICKER_MS = 60;

/** emote ที่เด้งขึ้นข้างลูกเต๋าตามผลทอย (id จาก OZZY.emotes) */
const REACT = {
  highHit: "e06", // PMA
  hit: "e01", // เชื่อ
  miss: "e17", // ตาโต
  sek: "e03", // เสก
  pma: "e16", // Pepe ให้ใจ — หัวใจไม่หาย
  ban: "e09", // ค้อน BAN
  won: "e15", // Pepe GG
} as const;

const emote = (id: string) => OZZY.emotes.find((e) => e.id === id)!;

export default function RunGame() {
  const { lang, run, dispatch, save } = useOzzy();
  const [rolling, setRolling] = useState(false);
  const [face, setFace] = useState<number | null>(null);
  const [last, setLast] = useState<RollResult | null>(null);
  const [reaction, setReaction] = useState<{ id: string; n: number } | null>(null);
  const timers = useRef<number[]>([]);

  // ผลทอยคำนวณจากสถานะ "ตอนลูกเต๋าหยุด" ไม่ใช่ตอนกด — ระหว่าง 0.7 วินาทีอาจไปซื้อของ/หมุนวงล้อมา
  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  }, [run]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((id) => window.clearTimeout(id));
  }, []);

  const react = (id: string) => setReaction((r) => ({ id, n: (r?.n ?? 0) + 1 }));
  const offerFor = (s: RunState) =>
    s.room === MERCHANT_AFTER ? drawOffer(s.relics.map((r) => r.id), Math.random) : undefined;

  const roll = (kind: RollKind) => {
    if (rolling || run.status !== "playing") return;
    const d20 = rollD20();
    const reroll = rollD20();
    const finish = () => {
      const s = runRef.current;
      const result = resolveRoll(s, kind, d20, reroll);
      setFace(result.face);
      setLast(result);
      setRolling(false);
      react(
        result.sek
          ? REACT.sek
          : result.pma
            ? REACT.pma
            : !result.hit
              ? REACT.miss
              : s.room === BOSS_ROOM
                ? REACT.won
                : kind === "high"
                  ? REACT.highHit
                  : REACT.hit,
      );
      dispatch({ type: "roll", result, offer: offerFor(s) });
    };
    if (reducedMotion()) {
      finish();
      return;
    }
    setRolling(true);
    setLast(null);
    const flicker = window.setInterval(() => setFace(rollD20()), FLICKER_MS);
    timers.current.push(flicker);
    timers.current.push(
      window.setTimeout(() => {
        window.clearInterval(flicker);
        finish();
      }, ROLL_MS),
    );
  };

  const ban = () => {
    react(REACT.ban);
    setLast(null);
    dispatch({ type: "useBan", offer: offerFor(run) });
  };

  const floor = OZZY.floors[Math.min(run.room, BOSS_ROOM)];
  const b = pendingBonuses(run);
  const roomLabel = (i: number) => (i === BOSS_ROOM ? t(OZZY.run.boss, lang) : `${t(OZZY.run.room, lang)} ${i + 1}`);

  return (
    <section aria-labelledby="run-title" className="mt-8">
      <h3 id="run-title" className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-(--oz-yellow)">
        {t(OZZY.run.title, lang)}
      </h3>
      <p className="mt-1 text-[13px] text-(--oz-sky)">{t(OZZY.run.intro, lang)}</p>

      <div className="mt-4">
        <RoomMap run={run} />
      </div>

      <div className="oz-panel mt-4 p-4 sm:p-6">
        {run.status === "pick" && <p className="py-5 text-center text-[14px] text-(--oz-sky)">↑ {t(OZZY.run.pickFirst, lang)}</p>}

        {run.status === "playing" && (
          <div className="grid items-center gap-5 md:grid-cols-[1fr_auto]">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-(--oz-yellow)">
                {roomLabel(run.room)} · {run.room + 1}/{OZZY.floors.length}
              </p>
              <p className="mt-2 flex items-center gap-3">
                <span className="text-[40px] leading-none" aria-hidden="true">
                  {floor.emoji}
                </span>
                <span className="oz-title text-[clamp(20px,3.2vw,28px)] font-bold leading-tight">{t(floor.name, lang)}</span>
              </p>
              {run.room === BOSS_ROOM && run.log[0]?.room === BOSS_ROOM && !run.log[0].hit && (
                <p className="mt-2 text-[13px] text-(--oz-sky)">{t(OZZY.run.bossStays, lang)}</p>
              )}

              {/* สองทางเลือก — ปุ่มไฮโรลตัวใหญ่และสว่างกว่าโดยตั้งใจ เพราะนั่นคือทางของเขา */}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => roll("safe")}
                  disabled={rolling}
                  className="rounded-xl border-[3px] border-(--oz-ink) bg-(--oz-night) px-4 py-2.5 text-left shadow-[4px_4px_0_var(--oz-ink)] transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_var(--oz-ink)] disabled:opacity-60"
                >
                  <span className="block font-mono text-[12px] font-bold uppercase tracking-[0.12em]">{t(OZZY.run.safe, lang)}</span>
                  <span className="mt-0.5 flex items-center gap-1 font-mono text-[11px] text-(--oz-sky)">
                    {t(OZZY.run.need, lang)} {floor.safe}+ · +{floor.safePoints} <Clover className="h-3 w-3" />
                  </span>
                </button>
                <button type="button" onClick={() => roll("high")} disabled={rolling} className="oz-button rounded-xl px-5 py-2.5 text-left">
                  <span className="flex items-center gap-1.5 font-mono text-[13px] font-bold uppercase tracking-[0.12em]">
                    <Bolt className="h-4 w-4" /> {t(OZZY.run.high, lang)}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1 font-mono text-[11px] opacity-80">
                    {t(OZZY.run.need, lang)} {floor.high}+ · +{floor.highPoints} <Clover className="h-3 w-3" />
                  </span>
                </button>
              </div>

              <Bonuses b={b} hero={run.hero} lang={lang} />
              <div className="mt-4">
                <RelicBar onBan={ban} disabled={rolling} />
              </div>
            </div>

            <div className="relative justify-self-center">
              <Dice face={face} rolling={rolling} last={last} lang={lang} />
              {reaction && !rolling && (
                <img
                  key={reaction.n}
                  src={emote(reaction.id).src}
                  alt={t(emote(reaction.id).name, lang)}
                  className="oz-pixel oz-pop absolute -right-6 -top-4 h-14 w-auto drop-shadow-[2px_2px_0_var(--oz-ink)]"
                />
              )}
            </div>
          </div>
        )}

        {run.status === "merchant" && <Merchant />}
        {run.status === "won" && <Won lang={lang} run={run} best={save.bestRunPoints} />}
        {run.status === "lost" && <Lost lang={lang} run={run} />}

        {/* บอก screen reader ว่าทอยได้เท่าไหร่ ผ่านไหม — ตาเห็นจากลูกเต๋า หูต้องได้ยินจากตรงนี้ */}
        <p aria-live="polite" className="sr-only">
          {last && describe(last, lang)}
        </p>

        {run.log.length > 0 && <Log entries={run.log} lang={lang} roomLabel={roomLabel} />}
      </div>
    </section>
  );
}

/** แผนที่แบบ roguelike: 1 ─ 2 ─ 🛒 ─ 3 ─ 👑 — พ่อค้าเป็นโหนดของตัวเองระหว่างห้อง 2 กับ 3 */
function RoomMap({ run }: { run: RunState }) {
  const nodes = ["1", "2", "🛒", "3", "👑"];
  // ตำแหน่งปัจจุบันบนแผนที่ (5 โหนด) จากห้อง (4 ห้อง) + สถานะพ่อค้า
  const here = run.status === "merchant" ? 2 : run.room <= MERCHANT_AFTER ? run.room : run.room + 1;
  return (
    <ol className="flex items-center" aria-hidden="true">
      {nodes.map((n, i) => {
        const done = run.status === "won" || (run.status !== "pick" && i < here);
        const now = (run.status === "playing" || run.status === "merchant") && i === here;
        return (
          <li key={i} className="flex flex-1 items-center last:flex-none">
            <span
              className={`grid h-9 w-9 flex-none place-items-center rounded-full border-[3px] border-(--oz-ink) font-mono text-[13px] font-bold transition-colors ${
                now ? "bg-(--oz-yellow) text-(--oz-ink) shadow-[0_0_18px_rgba(254,197,1,.6)]" : done ? "bg-(--oz-blue) text-(--oz-ink)" : "bg-(--oz-surface) text-(--oz-sky)"
              }`}
            >
              {n}
            </span>
            {i < nodes.length - 1 && <span className={`mx-1 h-[3px] flex-1 rounded-full ${done ? "bg-(--oz-blue)" : "bg-(--oz-blue)/20"}`} />}
          </li>
        );
      })}
    </ol>
  );
}

/** โบนัสที่รออยู่สำหรับทอยครั้งหน้า — โชว์ก่อนกด จะได้เลือกทางได้ถูก */
function Bonuses({ b, hero, lang }: { b: ReturnType<typeof pendingBonuses>; hero: RunState["hero"]; lang: Lang }) {
  const items: string[] = [];
  if (b.mbaku) items.push(`M'Baku +${b.mbaku}`);
  if (b.pepe) items.push(`Pepe +${b.pepe}`);
  if (b.glasses) items.push(`👓 +${b.glasses}`);
  if (b.luck) items.push(`🍀 +${b.luck}`);
  if (b.natural) items.push(`⚡ Dooley ${t(OZZY.run.natural, lang)}`);
  if (b.scarf) items.push(`🧣 ${t(OZZY.run.natural, lang)}`);
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11.5px]">
      {items.length > 0 && (
        <span className="text-(--oz-yellow)">
          {t(OZZY.run.bonuses, lang)}: {items.join(" · ")}
        </span>
      )}
      {hero === "dooley" && !b.natural && (
        <span className="text-(--oz-sky)" aria-label={`${t(OZZY.run.charge, lang)} ${b.charge}/2`}>
          {t(OZZY.run.charge, lang)} {"●".repeat(b.charge)}
          {"○".repeat(2 - b.charge)}
        </span>
      )}
    </div>
  );
}

/** ลูกเต๋า d20 — หกเหลี่ยมมีสามเหลี่ยมด้านในพอให้ดูออกว่าเป็น d20 */
function Dice({ face, rolling, last, lang }: { face: number | null; rolling: boolean; last: RollResult | null; lang: Lang }) {
  const tone = rolling ? "rolling" : last ? (last.hit ? "hit" : "miss") : "idle";
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 100 100" className="oz-dice h-28 w-28" data-rolling={rolling || undefined} data-tone={tone} aria-hidden="true">
        <polygon points="50,4 92,27 92,73 50,96 8,73 8,27" className="oz-dice-body" />
        <polygon points="50,25 77,68 23,68" className="oz-dice-facet" />
        <text x="50" y="53" textAnchor="middle" dominantBaseline="middle" className="oz-dice-num">
          {face ?? 20}
        </text>
      </svg>
      <div className="min-h-[38px] text-center font-mono text-[12px] font-bold uppercase tracking-[0.12em]">
        {rolling ? (
          <span className="text-(--oz-sky)">{t(OZZY.run.rolling, lang)}</span>
        ) : last ? (
          <>
            {last.hit ? (
              <span className="oz-glow-yellow text-[15px]">{last.kind === "high" ? t(OZZY.run.highHit, lang) : t(OZZY.run.hit, lang)}</span>
            ) : (
              <span className="text-(--oz-sky)">
                {t(OZZY.run.miss, lang)}
                {last.pma ? "" : " · ♥−1"}
              </span>
            )}
            {last.sek && (
              <span className="block text-[10.5px] normal-case tracking-normal text-(--oz-sky)">
                ✨ {t(OZZY.run.rerolled, lang)} ({last.firstFace} → {last.face})
              </span>
            )}
            {last.pma && <span className="block text-[10.5px] normal-case tracking-normal text-(--oz-sky)">😌 {t(OZZY.run.saved, lang)}</span>}
          </>
        ) : null}
      </div>
    </div>
  );
}

/** บันทึกการทอย — ทุกตัวเลขมีที่มา: หน้าลูกเต๋า + โบนัส = รวม เทียบกับเป้า */
function Log({ entries, lang, roomLabel }: { entries: LogEntry[]; lang: Lang; roomLabel: (i: number) => string }) {
  return (
    <ol className="mt-6 space-y-1.5 border-t-2 border-(--oz-blue)/20 pt-4 font-mono text-[11.5px] text-(--oz-sky)">
      {entries.map((e, i) => (
        <li key={e.id} className={i === 0 ? "text-white" : "opacity-70"}>
          <span className="text-(--oz-sky)/70">{roomLabel(e.room)}</span> ·{" "}
          {e.ban ? (
            <span>
              🔨 {t(OZZY.run.banned, lang)} · <span className="text-(--oz-yellow)">+{e.points} ☘</span>
            </span>
          ) : (
            <>
              {e.kind === "high" ? "⚡" : "🛡"} 🎲 {e.sek ? `${e.firstFace}→` : ""}
              {e.face}
              {(e.natural || e.scarf) && " (⚡20)"}
              {e.bonus > 0 && ` +${e.bonus}`} = {e.total} / {e.target}+ ·{" "}
              {e.hit ? (
                <span className="text-(--oz-yellow)">
                  {t(OZZY.run.hit, lang)} +{e.points} ☘
                </span>
              ) : (
                <span>
                  {t(OZZY.run.miss, lang)}
                  {e.pma ? " (PMA)" : " ♥−1"}
                </span>
              )}
            </>
          )}
        </li>
      ))}
    </ol>
  );
}

function describe(r: RollResult, lang: Lang) {
  const verdict = r.hit ? t(OZZY.run.hit, lang) : t(OZZY.run.miss, lang);
  return `${r.face}${r.bonus ? ` + ${r.bonus}` : ""} = ${r.total}, ${t(OZZY.run.need, lang)} ${r.target}. ${verdict}.`;
}

function Stats({ run, lang }: { run: RunState; lang: Lang }) {
  const rows = [
    [t(OZZY.run.earned, lang), `${run.runPoints} ☘`],
    [t(OZZY.run.highRate, lang), `${run.highHits} / ${run.highTries}`],
  ];
  return (
    <dl className="mt-4 grid grid-cols-2 gap-3 sm:max-w-[420px]">
      {rows.map(([k, v]) => (
        <div key={k} className="rounded-xl border-2 border-(--oz-ink) bg-(--oz-night) px-4 py-3">
          <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-(--oz-sky)/80">{k}</dt>
          <dd className="mt-1 text-[20px] font-bold">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function AgainButton({ lang }: { lang: Lang }) {
  const { dispatch } = useOzzy();
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: "restart" })}
      className="oz-button mt-6 rounded-xl px-5 py-2.5 font-mono text-[13px] font-bold uppercase tracking-[0.12em]"
    >
      ↻ {t(OZZY.run.again, lang)}
    </button>
  );
}

function Won({ run, lang, best }: { run: RunState; lang: Lang; best: number }) {
  const rank = rankOf(run.runPoints);
  return (
    <div className="oz-pop">
      <div className="flex items-center gap-3">
        <img src={emote(REACT.won).src} alt={t(emote(REACT.won).name, lang)} className="oz-pixel h-12 w-auto" />
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-(--oz-yellow)">👑 {t(OZZY.run.won, lang)}</p>
      </div>
      <p className="oz-title mt-2 text-[clamp(24px,4vw,34px)] font-bold leading-tight">
        {t(OZZY.run.rank, lang)}: <span className="oz-glow-yellow">{t(rank.label, lang)}</span>
      </p>
      <p className="mt-1 text-[12.5px] text-(--oz-sky)">
        {t(OZZY.run.best, lang)}: {t(rankOf(Math.max(best, run.runPoints)).label, lang)}
      </p>
      <Stats run={run} lang={lang} />
      <Loot lang={lang} />
      <AgainButton lang={lang} />
    </div>
  );
}

function Lost({ run, lang }: { run: RunState; lang: Lang }) {
  const pepe = OZZY.heroes[0];
  return (
    <div className="oz-pop">
      <div className="flex items-center gap-4">
        {/* แพ้แล้วเจอ Pepe หน้าเศร้า — อีโมตประจำช่องที่ใช้กันตอนดวงตกพอดี */}
        <img src={pepe.img} alt={t(pepe.alt, lang)} width={320} height={320} className="h-20 w-20 flex-none rounded-xl border-[3px] border-(--oz-ink) object-cover" />
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-(--oz-sky)">{t(OZZY.run.lost, lang)}</p>
          <p className="oz-title mt-1 text-[clamp(22px,4vw,32px)] font-bold">{t(OZZY.run.lostNote, lang)}</p>
        </div>
      </div>
      <Stats run={run} lang={lang} />
      <AgainButton lang={lang} />
    </div>
  );
}
