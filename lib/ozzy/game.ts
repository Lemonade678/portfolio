// ─────────────────────────────────────────────────────────────
// กติกาเกมดันเจี้ยนของเว็บ TheOzzy — แยกออกจาก UI ตั้งใจ (เดิมอยู่หน้า teaser /next)
//
// ทำไมแยก: กติกาทั้งหมด (โบนัสฮีโร่ รีลิค พ่อค้า แต้ม หัวใจ แพ้/ชนะ) อยู่ไฟล์เดียว
// อ่านรวดเดียวจบว่าเกมทำงานยังไง และเทสต์ได้โดยไม่ต้องเปิดเบราว์เซอร์ (tests/ozzy/game.test.ts)
//
// หลักสำคัญ: ไฟล์นี้ "ไม่สุ่มเอง" — หน้าลูกเต๋าและของที่พ่อค้าเอามาขาย UI เป็นคนสุ่ม
// แล้วส่งเข้ามาเป็นตัวเลข/รายการ ผลคือฟังก์ชันทุกตัวใส่ค่าเดิมได้ผลเดิมเสมอ
// React เรียก reducer ซ้ำได้ไม่พัง และเทสต์กำหนดผลได้ทุกกรณี
//
// แต้ม (points) คือกระเป๋าเงินที่อยู่ข้ามรัน — shell เป็นคนเซฟลง localStorage
// runPoints คือแต้มที่ได้จากห้องในรันนี้เท่านั้น ใช้คิดแรงก์ (วงล้อ/ร้านไม่เกี่ยว)
// ─────────────────────────────────────────────────────────────

import { OZZY, type OzHeroId, type RelicId } from "@/lib/ozzy/content";

export type RollKind = "safe" | "high";

export const MAX_HP = 3;
/** Pepe: ทอยพลาด → ครั้งถัดไปบวกเท่านี้ (ไม่ทบ) */
export const PEPE_BONUS = 4;
/** M'Baku: บวกทุกครั้ง */
export const MBAKU_BONUS = 2;
/** Dooley: ทอยครั้งที่ 3, 6, 9, … ของรันได้ 20 เต็ม */
export const DOOLEY_EVERY = 3;
/** วงล้อช่อง "ไฮโรล": ทอยครั้งถัดไปบวกเท่านี้ (ไม่ทบ) */
export const LUCK_BONUS = 5;
/** รีลิคแว่นไฟฟ้า */
export const GLASSES_BONUS = 1;
export const MAX_RELICS = 3;
/** พ่อค้าโผล่หลังห้อง index นี้ (ห้องที่ 2) */
export const MERCHANT_AFTER = 1;
/** ราคาพ่อค้า = 80% ปัดลงเป็นหลัก 10 */
const MERCHANT_RATE = 0.8;

export const BOSS_ROOM = OZZY.floors.length - 1;

/** สุ่มหน้าลูกเต๋า 1–20 แบบเท่ากันทุกหน้า — ฝั่ง UI เรียกใช้ */
export const rollD20 = () => 1 + Math.floor(Math.random() * 20);

export interface RelicSlot {
  id: RelicId;
  /** รีลิคใช้ครั้งเดียว (BAN · PMA · เสก · ผ้าพันคอ) ใช้แล้วยังโชว์ในช่องแต่เป็นสีเทา */
  used: boolean;
}

export interface RollResult {
  kind: RollKind;
  /** หน้าลูกเต๋าที่นับจริง (หลังเสก/ผ้าพันคอ/Dooley) */
  face: number;
  /** หน้าแรกก่อนเสกทอยใหม่ · null = เสกไม่ได้ทำงาน */
  firstFace: number | null;
  bonus: number;
  total: number;
  target: number;
  hit: boolean;
  points: number;
  /** Dooley ชาร์จเต็มรอบนี้ */
  natural: boolean;
  scarf: boolean;
  sek: boolean;
  pma: boolean;
}

export interface LogEntry extends RollResult {
  id: number;
  room: number;
  /** ข้ามห้องด้วยค้อน BAN (ไม่ได้ทอยจริง) */
  ban?: boolean;
}

export type RunStatus = "pick" | "playing" | "merchant" | "won" | "lost";

export interface RunState {
  /** นับรัน — UI ใช้เป็น key ให้ส่วนดันเจี้ยน remount ตอนเริ่มรันใหม่ */
  runId: number;
  hero: OzHeroId | null;
  status: RunStatus;
  hp: number;
  maxHp: number;
  /** กระเป๋าแต้ม (อยู่ข้ามรัน) */
  points: number;
  /** แต้มจากห้องในรันนี้ — ใช้คิดแรงก์ */
  runPoints: number;
  room: number;
  /** จำนวนครั้งที่ทอยในรันนี้ — Dooley ใช้นับรอบชาร์จ */
  rolls: number;
  pepeBonus: number;
  luckBonus: number;
  relics: RelicSlot[];
  merchantOffer: RelicId[];
  highTries: number;
  highHits: number;
  /** ล่าสุดอยู่บนสุด เก็บแค่ 6 บรรทัด */
  log: LogEntry[];
  /** เลขรันนิ่งไว้ทำ key ของ log ไม่ให้ซ้ำข้ามรัน */
  seq: number;
}

