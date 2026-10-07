/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // ภาพปกคลิปของ TheOzzy มาจาก i.ytimg.com / i1–i4.ytimg.com — ให้ next/image ดึงผ่าน Vercel
    // เบราว์เซอร์คนดูเลยไม่ต้องยิงไปหา Google ตรง ๆ แค่เปิดหน้าต่างคลิป (ยิงตอนกดเล่นเท่านั้น)
    remotePatterns: [{ protocol: "https", hostname: "*.ytimg.com" }],
  },
  async redirects() {
    // หน้า teaser /next เดิมกลายเป็นเว็บเต็มที่ /ozzy แล้ว — ลิงก์เก่าที่เคยแชร์ไปต้องยังใช้ได้
    return [{ source: "/next", destination: "/ozzy", permanent: true }];
  },
};

export default nextConfig;
