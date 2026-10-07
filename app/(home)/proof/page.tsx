import type { Metadata } from "next";
import HomeWindow from "@/components/home/HomeWindow";

export const metadata: Metadata = { title: "Proof you can check · Nutt Bhanidch" };

export default function ProofPage() {
  return <HomeWindow id="proof" />;
}
