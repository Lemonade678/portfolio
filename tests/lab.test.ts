// ห้องทดลอง YOLO ในหน้า playground — เลือก "คำตัดสิน" จากสิ่งที่โมเดลเจอในรูป (lib/lab.ts)
import { describe, expect, it } from "vitest";
import { LAB_FOOD, labVerdict } from "@/lib/lab";
import { COCO, type Det } from "@/lib/yolo";

const det = (label: string, score: number): Det => ({ label, score, box: [0, 0, 1, 1] });

describe("labVerdict", () => {
  it("picks the highest-scoring food, even when a person scores higher", () => {
    expect(labVerdict([det("person", 0.95), det("cup", 0.5), det("donut", 0.7)])).toEqual({ kind: "food", label: "donut" });
  });

  it("prefers real food over drinkware, and drinkware over cutlery or the table", () => {
    // รูปมื้อเย็นจริง: โต๊ะ 0.78 แต่มีแก้ว 0.49 — คำถามคือ "ในจานมีอะไร" แก้วต้องชนะโต๊ะ
    expect(labVerdict([det("dining table", 0.78), det("cup", 0.49)])).toEqual({ kind: "food", label: "cup" });
    expect(labVerdict([det("cup", 0.9), det("cake", 0.41)])).toEqual({ kind: "food", label: "cake" });
    expect(labVerdict([det("dining table", 0.8), det("fork", 0.5)])).toEqual({ kind: "food", label: "dining table" });
  });

  it("says person when only people are found", () => {
    expect(labVerdict([det("person", 0.9)])).toEqual({ kind: "person" });
  });

  it("names the top non-food thing when there is no food or person", () => {
    expect(labVerdict([det("laptop", 0.6), det("chair", 0.8)])).toEqual({ kind: "other", label: "chair" });
  });

  it("says nothing was found for an empty list", () => {
    expect(labVerdict([])).toEqual({ kind: "none" });
  });
});

describe("LAB_FOOD", () => {
  it("only uses real COCO class names, each with a line in both languages", () => {
    for (const [label, line] of Object.entries(LAB_FOOD)) {
      expect(COCO).toContain(label);
      expect(line.en.length).toBeGreaterThan(0);
      expect(line.th.length).toBeGreaterThan(0);
    }
  });
});