export const initialRun: RunState = {
  runId: 0,
  hero: null,
  status: "pick",
  hp: MAX_HP,
  maxHp: MAX_HP,
  points: 0,
  runPoints: 0,
  room: 0,
  rolls: 0,
  pepeBonus: 0,
  luckBonus: 0,
  relics: [],
  merchantOffer: [],
  highTries: 0,
  highHits: 0,
  log: [],
  seq: 0,
};

const holds = (s: RunState, id: RelicId) => s.relics.some((r) => r.id === id && !r.used);
const markUsed = (relics: RelicSlot[], id: RelicId, when: boolean) =>
  when ? relics.map((r) => (r.id === id ? { ...r, used: true } : r)) : relics;

/** โบนัสที่จะบวกในการทอยครั้งถัดไป แยกตามแหล่ง — UI เอาไปโชว์ให้เห็นก่อนกด */
export function pendingBonuses(s: RunState) {
  const natural = s.hero === "dooley" && (s.rolls + 1) % DOOLEY_EVERY === 0;
  return {
    mbaku: s.hero === "mbaku" ? MBAKU_BONUS : 0,
    pepe: s.pepeBonus,
    luck: s.luckBonus,
    glasses: holds(s, "glasses") ? GLASSES_BONUS : 0,
    /** ทอยครั้งถัดไปของ Dooley เป็น 20 เต็มไหม */
    natural,
    /** ผ้าพันคอจะทำงานครั้งหน้า (ถ้า Dooley ได้ 20 อยู่แล้ว เก็บผ้าพันคอไว้ใช้ทีหลัง) */
    scarf: !natural && holds(s, "scarf"),
    /** ชาร์จสะสมอยู่กี่ขีดแล้ว (0–2) */
    charge: s.hero === "dooley" ? s.rolls % DOOLEY_EVERY : 0,
  };
}

/**
 * คำนวณผลทอยหนึ่งครั้งจากสถานะปัจจุบัน + ลูกเต๋าสองลูกที่สุ่มมาแล้ว
 * ลูกที่สอง (reroll) ใช้เฉพาะตอนรีลิค "เสก" ทำงาน — ส่งมาเสมอ จะได้ไม่ต้องย้อนไปถาม UI
 * ลำดับตอนพลาด: เสกก่อน (ทอยใหม่) → ถ้ายังพลาดและมี PMA → ไม่เสียหัวใจ
 */
export function resolveRoll(s: RunState, kind: RollKind, d20: number, reroll: number): RollResult {
  const floor = OZZY.floors[s.room];
  const b = pendingBonuses(s);
  const bonus = b.mbaku + b.pepe + b.luck + b.glasses;
  const target = kind === "high" ? floor.high : floor.safe;

  let face = b.natural || b.scarf ? 20 : d20;
  let hit = face + bonus >= target;

  const sek = !hit && holds(s, "sek");
  const firstFace = sek ? face : null;
  if (sek) {
    face = reroll;
    hit = face + bonus >= target;
  }
  const pma = !hit && holds(s, "pma");
  const points = hit ? (kind === "high" ? floor.highPoints : floor.safePoints) : 0;

  return {
    kind,
    face,
    firstFace,
    bonus,
    total: face + bonus,
    target,
    hit,
    points,
    natural: b.natural,
    scarf: b.scarf,
    sek,
    pma,
  };
}

/** ราคารีลิค — พ่อค้าลด 20% ปัดลงเป็นหลัก 10 */
export function priceOf(id: RelicId, discounted: boolean): number {
  const base = OZZY.relics.find((r) => r.id === id)!.price;
  return discounted ? Math.floor((base * MERCHANT_RATE) / 10) * 10 : base;
}

/** สุ่มของให้พ่อค้า: รีลิคที่ยังไม่มี สูงสุด 3 ชิ้นไม่ซ้ำ — rand ส่งมาจากข้างนอก (เทสต์ได้) */
export function drawOffer(owned: RelicId[], rand: () => number): RelicId[] {
  const pool = OZZY.relics.map((r) => r.id).filter((id) => !owned.includes(id));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 3);
}

export type RunAction =
  | { type: "load"; points: number }
  | { type: "pick"; hero: OzHeroId }
  | { type: "roll"; result: RollResult; offer?: RelicId[] }
  | { type: "useBan"; offer?: RelicId[] }
  | { type: "buyRelic"; id: RelicId }
  | { type: "leaveMerchant" }
  | { type: "earn"; amount: number }
  | { type: "spend"; amount: number }
  | { type: "luck" }
  | { type: "restart" };

