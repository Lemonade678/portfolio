// ส่วนที่คำนวณล้วนของ YOLO (ไม่ต้องโหลดโมเดล ไม่ต้องมีเบราว์เซอร์)
import { describe, expect, it } from "vitest";
import { decode, decodeRaw, iou, letterboxGeometry, nms, type Det } from "@/lib/yolo";

describe("iou", () => {
  it("is 1 for identical boxes and 0 for disjoint ones", () => {
    expect(iou([0, 0, 1, 1], [0, 0, 1, 1])).toBe(1);
    expect(iou([0, 0, 1, 1], [2, 2, 3, 3])).toBe(0);
  });

  it("is a third when two unit boxes overlap by half", () => {
    // ทับกันครึ่งหนึ่ง: inter = 0.5 · union = 1 + 1 − 0.5 = 1.5
    expect(iou([0, 0, 1, 1], [0.5, 0, 1.5, 1])).toBeCloseTo(1 / 3);
  });
});

describe("nms", () => {
  const d = (label: string, score: number, x: number): Det => ({ label, score, box: [x, 0, x + 1, 1] });

  it("drops a weaker box of the same class that overlaps too much", () => {
    expect(nms([d("cup", 0.6, 0.1), d("cup", 0.9, 0)], 0.45)).toEqual([d("cup", 0.9, 0)]);
  });

  it("keeps overlapping boxes of different classes", () => {
    expect(nms([d("person", 0.9, 0), d("cell phone", 0.5, 0.1)], 0.45)).toHaveLength(2);
  });
});

describe("letterboxGeometry", () => {
  it("fits a tall photo by height and centres it sideways", () => {
    const g = letterboxGeometry(284, 459, 640);
    expect(g.scale).toBeCloseTo(640 / 459);
    expect(g.dh).toBe(640);
    expect(g.dw).toBe(396);
    expect(g.dx).toBe(122);
    expect(g.dy).toBe(0);
  });

  it("fits a wide photo by width and centres it vertically", () => {
    const g = letterboxGeometry(1000, 500, 640);
    expect(g.scale).toBeCloseTo(0.64);
    expect([g.dw, g.dh, g.dx, g.dy]).toEqual([640, 320, 0, 160]);
  });
});

describe("decode", () => {
  // เทนเซอร์จิ๋ว: 2 คลาส × 3 ตำแหน่ง เรียงแบบ channel-major เหมือนเอาต์พุตจริง [1, 4+คลาส, N]
  //   ตำแหน่ง 0: กล่องกลางภาพ คลาส a 0.9
  //   ตำแหน่ง 1: กล่องเดียวกันขยับนิดเดียว คลาส a 0.6 (NMS ต้องตัดทิ้ง)
  //   ตำแหน่ง 2: คะแนนต่ำกว่าเกณฑ์ทุกคลาส
  const n = 3;
  const rows = [
    [320, 324, 100], // cx
    [320, 320, 100], // cy
    [64, 64, 10], // w
    [128, 128, 10], // h
    [0.9, 0.6, 0.02], // คลาส a
    [0.1, 0.1, 0.03], // คลาส b
  ];
  const data = new Float32Array(rows.flat());
  const dims = [1, rows.length, n] as const;
  const meta = { scale: 1, dx: 0, dy: 0, iw: 640, ih: 640 };

  it("decodeRaw keeps every candidate above the floor, mapped back to 0..1", () => {
    const raw = decodeRaw(data, dims, meta, 0.05, ["a", "b"]);
    expect(raw).toHaveLength(2);
    expect(raw[0].label).toBe("a");
    expect(raw[0].score).toBeCloseTo(0.9);
    expect(raw[0].box.map((v) => Number(v.toFixed(3)))).toEqual([0.45, 0.4, 0.55, 0.6]);
  });

  it("decode = threshold + per-class NMS", () => {
    const out = decode(data, dims, meta, 0.4, 0.45, ["a", "b"]);
    expect(out).toHaveLength(1);
    expect(out[0].score).toBeCloseTo(0.9);
  });

  it("undoes letterbox padding and scale", () => {
    // รูปจริง 320×640 ถูกย่อ 1× แล้ววางกลาง (dx = 160) — กล่องที่ cx 320 ต้องกลับมาอยู่กลางรูปจริง
    const raw = decodeRaw(data, dims, { scale: 1, dx: 160, dy: 0, iw: 320, ih: 640 }, 0.5, ["a", "b"]);
    const [x1, , x2] = raw[0].box;
    expect((x1 + x2) / 2).toBeCloseTo(0.5);
  });
});
