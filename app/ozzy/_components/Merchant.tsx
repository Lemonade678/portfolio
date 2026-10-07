"use client";

// พ่อค้ากลางทาง 🛒 — โผล่หลังห้องที่ 2 (สถานะ "merchant")
// ของที่ขาย (merchantOffer) สุ่มมาแล้วตั้งแต่ตอนทอยห้องที่ 2 — ที่นี่แค่วาดและสั่งซื้อ
// ราคาลด 20% คิดใน reducer (priceOf) ที่นี่โชว์ราคาเดียวกันด้วยฟังก์ชันเดียวกัน ไม่คำนวณแยก

import { OZZY } from "@/lib/ozzy/content";
import { MAX_RELICS, priceOf } from "@/lib/ozzy/game";
import { useOzzy } from "./OzzyShell";
import ShopTile, { type TileState } from "./ShopTile";
import { t } from "./ui";

export default function Merchant() {
  const { lang, run, dispatch } = useOzzy();
  const M = OZZY.merchant;

  return (
    <div className="oz-pop">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-(--oz-yellow)">🛒 {t(M.title, lang)}</p>
      <p className="mt-1 text-[13.5px] text-(--oz-sky)">{t(M.note, lang)}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {run.merchantOffer.map((id) => {
          const item = OZZY.relics.find((r) => r.id === id)!;
          const price = priceOf(id, true);
          const owned = run.relics.some((r) => r.id === id);
          const state: TileState = owned
            ? "owned"
            : run.relics.length >= MAX_RELICS
              ? "full"
              : run.points < price
                ? "short"
                : "buy";
          return (
            <ShopTile
              key={id}
              item={item}
              price={price}
              base={item.price}
              state={state}
              lang={lang}
              onBuy={() => dispatch({ type: "buyRelic", id })}
            />
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => dispatch({ type: "leaveMerchant" })}
        className="oz-button mt-5 rounded-xl px-5 py-2.5 font-mono text-[13px] font-bold uppercase tracking-[0.12em]"
      >
        {t(M.leave, lang)} →
      </button>
    </div>
  );
}
