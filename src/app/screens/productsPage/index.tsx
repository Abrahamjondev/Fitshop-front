import React from "react";
import { Container } from "@mui/material";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import ChosenProduct from "./ChosenProduct";
import Products from "./Products";

export default function ProductsPage() {
  const products = useRouteMatch();
  return (
    <div className={"products-page"}>
      <switch>
        <Route path={`${products.path}/:productId`}>
          <ChosenProduct />
        </Route>
        <Route path={`${products.path}`}>
          <Products />
        </Route>
      </switch>
    </div>
  );
}
