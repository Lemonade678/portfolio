// เนื้อหาใหม่ของหน้าหลัก: กำแพงรูปใน People (04) + พิพิธภัณฑ์ YOLO ใน /stack — ครบสองภาษา ข้อมูลสมเหตุสมผล
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { NOW, PEOPLE, YOLO_MUSEUM } from "@/lib/content";

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

// ── พิพิธภัณฑ์ YOLO ในหน้าต่าง /stack ─────────────────────────
/** เดินทุกชั้นของ object หา L10n ({ en, th }) ทุกตัว — กันลืมแปลข้อความใดข้อความหนึ่ง */
function l10ns(v: unknown, path = "YOLO_MUSEUM"): [string, { en: unknown; th: unknown }][] {
  if (!v || typeof v !== "object") return [];
  if ("en" in v && "th" in v) return [[path, v as { en: unknown; th: unknown }]];
  return Object.entries(v).flatMap(([k, x]) => l10ns(x, `${path}.${k}`));
}

describe("YOLO_MUSEUM", () => {
  it("every piece of text exists in both languages", () => {
    const all = l10ns(YOLO_MUSEUM);
    expect(all.length).toBeGreaterThan(20);
    for (const [path, s] of all) {
      expect(typeof s.en === "string" && s.en.trim().length > 0, `${path}.en`).toBe(true);
      expect(typeof s.th === "string" && s.th.trim().length > 0, `${path}.th`).toBe(true);
    }
  });

  it("the timeline never goes back in time and starts with YOLOv1 in 2015", () => {
    const years = YOLO_MUSEUM.timeline.map((e) => e.year);
    expect(years.every((y, i) => i === 0 || y >= years[i - 1])).toBe(true);
    expect(YOLO_MUSEUM.timeline[0]).toMatchObject({ year: 2015, name: "YOLOv1" });
  });

  it("marks exactly one entry as the model running on this site — YOLO11", () => {
    const here = YOLO_MUSEUM.timeline.filter((e) => e.here);
    expect(here.map((e) => e.name)).toEqual(["YOLO11"]);
  });
});

describe("NOW (survey invite for the new project)", () => {
  it("has every line in both languages and links to the Google Form", () => {
    for (const s of [NOW.eyebrow, NOW.title, NOW.body, NOW.cta, NOW.note]) expect(both(s)).toBe(true);
    expect(NOW.href).toBe("https://forms.gle/GAQ4ktK4FnbCnivc9");
  });
});

describe("PEOPLE favourite streamer", () => {
  it("calls TheOzzy my favourite streamer and carries his Short", () => {
    expect(PEOPLE.next.en).toBe("My favourite streamer");
    expect(both(PEOPLE.next)).toBe(true);
    expect(PEOPLE.fav.videoId).toBe("byii5bL3ogc");
    expect(both(PEOPLE.fav.play)).toBe(true);
  });
});
