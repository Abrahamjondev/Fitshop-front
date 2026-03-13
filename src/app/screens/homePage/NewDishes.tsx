import React from "react";
import { Box, Container, Stack } from "@mui/material";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import { CssVarsProvider } from "@mui/joy/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Divider from "../../components/divider";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveNewDishes, retrievePopularDishes } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { ProductCollection } from "../../../lib/enums/product.enum";

/**.REDUX SLICE & SELECTOR **/

const newDishesRetriever = createSelector(retrieveNewDishes, (newDishes) => ({
  newDishes,
}));

export default function NewDishes() {
  const { newDishes } = useSelector(newDishesRetriever);
  console.log("populadishes:", newDishes);

  return (
    <div className="new-products-frame">
      {" "}
      {/**New Dishes sectional komponenti uchun umumiy div */}
      <Container>
        {" "}
        {/**new dishesga tegishli title hamda cardar uchun umumiy container */}
        <Stack className="main">
          {" "}
          {/*/* title hamda card uchun umumiy stack */}
          <Box className="category-title">Fresh Menu</Box>{" "}
          {/*sec comp ichidagi title */}
          <Stack className="cards-frame">
            {" "}
            {/*sec comp ichidagi cardlar joylashgan stack */}
            <CssVarsProvider>
              {" "}
              {/* mui joy cardidan foydalanganimiz sababli joy ga tegishli card kodini CssVarsProvider ichida yozdik */}
              {/**newDishesni uzunligini olchadik agar malumot bolsa iterate ishlaydi aks holda ekranga no products chiqadi. */}
              {newDishes.length !== 0 ? (
                newDishes.map((product: Product) => {
                  {
                    /*Newdishesni arrow function orqali iterate qildik */
                  }
                  const imagePath = `${serverApi}/${product.productImages[0]}`;
                  const sizeVolume =
                    product.productCollection === ProductCollection.DISH
                      ? product.productVolume + "l"
                      : product.productSize + "size";
                  return (
                    <Card
                      key={product._id}
                      variant="outlined"
                      className={"card"}
                    >
                      {" "}
                      {/*sec comp ichidagi cardlar joylashgan stack ichidagi card */}
                      <CardOverflow>
                        <div className="product-sale">{sizeVolume}</div>{" "}
                        {/* Cardlar ichida joylashgan normal-size */}
                        {/*Aspect ratio carga kiritilayotgan rasmning tomonklar orasidagi nisbati yani 1:1 kvadrat holatda bolsin*/}
                        <AspectRatio ratio="1">
                          <img src={imagePath} alt="" />
                        </AspectRatio>
                      </CardOverflow>
                      <CardOverflow variant="soft" className="product-detail">
                        {" "}
                        {/*Cardlarning pstgi qismida wiews ,narx uchun yaratilgan joy cardi */}
                        <Stack className="info">
                          {" "}
                          {/*Cardlarning pstgi qismida wiews ,narx uchun yaratilgan joy cardi ichida umumiy stack yaratib oldik */}
                          <Stack flexDirection={"row"}>
                            {" "}
                            {/*product name va narxi uchun umumiy stack */}
                            <Typography className={"title"}>
                              {" "}
                              {/*Mahsulot nomi */}
                              {product.productName}
                            </Typography>
                            <Divider width="2" height="24" bg="#d9d9d9" />{" "}
                            {/*Ozimiz yaratib olgan devider componentimizni chaqirdik.u product name va narxi orasidagi divider bilan ajratib turibdi */}
                            <Typography className={"price"}>
                              ${product.productPrice}
                            </Typography>{" "}
                            {/*Mahsulot narxi */}
                          </Stack>
                          <Stack>
                            {" "}
                            {/* mahsulot haqidagi korishlar soni va koz iconini oz ichiga olgan stack */}
                            <Typography className={"views"}>
                              {product.productViews}
                              <VisibilityIcon
                                sx={{ fontSize: 20, marginLeft: "5px" }}
                              />
                            </Typography>
                          </Stack>
                        </Stack>
                      </CardOverflow>
                    </Card>
                  );
                })
              ) : (
                <Box className="no-data">New Products are not available!</Box>
              )}
            </CssVarsProvider>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
