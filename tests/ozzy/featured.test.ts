// คลิปเด่นของหน้าต่างคลิป + บรรทัด "เว็บที่แฟนทำ" ที่กดกลับไปหน้าพอร์ตได้
import { describe, expect, it } from "vitest";
import { OZZY } from "@/lib/ozzy/content";

describe("OZZY.featured", () => {
  it("keeps the MV and adds the I'm-not-a-robot Short as a vertical clip", () => {
    expect(OZZY.featured.map((f) => f.videoId)).toEqual(["4ZI_mGuXtaE", "byii5bL3ogc"]);
    expect(OZZY.featured.find((f) => f.videoId === "byii5bL3ogc")?.short).toBe(true);
    expect(OZZY.featured.find((f) => f.videoId === "4ZI_mGuXtaE")?.short).toBeFalsy();
  });

  it("every featured id looks like a YouTube id", () => {
    for (const f of OZZY.featured) expect(f.videoId).toMatch(/^[\w-]{11}$/);
  });
});

describe("fan note", () => {
  it("splits into a link back to the portfolio and the rest, in both languages", () => {
    const n = OZZY.table.fanNote;
    for (const part of [n.link, n.rest]) {
      expect(part.en.trim().length).toBeGreaterThan(0);
      expect(part.th.trim().length).toBeGreaterThan(0);
    }
    expect(n.link.en).toBe("A fan-built site by Lemon");
  });
});
