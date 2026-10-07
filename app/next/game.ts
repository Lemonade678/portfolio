// ─────────────────────────────────────────────────────────────
// ตรรกะของมินิเกมในหน้า /next — แยกออกจาก UI ตั้งใจ
//
// ทำไมแยก: กติกาทั้งหมด (โบนัสของฮีโร่ เป้าแต้ม ทอง หัวใจ แพ้/ชนะ) อยู่ไฟล์เดียว
// อ่านรวดเดียวจบว่าเกมทำงานยังไง ไม่ต้องไล่หาใน JSX และเทสต์ได้โดยไม่ต้องเปิดเบราว์เซอร์
//
// หลักสำคัญ: ไฟล์นี้ "ไม่สุ่มเอง" — resolveRoll รับหน้าลูกเต๋ามาจากข้างนอก
// ฝั่ง UI เป็นคนสุ่ม (เพราะต้องเอาเลขไปโชว์ตอนลูกเต๋าหมุนอยู่แล้ว) แล้วส่งเลขเข้ามาคำนวณ
// ผลคือฟังก์ชันพวกนี้ใส่เลขเดิมได้ผลเดิมเสมอ (pure) — React เรียก reducer ซ้ำได้ไม่พัง
// ─────────────────────────────────────────────────────────────

import { NEXT_RUN, type OzHeroId } from "@/lib/content";

export type RollKind = "safe" | "high";

export const MAX_HP = 3;
/** Pepe: ทอยพลาด → ครั้งถัดไปบวกเท่านี้ (ไม่ทบ — พลาดซ้ำก็ยัง +4 เท่าเดิม) */
export const PEPE_BONUS = 4;
/** M'Baku: บวกทุกครั้ง */
export const MBAKU_BONUS = 2;
/** Dooley: ทอยครั้งที่ 3, 6, 9, … ของรันได้ 20 เต็มโดยไม่ต้องลุ้น */
export const DOOLEY_EVERY = 3;
/** วงล้อช่อง "ไฮโรล": ทอยครั้งถัดไปบวกเท่านี้ (หมุนได้ซ้ำก็ไม่ทบ) */
export const LUCK_BONUS = 5;

export const BOSS_ROOM = NEXT_RUN.floors.length - 1;

/** สุ่มหน้าลูกเต๋า 1–20 แบบเท่ากันทุกหน้า — ฝั่ง UI เรียกใช้ */
export const rollD20 = () => 1 + Math.floor(Math.random() * 20);

export interface RollResult {
  kind: RollKind;
  /** หน้าลูกเต๋าที่ออกจริง (ถ้า Dooley ชาร์จเต็มจะเป็น 20) */
  face: number;
  /** โบนัสรวมทุกแหล่งที่บวกเข้าไป */
  bonus: number;
  total: number;
  target: number;
  hit: boolean;
  gold: number;
  /** Dooley ชาร์จเต็มรอบนี้ */
  natural: boolean;
}

export interface LogEntry extends RollResult {
  id: number;
  room: number;
}

export interface RunState {
  hero: OzHeroId | null;
  status: "pick" | "playing" | "won" | "lost";
  hp: number;
  /** ทองในกระเป๋า — รวมทองจากวงล้อด้วย โชว์บนแถบบน */
  gold: number;
  /** ทองที่ได้จากห้องในรันนี้เท่านั้น — ใช้คิดแรงก์ (วงล้อไม่นับ ไม่งั้นหมุนปั๊มแรงก์ได้) */
  runGold: number;
  room: number;
  /** จำนวนครั้งที่ทอยในรันนี้ — Dooley ใช้นับรอบชาร์จ */
  rolls: number;
  pepeBonus: number;
  luckBonus: number;
  highTries: number;
  highHits: number;
  /** ล่าสุดอยู่บนสุด เก็บแค่ 6 บรรทัด */
  log: LogEntry[];
  /** เลขรันนิ่งไว้ทำ key ของ log ไม่ให้ซ้ำข้ามรัน */
  seq: number;
  /** นับรัน — หน้าเว็บใช้เป็น key ของส่วนดันเจี้ยน เริ่มรันใหม่เมื่อไหร่ ลูกเต๋า/ผลค้างจะล้างเอง */
  runId: number;
}

