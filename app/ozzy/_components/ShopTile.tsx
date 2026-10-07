"use client";

// ช่องของในร้าน — ใช้ทั้งร้านแต้ม (หน้าต่าง shop) และพ่อค้ากลางทางในดันเจี้ยน
// หน้าตาเลียนหน้า Channel Points ของช่อง: บล็อกสีด้านบน + ราคาในเม็ดยาสีเข้ม + ชื่อ/ผลด้านล่าง
//
// ปุ่มซื้อปิดเองเมื่อซื้อไม่ได้ และบอกเหตุผลเป็นคำ (แต้มไม่พอ / ช่องเต็ม / มีแล้ว)
// แทนที่จะปล่อยให้กดแล้วไม่เกิดอะไรขึ้น — reducer ก็กันซ้ำอีกชั้นอยู่แล้ว

import type { Lang } from "@/lib/content";
import { OZZY, type OzItem } from "@/lib/ozzy/content";
import { Clover, num, t } from "./ui";

export type TileState = "buy" | "owned" | "short" | "full" | "locked";

export default function ShopTile({
  item,
  price,
  base,
  state,
  lang,
  onBuy,
}: {
  item: OzItem<string>;
  price: number;
  /** ราคาเต็ม — ถ้าไม่เท่า price จะขีดฆ่าโชว์ว่าลดราคา */
  base?: number;
  state: TileState;
  lang: Lang;
  onBuy: () => void;
}) {
  const S = OZZY.shop;
  const label =
    state === "owned"
      ? S.owned
      : state === "short"
        ? S.short
        : state === "full"
          ? S.full
          : state === "locked"
            ? S.runOnly
            : S.buy;

  return (
    <div className={`oz-tile ${state === "owned" ? "opacity-70" : ""}`}>
      <div className="relative grid h-[74px] place-items-center text-[28px]" style={{ background: item.color }}>
        <span aria-hidden="true">{item.emoji}</span>
        <span className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#2a2a35] px-2.5 py-0.5 text-[12px] font-extrabold text-white">
          <Clover className="h-3 w-3" />
          {num(price, lang)}
          {base !== undefined && base !== price && <s className="ml-1 text-[10px] font-semibold opacity-60">{num(base, lang)}</s>}
        </span>
        {state === "owned" && (
          <span className="absolute right-1.5 top-1.5 rounded-full bg-(--oz-ink) px-1.5 py-0.5 font-mono text-[9px] font-bold text-(--oz-yellow)">
            {t(S.owned, lang)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-2">
        <p className="text-[13px] font-bold leading-tight [text-shadow:2px_2px_0_var(--oz-ink)]">{t(item.name, lang)}</p>
        <p className="mt-0.5 flex-1 text-[11px] leading-snug text-(--oz-sky)">{t(item.effect, lang)}</p>
        <button
          type="button"
          onClick={onBuy}
          disabled={state !== "buy"}
          className={`mt-2 rounded-lg border-2 border-(--oz-ink) px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] transition-colors ${
            state === "buy" ? "bg-(--oz-yellow) text-(--oz-ink) hover:brightness-110" : "cursor-not-allowed bg-(--oz-night) text-(--oz-sky)/60"
          }`}
        >
          {t(label, lang)}
        </button>
      </div>
    </div>
  );
}
