"use client";

import { SIGNATURE, type Lang } from "@/lib/content";
import { t, useReveal } from "@/components/home/ui";

/**
 * ลายเซ็นท้ายจดหมาย — วางต่อจากข้อความปิดท้าย ก่อนช่องทางติดต่อ
 *
 * เผยจากซ้ายไปขวาตอนเลื่อนมาถึง (ดู .signature ใน globals.css) ใช้ useReveal ตัวเดียวกับ
 * การ์ดอื่น ๆ ในหน้า ไม่ต้องมี observer แยก
 * ใส่ width/height จริงของไฟล์ไว้ เบราว์เซอร์จะกันที่ให้ก่อนรูปโหลดเสร็จ หน้าเลยไม่กระโดด
 *
 * ทำไม observer จับที่กล่องครอบ ไม่ใช่ที่ตัวรูป: ตอนเริ่ม รูปโดน clip-path บังจนกว้างเหลือ 0
 * และ Chrome เอา clip-path ของตัวรูปไปคิดตอนเช็กว่า "เห็นหรือยัง" — ถ้าจับที่รูปตรง ๆ
 * มันจะไม่เคยนับว่าเห็น ลายเซ็นเลยไม่เคยโผล่ (เคยพลาดมาแล้วรอบแรก)
 */
export default function Signature({ lang }: { lang: Lang }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="signature mb-8 mt-5 w-[clamp(150px,24vw,220px)]">
      <img
        src={SIGNATURE.src}
        alt={t(SIGNATURE.alt, lang)}
        width={SIGNATURE.width}
        height={SIGNATURE.height}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
    </div>
  );
}
