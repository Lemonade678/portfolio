import type { Metadata, Viewport } from "next";
import { fetchFeed, weeklyCount } from "@/lib/ozzy/youtube";
import OzzyShell from "./_components/OzzyShell";

// ─────────────────────────────────────────────────────────────
// เว็บ TheOzzy — โต๊ะไพ่ hub ที่ /ozzy (spec: docs/superpowers/specs/2026-10-08-ozzy-hub-design.md)
//
// layout นี้ไม่ถูก remount ตอนสลับหน้าต่าง (route ลูก) → OzzyShell ถือ state ทั้งหมดได้
// ดึง RSS ตรงนี้แค่เพื่อนับคลิปใน 7 วันไปใส่มุมไพ่ "คลิป" — แคช 1 ชั่วโมง (ISR)
// หน้าต่างคลิปเรียก fetchFeed() ซ้ำได้ Next.js ใช้ cache ก้อนเดียวกัน ไม่ยิงซ้ำ
//
// noindex ทั้งโซน: หน้านี้มีชื่อและรูปถ่ายของคนอื่นเป็นพระเอก + รูปลิขสิทธิ์คนอื่น
// ไม่ควรไปโผล่ปนผลค้นหาชื่อเขาก่อนเว็บจริงเสร็จและเจ้าตัวรับรู้
// ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: { default: "TheOzzy — card table", template: "%s · TheOzzy" },
  description:
    "A fan-built hub for TheOzzy, a Thai streamer who plays card games and roguelikes: clips, a tiny roguelike run, a wheel, his emotes and a points shop.",
  robots: { index: false, follow: false },
};

// สีแถบเบราว์เซอร์บนมือถือ ให้กลืนกับพื้นคราม ไม่ใช่น้ำตาลของพอร์ต
export const viewport: Viewport = { themeColor: "#12112c" };

export default async function OzzyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const feed = await fetchFeed();
  return <OzzyShell weeklyClips={weeklyCount(feed.videos, Date.now())}>{children}</OzzyShell>;
}
