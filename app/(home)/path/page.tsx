import type { Metadata } from "next";
import HomeWindow from "@/components/home/HomeWindow";

export const metadata: Metadata = { title: "Path so far · Nutt Bhanidch" };

export default function PathPage() {
  return <HomeWindow id="path" />;
}
