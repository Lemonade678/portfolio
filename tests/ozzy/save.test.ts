// save ใน localStorage มาจากเครื่องคนเล่น — แก้ได้ เสียได้ เป็นของเวอร์ชันเก่าได้
// ทุกเทสต์ในนี้คือ "ข้อมูลหน้าตาแปลก ๆ แล้วเว็บต้องไม่พัง"
import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_SAVE, STARTER_POINTS, loadSave, parseSave, welcome, writeSave } from "@/lib/ozzy/save";

describe("parseSave", () => {
  it.each([null, "not json", "[]", '{"v":2}'])("broken input %s → default", (raw) => {
    expect(parseSave(raw)).toEqual(DEFAULT_SAVE);
  });

  it("repairs bad fields one by one", () => {
    const s = parseSave('{"v":1,"points":-5,"runs":"x"}');
    expect(s.points).toBe(0);
    expect(s.runs).toBe(0);
  });

  it("treats infinity as zero", () => {
    expect(parseSave('{"v":1,"points":1e999}').points).toBe(0);
  });

  it("floors fractional counts", () => {
    expect(parseSave('{"v":1,"points":12.7}').points).toBe(12);
  });

  it("keeps valid data", () => {
    const raw = JSON.stringify({ v: 1, points: 340, runs: 2, bestRunPoints: 120, powdered: 1, vip: true, welcomed: true });
    expect(parseSave(raw)).toEqual({ v: 1, points: 340, runs: 2, bestRunPoints: 120, powdered: 1, vip: true, welcomed: true });
  });
});

describe("welcome", () => {
  it("gives starter points once", () => {
    const s = welcome(DEFAULT_SAVE);
    expect(s.points).toBe(STARTER_POINTS);
    expect(STARTER_POINTS).toBe(200);
    expect(s.welcomed).toBe(true);
  });

  it("does nothing the second time", () => {
    const once = welcome(DEFAULT_SAVE);
    expect(welcome(once)).toEqual(once);
  });
});

describe("storage that throws (private mode / blocked)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("writeSave swallows setItem errors", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    });
    expect(() => writeSave(welcome(DEFAULT_SAVE))).not.toThrow();
  });

  it("loadSave falls back to default when getItem throws", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {},
    });
    expect(loadSave()).toEqual(DEFAULT_SAVE);
  });
});
