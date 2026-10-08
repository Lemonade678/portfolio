import type { Metadata, Viewport } from "next";
import OzzyShell from "./_components/OzzyShell";

// ─────────────────────────────────────────────────────────────
// เว็บ TheOzzy — โต๊ะไพ่ hub ที่ /ozzy (spec: docs/superpowers/specs/2026-10-08-ozzy-hub-design.md)
//
// layout นี้ไม่ถูก remount ตอนสลับหน้าต่าง (route ลูก) → OzzyShell ถือ state ทั้งหมดได้
// (เดิมดึง RSS ตรงนี้เพื่อนับคลิปใน 7 วันไปใส่มุมไพ่ "คลิป" — ตอนนี้มุมไพ่เป็นมุก 2·13 แล้ว
//  RSS เหลือดึงเฉพาะในหน้าต่างคลิปกับหน้าต่างโปรไฟล์)
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

export default function OzzyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <OzzyShell>{children}</OzzyShell>;
}
