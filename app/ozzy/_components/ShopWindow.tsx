"use client";

// ─────────────────────────────────────────────────────────────
// ร้านแต้ม — หน้าตาเลียนหน้า Channel Points ของช่อง (ช่องสี + ราคาในเม็ดยา)
//
// สองชั้น:
//   รีลิค — ใช้ได้เฉพาะรันที่ซื้อ ซื้อได้เฉพาะตอนมีรันกำลังเล่น (เล่นอยู่หรือเจอพ่อค้าอยู่)
//          ไม่มีรัน = บอกให้ไปเริ่มรันก่อน พร้อมลิงก์ไปหน้าต่างดันเจี้ยน
//          ราคาที่นี่เป็นราคาเต็มเสมอ (ส่วนลด 20% เป็นของพ่อค้ากลางทางเท่านั้น — reducer คิดเอง)
//   ของสนุก — ซื้อได้ทุกเวลา: ทาแป้งตัวเอง · เปิดเพลง · VIP TICKET (ราคาเดียวกับในช่องจริง — มุก)
//
// ทุกการซื้อผ่าน reducer (เช็กแต้มในจังหวะเดียวกับหักแต้ม) — ปุ่มปิดเองตอนซื้อไม่ได้
// และบอกเหตุผลเป็นคำ (แต้มไม่พอ / ช่องเต็ม / มีแล้ว)
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { OZZY, type FunId } from "@/lib/ozzy/content";
import { MAX_RELICS, priceOf } from "@/lib/ozzy/game";
import { useOzzy } from "./OzzyShell";
import ShopTile, { type TileState } from "./ShopTile";
import { t } from "./ui";

export default function ShopWindow() {
  const { lang, run, dispatch, powder, setMusic, save, updateSave, href } = useOzzy();
  const S = OZZY.shop;
  const inRun = run.status === "playing" || run.status === "merchant";

  const buyFun = (id: FunId, price: number) => {
    if (run.points < price) return;
    dispatch({ type: "spend", amount: price });
    if (id === "powder") powder();
    if (id === "music") setMusic(true);
    if (id === "vip") updateSave((s) => ({ ...s, vip: true }));
  };

  return (
    <div className="space-y-7">
      <section aria-labelledby="relics-title">
        <h3 id="relics-title" className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-(--oz-yellow)">
          {t(S.relicsTitle, lang)}
        </h3>
        {inRun ? (
          <p className="mt-1.5 text-[12.5px] text-(--oz-sky)">
            {t(S.held, lang)} {run.relics.length}/{MAX_RELICS} · {t(S.max, lang)}
          </p>
        ) : (
          <p className="mt-1.5 text-[13px] text-(--oz-sky)">
            {t(S.startRun, lang)}{" "}
            <Link href={href("/ozzy/run")} className="font-semibold text-(--oz-yellow) underline underline-offset-2">
              {t(S.goRun, lang)}
            </Link>
          </p>
        )}
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {OZZY.relics.map((r) => {
            const price = priceOf(r.id, false);
            const owned = run.relics.some((x) => x.id === r.id);
            const state: TileState = !inRun
              ? "locked"
              : owned
                ? "owned"
                : run.relics.length >= MAX_RELICS
                  ? "full"
                  : run.points < price
                    ? "short"
                    : "buy";
            return (
              <ShopTile key={r.id} item={r} price={price} state={state} lang={lang} onBuy={() => dispatch({ type: "buyRelic", id: r.id })} />
            );
          })}
        </div>
      </section>

      <section aria-labelledby="fun-title">
        <h3 id="fun-title" className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-(--oz-yellow)">
          {t(S.funTitle, lang)}
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {OZZY.fun.map((f) => {
            const owned = f.id === "vip" && save.vip;
            const state: TileState = owned ? "owned" : run.points < f.price ? "short" : "buy";
            return <ShopTile key={f.id} item={f} price={f.price} state={state} lang={lang} onBuy={() => buyFun(f.id, f.price)} />;
          })}
        </div>
      </section>

      <p className="text-center text-[11.5px] text-(--oz-sky)/70">{t(OZZY.points.notReal, lang)}</p>
    </div>
  );
}
