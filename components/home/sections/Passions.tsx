"use client";

// ─────────────────────────────────────────────────────────────
// 06 แพชชั่น — ภาษา · อาหารและเครื่องดื่ม · เทค (สามอย่างที่เจ้าของเว็บบอกมา)
//
// ทุกประโยคประกอบจากข้อเท็จจริงที่มีอยู่แล้วในเว็บ (TOEIC 885 · ร้าน Buttertteok 4U · สามบทบาทบนหัวเว็บ)
// ไม่แต่งความรู้สึกหรืองานอดิเรกที่เจ้าตัวไม่ได้พูด — ข้อความทั้งหมดอยู่ใน HOME.passions ใน content.ts
// อยากเล่าด้วยคำของตัวเองเมื่อไหร่ แก้ที่นั่นที่เดียว
//
// สีหัวการ์ดวนตามลำดับ (เหลือง ชมพู ฟ้า) แบบเดียวกับการ์ด soft skill — ไม่ได้ผูกความหมายแบบสีโปรเจกต์
// ลิงก์ที่ขึ้นต้นด้วย / คือหน้าต่างในเว็บนี้ → ใช้ <Link> + แนบ ?lang ให้ (ไม่โหลดหน้าใหม่ ภาษาไม่หลุด)
// ลิงก์ออกนอกเว็บใช้ CardLink ตัวเดียวกับการ์ดโปรเจกต์ (มีโลโก้ปลายทาง + ป้ายบอกว่าไปไหน)
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { useHome } from "@/components/home/HomeShell";
import { CardLink, Reveal, SOFT_ACCENTS, accentVar, t } from "@/components/home/ui";
import { ACCENT_HEX, HOME, SHOP_LOGO, type Lang } from "@/lib/content";

export default function Passions({ lang }: { lang: Lang }) {
  const { href } = useHome();
  const P = HOME.passions;

  return (
    <>
      <p className="mb-6 max-w-[62ch] text-[14.5px] text-ink2">{t(P.intro, lang)}</p>

      <div className="grid gap-4 md:grid-cols-3">
        {P.cards.map((c, i) => {
          const accent = SOFT_ACCENTS[i % SOFT_ACCENTS.length];
          const hex = ACCENT_HEX[accent];
          return (
            <Reveal key={c.id}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6" style={accentVar(accent)}>
                <span className="flex items-start justify-between gap-3">
                  <span className="font-mono text-[10.5px] tracking-[0.16em] text-muted">0{i + 1}</span>
                  {/* การ์ดอาหารและเครื่องดื่ม: โลโก้ร้านบัตเตอร์ต๊อกมุมขวาบน */}
                  {c.logo && (
                    <img
                      src={SHOP_LOGO.src}
                      alt={t(SHOP_LOGO.alt, lang)}
                      width={SHOP_LOGO.w}
                      height={SHOP_LOGO.h}
                      loading="lazy"
                      className="-mr-1 -mt-1 h-20 w-auto flex-none"
                    />
                  )}
                </span>
                <h3 className="mt-1 text-[18px] font-bold tracking-[-0.01em]" style={{ color: "var(--c)" }}>
                  {t(c.title, lang)}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink2">{t(c.body, lang)}</p>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
                  {c.links.map((l) =>
                    l.href.startsWith("/") ? (
                      <Link
                        key={l.href}
                        href={href(l.href)}
                        className="inline-flex items-center gap-1.5 border-b pb-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em]"
                        style={{ color: hex }}
                      >
                        {t(l.label, lang)} →
                      </Link>
                    ) : (
                      <CardLink key={l.href} href={l.href} color={hex}>
                        {t(l.label, lang)}
                      </CardLink>
                    ),
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <p className="mt-6 max-w-[62ch] text-[13.5px] italic text-muted">{t(P.outro, lang)}</p>
    </>
  );
}
