import type { Metadata } from "next";

// หน้านี้เป็นไข่อีสเตอร์ — ไม่อยากให้ Google เก็บไปขึ้นผลค้นหา
// ไม่งั้นคนค้นชื่อเจ้าตัวแล้วเจอ "Floralgender" ก่อนเจอพอร์ต ซึ่งผิดลำดับความสำคัญมาก
// (noindex ไม่ได้ซ่อนหน้าจากคนที่รู้ URL — มันแค่ขอให้เครื่องมือค้นหาไม่เก็บ)
export const metadata: Metadata = {
  title: "🍋 playground",
  robots: { index: false, follow: false },
};

export default function PlaygroundLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
