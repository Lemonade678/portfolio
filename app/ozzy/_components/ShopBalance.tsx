"use client";

// ยอดแต้มบนแถบชื่อของร้าน — เห็นตลอดแม้เลื่อนดูของลงไปข้างล่าง

import { OZZY } from "@/lib/ozzy/content";
import { useOzzy } from "./OzzyShell";
import { Clover, num, t } from "./ui";

export default function ShopBalance() {
  const { lang, run } = useOzzy();
  return (
    <span
      className="flex flex-none items-center gap-1 rounded-full border-2 border-(--oz-ink) bg-(--oz-night) px-2.5 py-1 text-[13px] font-extrabold text-[#7ee08a]"
      aria-label={`${run.points} ${t(OZZY.points.name, lang)}`}
    >
      <Clover className="h-3.5 w-3.5" />
      {num(run.points, lang)}
    </span>
  );
}
