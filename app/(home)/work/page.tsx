import type { Metadata } from "next";
import HomeWindow from "@/components/home/HomeWindow";

export const metadata: Metadata = { title: "Selected work · Nutt Bhanidch" };

export default function WorkPage() {
  return <HomeWindow id="work" />;
}
