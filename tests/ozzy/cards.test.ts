// ไพ่บนโต๊ะ TheOzzy: ภาพแฟนอาร์ตบนไพ่ (ไฟล์มีจริง + มีเครดิตผู้วาด) และเลขมุกบนหกเหลี่ยม
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { OZZY } from "@/lib/ozzy/content";
import { deckGems } from "@/lib/ozzy/deck";

const card = (id: string) => OZZY.cards.find((c) => c.id === id)!;

describe("deck card art", () => {
  it("profile and wheel use the cropped fan art, shop uses the storefront icon", () => {
    expect(card("profile").art).toBe("/ozzy/cards/profile.webp");
    expect(card("wheel").art).toBe("/ozzy/cards/wheel.webp");
    expect(card("shop").art).toBe("/ozzy/cards/shop.svg");
  });

  it("every image on a card exists on disk", () => {
    for (const c of OZZY.cards) if (c.art.startsWith("/")) expect(existsSync(`public${c.art}`), c.art).toBe(true);
  });

  it("every fan-art card has a credit line in both languages", () => {
    for (const id of ["profile", "wheel"]) {
      const credit = OZZY.table.artCredits.find((a) => a.card === id);
      expect(credit, id).toBeDefined();
      expect(credit!.by.en.length).toBeGreaterThan(0);
      expect(credit!.by.th.length).toBeGreaterThan(0);
    }
    expect(OZZY.table.artCredits.find((a) => a.card === "profile")!.by.en).toBe("Fan art by Thanpisit");
    expect(OZZY.table.artCredits.find((a) => a.card === "wheel")!.by.en).toBe("Art by zlxwartwork (IG)");
  });
});

describe("deck gems (cost · power) read as memes", () => {
  it("each card's two corners, left to right", () => {
    // โปรไฟล์ 1·2 (ตรงกับแฟนอาร์ต TheOzzy 1/2) · คลิป 2·13 = 213 เลขมงคลประจำช่อง
    // ดันเจี้ยน 3·4 กับวงล้อ 4·8 ยังเป็นตัวเลขจริง · คอลเลกชัน 6·7 · ร้าน 6·9
    expect(deckGems()).toEqual({
      profile: { cost: 1, power: 2 },
      clips: { cost: 2, power: 13 },
      run: { cost: 3, power: 4 },
      wheel: { cost: 4, power: 8 },
      collection: { cost: 6, power: 7 },
      shop: { cost: 6, power: 9 },
    });
  });

  it("dungeon and wheel still count the real rooms and slices", () => {
    expect(deckGems().run.power).toBe(OZZY.floors.length);
    expect(deckGems().wheel.power).toBe(OZZY.wheel.slices.length);
  });
});

describe("SVG card art", () => {
  it("has no '--' inside XML comments (that makes the whole SVG fail to load)", async () => {
    const { readFileSync } = await import("node:fs");
    for (const c of OZZY.cards.filter((c) => c.art.endsWith(".svg"))) {
      const svg = readFileSync(`public${c.art}`, "utf8");
      for (const m of svg.matchAll(/<!--([\s\S]*?)-->/g)) expect(m[1], c.art).not.toContain("--");
    }
  });
});
