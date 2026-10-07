import type { Metadata } from "next";
import { fetchFeed } from "@/lib/ozzy/youtube";
import ClipsWindow from "../_components/ClipsWindow";
import Window from "../_components/Window";

export const metadata: Metadata = { title: "Clips" };

// ดึง RSS ฝั่งเซิร์ฟเวอร์ (แคช 1 ชม. ก้อนเดียวกับที่ layout ใช้นับคลิปบนไพ่) แล้วส่งข้อมูลดิบให้หน้าต่าง
// fetchFeed ไม่ throw — ล่มเมื่อไหร่ได้ { ok: false } หน้าต่างโชว์คลิปเด่นแทน
export default async function ClipsPage() {
  const feed = await fetchFeed();
  return (
    <Window card="clips">
      <ClipsWindow feed={feed} />
    </Window>
  );
}
