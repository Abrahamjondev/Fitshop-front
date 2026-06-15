import React from "react";
import StatSection from "./StatSection";
import TopProductsSection from "./TopProductsSection";
import TopUsersSection from "./TopUsersSection";
import CategorySection from "./CategorySection";
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
      <TopUsersSection />
      <CategorySection />
    </div>
  );
}
