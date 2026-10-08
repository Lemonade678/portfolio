// ─────────────────────────────────────────────────────────────
// ไข่อีสเตอร์ LEMONADE — ตัวอักษรทั้ง 8 ซ่อนอยู่ "ในคำ" บนหน้าแรก หน้าตาเหมือนตัวหนังสือรอบข้างทุกอย่าง
// (เดิมเป็นปุ่มตัวอักษรจาง ๆ ชิดขอบขวา เจ้าของเว็บอยากให้เป็นความลับจริง ๆ เลยย้ายมาฝังในข้อความ)
//
// เลือกเฉพาะคำที่เหมือนกันทั้งสองภาษา (LLM · Fine · Generation · Thailand · label)
// สลับภาษาแล้วไข่ยังอยู่ที่เดิม — คนที่หาเจอในภาษาไทยก็กดตำแหน่งเดียวกับคนอ่านอังกฤษ
//
// เรียงบน → ล่าง ตามที่คำใบ้ในหน้าล็อกบอก:
//   L  e  : บรรทัดบทบาทใต้ชื่อ     "[L]LM Fin[e]-tuning"
//   M     : ย่อหน้าแนะนำตัวแรก      "LL[M]"
//   o n a d : การ์ดตัวเลขแฮกกาธอน   "Generati[o][n] Th[a]ilan[d]"
//   e     : บรรทัดใต้ตู้ขนม          "lab[e]l"
//
// ข้อมูลเป็นแค่ "คำ + ตำแหน่งตัวอักษร" — ไม่ได้ฝังเครื่องหมายพิเศษไว้ในข้อความใน content.ts
// ข้อความเลยยังเอาไปใช้ที่อื่นได้ตามปกติ (metadata, portfolio-preview.html) ไม่มีขยะติดไป
// ถ้าวันหนึ่งแก้ข้อความแล้วคำหายไป splitSecret จะ throw และเทสต์ใน tests/home/secret.test.ts จะแดงทันที
// ─────────────────────────────────────────────────────────────

export interface Spot {
  /** คำที่ใช้ซ่อน (ต้องมีอยู่จริงในข้อความ ตัวพิมพ์ตรงเป๊ะ) */
  word: string;
  /** ตำแหน่งตัวอักษรในคำ เริ่มที่ 0 */
  char: number;
  /** ลำดับใน LEMONADE (0–7) */
  index: number;
}

export type Segment = string | { ch: string; index: number };

export const SECRET_SPOTS = {
  roles: [
    { word: "LLM", char: 0, index: 0 },
    { word: "Fine", char: 3, index: 1 },
  ],
  intro: [{ word: "LLM", char: 2, index: 2 }],
  hackathon: [
    { word: "Generation", char: 8, index: 3 },
    { word: "Generation", char: 9, index: 4 },
    { word: "Thailand", char: 2, index: 5 },
    { word: "Thailand", char: 7, index: 6 },
  ],
  honesty: [{ word: "label", char: 3, index: 7 }],
} satisfies Record<string, Spot[]>;

export type SecretPlace = keyof typeof SECRET_SPOTS;

/**
 * หั่นข้อความเป็นชิ้น ๆ: ข้อความธรรมดา + ตัวอักษรลับ
 * ค้นคำตามลำดับ spot — ตัวอักษรสองตัวจากคำเดียวกัน (เช่น o กับ n ของ Generation) ใช้คำตำแหน่งเดียวกัน
 */
export function splitSecret(text: string, spots: readonly Spot[]): Segment[] {
  const out: Segment[] = [];
  let cursor = 0; // ตัดข้อความไปถึงไหนแล้ว
  let prev: { word: string; start: number } | null = null;

  for (const s of spots) {
    const from = prev && prev.word === s.word ? prev.start : cursor;
    const start = text.indexOf(s.word, from);
    if (start < 0) throw new Error(`secret word "${s.word}" not found in: ${text.slice(0, 40)}…`);
    const at = start + s.char;
    if (at < cursor || s.char >= s.word.length) throw new Error(`secret spot out of order: ${s.word}[${s.char}]`);

    if (at > cursor) out.push(text.slice(cursor, at));
    out.push({ ch: text[at], index: s.index });
    cursor = at + 1;
    prev = { word: s.word, start };
  }
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}
