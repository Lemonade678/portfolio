"use client";

// แถบรีลิคที่ถืออยู่ในรันนี้ (สูงสุด 3 ช่อง) + ปุ่มใช้ค้อน BAN
// รีลิคใช้ครั้งเดียวที่ใช้ไปแล้ว ยังโชว์ในช่องแต่เป็นสีเทา — คนเล่นจะได้รู้ว่าเคยมีและหมดไปแล้ว
// ปุ่ม BAN โผล่เฉพาะตอนถือค้อนที่ยังไม่ใช้ และไม่ใช่ห้องบอส (กติกาใน reducer กันซ้ำอีกชั้น)

import { OZZY, type RelicId } from "@/lib/ozzy/content";
import { BOSS_ROOM, MAX_RELICS } from "@/lib/ozzy/game";
import { useOzzy } from "./OzzyShell";
import { t } from "./ui";

export default function RelicBar({ onBan, disabled }: { onBan: () => void; disabled: boolean }) {
  const { lang, run } = useOzzy();
  const banReady = run.status === "playing" && run.room !== BOSS_ROOM && run.relics.some((r) => r.id === "ban" && !r.used);
  const nameOf = (id: RelicId) => t(OZZY.relics.find((r) => r.id === id)!.name, lang);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-(--oz-sky)/80">{t(OZZY.run.relicsTitle, lang)}</span>
      {Array.from({ length: MAX_RELICS }, (_, i) => {
        const slot = run.relics[i];
        const item = slot && OZZY.relics.find((r) => r.id === slot.id)!;
        return (
          <span
            key={i}
            title={slot ? nameOf(slot.id) : undefined}
            aria-label={slot ? `${nameOf(slot.id)}${slot.used ? " ✓" : ""}` : undefined}
            className={`grid h-8 w-8 place-items-center rounded-lg text-[16px] ${
              slot ? "border-2 border-(--oz-ink)" : "border-2 border-dashed border-(--oz-sky)/30"
            } ${slot?.used ? "opacity-35 grayscale" : ""}`}
            style={item ? { background: item.color } : undefined}
          >
            {item?.emoji}
          </span>
        );
      })}
      {banReady && (
        <button
          type="button"
          onClick={onBan}
          disabled={disabled}
          className="ml-1 rounded-lg border-2 border-(--oz-ink) bg-[#ffaa77] px-2.5 py-1 font-mono text-[11px] font-bold text-(--oz-ink) shadow-[3px_3px_0_var(--oz-ink)] disabled:opacity-50"
        >
          🔨 {t(OZZY.run.useBan, lang)}
        </button>
      )}
    </div>
  );
}
