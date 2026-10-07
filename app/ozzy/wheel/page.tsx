import type { Metadata } from "next";
import Wheel from "../_components/Wheel";
import Window from "../_components/Window";

export const metadata: Metadata = { title: "Wheel" };

export default function WheelPage() {
  return (
    <Window card="wheel">
      <Wheel />
    </Window>
  );
}