/** ห้องถัดไปหลังผ่าน/ข้ามห้อง non-boss — ถ้าเพิ่งพ้นห้องที่ 2 ไปเจอพ่อค้าก่อน */
function advance(s: RunState, offer: RelicId[] | undefined) {
  const merchant = s.room === MERCHANT_AFTER;
  return {
    room: s.room + 1,
    status: (merchant ? "merchant" : "playing") as RunStatus,
    merchantOffer: merchant ? (offer ?? []) : [],
  };
}

export function runReducer(s: RunState, a: RunAction): RunState {
  switch (a.type) {
    case "load":
      return { ...s, points: Math.max(0, Math.floor(a.points)) };

    case "pick":
      // เลือกฮีโร่ = เริ่มรันใหม่ทุกครั้ง · กระเป๋าแต้มกับโบนัสจากวงล้อติดตัวไป (ได้มาจากนอกดันเจี้ยน)
      return {
        ...initialRun,
        runId: s.runId + 1,
        hero: a.hero,
        status: "playing",
        points: s.points,
        luckBonus: s.luckBonus,
        seq: s.seq,
      };

    case "roll": {
      if (s.status !== "playing") return s;
      const r = a.result;
      const hp = r.hit || r.pma ? s.hp : s.hp - 1;
      const boss = s.room === BOSS_ROOM;
      let next: { room: number; status: RunStatus; merchantOffer: RelicId[] };
      if (hp <= 0) next = { room: s.room, status: "lost", merchantOffer: [] };
      else if (boss) next = { room: s.room, status: r.hit ? "won" : "playing", merchantOffer: [] };
      else next = advance(s, a.offer);

      let relics = markUsed(s.relics, "scarf", r.scarf);
      relics = markUsed(relics, "sek", r.sek);
      relics = markUsed(relics, "pma", r.pma);

      return {
        ...s,
        ...next,
        hp,
        relics,
        points: s.points + r.points,
        runPoints: s.runPoints + r.points,
        rolls: s.rolls + 1,
        pepeBonus: s.hero === "pepe" && !r.hit ? PEPE_BONUS : 0,
        luckBonus: 0,
        highTries: s.highTries + (r.kind === "high" ? 1 : 0),
        highHits: s.highHits + (r.kind === "high" && r.hit ? 1 : 0),
        log: [{ ...r, id: s.seq, room: s.room }, ...s.log].slice(0, 6),
        seq: s.seq + 1,
      };
    }

    case "useBan": {
      if (s.status !== "playing" || s.room === BOSS_ROOM || !holds(s, "ban")) return s;
      const floor = OZZY.floors[s.room];
      const entry: LogEntry = {
        id: s.seq,
        room: s.room,
        ban: true,
        kind: "safe",
        face: 0,
        firstFace: null,
        bonus: 0,
        total: 0,
        target: floor.safe,
        hit: true,
        points: floor.safePoints,
        natural: false,
        scarf: false,
        sek: false,
        pma: false,
      };
      return {
        ...s,
        ...advance(s, a.offer),
        relics: markUsed(s.relics, "ban", true),
        points: s.points + floor.safePoints,
        runPoints: s.runPoints + floor.safePoints,
        log: [entry, ...s.log].slice(0, 6),
        seq: s.seq + 1,
      };
    }

    case "buyRelic": {
      if (s.status !== "playing" && s.status !== "merchant") return s;
      if (s.relics.length >= MAX_RELICS || s.relics.some((r) => r.id === a.id)) return s;
      const price = priceOf(a.id, s.status === "merchant" && s.merchantOffer.includes(a.id));
      if (s.points < price) return s;
      const heart = a.id === "heart" ? 1 : 0;
      return {
        ...s,
        points: s.points - price,
        relics: [...s.relics, { id: a.id, used: false }],
        hp: s.hp + heart,
        maxHp: s.maxHp + heart,
      };
    }

    case "leaveMerchant":
      return s.status === "merchant" ? { ...s, status: "playing", merchantOffer: [] } : s;

    case "earn":
      return a.amount > 0 ? { ...s, points: s.points + Math.floor(a.amount) } : s;

    case "spend":
      return a.amount > 0 && a.amount <= s.points ? { ...s, points: s.points - a.amount } : s;

    case "luck":
      return { ...s, luckBonus: LUCK_BONUS };

    case "restart":
      return s.hero ? runReducer(s, { type: "pick", hero: s.hero }) : s;
  }
}

/** แรงก์ตอนจบรัน — ranks เรียงจากสูงไปต่ำ หยิบตัวแรกที่ถึงเกณฑ์ */
export function rankOf(runPoints: number) {
  return OZZY.run.ranks.find((r) => runPoints >= r.min) ?? OZZY.run.ranks[OZZY.run.ranks.length - 1];
}
