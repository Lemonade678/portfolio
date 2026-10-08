// ─────────────────────────────────────────────────────────────
// ตัวเลขสองมุมของไพ่ 6 ใบบนโต๊ะ TheOzzy: วงฟ้า = cost · หกเหลี่ยมส้ม = power (แบบ Marvel Snap)
//
// เจ้าของเว็บอยากให้มุมไพ่ "อ่านซ้ายไปขวาเป็นมีม" — ค่ามุกอยู่ใน OZZY.table.gems (content.ts)
//   โปรไฟล์ 1·2 · คลิป 2·13 (= 213 เลขมงคลประจำช่อง) · คอลเลกชัน 6·7 · ร้าน 6·9
// ไพ่ที่ไม่มีมุก (ดันเจี้ยน · วงล้อ) ใช้ cost = ลำดับไพ่ และ power = ตัวเลขจริงของหน้าต่างนั้น
// (จำนวนห้อง · จำนวนช่องวงล้อ) — แก้ห้องหรือช่องวงล้อเมื่อไหร่ เลขขยับตามเอง
// แยกเป็นฟังก์ชันล้วนเพื่อเทสต์ได้ (tests/ozzy/cards.test.ts)
// ─────────────────────────────────────────────────────────────

import { OZZY, type CardId } from "@/lib/ozzy/content";

export interface Gem {
  cost: number;
  power: number;
}

/** ตัวเลขจริงของหน้าต่าง (ใช้กับไพ่ที่ไม่มีมุก) */
const REAL: Partial<Record<CardId, number>> = {
  run: OZZY.floors.length,
  wheel: OZZY.wheel.slices.length,
};

export function deckGems(): Record<CardId, Gem> {
  const out = {} as Record<CardId, Gem>;
  OZZY.cards.forEach((c, i) => {
    const meme: Partial<Gem> | undefined = OZZY.table.gems[c.id as keyof typeof OZZY.table.gems];
    out[c.id] = { cost: meme?.cost ?? i + 1, power: meme?.power ?? REAL[c.id] ?? 0 };
  });
  return out;
}
