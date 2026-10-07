"use client";

// ตู้ขนม — ตัวชั่วคราว (รายการลิงก์ธรรมดา + ตัวอักษรลับ) จนกว่าจะวาดตู้จริงใน Task 4
import Link from "next/link";
import { SecretLetter } from "@/components/SecretCode";
import { useHome } from "@/components/home/HomeShell";
import { t } from "@/components/home/ui";
import { HOME } from "@/lib/content";
import { HOME_WINDOWS, counts } from "@/lib/home";

export default function Counter() {
  const { lang, href } = useHome();
  const n = counts();
  return (
    <section aria-labelledby="counter-title" className="pt-[clamp(52px,8vw,86px)]">
      <h2 id="counter-title" className="text-[clamp(22px,3.6vw,30px)] font-bold tracking-[-0.02em]">
        {t(HOME.counter.title, lang)}
      </h2>
      <ul className="mt-6 border-t border-line">
        {HOME_WINDOWS.map((id) => {
          const w = HOME.windows[id];
          return (
            <li key={id} className="flex items-center gap-4 border-b border-line py-4">
              <span className="font-mono text-[10.5px] tracking-[0.16em] text-yellow">{w.n}</span>
              <Link href={href(`/${id}`)} className="flex-1 font-semibold hover:text-yellow">
                {t(w.title, lang)}
              </Link>
              <span className="font-mono text-[11px] text-muted">
                {n[id]} {t(w.unit, lang)}
              </span>
              {w.secret !== undefined && <SecretLetter index={w.secret} />}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
