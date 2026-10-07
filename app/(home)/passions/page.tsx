import type { Metadata } from "next";
import HomeWindow from "@/components/home/HomeWindow";

export const metadata: Metadata = { title: "Passions · Nutt Bhanidch" };

export default function PassionsPage() {
  return <HomeWindow id="passions" />;
}
