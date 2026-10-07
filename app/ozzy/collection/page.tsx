import type { Metadata } from "next";
import CollectionWindow from "../_components/CollectionWindow";
import Window from "../_components/Window";

export const metadata: Metadata = { title: "Collection" };

export default function CollectionPage() {
  return (
    <Window card="collection">
      <CollectionWindow />
    </Window>
  );
}
