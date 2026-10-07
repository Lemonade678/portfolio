"use client";

import { useEffect, useState } from "react";
import CoverArt from "@/components/CoverArt";
import { SecretLetter, SecretProvider } from "@/components/SecretCode";
import Hero from "@/components/home/Hero";
import Work from "@/components/home/sections/Work";
import Proof from "@/components/home/sections/Proof";
import Stack from "@/components/home/sections/Stack";
import Soft from "@/components/home/sections/Soft";
import Path from "@/components/home/sections/Path";
import Outro from "@/components/home/sections/Outro";
import { SectionHead, t } from "@/components/home/ui";
import { PERSON, UI, type Lang } from "@/lib/content";

// ── หน้าเว็บ ──────────────────────────────────────────────────

export default function Page() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    // SecretProvider ครอบทั้งหน้า เพราะตัวอักษร 8 ตัวกระจายอยู่ทั้งใน header และ main
    // ต้องแชร์ตัวนับเดียวกันว่ากดถูกมาถึงตัวไหนแล้ว
    <SecretProvider lang={lang}>
      {/* ───── แถบบน ───── */}
      <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-[54px] max-w-[1120px] items-center justify-between px-5 sm:px-8 lg:px-16">
          <span className="font-mono text-[13px] font-semibold tracking-[0.2em]">
            NUTT<span className="text-yellow">.</span>
          </span>

          <div className="flex items-center gap-5">
            {/* ตัวที่ 1 — L อยู่ใน header ที่ sticky เลยมองเห็นและกดได้ตลอด
                ไม่ว่าจะเลื่อนไปถึงไหน ซึ่งเหมาะกับตัวแรกของรหัสพอดี */}
            <SecretLetter index={0} />
            <nav className="hidden gap-5 md:flex">
              {(["work", "proof", "stack", "soft", "path", "contact"] as const).map((k) => (
                <a
                  key={k}
                  href={`#${k}`}
                  className="border-b border-transparent pb-[3px] font-mono text-[11px] uppercase tracking-[0.12em] text-ink2 transition-colors hover:border-yellow hover:text-yellow"
                >
                  {t(UI.nav[k], lang)}
                </a>
              ))}
            </nav>

            <div
              role="group"
              aria-label="Language"
              className="flex overflow-hidden rounded-full border border-line"
            >
              {(["en", "th"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={`px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                    lang === l ? "bg-yellow text-bg" : "text-muted"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <CoverArt />

      <main className="mx-auto max-w-[1120px] px-5 pb-20 sm:px-8 lg:px-16">
        {/* ───── หัวเรื่อง ───── */}
        <Hero lang={lang} />

        {/* ───── ผลงาน ───── */}
        <section id="work" className="pt-[clamp(52px,8vw,86px)]">
          <SectionHead n="01" secret={3} title={t(UI.sections.work, lang)} />
          <Work lang={lang} />
        </section>

        {/* ───── หลักฐาน ───── */}
        <section id="proof" className="pt-[clamp(52px,8vw,86px)]">
          <SectionHead n="02" secret={4} title={t(UI.sections.proof, lang)} />
          <Proof lang={lang} />
        </section>

        {/* ───── เครื่องมือ ───── */}
        <section id="stack" className="pt-[clamp(52px,8vw,86px)]">
          <SectionHead n="03" secret={5} title={t(UI.sections.stack, lang)} />
          <Stack lang={lang} />
        </section>

        {/* ───── ทักษะที่ไม่ใช่เครื่องมือ ───── */}
        <section id="soft" className="pt-[clamp(52px,8vw,86px)]">
          <SectionHead n="04" secret={6} title={t(UI.sections.soft, lang)} />
          <Soft lang={lang} />
        </section>

        {/* ───── เส้นทาง ───── */}
        <section id="path" className="pt-[clamp(52px,8vw,86px)]">
          <SectionHead n="05" secret={7} title={t(UI.sections.path, lang)} />
          <Path lang={lang} />
        </section>

        {/* ───── ปิดท้าย ───── */}
        <section id="contact" className="pt-[clamp(52px,8vw,86px)]">
          <Outro lang={lang} />
        </section>

        <footer className="mt-[clamp(48px,7vw,72px)] flex flex-wrap justify-between gap-2.5 border-t border-line pt-[18px] font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          <span>
            {PERSON.name} — {PERSON.location}
          </span>
          <span>{t(UI.updated, lang)}</span>
        </footer>
      </main>
    </SecretProvider>
  );
}
