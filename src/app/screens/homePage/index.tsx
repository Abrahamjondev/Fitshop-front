import React, { useEffect } from "react";
import Statistics from "./Statistics";
import Advertisement from "./Advirtesement";
import ActiveUsers from "./ActiveUsers";
import Events from "./Events";
import PopularDishes from "./PopularDishes";
import NewDishes from "./NewDishes";
import "../../../css/home.css";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { setPopularDishes } from "./slice";
import { retrievePopularDishes } from "./selector";
import { Product } from "../../../lib/types/product";

/**.REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
});

const popularDishesRetriever = createSelector(
  retrievePopularDishes,
  (popularDishes) => ({ popularDishes }),
);

export default function HomePage() {
  const { setPopularDishes } = actionDispatch(useDispatch());
  const { popularDishes } = useSelector(popularDishesRetriever);

  console.log(process.env.REACT_APP_API_URL);

  //Selector: Store => Data [yani selector biz storega saqlagan datani oladis ]
  useEffect(() => {
    //Backend server data request =>DATA
    //slice: Data => Store [yani backendan olingan malumot birinchi redux store ga joylanadi
    //  keyin undan olib kelip ishlatiladi ]
    //@ts-ignore
  }, []);

  return (
    <div className={"homepage"}>
      {" "}
      {/**Barcha section complar homepage schreen components ichida joylashtirildi sababi ular faqat HomePage schreen comp ichida foydalaniladi */}
      <Statistics />
      <PopularDishes />
      <NewDishes />
      <Advertisement />
      <ActiveUsers />
      <Events />
    </div>
  );
}
