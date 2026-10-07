// หน้าหลักแบบ hub — ทะเบียนหน้าต่าง + ตัวช่วยเส้นทาง (ไม่มี DOM ไม่มีเบราว์เซอร์)
import { describe, expect, it } from "vitest";
import { HOME_WINDOWS, counts, neighbours, windowFromHash, withLang } from "@/lib/home";
import { CREDENTIALS, HOME, PROJECTS, SOFT_SKILLS, STACK, TIMELINE } from "@/lib/content";

describe("window registry", () => {
  it("lists the six windows in counter order", () => {
    expect(HOME_WINDOWS).toEqual(["work", "proof", "stack", "soft", "path", "passions"]);
  });

  it("maps old anchors to windows", () => {
    expect(windowFromHash("#work")).toBe("work");
    expect(windowFromHash("work")).toBe("work");
    expect(windowFromHash("#path")).toBe("path");
  });

  it("ignores anchors that are not windows", () => {
    // #contact ยังเป็นส่วนหนึ่งของหน้า hub (ข้อความปิดท้าย) ไม่ใช่หน้าต่าง
    expect(windowFromHash("#contact")).toBeNull();
    expect(windowFromHash("#nope")).toBeNull();
    expect(windowFromHash("")).toBeNull();
    expect(windowFromHash("#Passions")).toBeNull();
  });

  it("knows each window's neighbours, with none past the ends", () => {
    expect(neighbours("work")).toEqual({ prev: null, next: "proof" });
    expect(neighbours("stack")).toEqual({ prev: "proof", next: "soft" });
    expect(neighbours("passions")).toEqual({ prev: "path", next: null });
  });

  it("counts come from the content, not typed by hand", () => {
    const tools = STACK.core.items.length + STACK.shipped.items.length + STACK.learning.items.length;
    expect(counts()).toEqual({
      work: PROJECTS.length,
      proof: CREDENTIALS.length,
      stack: tools,
      soft: SOFT_SKILLS.length,
      path: TIMELINE.length,
      passions: 3,
    });
    expect(tools).toBe(26);
  });
});

describe("withLang", () => {
  it("adds ?lang=th only for Thai", () => {
    expect(withLang("/work", "th")).toBe("/work?lang=th");
    expect(withLang("/work", "en")).toBe("/work");
    expect(withLang("/", "th")).toBe("/?lang=th");
  });
});

describe("HOME copy", () => {
  it("every window has both languages for title, nav, note and unit", () => {
    for (const id of HOME_WINDOWS) {
      const w = HOME.windows[id];
      for (const s of [w.title, w.nav, w.note, w.unit]) {
        expect(s.en.length).toBeGreaterThan(0);
        expect(s.th.length).toBeGreaterThan(0);
      }
    }
  });

  it("rows 01–05 carry the secret letters O N A D E in order; passions has none", () => {
    expect(HOME_WINDOWS.map((id) => HOME.windows[id].secret)).toEqual([3, 4, 5, 6, 7, undefined]);
  });

  it("passions has three cards", () => {
    expect(HOME.passions.cards).toHaveLength(3);
  });
});
