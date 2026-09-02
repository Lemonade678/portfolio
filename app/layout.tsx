import type { Metadata } from "next";
import { Anuphan, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Anuphan รองรับทั้งไทยและละติน เลยใช้ตัวเดียวได้ทั้งเว็บ
const anuphan = Anuphan({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-anuphan",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nutt Bhanidch — AI Engineer",
  description:
    "AI systems that have to run in a real workplace. Chip anomaly detection at 91% on a production line, lane change detection from road video, and a Thai interview LLM fine-tuned to 88%.",
  openGraph: {
    title: "Nutt Bhanidch — AI Engineer",
    description:
      "AI systems that have to run in a real workplace — computer vision on a production line, and an LLM I fine-tuned myself.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anuphan.variable} ${plexMono.variable}`}>
      <body className="font-sans text-base leading-relaxed">{children}</body>
    </html>
  );
}
