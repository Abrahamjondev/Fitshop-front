import React from "react";
import Statistics from "./Statistics";
import Advertisement from "./Advirtesement";
import ActiveUsers from "./ActiveUsers";
import Events from "./Events";
import PopularDishes from "./PopularDishes";
import NewDishes from "./NewDishes";
import "../../../css/home.css"

export default function HomePage() {
  return (
  <div className={"homepage"}> {/**Barcha section complar homepage schreen components ichida joylashtirildi sababi ular faqat HomePage schreen comp ichida foydalaniladi */}
    <Statistics/>
    <PopularDishes/>
    <NewDishes/>
    <Advertisement/>
    <ActiveUsers/>
    <Events/>
  </div>
  );
}
