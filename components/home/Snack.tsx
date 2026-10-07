// ─────────────────────────────────────────────────────────────
// ขนมประจำแต่ละชั้นในตู้ — วาดเป็น SVG ล้วน ไม่มีไฟล์รูป ไม่มี dependency
//
// ทุกชิ้นใช้กติกาเดียวกัน ให้ดูเป็นชุดเดียวกัน: กรอบ 64×64 · เส้นขอบสีพื้นเว็บ (#1a1310) หนา 3
// · สีเรียบ + ไฮไลต์หนึ่งเส้น — ลายเส้นแบบสติกเกอร์ ไม่ต้องสมจริง แต่ต้องดูออกว่าเป็นขนมอะไร
//
// ขนมแต่ละชิ้นเป็นมุกกับชื่อหัวข้อ (ดูตารางใน README หัวข้อ "หน้าหลักแบบ hub"):
//   tteok    บัตเตอร์ต๊อก — ของขึ้นชื่อของร้าน Kapimong = ผลงานหลัก
//   bread    ขนมปังที่ "proof" (พักแป้งให้ขึ้นฟู) = หลักฐาน (proof)
//   pancakes แพนเค้กซ้อน = stack
//   dango    ดังโงะ (โมจิเสียบไม้) = soft
//   roll     โรลเค้ก ครีมวนเป็นทาง = path
//   lemonade น้ำเลมอน = เลม่อน เจ้าของเว็บ
//
// aria-hidden เสมอ — เป็นของตกแต่ง ชื่อหัวข้อจริงอยู่ในตัวหนังสือข้าง ๆ แล้ว
// ─────────────────────────────────────────────────────────────

import type { SnackId } from "@/lib/content";

const INK = "#1a1310";

/** เกลียวครีมของโรลเค้ก — คำนวณเป็นจุดจากเกลียวอาร์คิมีดีส (r = 1.6 + 1.02θ) ไว้ล่วงหน้า */
const SPIRAL =
  "M32.0 33.4L32.4 33.2L33.0 33.1L33.5 33.2L34.1 33.5L34.6 34.0L35.0 34.6L35.3 35.4L35.3 36.2L35.2 37.1L34.7 38.0L34.1 38.8L33.2 39.4L32.1 39.8L30.9 39.9L29.7 39.7L28.5 39.2L27.4 38.4L26.5 37.3L25.8 35.9L25.5 34.4L25.6 32.8L26.1 31.2L27.0 29.8L28.3 28.5L29.8 27.6L31.7 27.0L33.6 26.9L35.6 27.3L37.4 28.2L39.1 29.6L40.4 31.3L41.3 33.4L41.7 35.6L41.5 38.0L40.7 40.3L39.4 42.4L37.5 44.1L35.3 45.4L32.7 46.1L30.0 46.2L27.3 45.6L24.8 44.4L22.5 42.6L20.8 40.2L19.6 37.5L19.2 34.4L19.4 31.3L20.4 28.3L22.2 25.6L24.6 23.3L27.5 21.7L30.8 20.7L34.2 20.6L37.7 21.3L40.9 22.9";

