import type { Metadata } from "next";
import HomeWindow from "@/components/home/HomeWindow";

export const metadata: Metadata = { title: "What I actually use · Nutt Bhanidch" };

export default function StackPage() {
  return <HomeWindow id="stack" />;
}
