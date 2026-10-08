// รูปในหน้าต่างโปรไฟล์ของ TheOzzy — ไฟล์มีจริง · alt ครบสองภาษา · id ไม่ซ้ำ
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { OZZY } from "@/lib/ozzy/content";

describe("OZZY.photos", () => {
  it("has the three original photos plus the three from his album", () => {
    expect(OZZY.photos.map((p) => p.id)).toEqual(["selfie", "giraffe", "stream", "duo", "meetup", "setup"]);
  });

  it("every photo has a file on disk, a real size and alt text in both languages", () => {
    for (const p of OZZY.photos) {
      expect(existsSync(`public${p.src}`), p.src).toBe(true);
      expect(Number.isInteger(p.w) && p.w > 0 && Number.isInteger(p.h) && p.h > 0).toBe(true);
      expect(p.alt.en.trim().length).toBeGreaterThan(0);
      expect(p.alt.th.trim().length).toBeGreaterThan(0);
    }
  });
});