function Art({ id }: { id: SnackId }) {
  switch (id) {
    case "tteok":
      return (
        <>
          <rect x="7" y="17" width="30" height="27" rx="7" fill="#d9952e" />
          <rect x="23" y="25" width="33" height="29" rx="8" fill="#f2b443" />
          <path d="M28 34c4-2 13-2 22 0" fill="none" stroke="#ffe39a" />
          <path d="M28 47h4M37 47h3M44 47h4" fill="none" stroke="#c9822a" strokeWidth="2.5" />
          {/* เนยก้อนเล็กบนหน้าขนม */}
          <path d="M30 18.5l12-2.4 2 8.4-12 2.4z" fill="#fff2bf" strokeWidth="2.5" />
        </>
      );
    case "bread":
      return (
        <>
          <path d="M8 45c0-15 11-27 24-27s24 12 24 27v3a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z" fill="#d99a52" />
          <path d="M21 29l6 8M30 25l6 9M40 28l5 8" fill="none" stroke="#a8692c" />
          <path d="M14 41c1-6 4-11 9-14" fill="none" stroke="#f0c486" />
          <path d="M8 46h48" fill="none" stroke="#b97a3a" strokeWidth="2.5" />
        </>
      );
    case "pancakes":
      return (
        <>
          {/* วาดจากแผ่นล่างขึ้นบน แผ่นบนจะได้ทับแผ่นล่าง */}
          <rect x="7" y="45" width="50" height="10" rx="5" fill="#d99a52" />
          <rect x="9" y="37" width="46" height="10" rx="5" fill="#e6ad66" />
          <rect x="8" y="29" width="48" height="10" rx="5" fill="#d99a52" />
          <rect x="10" y="21" width="44" height="10" rx="5" fill="#e6ad66" />
          <path
            d="M14 22h36c0 4-2 6-5 6h-2c-2 0-2 1-2 3v6c0 2.5-4 2.5-4 0v-4c0-2-1-3-3-3h-4c-1.5 0-2 1-2 2v2c0 2.5-4 2.5-4 0v-3c0-2-1-3-3-3h-2c-3 0-5-2-5-6z"
            fill="#9a4f1d"
          />
          <path d="M27 13l10 0 1 8h-12z" fill="#fff2bf" strokeWidth="2.5" />
        </>
      );
    case "dango":
      return (
        <>
          {/* ไม้เสียบ: เส้นหมึกหนาก่อน แล้วเส้นสีไม้ทับ = ไม้มีขอบ */}
          <path d="M11 57L53 9" strokeWidth="7" />
          <path d="M11 57L53 9" stroke="#d6a56b" />
          <circle cx="22" cy="44" r="10" fill="#9fd08a" />
          <circle cx="31.5" cy="33" r="10" fill="#fbf3ea" />
          <circle cx="41" cy="22" r="10" fill="#ff9fb5" />
          <g stroke="none" fill="#ffffff" opacity=".7">
            <ellipse cx="37.5" cy="18.5" rx="3" ry="2" />
            <ellipse cx="28" cy="29.5" rx="3" ry="2" />
            <ellipse cx="18.5" cy="40.5" rx="3" ry="2" />
          </g>
        </>
      );
    case "roll":
      return (
        <>
          <circle cx="32" cy="35" r="20" fill="#cf9150" />
          <path d={SPIRAL} fill="none" stroke="#fff3e2" strokeWidth="3.2" />
          <path d="M20 15c3-4 9-5 12-2 3-3 9-2 12 2" fill="#fff3e2" strokeWidth="2.5" />
          <circle cx="32" cy="10" r="4.5" fill="#ff7e9d" strokeWidth="2.5" />
        </>
      );
    case "lemonade":
      return (
        <>
          <path d="M33 27L41 4" strokeWidth="7" />
          <path d="M33 27L41 4" stroke="#ff7e9d" />
          <path d="M14 15h34l-4.5 40a4 4 0 0 1-4 3.5H22.5a4 4 0 0 1-4-3.5z" fill="#fdf3cf" />
          <path d="M16.6 25h28.8l-3.4 29.4a2 2 0 0 1-2 1.8H22a2 2 0 0 1-2-1.8z" fill="#f7d443" stroke="none" />
          {/* ขอบแก้ววาดซ้ำทับน้ำ ไม่งั้นน้ำเลมอนจะกินขอบแก้วด้านล่าง */}
          <path d="M14 15h34l-4.5 40a4 4 0 0 1-4 3.5H22.5a4 4 0 0 1-4-3.5z" fill="none" />
          <g stroke="none" fill="#fffbe6">
            <circle cx="25" cy="44" r="2" />
            <circle cx="35" cy="36" r="1.6" />
            <circle cx="29" cy="50" r="1.3" />
          </g>
          <circle cx="47" cy="16" r="9" fill="#f5e04a" />
          <circle cx="47" cy="16" r="5.5" fill="#fff6b0" stroke="#e6c21f" strokeWidth="1.5" />
          <path d="M47 10.5v11M41.5 16h11M43 12l8 8M51 12l-8 8" stroke="#e6c21f" strokeWidth="1.2" />
        </>
      );
  }
}

export default function Snack({ id, className = "" }: { id: SnackId; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <Art id={id} />
      </g>
    </svg>
  );
}
