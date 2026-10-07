"use client";

// ─────────────────────────────────────────────────────────────
// Shell ของหน้าหลักแบบ hub — วาดหน้า hub ค้างไว้ตลอด แล้วให้หน้าต่าง (route ลูก) ลอยทับ
//
// ทำไมต้องมี shell: app/(home)/layout.tsx ไม่ถูก mount ใหม่ตอนสลับ / ↔ /work ↔ /proof
// state ที่อยู่ตรงนี้ (ภาษา · ตัวอักษรลับที่กดมาแล้ว) เลยไม่หายตอนเปิด/ปิดหน้าต่าง
// — แบบเดียวกับโต๊ะการ์ดของ /ozzy (app/ozzy/_components/OzzyShell.tsx)
//
// ภาษาอยู่ใน URL (?lang=th) ไม่ใช่แค่ใน state: แชร์ลิงก์หน้าต่างไหนไป คนเปิดก็ได้ภาษาเดียวกัน
//
// ลิงก์เก่าของหน้ายาว (/#work, /#proof …) ยังใช้ได้: ตอนเปิดหน้ามาเจอ hash ที่ตรงกับหน้าต่าง
// จะพาไปหน้าต่างนั้นแทน ส่วน #contact ยังเป็นข้อความปิดท้ายบนหน้า hub เบราว์เซอร์เลื่อนไปเอง
// ─────────────────────────────────────────────────────────────

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import CoverArt from "@/components/CoverArt";
import { SecretLetter, SecretProvider } from "@/components/SecretCode";
import Hero from "@/components/home/Hero";
import Outro from "@/components/home/sections/Outro";
import Counter from "@/components/home/Counter";
import { t } from "@/components/home/ui";
import { HOME, PERSON, UI, type Lang } from "@/lib/content";
import { HOME_WINDOWS, windowFromHash, withLang, type WindowId } from "@/lib/home";

interface HomeCtx {
  lang: Lang;
  /** แนบ ?lang=th ให้ลิงก์ภายในเมื่อกำลังเป็นภาษาไทย */
  href: (path: string) => string;
}

const Ctx = createContext<HomeCtx | null>(null);

export function useHome(): HomeCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useHome() ต้องอยู่ใต้ <HomeShell>");
  return c;
}

export default function HomeShell({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const router = useRouter();
  const pathname = usePathname();
  const windowOpen = pathname !== "/";

  // ภาษาจาก ?lang + ลิงก์เก่าแบบ #anchor — ทำครั้งเดียวตอนเปิดหน้า
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("lang");
    const l: Lang = q === "th" ? "th" : "en";
    setLangState(l);
    const id = windowFromHash(window.location.hash);
    if (id && window.location.pathname === "/") router.replace(withLang(`/${id}`, l));
  }, [router]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    const url = new URL(window.location.href);
    if (l === "th") url.searchParams.set("lang", "th");
    else url.searchParams.delete("lang");
    window.history.replaceState(null, "", url);
  }, []);

  const href = useCallback((path: string) => withLang(path, lang), [lang]);
  const value = useMemo(() => ({ lang, href }), [lang, href]);

  // ── คืนโฟกัสให้ปุ่มที่เปิดหน้าต่าง ──
  // จำ "ลิงก์/ปุ่มที่เพิ่งกด" ไว้ตอนคลิก (ตอนนั้น activeElement ยังเป็นตัวมันอยู่)
  // พอหน้าต่างปิด (เปิดอยู่ → ไม่เปิด) ค่อยโฟกัสกลับ — คนใช้คีย์บอร์ดจะได้ไม่ต้องเริ่ม Tab ใหม่จากบนสุด
  // ถ้าเปิดหน้าต่างมาตรง ๆ จากลิงก์ (ไม่มีคนกด) ก็ไม่มีอะไรให้คืน ปล่อยไว้ตามปกติ
  const opener = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(windowOpen);
  useEffect(() => {
    if (wasOpen.current && !windowOpen && opener.current?.isConnected) opener.current.focus();
    wasOpen.current = windowOpen;
  }, [windowOpen]);
  const remember = (e: React.MouseEvent) => {
    if (windowOpen) return; // คลิกในหน้าต่าง (ก่อนหน้า/ถัดไป) ไม่ใช่ตัวเปิดจากหน้า hub
    const el = (e.target as Element).closest<HTMLElement>("a, button");
    if (el) opener.current = el;
  };

  const navIds: (WindowId | "contact")[] = [...HOME_WINDOWS, "contact"];

  return (
    <Ctx.Provider value={value}>
      {/* SecretProvider ครอบทั้งหน้า เพราะตัวอักษร 8 ตัวกระจายอยู่ทั้งแถบบน หัวเว็บ และตู้ขนม */}
      <SecretProvider lang={lang}>
        {/* ───── แถบบน ─────
            อยู่เหนือหน้าต่าง (z-50) และไม่ถูก inert: สลับภาษาได้แม้เปิดหน้าต่างอยู่ */}
        <header onClickCapture={remember} className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
          <div className="mx-auto flex h-[54px] max-w-[1120px] items-center justify-between px-5 sm:px-8 lg:px-16">
            <Link href={href("/")} className="font-mono text-[13px] font-semibold tracking-[0.2em]">
              NUTT<span className="text-yellow">.</span>
            </Link>

            <div className="flex items-center gap-5">
              {/* ตัวที่ 1 — L อยู่ใน header ที่ sticky เลยมองเห็นและกดได้ตลอด */}
              <SecretLetter index={0} />
              <nav className="hidden gap-4 lg:flex">
                {navIds.map((k) => {
                  const label = k === "contact" ? UI.nav.contact : HOME.windows[k].nav;
                  const to = k === "contact" ? `${href("/")}#contact` : href(`/${k}`);
                  const on = pathname === `/${k}`;
                  return (
                    <Link
                      key={k}
                      href={to}
                      aria-current={on ? "page" : undefined}
                      className={`border-b pb-[3px] font-mono text-[11px] uppercase tracking-[0.12em] transition-colors hover:border-yellow hover:text-yellow ${
                        on ? "border-yellow text-yellow" : "border-transparent text-ink2"
                      }`}
                    >
                      {t(label, lang)}
                    </Link>
                  );
                })}
              </nav>

              <div role="group" aria-label="Language" className="flex overflow-hidden rounded-full border border-line">
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

        {/* ───── หน้า hub ─────
            ตอนเปิดหน้าต่าง ทั้งก้อนเป็น inert (กด/โฟกัสไม่ได้ screen reader ข้าม) — Tab จะไม่หลุดไปหลังหน้าต่าง */}
        <div inert={windowOpen} onClickCapture={remember}>
          <CoverArt />

          <main className="mx-auto max-w-[1120px] px-5 pb-20 sm:px-8 lg:px-16">
            <Hero lang={lang} windowHref={(id) => href(`/${id}`)} />

            <Counter />

            {/* ───── ปิดท้าย ───── */}
            <section id="contact" className="scroll-mt-20 pt-[clamp(52px,8vw,86px)]">
              <Outro lang={lang} />
            </section>

            <footer className="mt-[clamp(48px,7vw,72px)] flex flex-wrap justify-between gap-2.5 border-t border-line pt-[18px] font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              <span>
                {PERSON.name} — {PERSON.location}
              </span>
              <span>{t(UI.updated, lang)}</span>
            </footer>
          </main>
        </div>

        {children}
      </SecretProvider>
    </Ctx.Provider>
  );
}
