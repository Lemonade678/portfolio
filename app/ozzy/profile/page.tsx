import type { Metadata } from "next";
import { fetchFeed } from "@/lib/ozzy/youtube";
import ProfileWindow from "../_components/ProfileWindow";
import Window from "../_components/Window";

export const metadata: Metadata = { title: "Profile" };

// "ช่วงนี้เล่น" ดึงจากชื่อเกมในคลิปล่าสุด ไม่เขียนตายตัว — เขาเปลี่ยนเกมบ่อย
// RSS ล่ม = ไม่โชว์บรรทัดนี้เลย (ดีกว่าโชว์รายชื่อเก่าที่อาจผิด)
export default async function ProfilePage() {
  const feed = await fetchFeed();
  const games = [...new Set(feed.videos.map((v) => v.game).filter((g): g is string => g !== null))];
  return (
    <Window card="profile">
      <ProfileWindow games={games} />
    </Window>
  );
}
