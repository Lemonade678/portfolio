// ไข่อีสเตอร์ LEMONADE — ตัวอักษรซ่อนอยู่ในคำบนหน้าแรก (lib/secret.ts)
// เทสต์นี้กันเหตุการณ์ "แก้ข้อความแล้วคำที่ซ่อนตัวอักษรหายไป" ซึ่ง TypeScript ไม่มีทางรู้
import { describe, expect, it } from "vitest";
import { SECRET_SPOTS, splitSecret, type Segment } from "@/lib/secret";
import { HOME, METRICS, PERSON, type Lang } from "@/lib/content";

/** ข้อความทั้งสี่ที่มีตัวอักษรซ่อน เรียงตามลำดับบนหน้า (บน → ล่าง) */
function places(lang: Lang) {
  const hackathon = METRICS.find((m) => m.secret === "hackathon");
  if (!hackathon) throw new Error("no metric marked secret: hackathon");
  return [
    { place: "roles", text: PERSON.roles[1].text },
    { place: "intro", text: PERSON.intro[0][lang] },
    { place: "hackathon", text: hackathon.label[lang] },
    { place: "honesty", text: HOME.counter.honesty[lang] },
  ] as const;
}

const secrets = (segs: Segment[]) => segs.filter((s): s is Exclude<Segment, string> => typeof s !== "string");

describe.each(["en", "th"] as const)("hidden letters (%s)", (lang) => {
  const all = places(lang).map((p) => ({ ...p, segs: splitSecret(p.text, SECRET_SPOTS[p.place]) }));

  it("spell LEMONADE top to bottom, indices 0–7 in order", () => {
    const found = all.flatMap((p) => secrets(p.segs));
    expect(found.map((s) => s.ch.toUpperCase()).join("")).toBe("LEMONADE");
    expect(found.map((s) => s.index)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it("put the text back together exactly", () => {
    for (const p of all) {
      expect(p.segs.map((s) => (typeof s === "string" ? s : s.ch)).join("")).toBe(p.text);
    }
  });
});

describe("splitSecret", () => {
  it("throws when the word is missing, so a copy edit can't break the egg silently", () => {
    expect(() => splitSecret("no such word", [{ word: "LLM", char: 0, index: 0 }])).toThrow(/LLM/);
  });

  it("reuses the same occurrence for two letters of one word", () => {
    const segs = splitSecret("Generation", [
      { word: "Generation", char: 8, index: 3 },
      { word: "Generation", char: 9, index: 4 },
    ]);
    expect(segs).toEqual(["Generati", { ch: "o", index: 3 }, { ch: "n", index: 4 }]);
  });
});
