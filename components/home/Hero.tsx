"use client";

// หัวเว็บ: รูป (กดรัน YOLO ได้) · ชื่อ · บทบาท · แนะนำตัว · ปุ่มปลายทาง · ช่องทางติดต่อ · ตัวเลขสี่ตัว
// ย้ายมาจาก app/page.tsx ไม่แก้ markup — ตัวอักษรลับ E กับ M อยู่ในนี้

import PhotoDetect from "@/components/PhotoDetect";
import BrandIcon, { brandOf } from "@/components/BrandIcon";
import { SecretLetter } from "@/components/SecretCode";
import ContactCards from "@/components/home/ContactCards";
import { ACCENT_HEX, MENU, METRICS, PERSON, type Lang } from "@/lib/content";
import { Reveal, t } from "@/components/home/ui";

export default function Hero({ lang }: { lang: Lang }) {
  return (
    <section className="-mt-14">
      {/* มีรูป → ใช้กรอบที่กดรัน YOLO ได้ / ไม่มีรูป → กลับไปเป็นวงกลมอักษรย่อเหมือนเดิม */}
      {PERSON.photo ? (
        <PhotoDetect lang={lang} />
      ) : (
        <div className="relative z-10 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-[3px] border-bg bg-surface2 font-mono text-2xl font-semibold text-yellow shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
          {PERSON.initials}
        </div>
      )}

      <div className="mt-6 flex items-start justify-between gap-4">
        <h1 className="text-[clamp(38px,8vw,74px)] font-bold leading-[1.02] tracking-[-0.03em]">
          {PERSON.name}
        </h1>
        {/* ตัวที่ 2 — E ปลายบรรทัดชื่อ */}
        <SecretLetter index={1} className="mt-2" />
      </div>

      <p className="mt-3 text-[clamp(17px,3.2vw,26px)] font-semibold tracking-[-0.01em]">
        {PERSON.roles.map((r, i) => (
          <span key={r.text}>
            {i > 0 && <span className="px-1.5 font-normal text-muted">|</span>}
            <span style={{ color: ACCENT_HEX[r.accent] }}>{r.text}</span>
          </span>
        ))}
      </p>

      {PERSON.intro.map((p, i) => (
        <p
          key={i}
          className="mt-5 max-w-[62ch] text-[clamp(15px,2.1vw,17px)] text-ink2"
        >
          {t(p, lang)}
        </p>
      ))}

      {/* เมนูปลายทาง — สามปุ่มพอ แบบ 9arm.co
          ปุ่มแรกทึบเพราะเป็นสิ่งที่อยากให้กดที่สุด ที่เหลือเป็นเส้นขอบ
          คำอธิบายใต้ปุ่มจำเป็น เพราะคำว่า "Shop" ลอย ๆ บนพอร์ตวิศวะ
          ไม่มีใครเดาถูกว่าขายอะไร */}
      <nav aria-label="Main destinations" className="mt-8 grid gap-2.5 sm:grid-cols-3">
        {MENU.map((m) => (
          <a
            key={m.href}
            href={m.href}
            target={m.external ? "_blank" : undefined}
            rel={m.external ? "noopener noreferrer" : undefined}
            className="group rounded-xl border px-4 py-3.5 transition-all hover:-translate-y-0.5"
            style={{
              color: m.primary ? "#1A1310" : ACCENT_HEX.yellow,
              background: m.primary ? ACCENT_HEX.yellow : `${ACCENT_HEX.yellow}12`,
              borderColor: m.primary ? ACCENT_HEX.yellow : `${ACCENT_HEX.yellow}47`,
            }}
          >
            <span className="flex items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-[0.12em]">
              {m.external && <BrandIcon brand={brandOf(m.href)} size={14} />}
              {t(m.label, lang)}
              {m.external ? " ↗" : " ↓"}
            </span>
            <span
              className="mt-1 block text-[11.5px] leading-snug"
              style={{ opacity: m.primary ? 0.72 : 0.78 }}
            >
              {t(m.note, lang)}
            </span>
          </a>
        ))}
      </nav>

      <ContactCards lang={lang} className="mt-3" />

      {/* ตัวเลขมี 4 ตัว → 1 / 2 / 4 คอลัมน์ ถ้าใช้ 3 คอลัมน์เหมือนเดิม
          ใบสุดท้ายจะเหลือค้างแถวล่างใบเดียว และบนมือถือยังเป็นคอลัมน์เดียว
          เพราะคำบรรยายยาวเกินกว่าจะบีบสองใบต่อแถวได้ */}
      {/* ตัวที่ 3 — M แถวบาง ๆ เหนือตัวเลข ชิดขวาให้ตรงแนวกับตัวอื่น */}
      <div className="mt-2 flex justify-end">
        <SecretLetter index={2} />
      </div>
      <div className="mt-1 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <Reveal key={m.value + m.accent}>
            <div className="rounded-xl border border-line bg-surface p-[18px]">
              <div
                className="text-[clamp(24px,4.4vw,34px)] font-bold leading-none tracking-[-0.02em]"
                style={{ color: ACCENT_HEX[m.accent] }}
              >
                {m.value}
                {m.suffix && (
                  <span className="text-[0.55em] text-muted">{m.suffix}</span>
                )}
              </div>
              <p className="mt-2 text-xs leading-snug text-muted">
                {t(m.label, lang)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
