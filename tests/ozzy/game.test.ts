// กติกาเกมดันเจี้ยนของหน้า /ozzy — ทุกเทสต์ใส่หน้าลูกเต๋าเอง ไม่มีการสุ่ม
// (reducer ไม่สุ่มเอง UI เป็นคนสุ่มแล้วส่งเลขเข้ามา — เทสต์เลยกำหนดผลได้ทุกครั้ง)
import { describe, expect, it } from "vitest";
import {
  MERCHANT_AFTER,
  drawOffer,
  initialRun,
  pendingBonuses,
  priceOf,
  rankOf,
  resolveRoll,
  runReducer,
  type RollKind,
  type RunState,
} from "@/lib/ozzy/game";
import type { OzHeroId, RelicId } from "@/lib/ozzy/content";

const start = (hero: OzHeroId, points = 1000): RunState =>
  runReducer(runReducer(initialRun, { type: "load", points }), { type: "pick", hero });

const roll = (s: RunState, kind: RollKind, d20: number, reroll = 1, offer?: RelicId[]) =>
  runReducer(s, { type: "roll", result: resolveRoll(s, kind, d20, reroll), offer });

const buy = (s: RunState, id: RelicId, at: "shop" | "merchant" = "shop") => runReducer(s, { type: "buyRelic", id, at });

/** เดินถึงห้องบอส: ผ่านห้อง 0, 1 (เข้าพ่อค้าแล้วออก), 2 ด้วยทางเซฟ */
const toBoss = (s: RunState) => {
  s = roll(s, "safe", 15);
  s = roll(s, "safe", 15, 1, ["heart", "pma", "sek"]);
  s = runReducer(s, { type: "leaveMerchant" });
  return roll(s, "safe", 15);
};

describe("existing rules", () => {
  it("M'Baku adds 2 to every roll", () => {
    const r = resolveRoll(start("mbaku"), "safe", 5, 1);
    expect(r.bonus).toBe(2);
    expect(r.total).toBe(7);
  });

  it("Pepe gets +4 only after a miss", () => {
    const missed = roll(start("pepe"), "high", 1);
    expect(pendingBonuses(missed).pepe).toBe(4);
    const hitAfter = roll(missed, "safe", 10);
    expect(pendingBonuses(hitAfter).pepe).toBe(0);
  });

  it("Dooley rolls a natural 20 on rolls 3 and 6", () => {
    let s = start("dooley");
    s = roll(s, "safe", 10);
    s = roll(s, "safe", 10, 1, ["heart", "pma", "sek"]);
    s = runReducer(s, { type: "leaveMerchant" });
    expect(resolveRoll(s, "high", 1, 1).face).toBe(20);
    s = roll(s, "high", 1); // ครั้งที่ 3 → 20 → ห้อง 2 ผ่าน
    s = roll(s, "safe", 1); // บอส พลาด
    s = roll(s, "safe", 1); // บอส พลาด
    const sixth = resolveRoll(s, "high", 1, 1);
    expect(sixth.natural).toBe(true);
    expect(sixth.face).toBe(20);
    expect(pendingBonuses({ ...s, rolls: 8 }).natural).toBe(true);
  });

  it("the boss stays until hit", () => {
    const s = roll(toBoss(start("pepe")), "safe", 1);
    expect(s.room).toBe(3);
    expect(s.status).toBe("playing");
  });

  it("running out of hearts loses the run", () => {
    let s = start("pepe");
    s = roll(s, "high", 1);
    expect(s.hp).toBe(2);
    s = { ...s, hp: 1 };
    s = roll(s, "high", 1);
    expect(s.status).toBe("lost");
  });

  it("hitting the boss wins the run", () => {
    const s = roll(toBoss(start("pepe")), "high", 20);
    expect(s.status).toBe("won");
  });

  it("ranks by points earned in rooms", () => {
    expect(rankOf(180).label.en.startsWith("S+")).toBe(true);
    expect(rankOf(179).label.en.startsWith("A")).toBe(true);
    expect(rankOf(99).label.en.startsWith("B")).toBe(true);
  });

  it("earning in rooms fills both the wallet and the run total", () => {
    const s = roll(start("pepe", 0), "high", 20);
    expect(s.points).toBe(40);
    expect(s.runPoints).toBe(40);
  });
});

