import HomeShell from "@/components/home/HomeShell";

// หน้าหลักทั้งโซน (/ กับหน้าต่าง /work … /passions) ใช้ shell เดียว — ดู components/home/HomeShell.tsx
// metadata หลักของเว็บอยู่ที่ app/layout.tsx · แต่ละหน้าต่างตั้ง title ของตัวเองในไฟล์ page.tsx
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <HomeShell>{children}</HomeShell>;
}
