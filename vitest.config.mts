// เทสต์เฉพาะส่วนที่เป็นฟังก์ชันล้วน (ตัวแยก RSS · save · กติกาเกม) — ไม่เทสต์ UI ด้วย vitest
// UI ตรวจในเบราว์เซอร์จริงแทน เพราะของที่พังบ่อยคือ layout/animation ซึ่ง jsdom ไม่ได้วาดจริง
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // ให้ import "@/lib/..." ในเทสต์ชี้ที่เดียวกับ tsconfig paths ของ Next.js
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
