// ─────────────────────────────────────────────────────────────
// การ์ด teaser งานถัดไป (เว็บไซต์สำหรับ TheOzzy) — วางท้าย section 05 ของหน้าหลัก
//
// ทำไมวางท้าย "เส้นทางที่ผ่านมา": ไทม์ไลน์เล่าว่าผ่านอะไรมาแล้ว การ์ดนี้คือก้าวถัดไป
// อ่านต่อกันเป็นเรื่องเดียว ไม่ต้องมีหัวข้อใหม่มาคั่น
//
// ทำไมสีไม่เหมือนส่วนอื่นของเว็บ: การ์ดใบนี้เป็น "ประตู" ไปอีกโลก (หน้า /next ใช้สีของช่องเขาทั้งหน้า)
// เลยตั้งใจให้หลุดจากระบบสีของเว็บใบเดียว — สีทั้งหมดขังอยู่ใต้คลาส .oz ใน globals.css
//
// การ์ดใบนี้จงใจไม่มีรูปตัวละคร (Pepe/Dooley/M'Baku) — รูปพวกนั้นเป็นลิขสิทธิ์คนอื่น
// เก็บไว้ในหน้า /next ที่เป็นพื้นที่แฟนล้วน ๆ หน้าพอร์ตหลักจะได้มีแต่งานของเจ้าของเว็บเอง
//
// ภาษา: ส่งต่อผ่าน ?lang=th ใน URL ไม่ใช้ sessionStorage แบบหน้า playground
// เพราะหน้านี้ตั้งใจให้แชร์ลิงก์ต่อได้ — คนที่ได้ลิงก์ภาษาไทยไปก็ควรเปิดมาเป็นภาษาไทย
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { NEXT_RUN as N, type L10n, type Lang } from "@/lib/content";

const t = (s: L10n, lang: Lang) => s[lang];

/** สายฟ้า — ล้อสายฟ้าในแบนเนอร์ของเขา ขอบหมึกหนาให้เข้ากับลายเส้นการ์ตูน
 *  paintOrder="stroke" วาดเส้นขอบก่อนแล้วค่อยเทสีทับ ขอบเลยไม่กินเนื้อสายฟ้า */
export function Bolt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        d="M13.5 1.5 4 13.5h6.2L9 22.5l10.5-13H13z"
        fill="currentColor"
        style={{ stroke: "var(--oz-ink)" }}
        strokeWidth={1.8}
        strokeLinejoin="round"
        paintOrder="stroke"
      />
    </svg>
  );
}

export default function NextRunCard({ lang }: { lang: Lang }) {
  // พอเว็บจริงเสร็จแล้วเปลี่ยน href เป็นลิงก์ภายนอก → เปิดแท็บใหม่ และไม่ต้องแนบ ?lang
  const internal = N.href.startsWith("/");
  const href = internal && lang === "th" ? `${N.href}?lang=th` : N.href;

  return (
    <Link
      href={href}
      target={internal ? undefined : "_blank"}
      rel={internal ? undefined : "noopener noreferrer"}
      className="oz oz-grid oz-teaser relative mt-8 flex items-center gap-6 overflow-hidden rounded-2xl p-6 sm:p-7"
    >
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-(--oz-yellow)">
          <Bolt className="h-3.5 w-3.5" />
          {t(N.card.eyebrow, lang)}
        </p>
        <h3 className="oz-title mt-2.5 text-[clamp(22px,3.6vw,30px)] font-bold leading-tight tracking-[-0.02em]">
          {t(N.card.title, lang)}
        </h3>
        <p className="mt-2 max-w-[54ch] text-[13.5px] leading-relaxed text-(--oz-sky)">
          {t(N.card.body, lang)}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 border-b border-(--oz-blue) pb-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-(--oz-blue)">
          {t(N.card.cta, lang)} →
        </span>
      </div>

      {/* พัดการ์ดสามใบ — ตกแต่งล้วน มือถือซ่อนไว้ ไม่งั้นเบียดตัวหนังสือ */}
      <div className="oz-fan relative hidden h-[124px] w-[150px] flex-none sm:block" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="oz-cardback absolute left-1/2 top-3 -ml-[38px] h-[106px] w-[76px]"
          >
            <Bolt className="w-[42%]" />
          </div>
        ))}
      </div>
    </Link>
  );
}
