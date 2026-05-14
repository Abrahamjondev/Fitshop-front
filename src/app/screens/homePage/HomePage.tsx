import React from "react";
import StatSection from "./StatSection";
import TopProductsSection from "./TopProductsSection";
import ComingSoonSection from "./ComingSoonSection";
import "../../../css/home.css";
import { CartItem } from "../../../lib/types/search";

interface HomePageProps {
  onAdd: (item: CartItem) => void;
}

export default function HomePage({ onAdd }: HomePageProps) {
  return (
    <div className={"homepage"}>
      <StatSection />
      <TopProductsSection onAddToCart={onAdd} />
      <ComingSoonSection />
    </div>
  );
}
