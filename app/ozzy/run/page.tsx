import type { Metadata } from "next";
import RunWindow from "../_components/RunWindow";
import Window from "../_components/Window";

export const metadata: Metadata = { title: "Dungeon" };

export default function RunPage() {
  return (
    <Window card="run">
      <RunWindow />
    </Window>
  );
}
