"use client";

// ─────────────────────────────────────────────────────────────
// ไข่อีสเตอร์: ตัวอักษร L E M O N A D E ซ่อนอยู่ 8 จุดในหน้าหลัก เรียงจากบนลงล่าง
// กดครบตามลำดับ → ปลดล็อกแล้วพาไปหน้า /playground
//
//   L  แถบบนสุด (sticky อยู่ตลอด เลยกดก่อนได้เสมอ)
//   E  ปลายบรรทัดชื่อ
//   M  เหนือแถวตัวเลข
//   O N A D E  ปลายเส้นคั่นหัวข้อ 01–05
//
// อ่านไล่ขอบขวาลงมาจะเห็นคำว่า LEMONADE — ตั้งใจให้ "หาเจอได้ถ้าช่างสังเกต"
// ไม่ใช่ซ่อนจนไม่มีทางเจอ ไข่อีสเตอร์ที่ไม่มีใครเจอก็เท่ากับไม่มี
//
// ⚠️ นี่คือการซ่อน ไม่ใช่การล็อก
//    เว็บนี้เป็น static ทั้งหมด เนื้อหาหน้า playground อยู่ใน JS bundle อยู่แล้ว
//    ใครเปิด devtools หรือพิมพ์ /playground ตรง ๆ ก็ไปถึงได้ (เจอหน้า "ล็อกอยู่"
//    แต่อ่านโค้ดก็รู้เนื้อหา) — พอสำหรับมุก ห้ามเอาไว้ใช้ซ่อนของจริง
// ─────────────────────────────────────────────────────────────

import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/content";

export const SECRET_WORD = "LEMONADE";

/** sessionStorage — หายเองเมื่อปิดแท็บ เลยต้องหาตัวอักษรใหม่ทุกครั้งที่กลับมา
 *  ซึ่งตั้งใจแบบนั้น ถ้าใช้ localStorage จะปลดล็อกค้างไว้ตลอดกาล ความสนุกหายหมด */
export const UNLOCK_KEY = "lemonade:unlocked";
/** ภาษาที่เลือกอยู่ตอนปลดล็อก — หน้า playground จะเปิดมาเป็นภาษาเดียวกัน */
export const LANG_KEY = "lemonade:lang";

type SecretState = {
  /** กดถูกมาแล้วกี่ตัว (0–8) ตัวอักษร index < progress จะติดไฟ */
  progress: number;
  press: (index: number) => void;
};

const SecretContext = createContext<SecretState | null>(null);

export function SecretProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  // ไม่ใช้ setProgress(p => ...) แบบ updater ตรงนี้ เพราะต้องมี side effect
  // (เขียน sessionStorage + เปลี่ยนหน้า) และ React strict mode เรียก updater
  // ซ้ำสองรอบตอน dev ได้ — ใช้ค่า progress จาก closure ตรง ๆ ปลอดภัยกว่า
  // เพราะการกดแต่ละครั้งเป็น event แยกกันอยู่แล้ว
  const press = useCallback(
    (index: number) => {
      if (index !== progress) {
        // กดผิดลำดับ → ล้างกลับเป็นศูนย์
        // ยกเว้นกด L (ตัวแรก) ให้นับเป็นการเริ่มใหม่เลย ไม่ต้องกดซ้ำอีกรอบ
        setProgress(index === 0 ? 1 : 0);
        return;
      }

      const next = progress + 1;
      setProgress(next);

      if (next === SECRET_WORD.length) {
        try {
          sessionStorage.setItem(UNLOCK_KEY, "1");
          sessionStorage.setItem(LANG_KEY, lang);
        } catch {
          // บางเบราว์เซอร์ (โหมดส่วนตัวรุ่นเก่า) โยน error ตอนแตะ storage
          // ไม่เป็นไร — หน้า playground จะขึ้น "ล็อกอยู่" แทน ไม่ใช่หน้าพัง
        }
        // หน่วงให้เห็นตัวสุดท้ายติดไฟก่อน ไม่งั้นหน้าเปลี่ยนไวจนไม่รู้ว่าทำสำเร็จ
        setTimeout(() => router.push("/playground"), 450);
      }
    },
    [progress, lang, router],
  );

  return (
    <SecretContext.Provider value={{ progress, press }}>
      {children}
    </SecretContext.Provider>
  );
}

/**
 * ตัวอักษรหนึ่งตัวของรหัส — เป็น <button> จริง กดด้วยคีย์บอร์ดได้ด้วย
 * หน้าตาจางมากจนดูเหมือนลายประดับ จนกว่าจะเอาเมาส์ไปชี้หรือกดถูก
 *
 * ปุ่มกว้างอย่างน้อย 24×24 ตามเกณฑ์ WCAG ขั้นต่ำ ทั้งที่ตัวอักษรเล็กนิดเดียว
 * ไม่งั้นบนมือถือกดโดนยากมาก
 */
export function SecretLetter({
  index,
  className = "",
}: {
  index: number;
  className?: string;
}) {
  const ctx = useContext(SecretContext);
  if (!ctx) return null;

  const char = SECRET_WORD[index];
  const lit = index < ctx.progress;

  return (
    <button
      type="button"
      onClick={() => ctx.press(index)}
      aria-label={char}
      data-lit={lit || undefined}
      className={`secret-letter ${className}`}
    >
      {char}
    </button>
  );
}
