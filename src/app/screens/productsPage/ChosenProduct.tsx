import React, { useEffect, useState } from "react";
import {
  Container,
  Stack,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import Button from "@mui/material/Button";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setShop, setChosenProduct } from "./slice";
import { createSelector } from "reselect";
import { retrieveChosenProduct, retrieveShop } from "./selector";
import { Product } from "../../../lib/types/product";
import { useParams } from "react-router-dom";
import ProductService from "../../services/ProductService";
import MemberService from "../../services/MemberService";
import { Member } from "../../../lib/types/member";
import { serverApi } from "../../../lib/config";
import { isProductAvailable, formatPrice } from "../../../lib/utils";
import {
  sweetTopSmallSuccessAlert,
  sweetTopSmallErrorAlert,
} from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import { CartItem } from "../../../lib/types/search";
import ProductReviews from "./ProductReviews";
import useWishlist from "../../hooks/useWishlist";

/** REDUX SLICE & SELECTOR */

const actionDispatch = (dispatch: Dispatch) => ({
  setShop: (data: Member) => dispatch(setShop(data)),
  setChosenProduct: (data: Product | null) => dispatch(setChosenProduct(data)),
});

const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({
    chosenProduct,
  }),
);

const shopRetriever = createSelector(retrieveShop, (shop) => ({
  shop,
}));

interface ChosenProductProps {
  onAdd: (item: CartItem) => void;
}

function formatChosenMeta(product: Product) {
  if (product.productWeight) {
    const weight = Number(product.productWeight);
    return weight >= 1000 ? `${weight / 1000}kg` : `${weight}g`;
  }
  return product.productSize && product.productSize !== "N/A"
    ? String(product.productSize).replace("_", " ")
    : "Standard";
}

export default function ChosenProduct(props: ChosenProductProps) {
  const { onAdd } = props;
  const { authMember } = useGlobals();
  const { productId } = useParams<{ productId: string }>();
  const { setShop, setChosenProduct } = actionDispatch(useDispatch());
  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { shop } = useSelector(shopRetriever);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const productImages =
    (chosenProduct?.productImages?.length || 0) > 0
      ? chosenProduct?.productImages || []
      : ["icons/noimage-list.svg"];

  useEffect(() => {
    // productId o'zgarganda qayta yuklanadi; eski mahsulot tozalanadi
    setChosenProduct(null);
    setIsLoading(true);
    setLoadError(false);

    const product = new ProductService();
    product
      .getProduct(productId)
      .then((data) => setChosenProduct(data))
      .catch((err) => {
        console.error(err);
        setLoadError(true);
      })
      .finally(() => setIsLoading(false));

    const member = new MemberService();
    member
      .getShop()
      .then((data) => setShop(data))
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  /** HANDLERS **/
  const addToCartHandler = (product: Product) => {
    if (!isProductAvailable(product)) return;

    // Login bo'lmagan foydalanuvchi savatga qo'sha olmaydi
    if (!authMember) {
      sweetTopSmallErrorAlert("Please login to add items to your basket!", 1500);
      return;
    }

    onAdd({
      _id: product._id,
      name: product.productName,
      price: product.productPrice,
      image: product.productImages?.[0] || "",
      quantity: 1,
    });
    sweetTopSmallSuccessAlert("Added to basket!", 1200);
  };

  if (isLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "50vh" }}
      >
        <CircularProgress sx={{ color: "#0E7C5A" }} />
      </Stack>
    );
  }

  if (loadError || !chosenProduct) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "50vh", color: "#5B6470" }}
      >
        Product not found or unavailable.
      </Stack>
    );
  }

  const available = isProductAvailable(chosenProduct);

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
                {formatChosenMeta(chosenProduct)}
              </span>
              {shop?.memberPhone ? (
                <span className={"resto-name"}>{shop.memberPhone}</span>
              ) : null}
              <span className={"resto-name"}>
                {available
                  ? `${chosenProduct.productLeftCount} in stock`
                  : "Out of stock"}
              </span>
            </Stack>
            <Box className={"rating-box"}>
              <div className={"evaluation-box"}>
                <div className={"product-view"}>
                  <RemoveRedEyeIcon sx={{ mr: "10px" }} />
                  <span>{chosenProduct?.productViews} views</span>
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
                disabled={!available}
                onClick={() => addToCartHandler(chosenProduct)}
              >
                {available ? "Add To Basket" : "Out of Stock"}
              </Button>
              <IconButton
                aria-label={
                  isInWishlist(chosenProduct._id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                onClick={() => toggleWishlist(chosenProduct._id)}
                sx={{
                  ml: 1.5,
                  width: 52,
                  height: 52,
                  bgcolor: "#FFFFFF",
                  color: isInWishlist(chosenProduct._id)
                    ? "#ef4444"
                    : "#0E1116",
                  border: "1px solid rgba(14, 17, 22, 0.12)",
                  boxShadow: "0 6px 18px -10px rgba(14,17,22,0.4)",
                  transition: "all 320ms cubic-bezier(0.32,0.72,0,1)",
                  "&:hover": {
                    color: "#ef4444",
                    borderColor: "rgba(239,68,68,0.4)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {isInWishlist(chosenProduct._id) ? (
                  <FavoriteRoundedIcon />
                ) : (
                  <FavoriteBorderRoundedIcon />
                )}
              </IconButton>
            </div>
          </Box>
        </Stack>
        <ProductReviews productId={productId} />
      </Container>
    </div>
  );
}
