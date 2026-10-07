"use client";

// ขนมประจำแต่ละชั้น — ตัวชั่วคราว (วงกลมสี) จนกว่าจะวาดขนมจริงใน Task 4
import type { SnackId } from "@/lib/content";

const FILL: Record<SnackId, string> = {
  tteok: "#f5b92e",
  bread: "#d9a066",
  pancakes: "#e2b07a",
  dango: "#ff9fb5",
  roll: "#b98a5e",
  lemonade: "#f8e27a",
};

export default function Snack({ id, className = "" }: { id: SnackId; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="24" fill={FILL[id]} stroke="#1a1310" strokeWidth="3" />
    </svg>
  );
}
