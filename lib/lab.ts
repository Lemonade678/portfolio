// ─────────────────────────────────────────────────────────────
// ห้องทดลอง YOLO ในหน้า playground — "ในจานคุณมีอะไร?"
//
// ผู้ชมเลือกรูปของตัวเอง → yolo11n รันในเบราว์เซอร์ (components/YoloLab.tsx) → ที่นี่เลือกคำตัดสินหนึ่งบรรทัด
// แยกเป็นฟังก์ชันล้วนเพื่อเทสต์ได้ (tests/lab.test.ts) และแก้มุกได้โดยไม่ต้องแตะ UI
//
// โมเดลเป็น COCO 80 คลาส — ไม่มีคลาส "มะนาว" หรือ "ต๊อก" (มีแค่ของกินทั่วไปอย่าง donut, cake, banana, cup)
// มุกเลยผูกของที่โมเดลรู้จักเข้ากับชั้นขนมในตู้หน้าแรกแทน
// ─────────────────────────────────────────────────────────────

import type { L10n } from "@/lib/content";
import type { Det } from "@/lib/yolo";

/** ของกิน/ภาชนะใน COCO → บรรทัดตัดสิน (ชื่อคลาสต้องตรงกับ COCO เป๊ะ — เทสต์เช็กให้) */
export const LAB_FOOD: Record<string, L10n> = {
  banana: { en: "Banana — goes on the same shelf as the pancakes.", th: "กล้วย — วางชั้นเดียวกับแพนเค้กได้เลย" },
  apple: { en: "Apple — the one healthy thing in the case. Rare.", th: "แอปเปิล — ของสุขภาพชิ้นเดียวในตู้ หายาก" },
  sandwich: { en: "Sandwich — two slices from the proof shelf.", th: "แซนด์วิช — ขนมปังจากชั้น proof สองแผ่นประกบกัน" },
  orange: { en: "Orange — close, but this counter only stocks lemons.", th: "ส้ม — ใกล้แล้ว แต่ตู้นี้ขายแต่มะนาว" },
  broccoli: { en: "Broccoli — a brave thing to bring to a snack counter.", th: "บร็อกโคลี — กล้ามากที่เอามาตู้ขนม" },
  carrot: { en: "Carrot — would make a decent carrot roll cake.", th: "แครอท — เอาไปทำโรลเค้กแครอทได้" },
  "hot dog": { en: "Hot dog — not a sandwich. The model agrees.", th: "ฮอตดอก — ไม่ใช่แซนด์วิช โมเดลเห็นด้วย" },
  pizza: { en: "Pizza — a very flat butter tteok, if you squint.", th: "พิซซ่า — บัตเตอร์ต๊อกแบน ๆ ถ้าหรี่ตามอง" },
  donut: { en: "Donut — a roll cake that gave up on the spiral.", th: "โดนัท — โรลเค้กที่เลิกม้วนไปครึ่งทาง" },
  cake: { en: "Cake — family of the roll cake on shelf 05.", th: "เค้ก — ญาติกับโรลเค้กชั้น 05" },
  cup: { en: "Cup — same shelf as the lemonade.", th: "แก้ว — อยู่ชั้นเดียวกับน้ำเลมอน" },
  bowl: { en: "Bowl — the dango would fit nicely.", th: "ชาม — ใส่ดังโงะได้พอดี" },
  bottle: { en: "Bottle — lemonade inside, hopefully.", th: "ขวด — หวังว่าข้างในเป็นน้ำเลมอน" },
  "wine glass": { en: "Wine glass — lemonade in a fancy glass still counts.", th: "แก้วไวน์ — น้ำเลมอนในแก้วหรูก็ยังนับ" },
  spoon: { en: "Spoon — you came ready to eat.", th: "ช้อน — มาพร้อมกินเลย" },
  fork: { en: "Fork — you came ready to eat.", th: "ส้อม — มาพร้อมกินเลย" },
  knife: { en: "Knife — someone is cutting the tteok.", th: "มีด — มีคนกำลังหั่นต๊อก" },
  "dining table": { en: "A dining table — the counter's bigger cousin.", th: "โต๊ะกินข้าว — ญาติตัวใหญ่ของตู้ขนม" },
};

export type LabVerdict =
  | { kind: "food"; label: string }
  | { kind: "person" }
  | { kind: "other"; label: string }
  | { kind: "none" };

/**
 * ลำดับความสำคัญของ "ของบนโต๊ะ": ของกินจริง → ภาชนะใส่ของกิน/เครื่องดื่ม → ช้อนส้อมกับตัวโต๊ะ
 * (ทดลองกับรูปมื้อเย็นจริง: โต๊ะได้ 0.78 แก้วได้ 0.49 — ถ้าเรียงตามคะแนนอย่างเดียว คำตัดสินจะเป็น "โต๊ะ" ซึ่งไม่สนุก)
 * ในขั้นเดียวกันใช้คะแนนสูงสุด · ของที่ไม่อยู่ในรายการเลยอยู่ขั้นสุดท้าย
 */
const TIER: Record<string, number> = {
  banana: 0, apple: 0, sandwich: 0, orange: 0, broccoli: 0, carrot: 0, "hot dog": 0, pizza: 0, donut: 0, cake: 0,
  cup: 1, bowl: 1, bottle: 1, "wine glass": 1,
  spoon: 2, fork: 2, knife: 2, "dining table": 2,
};

/** ของกินชนะเสมอ (ต่อให้คนในรูปคะแนนสูงกว่า — เพราะคำถามคือ "ในจานมีอะไร") → คน → ของอื่น → ไม่เจออะไร */
export function labVerdict(dets: readonly Det[]): LabVerdict {
  const byScore = [...dets].sort((a, b) => b.score - a.score);
  const food = byScore
    .filter((d) => d.label in LAB_FOOD)
    .sort((a, b) => (TIER[a.label] ?? 3) - (TIER[b.label] ?? 3) || b.score - a.score)[0];
  if (food) return { kind: "food", label: food.label };
  if (byScore.some((d) => d.label === "person")) return { kind: "person" };
  if (byScore.length > 0) return { kind: "other", label: byScore[0].label };
  return { kind: "none" };
}