export const initialRun: RunState = {
  runId: 0,
  hero: null,
  status: "pick",
  hp: MAX_HP,
  gold: 0,
  runGold: 0,
  room: 0,
  rolls: 0,
  pepeBonus: 0,
  luckBonus: 0,
  highTries: 0,
  highHits: 0,
  log: [],
  seq: 0,
};

/** โบนัสที่จะบวกในการทอยครั้งถัดไป แยกตามแหล่ง — UI เอาไปโชว์ให้เห็นก่อนกดทอย */
export function pendingBonuses(s: RunState) {
  return {
    mbaku: s.hero === "mbaku" ? MBAKU_BONUS : 0,
    pepe: s.pepeBonus,
    luck: s.luckBonus,
    /** ทอยครั้งถัดไปของ Dooley เป็น 20 เต็มไหม */
    natural: s.hero === "dooley" && (s.rolls + 1) % DOOLEY_EVERY === 0,
    /** ชาร์จสะสมอยู่กี่ขีดแล้ว (0–2) */
    charge: s.hero === "dooley" ? s.rolls % DOOLEY_EVERY : 0,
  };
}

/** คำนวณผลทอยหนึ่งครั้งจากสถานะปัจจุบัน + หน้าลูกเต๋าที่สุ่มมาแล้ว */
export function resolveRoll(s: RunState, kind: RollKind, d20: number): RollResult {
  const floor = NEXT_RUN.floors[s.room];
  const b = pendingBonuses(s);
  const face = b.natural ? 20 : d20;
  const bonus = b.mbaku + b.pepe + b.luck;
  const total = face + bonus;
  const target = kind === "high" ? floor.high : floor.safe;
  const hit = total >= target;
  const gold = hit ? (kind === "high" ? floor.highGold : floor.safeGold) : 0;
  return { kind, face, bonus, total, target, hit, gold, natural: b.natural };
}

export type RunAction =
  | { type: "pick"; hero: OzHeroId }
  | { type: "roll"; result: RollResult }
  | { type: "gold"; amount: number }
  | { type: "luck" }
  | { type: "restart" };

export function runReducer(s: RunState, a: RunAction): RunState {
  switch (a.type) {
    case "pick":
      // เลือกฮีโร่ = เริ่มรันใหม่ทุกครั้ง (กดตัวเดิมซ้ำก็เริ่มใหม่ — เท่ากับปุ่มรีสตาร์ต)
      // ทองในกระเป๋ากับโบนัสจากวงล้อเก็บไว้ เพราะได้มาจากนอกดันเจี้ยน ไม่ใช่ของรันเก่า
      return {
        ...initialRun,
        runId: s.runId + 1,
        hero: a.hero,
        status: "playing",
        gold: s.gold,
        luckBonus: s.luckBonus,
        seq: s.seq,
      };

    case "roll": {
      if (s.status !== "playing") return s;
      const r = a.result;
      const hp = r.hit ? s.hp : s.hp - 1;
      const boss = s.room === BOSS_ROOM;
      // ห้องธรรมดา: ผ่านหรือพลาดก็เดินต่อ (โดนตีแต่รอด) · ห้องบอส: ต้องชนะถึงจะจบ
      const room = boss ? s.room : s.room + 1;
      const status = hp <= 0 ? "lost" : boss && r.hit ? "won" : "playing";
      return {
        ...s,
        hp,
        room,
        status,
        gold: s.gold + r.gold,
        runGold: s.runGold + r.gold,
        rolls: s.rolls + 1,
        pepeBonus: s.hero === "pepe" && !r.hit ? PEPE_BONUS : 0,
        luckBonus: 0,
        highTries: s.highTries + (r.kind === "high" ? 1 : 0),
        highHits: s.highHits + (r.kind === "high" && r.hit ? 1 : 0),
        log: [{ ...r, id: s.seq, room: s.room }, ...s.log].slice(0, 6),
        seq: s.seq + 1,
      };
    }

    case "gold":
      return { ...s, gold: s.gold + a.amount };

    case "luck":
      return { ...s, luckBonus: LUCK_BONUS };

    case "restart":
      return s.hero ? runReducer(s, { type: "pick", hero: s.hero }) : s;
  }
}

/** แรงก์ตอนจบรัน — ranks เรียงจากสูงไปต่ำ หยิบตัวแรกที่ถึงเกณฑ์ */
export function rankOf(runGold: number) {
  return NEXT_RUN.run.ranks.find((r) => runGold >= r.min) ?? NEXT_RUN.run.ranks.at(-1)!;
}
