import React, { useEffect } from "react";
import { Container, Stack, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setRestaurant, setChosenProduct } from "./slice";
import { createSelector } from "reselect";
import { retrieveChosenProduct, retrieveRestaurant } from "./selector";
import { Product } from "../../../lib/types/product";
import { useParams } from "react-router-dom";
import ProductService from "../../services/ProductService";
import MemberService from "../../services/MemberService";
import { Member } from "../../../lib/types/member";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import ts from "typescript";

/** REDUX SLICE & SELECTOR */

const actionDispatch = (dispatch: Dispatch) => ({
  setRestaurant: (data: Member) => dispatch(setRestaurant(data)),
  setChosenProduct: (data: Product) => dispatch(setChosenProduct(data)),
});

const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({
    chosenProduct,
  }),
);

const restaurantRetriever = createSelector(
  retrieveRestaurant,
  (restaurant) => ({
    restaurant,
  }),
);

interface ChosenProductProps {
  onAdd: (item: CartItem) => void;
}

function formatChosenMeta(product: Product) {
  if (product.productVolume) return `${product.productVolume}L`;
  if (product.productWeight) {
    const weight = Number(product.productWeight);
    return weight >= 1000 ? `${weight / 1000}kg` : `${weight}g`;
  }
  return product.productSize
    ? String(product.productSize).replace("_", " ")
    : "Standard";
}

function formatPrice(price: number) {
  return `${price?.toLocaleString()} UZS`;
}

export default function ChosenProduct(props: ChosenProductProps) {
  const { onAdd } = props;
  const { productId } = useParams<{ productId: string }>();
  const { setRestaurant, setChosenProduct } = actionDispatch(useDispatch());
  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { restaurant } = useSelector(restaurantRetriever);
  const productImages =
    (chosenProduct?.productImages?.length || 0) > 0
      ? chosenProduct?.productImages || []
      : ["icons/noimage-list.svg"];

  useEffect(() => {
    const product = new ProductService();
    product
      .getProduct(productId)
      .then((data) => setChosenProduct(data))
      .catch((err) => console.log(err));

    const member = new MemberService();
    member
      .getRestaurant()
      .then((data) => setRestaurant(data))
      .catch((err) => console.log(err));
  }, []);

  if (!chosenProduct) return null;
  return (
    <div className={"chosen-product"}>
      <Box className="chosen-product-head">
        <span className="chosen-kicker">FitShop Product</span>
        <Box className={"title"}>Product detail</Box>
      </Box>
      <Container className={"product-container"}>
        <Stack className={"chosen-product-slider"}>
          <Swiper
            loop={productImages.length > 1}
            spaceBetween={10}
            navigation={true}
            modules={[Navigation]}
            className="swiper-area"
          >
            {productImages.map((ele: string, index: number) => {
              const imagePath = ele.startsWith("icons/")
                ? `/${ele}`
                : `${serverApi}/${ele}`;
              return (
                <SwiperSlide key={index}>
                  <img
                    className="slider-image"
                    src={imagePath}
                    alt={`${chosenProduct.productName} ${index + 1}`}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Stack>
        <Stack className={"chosen-product-info"}>
          <Box className={"info-box"}>
            <strong className={"product-name"}>
              {chosenProduct?.productName}
            </strong>
            <Stack className="detail-chip-row">
              <span className={"resto-name"}>
                {chosenProduct.productBrand || "FitShop"}
              </span>
              <span className={"resto-name"}>
                {formatChosenMeta(chosenProduct)}
              </span>
              <span className={"resto-name"}>{restaurant?.memberPhone}</span>
            </Stack>
            <Box className={"rating-box"}>
              <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
              <div className={"evaluation-box"}>
                <div className={"product-view"}>
                  <RemoveRedEyeIcon sx={{ mr: "10px" }} />
                  <span>{chosenProduct?.productViews}</span>
                </div>
              </div>
            </Box>
            <p className={"product-desc"}>
              {chosenProduct?.productDesc
                ? chosenProduct?.productDesc
                : "No description"}
            </p>
            <div className={"product-price"}>
              <span>Price:</span>
              <span>{formatPrice(chosenProduct.productPrice)}</span>
            </div>
            <div className={"button-box"}>
              <Button
                variant="contained"
                startIcon={<AddShoppingCartIcon />}
                onClick={(e) => {
                  onAdd({
                    _id: chosenProduct._id,
                    name: chosenProduct.productName,
                    price: chosenProduct.productPrice,
                    image: chosenProduct.productImages?.[0] || "",
                    quantity: 1,
                  });
                  e.stopPropagation();
                }}
              >
                Add To Basket
              </Button>
            </div>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
