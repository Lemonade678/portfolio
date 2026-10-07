// ตัวแยก RSS ของช่อง TheOzzy — ใช้ feed จริงที่ดึงมาเมื่อ 2026-10-07 เป็นข้อมูลทดสอบ
// ถ้า YouTube เปลี่ยนหน้าตา feed วันหนึ่ง เทสต์ชุดนี้ยังผ่าน (fixture เป็นของเก่า) — ตัวจับปัญหาจริง
// คือการเช็กในเบราว์เซอร์ว่าหน้าต่างคลิปยังมีคลิปขึ้น (ดู Task 8)
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { gameOf, parseFeed, weeklyCount } from "@/lib/ozzy/youtube";

const xml = readFileSync(new URL("../fixtures/ozzy-feed-2026-10-07.xml", import.meta.url), "utf-8");

describe("parseFeed", () => {
  it("reads all 15 entries", () => {
    const videos = parseFeed(xml);
    expect(videos).toHaveLength(15);
    expect(videos[0].id).toBe("vaqmUyiwX3U");
    expect(videos[0].published.startsWith("2026-10-07")).toBe(true);
  });

  it("flags shorts by /shorts/ link", () => {
    const shorts = parseFeed(xml).filter((v) => v.isShort).map((v) => v.id);
    expect(shorts).toEqual(["Dk8zplQztQ8", "RW07E6zZW0E", "uTKcOxfFfJo"]);
  });

  it("decodes entities", () => {
    const v = parseFeed(xml).find((x) => x.id === "ShtgRzYSw0Y")!;
    expect(v.title).toContain('"Mythical"');
    expect(v.title).not.toContain("&quot;");
  });

  it("reads views as numbers", () => {
    const v = parseFeed(xml).find((x) => x.id === "vaqmUyiwX3U")!;
    expect(v.views).toBe(7294);
  });
});

describe("gameOf", () => {
  it.each([
    ["เมื่อ Killmonger กลายเป็น Vampire!? - MARVEL SNAP", "Marvel Snap"],
    ["ยุคสมัยของหมูควงค้อน🔥- THE BAZAAR", "The Bazaar"],
    ["ขอนไม้ยักษ์ฟาดหน้า🔥 - The Bazaar", "The Bazaar"],
    ["หนูท่อ x67 - Batomon Showdown", "Batomon Showdown"],
    ["ยานโรเวอร์ vs ฮิปโป? - Size it up", "Size it up"],
    ["Sion 3 stars = Immortal 🔥 - TFT Set 16", "TFT"],
    ["ซูชิโร่ที่รอคอย (กินอย่างเดียว 🍣)", null],
  ])("%s → %s", (title, game) => {
    expect(gameOf(title)).toBe(game);
  });
});

describe("weeklyCount", () => {
  it("counts uploads in the 7 days before now", () => {
    const now = Date.parse("2026-10-07T23:00:00Z");
    expect(weeklyCount(parseFeed(xml), now)).toBe(6);
  });
});
