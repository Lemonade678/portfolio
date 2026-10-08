// ไพ่บนโต๊ะ TheOzzy: ภาพแฟนอาร์ตบนไพ่ (ไฟล์มีจริง + มีเครดิตผู้วาด) และเลขมุกบนหกเหลี่ยม
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { OZZY } from "@/lib/ozzy/content";

const card = (id: string) => OZZY.cards.find((c) => c.id === id)!;

describe("deck card art", () => {
  it("profile and wheel use the cropped fan art, shop keeps its emoji", () => {
    expect(card("profile").art).toBe("/ozzy/cards/profile.webp");
    expect(card("wheel").art).toBe("/ozzy/cards/wheel.webp");
    expect(card("shop").art).toBe("🛒");
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

describe("joke numbers on the gems", () => {
  it("profile shows the channel's lucky 213, collection shows 6/7", () => {
    expect(OZZY.table.profilePower).toBe("213");
    expect(OZZY.table.collectionPower).toBe("6/7");
  });
});
