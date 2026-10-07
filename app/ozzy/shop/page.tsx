import type { Metadata } from "next";
import ShopBalance from "../_components/ShopBalance";
import ShopWindow from "../_components/ShopWindow";
import Window from "../_components/Window";

export const metadata: Metadata = { title: "Points shop" };

export default function ShopPage() {
  return (
    <Window card="shop" extra={<ShopBalance />}>
      <ShopWindow />
    </Window>
  );
}
