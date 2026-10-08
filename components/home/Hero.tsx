"use client";

// หัวเว็บ: รูป (กดรัน YOLO ได้) · ชื่อ · บทบาท · แนะนำตัว · ปุ่มปลายทาง · ช่องทางติดต่อ · ตัวเลขสี่ตัว
// ย้ายมาจาก app/page.tsx ไม่แก้ markup — ตัวอักษรลับ E กับ M อยู่ในนี้

import { useRouter } from "next/navigation";
import PhotoDetect from "@/components/PhotoDetect";
import BrandIcon, { brandOf } from "@/components/BrandIcon";
import SecretText from "@/components/SecretText";
import ContactCards from "@/components/home/ContactCards";
import { ACCENT_HEX, MENU, METRICS, PERSON, SHOP_LOGO, type Lang } from "@/lib/content";
import { windowFromHash, type WindowId } from "@/lib/home";
import { Reveal, t } from "@/components/home/ui";

export default function Hero({
  lang,
  windowHref,
}: {
  lang: Lang;
  /** ปุ่มที่ชี้ไป #หัวข้อ (เช่น "ผลงาน" → #work) เปิดเป็นหน้าต่างแทนการเลื่อนลง — ไม่ส่งมา = ใช้ลิงก์ # เดิม */
  windowHref?: (id: WindowId) => string;
}) {
  const router = useRouter();
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

      <h1 className="mt-6 text-[clamp(38px,8vw,74px)] font-bold leading-[1.02] tracking-[-0.03em]">
        {PERSON.name}
      </h1>

      <p className="mt-3 text-[clamp(17px,3.2vw,26px)] font-semibold tracking-[-0.01em]">
        {PERSON.roles.map((r, i) => (
          <span key={r.text}>
            {i > 0 && <span className="px-1.5 font-normal text-muted">|</span>}
            {/* L กับ e ของ LEMONADE ซ่อนอยู่ใน "LLM Fine-tuning" (บทบาทที่สอง) — ดู lib/secret.ts */}
            <span style={{ color: ACCENT_HEX[r.accent] }}>
              {i === 1 ? <SecretText text={r.text} place="roles" /> : r.text}
            </span>
          </span>
        ))}
      </p>

      {PERSON.intro.map((p, i) => (
        <p
          key={i}
          className="mt-5 max-w-[62ch] text-[clamp(15px,2.1vw,17px)] text-ink2"
        >
          {/* M ซ่อนอยู่ใน "LLM" ของย่อหน้าแรก */}
          {i === 0 ? <SecretText text={t(p, lang)} place="intro" /> : t(p, lang)}
        </p>
      ))}

      {/* เมนูปลายทาง — สามปุ่มพอ แบบ 9arm.co
          ปุ่มแรกทึบเพราะเป็นสิ่งที่อยากให้กดที่สุด ที่เหลือเป็นเส้นขอบ
          คำอธิบายใต้ปุ่มจำเป็น เพราะคำว่า "Shop" ลอย ๆ บนพอร์ตวิศวะ
          ไม่มีใครเดาถูกว่าขายอะไร */}
      <nav aria-label="Main destinations" className="mt-8 grid gap-2.5 sm:grid-cols-3">
        {MENU.map((m) => {
          const win = windowHref && windowFromHash(m.href);
          return (
          <a
            key={m.href}
            href={win ? windowHref(win) : m.href}
            onClick={win ? (e) => {
              // ลิงก์ภายใน: ให้ router เปลี่ยนหน้าต่างแบบไม่โหลดหน้าใหม่ (state ของ shell ไม่หาย)
              // กดพร้อม Ctrl/⌘/Shift หรือคลิกกลาง = อยากเปิดแท็บใหม่ ปล่อยให้เบราว์เซอร์ทำตามปกติ
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
              e.preventDefault();
              router.push(windowHref(win));
            } : undefined}
            target={m.external ? "_blank" : undefined}
            rel={m.external ? "noopener noreferrer" : undefined}
            className={`group rounded-xl border px-4 py-3.5 transition-all hover:-translate-y-0.5 ${m.logo ? "flex items-center gap-3" : ""}`}
            style={{
              color: m.primary ? "#1A1310" : ACCENT_HEX.yellow,
              background: m.primary ? ACCENT_HEX.yellow : `${ACCENT_HEX.yellow}12`,
              borderColor: m.primary ? ACCENT_HEX.yellow : `${ACCENT_HEX.yellow}47`,
            }}
          >
            {/* ปุ่มร้าน: โลโก้ร้านซ้าย ข้อความขวา — คนเห็นแล้วจำร้านได้ทันทีโดยไม่ต้องอ่าน */}
            {m.logo && (
              <img
                src={SHOP_LOGO.src}
                alt={t(SHOP_LOGO.alt, lang)}
                width={SHOP_LOGO.w}
                height={SHOP_LOGO.h}
                className="h-11 w-auto flex-none transition-transform group-hover:-rotate-6"
              />
            )}
            <span className="block min-w-0">
              <span className="flex items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-[0.12em]">
                {m.external && <BrandIcon brand={brandOf(m.href)} size={14} />}
                {t(m.label, lang)}
                {m.external ? " ↗" : win ? " →" : " ↓"}
              </span>
              <span
                className="mt-1 block text-[11.5px] leading-snug"
                style={{ opacity: m.primary ? 0.72 : 0.78 }}
              >
                {t(m.note, lang)}
              </span>
            </span>
          </a>
          );
        })}
      </nav>

      <ContactCards lang={lang} className="mt-3" />

      {/* ตัวเลขมี 4 ตัว → 1 / 2 / 4 คอลัมน์ ถ้าใช้ 3 คอลัมน์เหมือนเดิม
          ใบสุดท้ายจะเหลือค้างแถวล่างใบเดียว และบนมือถือยังเป็นคอลัมน์เดียว
          เพราะคำบรรยายยาวเกินกว่าจะบีบสองใบต่อแถวได้ */}
      <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                {/* o n a d ซ่อนอยู่ใน "Generation Thailand" ของการ์ดแฮกกาธอน */}
                {m.secret ? <SecretText text={t(m.label, lang)} place={m.secret} /> : t(m.label, lang)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