describe("relics", () => {
  it("glasses add 1 (3 with M'Baku)", () => {
    expect(resolveRoll(buy(start("pepe"), "glasses"), "safe", 5, 1).total).toBe(6);
    expect(resolveRoll(buy(start("mbaku"), "glasses"), "safe", 5, 1).total).toBe(8);
  });

  it("a spare heart raises hp and the cap", () => {
    const s = buy(start("pepe"), "heart");
    expect(s.hp).toBe(4);
    expect(s.maxHp).toBe(4);
  });

  it("the scarf turns the next roll into a 20, once", () => {
    let s = buy(start("pepe"), "scarf");
    const r = resolveRoll(s, "high", 1, 1);
    expect(r.face).toBe(20);
    expect(r.scarf).toBe(true);
    s = roll(s, "high", 1);
    expect(s.relics.find((x) => x.id === "scarf")?.used).toBe(true);
    expect(resolveRoll(s, "safe", 3, 1).face).toBe(3);
  });

  it("เสก rerolls the first miss only", () => {
    let s = buy(start("pepe"), "sek");
    const r = resolveRoll(s, "high", 2, 18);
    expect(r.sek).toBe(true);
    expect(r.firstFace).toBe(2);
    expect(r.face).toBe(18);
    expect(r.hit).toBe(true);
    expect(r.points).toBe(40);
    s = roll(s, "high", 2, 18);
    const second = resolveRoll(s, "high", 2, 18);
    expect(second.sek).toBe(false);
    expect(second.firstFace).toBeNull();
    expect(second.hit).toBe(false);
  });

  it("PMA saves the heart on the first miss only", () => {
    let s = buy(start("pepe"), "pma");
    s = roll(s, "high", 1);
    expect(s.hp).toBe(3);
    s = roll(s, "high", 1);
    expect(s.hp).toBe(2);
  });

  it("with เสก and PMA, เสก goes first and PMA catches a second miss", () => {
    let s = buy(buy(start("pepe"), "sek"), "pma");
    const r = resolveRoll(s, "high", 1, 2);
    expect(r.sek).toBe(true);
    expect(r.pma).toBe(true);
    s = roll(s, "high", 1, 2);
    expect(s.hp).toBe(3);
  });

  it("BAN skips a normal room for safe points but not the boss", () => {
    let s = buy(start("pepe", 1000), "ban");
    const before = s.points;
    s = runReducer(s, { type: "useBan" });
    expect(s.room).toBe(1);
    expect(s.status).toBe("playing");
    expect(s.points).toBe(before + 10);
    expect(s.relics.find((x) => x.id === "ban")?.used).toBe(true);

    const atBoss = toBoss(buy(start("pepe", 1000), "ban"));
    expect(runReducer(atBoss, { type: "useBan" })).toEqual(atBoss);
  });
});

describe("merchant", () => {
  it("opens after room index 1 with the offered relics", () => {
    expect(MERCHANT_AFTER).toBe(1);
    let s = roll(start("pepe"), "safe", 15);
    s = roll(s, "safe", 15, 1, ["heart", "pma", "sek"]);
    expect(s.status).toBe("merchant");
    expect(s.merchantOffer).toEqual(["heart", "pma", "sek"]);
    s = runReducer(s, { type: "leaveMerchant" });
    expect(s.status).toBe("playing");
    expect(s.room).toBe(2);
  });

  it("does not open when the run dies on room 1", () => {
    let s = roll(start("pepe"), "safe", 15);
    s = { ...s, hp: 1 };
    s = roll(s, "high", 1, 1, ["heart", "pma", "sek"]);
    expect(s.status).toBe("lost");
  });

  it("discounts offered relics only", () => {
    expect(priceOf("ban", true)).toBe(200);
    expect(priceOf("glasses", true)).toBe(120);
    let s = roll(start("pepe", 1000), "safe", 15);
    s = roll(s, "safe", 15, 1, ["heart", "pma", "sek"]);
    const wallet = s.points;
    s = buy(s, "heart", "merchant");
    expect(s.points).toBe(wallet - 160);
    s = buy(s, "glasses", "merchant");
    expect(s.points).toBe(wallet - 160 - 150);
  });

  it("the points shop charges full price even while the merchant is open", () => {
    // ร้านแต้มโชว์ราคาเต็มเสมอ — ถ้า reducer คิดส่วนลดให้ของที่พ่อค้าเสนอ ราคาที่เห็นกับที่โดนหักจะไม่ตรงกัน
    let s = roll(start("pepe", 1000), "safe", 15);
    s = roll(s, "safe", 15, 1, ["heart", "pma", "sek"]);
    const wallet = s.points;
    s = runReducer(s, { type: "buyRelic", id: "heart", at: "shop" });
    expect(s.points).toBe(wallet - 200);
  });
});

describe("shop guards", () => {
  it("refuses when points are short", () => {
    const s = start("pepe", 100);
    expect(buy(s, "heart")).toEqual(s);
  });

  it("refuses a 4th relic", () => {
    const s = buy(buy(buy(start("pepe"), "glasses"), "heart"), "pma");
    expect(buy(s, "sek")).toEqual(s);
  });

  it("refuses a duplicate", () => {
    const s = buy(start("pepe"), "glasses");
    expect(buy(s, "glasses")).toEqual(s);
  });

  it("refuses outside a run", () => {
    const idle = runReducer(initialRun, { type: "load", points: 1000 });
    expect(buy(idle, "glasses")).toEqual(idle);
    const won = roll(toBoss(start("pepe")), "high", 20);
    expect(buy(won, "glasses")).toEqual(won);
  });

  it("spend never goes below zero, earn adds", () => {
    const s = runReducer(initialRun, { type: "load", points: 50 });
    expect(runReducer(s, { type: "spend", amount: 100 })).toEqual(s);
    expect(runReducer(s, { type: "spend", amount: 50 }).points).toBe(0);
    expect(runReducer(s, { type: "earn", amount: 300 }).points).toBe(350);
  });
});

describe("drawOffer", () => {
  const seq = (vals: number[]) => {
    let i = 0;
    return () => vals[i++ % vals.length];
  };

  it("draws 3 distinct relics the player doesn't own", () => {
    const offer = drawOffer(["glasses"], seq([0.1, 0.5, 0.9, 0.3, 0.7]));
    expect(offer).toHaveLength(3);
    expect(new Set(offer).size).toBe(3);
    expect(offer).not.toContain("glasses");
  });

  it("returns what is left when fewer than 3 remain", () => {
    const offer = drawOffer(["glasses", "heart", "ban", "pma"], seq([0.4]));
    expect([...offer].sort()).toEqual(["scarf", "sek"]);
  });
});
