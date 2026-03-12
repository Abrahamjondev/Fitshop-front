import React, { useEffect } from "react";
import Statistics from "./Statistics";
import Advertisement from "./Advirtesement";
import ActiveUsers from "./ActiveUsers";
import Events from "./Events";
import PopularDishes from "./PopularDishes";
import NewDishes from "./NewDishes";
import "../../../css/home.css";

import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPopularDishes } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";

/**.REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
});

export default function HomePage() {
  const { setPopularDishes } = actionDispatch(useDispatch());

  console.log(process.env.REACT_APP_API_URL);

  //Selector: Store => Data [yani selector biz storega saqlagan datani oladis ]
  useEffect(() => {
    //Backend server data request =>DATA
    //slice: Data => Store [yani backendan olingan malumot birinchi redux store ga joylanadi
    //  keyin undan olib kelip ishlatiladi ]
    const product = new ProductService();
    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "productViews",
        productCollection: ProductCollection.DISH,
      })
      .then((data) => {
        setPopularDishes(data);
      })
      .catch((err) => console.log(err));
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
