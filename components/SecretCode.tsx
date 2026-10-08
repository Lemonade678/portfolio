"use client";

// ─────────────────────────────────────────────────────────────
// ไข่อีสเตอร์: ตัวอักษร L E M O N A D E ซ่อนอยู่ "ในคำ" บนหน้าหลัก เรียงจากบนลงล่าง
// กดครบตามลำดับ → ปลดล็อกแล้วพาไปหน้า /playground
//
// ตำแหน่งตัวอักษรอยู่ใน lib/secret.ts · ตัวที่วาดบนจอคือ components/SecretText.tsx
// ไฟล์นี้ถือแค่ "สถานะ" ว่ากดถูกมาถึงตัวไหนแล้ว (SecretProvider) ให้ทุกจุดบนหน้าแชร์ตัวนับเดียวกัน
//
// ตั้งใจให้เป็นความลับจริง ๆ: ตัวอักษรหน้าตาเหมือนตัวหนังสือรอบข้างทุกอย่าง
// จุดสังเกตเดียวคือเอาเมาส์ไปชี้แล้วเคอร์เซอร์เป็นรูปมือ — กดถูกแล้วค่อยเรืองเหลืองให้รู้ว่ามาถูกทาง
// ไม่มีทางเข้าด้วยคีย์บอร์ด (เจ้าของเว็บเลือกเอง: Tab ไปโดนตัวอักษรเมื่อไหร่ ความลับก็แตก)
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

/** สถานะของไข่ — null ถ้าไม่ได้อยู่ใต้ SecretProvider (เช่นใช้ข้อความเดียวกันนอกหน้าแรก) */
export function useSecret(): SecretState | null {
  return useContext(SecretContext);
}
