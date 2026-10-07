import type { Metadata, Viewport } from "next";

// หน้า teaser งานถัดไป — ดู app/next/page.tsx
//
// noindex ด้วยเหตุผลสองข้อ:
//   1. หน้านี้มีชื่อคนอื่น (TheOzzy) เป็นพระเอก ถ้า Google เก็บไป คนที่ค้นชื่อเขาอาจเจอหน้านี้
//      ปนกับช่องจริงของเขา ซึ่งไม่ควรเกิดก่อนเว็บจริงเสร็จและเจ้าตัวรับรู้
//   2. มีรูปตัวละครที่เป็นลิขสิทธิ์คนอื่น — ใส่ในฐานะแฟนได้ แต่ไม่ควรไปดันให้ขึ้นผลค้นหา
// (noindex ไม่ได้ซ่อนหน้าจากคนที่มีลิงก์ — การ์ดบนหน้าหลักยังพามาที่นี่ได้ตามปกติ)
export const metadata: Metadata = {
  title: "⚡ Next run — a website for TheOzzy",
  description:
    "Teaser for my next project: a website for TheOzzy, a Thai streamer who plays card games and roguelikes. Pick a hero, clear four rooms, spin the wheel.",
  robots: { index: false, follow: false },
};

// สีแถบเบราว์เซอร์บนมือถือ ให้กลืนกับพื้นครามของหน้านี้ ไม่ใช่น้ำตาลของหน้าหลัก
export const viewport: Viewport = { themeColor: "#12112c" };

export default function NextLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
