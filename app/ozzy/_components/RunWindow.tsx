"use client";

// หน้าต่างดันเจี้ยน = เลือกฮีโร่ + ตัวเกม
// key={run.runId}: เริ่มรันใหม่เมื่อไหร่ ส่วนเกม remount ล้างลูกเต๋า/ผลค้าง/emote ของรันเก่าให้เอง

import Heroes from "./Heroes";
import { useOzzy } from "./OzzyShell";
import RunGame from "./RunGame";

export default function RunWindow() {
  const { run } = useOzzy();
  return (
    <>
      <Heroes />
      <RunGame key={run.runId} />
    </>
  );
}
