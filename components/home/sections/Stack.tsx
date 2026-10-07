"use client";

// 03 เครื่องมือที่ใช้จริง (ย้ายมาจาก app/page.tsx ไม่แก้ markup)

import { ACCENT_HEX, STACK, type Lang } from "@/lib/content";
import { CHIP, Reveal, t } from "@/components/home/ui";

export default function Stack({ lang }: { lang: Lang }) {
  return (
    <>

      {/* กลุ่ม core กินเต็มความกว้างและใช้ชิปสีเหลืองตัวใหญ่กว่า
          เพื่อให้คนกวาดตาผ่านแล้วเห็นหกอย่างนี้ก่อนอย่างอื่น */}
      <Reveal>
        {/* ใช้ hex + alpha ผ่าน inline style แบบเดียวกับแท็บหมวดโปรเจกต์ข้างบน
            แทนที่จะใช้ opacity modifier ของ Tailwind — เว็บนี้ทำแบบนี้อยู่แล้วทั้งไฟล์ */}
        <div
          className="mb-4 rounded-2xl border p-6"
          style={{
            borderColor: `${ACCENT_HEX.yellow}40`,
            background: `${ACCENT_HEX.yellow}0F`,
          }}
        >
          <h3 className="text-[15px] font-semibold text-yellow">
            {t(STACK.core.title, lang)}
          </h3>
          <p className="mb-4 mt-0.5 text-[12.5px] text-ink2">
            {t(STACK.core.note, lang)}
          </p>
          <div className="flex flex-wrap gap-2">
            {STACK.core.items.map((s) => (
              <span
                key={s}
                className="rounded-lg border px-3 py-1.5 font-mono text-[12px] font-medium"
                style={{
                  color: ACCENT_HEX.yellow,
                  borderColor: `${ACCENT_HEX.yellow}57`,
                  background: `${ACCENT_HEX.yellow}1F`,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2">
        {[STACK.shipped, STACK.learning].map((col) => (
          <div
            key={col.title.en}
            className="rounded-2xl border border-line bg-surface p-6"
          >
            <h3 className="text-[15px] font-semibold">{t(col.title, lang)}</h3>
            <p className="mb-4 mt-0.5 text-[12.5px] text-muted">
              {t(col.note, lang)}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {col.items.map((s) => (
                <span key={s} className={CHIP}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
