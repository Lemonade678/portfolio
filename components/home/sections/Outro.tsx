"use client";

// ปิดท้าย — กำลังมองหางานอะไร + ลายเซ็น + ช่องทางติดต่อ (ย้ายมาจาก app/page.tsx ไม่แก้ markup)

import { UI, type Lang } from "@/lib/content";
import ContactCards from "@/components/home/ContactCards";
import Signature from "@/components/home/Signature";
import { t } from "@/components/home/ui";

export default function Outro({ lang }: { lang: Lang }) {
  return (
    <>
      <h2 className="max-w-[20ch] text-[clamp(24px,5vw,42px)] font-bold leading-[1.1] tracking-[-0.03em] text-yellow">
        {t(UI.outro.heading, lang)}
      </h2>
      <p className="mt-3 max-w-[48ch] text-ink2">{t(UI.outro.body, lang)}</p>
      <Signature lang={lang} />
      <ContactCards lang={lang} />
    </>
  );
}
