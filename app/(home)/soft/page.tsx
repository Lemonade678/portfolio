import type { Metadata } from "next";
import HomeWindow from "@/components/home/HomeWindow";

export const metadata: Metadata = { title: "How I work with people · Nutt Bhanidch" };

export default function SoftPage() {
  return <HomeWindow id="soft" />;
}
