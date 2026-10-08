// เนื้อหาใหม่ของหน้าหลัก: กำแพงรูปใน People (04) — ครบสองภาษา และไฟล์รูปมีอยู่จริง
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PEOPLE } from "@/lib/content";

const both = (s: { en: string; th: string }) => s.en.trim().length > 0 && s.th.trim().length > 0;

describe("PEOPLE", () => {
  it("has a title, intro and the TheOzzy lead-in in both languages", () => {
    expect(both(PEOPLE.title)).toBe(true);
    expect(both(PEOPLE.intro)).toBe(true);
    expect(both(PEOPLE.next)).toBe(true);
  });

  it("every photo has a file on disk, a real size, alt text and a caption in both languages", () => {
    expect(PEOPLE.photos.length).toBeGreaterThan(0);
    for (const p of PEOPLE.photos) {
      expect(p.src).toMatch(/^\/people\/[a-z0-9-]+\.webp$/);
      expect(existsSync(`public${p.src}`)).toBe(true);
      expect(Number.isInteger(p.w) && p.w > 0).toBe(true);
      expect(Number.isInteger(p.h) && p.h > 0).toBe(true);
      expect(both(p.alt)).toBe(true);
      expect(both(p.caption)).toBe(true);
    }
  });

  it("photo ids are unique", () => {
    const ids = PEOPLE.photos.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
