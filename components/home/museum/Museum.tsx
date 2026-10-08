"use client";

// ─────────────────────────────────────────────────────────────
// พิพิธภัณฑ์ YOLO ขนาดเล็ก — ต่อท้ายหน้าต่าง 03 เครื่องมือ (/stack)
//
// ทำไมอยู่ในหน้าต่างเครื่องมือ: เจ้าของเว็บเลือกเอง — YOLO คือเครื่องมือที่ใช้ส่งงานจริงมากที่สุด
// ห้าชิ้น เรียงจากแนวคิดพื้นฐาน → ของจริง → ประวัติ:
//   01 ตาราง S×S (YOLOv1) · 02 IoU · 03 letterbox · 04 สด: ความมั่นใจ + NMS · 05 ไทม์ไลน์
// ทุกชิ้นขยับด้วยแถบเลื่อน ไม่มีอะไรเคลื่อนไหวเอง (คนที่ตั้ง "ลดการเคลื่อนไหว" ไว้ก็ใช้ได้เต็มที่)
// ข้อความทั้งหมดอยู่ใน YOLO_MUSEUM ใน lib/content.ts
// ─────────────────────────────────────────────────────────────

import GridExhibit from "@/components/home/museum/GridExhibit";
import IouExhibit from "@/components/home/museum/IouExhibit";
import LetterboxExhibit from "@/components/home/museum/LetterboxExhibit";
import LiveExhibit from "@/components/home/museum/LiveExhibit";
import Timeline from "@/components/home/museum/Timeline";
import { t } from "@/components/home/ui";
import { YOLO_MUSEUM, type Lang } from "@/lib/content";

export default function Museum({ lang }: { lang: Lang }) {
  return (
    <section aria-labelledby="yolo-museum" className="mt-12">
      <h3 id="yolo-museum" className="text-[clamp(18px,2.6vw,22px)] font-bold tracking-[-0.02em]">
        🏛️ {t(YOLO_MUSEUM.title, lang)}
      </h3>
      <p className="mb-5 mt-1 max-w-[62ch] text-[13.5px] text-ink2">{t(YOLO_MUSEUM.intro, lang)}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <GridExhibit lang={lang} />
        <IouExhibit lang={lang} />
        <LetterboxExhibit lang={lang} />
        <LiveExhibit lang={lang} />
        <Timeline lang={lang} />
      </div>
    </section>
  );
}
