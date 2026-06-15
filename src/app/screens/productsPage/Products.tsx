import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Box, Button, Container, IconButton, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import {
  Product,
  ProductInquiry,
  ProductsResult,
} from "../../../lib/types/product";
import { createSelector } from "reselect";
import { retrieveProducts, retrieveProductsTotal } from "./selector";
import { setProducts } from "./slice";
import ProductService from "../../services/ProductService";
import { ProductCategory } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { isProductAvailable, formatPrice } from "../../../lib/utils";
import {
  sweetTopSmallSuccessAlert,
  sweetTopSmallErrorAlert,
} from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory, useLocation } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import useWishlist from "../../hooks/useWishlist";

/**.REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: ProductsResult) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(
  retrieveProducts,
  retrieveProductsTotal,
  (products, productsTotal) => ({
    products,
    productsTotal,
  }),
);

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

const productCollectionLabels: Record<ProductCategory, string> = {
  [ProductCategory.NUTRITION]: "Nutrition",
  [ProductCategory.APPAREL]: "Apparel",
  [ProductCategory.SHOES]: "Shoes",
  [ProductCategory.EQUIPMENT]: "Equipment",
  [ProductCategory.RECOVERY]: "Recovery",
  [ProductCategory.TECH]: "Tech",
  [ProductCategory.COMBAT]: "Combat",
  [ProductCategory.OUTDOOR]: "Outdoor",
};

const productCollectionOrder = [
  ProductCategory.NUTRITION,
  ProductCategory.APPAREL,
  ProductCategory.SHOES,
  ProductCategory.EQUIPMENT,
  ProductCategory.RECOVERY,
  ProductCategory.TECH,
  ProductCategory.COMBAT,
  ProductCategory.OUTDOOR,
];

const shopPlaces = [
  {
    title: "FitShop Central",
    area: "Tashkent City",
    address: "Performance gear, nutrition, and daily sport essentials",
    hours: "Mon-Sun 09:00 - 22:00",
    phone: "+998 90 123 45 67",
  },
  {
    title: "FitShop North",
    area: "Yunusabad",
    address: "Shoes, apparel, and recovery products for gym routines",
    hours: "Mon-Sat 10:00 - 21:00",
    phone: "+998 90 234 56 78",
  },
  {
    title: "FitShop West",
    area: "Chilanzar",
    address: "Protein, creatine, amino, and strength training equipment",
    hours: "Mon-Sun 09:30 - 21:30",
    phone: "+998 90 345 67 89",
  },
  {
    title: "FitShop South",
    area: "Sergeli",
    address: "Outdoor, combat, and home workout essentials",
    hours: "Mon-Sat 10:00 - 20:00",
    phone: "+998 90 456 78 90",
  },
];

function formatProductMeta(product: Product) {
  if (product.productWeight) {
    const weight = Number(product.productWeight);
    return weight >= 1000 ? `${weight / 1000}kg` : `${weight}g`;
  }
  return product.productSize && product.productSize !== "N/A"
    ? String(product.productSize).replace("_", " ")
    : "Standard";
}

function getProductImagePath(product: Product) {
  const image = product.productImages?.[0];
  if (!image) return "/icons/noimage-list.svg";
  if (image.startsWith("http")) return image;
  if (image.startsWith("/")) return `${serverApi}${image}`;
  return `${serverApi}/${image}`;
}

function getProductBrandLabel(product: Product) {
  const name = product.productName.trim();
  const firstWords = name.split(/\s+/).slice(0, 2).join(" ");
  return firstWords || "FitShop Pick";
}

/** Eng ko'p ko'rilgan mahsulotlardan har bir kategoriyadan bittadan, 4 ta */
function pickTopBrandProducts(products: Product[]) {
  return [...products]
    .sort((first, second) => (second.productViews || 0) - (first.productViews || 0))
    .reduce<Product[]>((featured, product) => {
      const alreadyAdded = featured.some(
        (item) => item.productCollection === product.productCollection,
      );
      if (!alreadyAdded && featured.length < 4) featured.push(product);
      return featured;
    }, []);
}

export default function Products(props: ProductsProps) {
  const { onAdd } = props;
  const { authMember } = useGlobals();
  const { setProducts } = actionDispatch(useDispatch());
  const { products, productsTotal } = useSelector(productsRetriever);
  const [topBrandProducts, setTopBrandProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const location = useLocation<{ collection?: ProductCategory } | undefined>();
  const [productSearch, setProductsSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
    order: "createdAt",
    search: "",
    productCollection: location.state?.collection,
  });

  const [searchText, setSearchText] = useState<string>("");
  const history = useHistory();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    setIsLoading(true);
    setLoadError(false);
    const product = new ProductService();
    product
      .getProducts(productSearch)
      .then((data) => setProducts(data))
      .catch((err) => {
        console.error(err);
        setLoadError(true);
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSearch]);

  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts({ page: 1, limit: 40, order: "productViews" })
      .then((data) => setTopBrandProducts(pickTopBrandProducts(data.list)))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (searchText === "") {
      setProductsSearch((prev) => ({ ...prev, page: 1, search: "" }));
    }
  }, [searchText]);

  const featuredBrandProducts = useMemo(
    () =>
      topBrandProducts.length > 0
        ? topBrandProducts
        : pickTopBrandProducts(products),
    [products, topBrandProducts],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(productsTotal / productSearch.limit),
  );

  /** HANDLERS **/
  const searchConnectionHandler = (collection?: ProductCategory) => {
    setProductsSearch((prev) => ({
      ...prev,
      page: 1,
      productCollection: collection,
    }));
  };

  const searchOrderHandler = (order: string) => {
    setProductsSearch((prev) => ({ ...prev, page: 1, order }));
  };

  const searchproductHandler = () => {
    setProductsSearch((prev) => ({ ...prev, page: 1, search: searchText }));
  };
  const peginationHandler = (e: ChangeEvent<any>, value: number) => {
    setProductsSearch((prev) => ({ ...prev, page: value }));
  };

  const chooseProductHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

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
  return (
    <div>
      <div className="products">
        <Container>
          <Stack flexDirection={"column"} alignItems={"center"}>
            <Stack className="avatar-big-box">
              <Box className="products-heading">
                <span className="products-kicker">FitShop Catalog</span>
                <Box className={"title"}>Performance products</Box>
                <p>
                  Search, filter, and sort essentials for training, recovery,
                  apparel, and everyday discipline.
                </p>
              </Box>
              <Box className={"single-search-big-box"}>
                <input
                  type="search"
                  className="single-search-input"
                  placeholder="Search products"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") searchproductHandler();
                  }}
                />
                <Button
                  className="single-search-button"
                  variant="contained"
                  color={"primary"}
                  onClick={searchproductHandler}
                >
                  Search
                  <SearchIcon sx={{ ml: "3px" }} />
                </Button>
              </Box>
            </Stack>
            <Stack className="dishes-filter-section">
              <Stack className="dishes-filter-box">
                <Button
                  variant="contained"
                  className={`order ${
                    productSearch.order === "createdAt" ? "active" : ""
                  }`}
                  color={
                    productSearch.order === "createdAt"
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => searchOrderHandler("createdAt")}
                >
                  NEW
                </Button>
                <Button
                  variant="contained"
                  className={`order ${
                    productSearch.order === "productPrice" ? "active" : ""
                  }`}
                  color={
                    productSearch.order === "productPrice"
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => searchOrderHandler("productPrice")}
                >
                  PRICE
                </Button>
                <Button
                  variant="contained"
                  className={`order ${
                    productSearch.order === "productViews" ? "active" : ""
                  }`}
                  color={
                    productSearch.order === "productViews"
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => searchOrderHandler("productViews")}
                >
                  VIEW
                </Button>
              </Stack>
            </Stack>
            <Stack className="list-category-section">
              <Stack className="product-category">
                <Stack className="category-main">
                  <Button
                    variant="contained"
                    className={!productSearch.productCollection ? "active" : ""}
                    color={!productSearch.productCollection ? "primary" : "secondary"}
                    onClick={() => searchConnectionHandler(undefined)}
                  >
                    All Gear
                  </Button>
                  {productCollectionOrder.map((collection) => (
                    <Button
                      key={collection}
                      variant="contained"
                      className={
                        productSearch.productCollection === collection
                          ? "active"
                          : ""
                      }
                      color={
                        productSearch.productCollection === collection
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => searchConnectionHandler(collection)}
                    >
                      {productCollectionLabels[collection]}
                    </Button>
                  ))}
                </Stack>
              </Stack>
              <Stack className="product-wrapper">
                {isLoading ? (
                  <Box className={"no-data"}>Loading products...</Box>
                ) : loadError ? (
                  <Box className={"no-data"}>
                    Failed to load products. Please try again later.
                  </Box>
                ) : products.length !== 0 ? (
                  products.map((product: Product) => {
                    const imagePath = product.productImages?.[0]
                      ? `${serverApi}/${product.productImages[0]}`
                      : "/icons/noimage-list.svg";
                    const sizeVolume = formatProductMeta(product);
                    const available = isProductAvailable(product);
                    const collectionLabel =
                      productCollectionLabels[
                        product.productCollection as ProductCategory
                      ] || String(product.productCollection);

                    return (
                      <Stack
                        key={product._id}
                        className={"product-card"}
                        onClick={() => chooseProductHandler(product._id)}
                      >
                        <Stack
                          className={"product-image"}
                          sx={{ backgroundImage: `url(${imagePath})` }}
                        >
                          <div className="product-sale">
                            {available ? collectionLabel : "OUT OF STOCK"}
                          </div>
                          <IconButton
                            aria-label={
                              isInWishlist(product._id)
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(product._id);
                            }}
                            sx={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              zIndex: 3,
                              width: 38,
                              height: 38,
                              bgcolor: "rgba(255,255,255,0.85)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(14,17,22,0.08)",
                              color: isInWishlist(product._id)
                                ? "#ef4444"
                                : "#0E1116",
                              boxShadow: "0 6px 18px -8px rgba(14,17,22,0.45)",
                              transition: "all 320ms cubic-bezier(0.32,0.72,0,1)",
                              "&:hover": {
                                bgcolor: "#FFFFFF",
                                color: "#ef4444",
                                transform: "scale(1.08)",
                              },
                            }}
                          >
                            {isInWishlist(product._id) ? (
                              <FavoriteRoundedIcon sx={{ fontSize: 19 }} />
                            ) : (
                              <FavoriteBorderRoundedIcon sx={{ fontSize: 19 }} />
                            )}
                          </IconButton>
                        </Stack>
                        <Box className={"product-desc"}>
                          <span className="product-brand">
                            {getProductBrandLabel(product)}
                          </span>
                          <span className="product-title">
                            {product.productName}
                          </span>
                          <Box className="product-meta-row">
                            <span className="product-price">
                              {formatPrice(product.productPrice)}
                            </span>
                            <span className="product-views">
                              <RemoveRedEyeIcon sx={{ fontSize: 15 }} />
                              {product.productViews ?? 0}
                            </span>
                          </Box>
                          <span className="product-size">{sizeVolume}</span>
                          <Button
                            className="add-cart-btn"
                            disabled={!available}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCartHandler(product);
                            }}
                          >
                            <AddShoppingCartIcon sx={{ fontSize: 18, mr: 1 }} />
                            {available ? "Add to Cart" : "Out of Stock"}
                          </Button>
                        </Box>
                      </Stack>
                    );
                  })
                ) : (
                  <Box className={"no-data"}>Products are not available!</Box>
                )}
              </Stack>
            </Stack>
            <Stack className="pagination-section">
              <Pagination
                count={totalPages}
                page={productSearch.page}
                renderItem={(item) => (
                  <PaginationItem
                    components={{
                      previous: ArrowBackIcon,
                      next: ArrowForwardIcon,
                    }}
                    {...item}
                    color="secondary"
                  />
                )}
                onChange={peginationHandler}
              />
            </Stack>
          </Stack>
        </Container>
      </div>

      <div className="brands-logo">
        <Container>
          <Stack className="main">
            <Box className="brands-heading">
              <span className="brands-kicker">FitShop lineup</span>
              <Box className="title">Our Top Brands</Box>
              <p>
                One standout product from each trusted brand in the store.
              </p>
            </Box>
            <Stack className="brand-cards">
                {featuredBrandProducts.length !== 0 ? (
                featuredBrandProducts.map((product) => {
                  const imagePath = getProductImagePath(product);
                  const collectionLabel =
                    productCollectionLabels[
                      product.productCollection as ProductCategory
                    ] || String(product.productCollection);

                  return (
                    <Box
                      key={product._id}
                      className="brand-card"
                      onClick={() => chooseProductHandler(product._id)}
                    >
                      <Box
                        className="brand-product-image"
                      >
                        <img
                          src={imagePath}
                          alt={product.productName}
                          onError={(event) => {
                            event.currentTarget.src = "/icons/noimage-list.svg";
                          }}
                        />
                        <span>{collectionLabel}</span>
                      </Box>
                      <Box className="brand-product-info">
                        <span className="brand-name">
                          {getProductBrandLabel(product)}
                        </span>
                        <strong>{product.productName}</strong>
                        <span className="brand-price">
                          {formatPrice(product.productPrice)}
                        </span>
                      </Box>
                      <Button
                        className="brand-shop-btn"
                        disabled={!isProductAvailable(product)}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCartHandler(product);
                        }}
                      >
                        <AddShoppingCartIcon fontSize="small" />
                      </Button>
                    </Box>
                  );
                })
              ) : (
                <Box className="brand-no-data">Top brands are loading.</Box>
              )}
            </Stack>
          </Stack>
        </Container>
      </div>

      <div className="address">
        <Container>
          <Stack className="address-main">
            <Box className="shop-places-heading">
              <span className="shop-places-kicker">Store locator</span>
              <Box className="title">Our Shop Places</Box>
              <p>
                Visit the closest FitShop branch for sports nutrition,
                footwear, apparel, and training essentials.
              </p>
            </Box>
            <Box className="shop-places-layout">
              <Box className="shop-places-list">
                {shopPlaces.map((place, index) => (
                  <Box className="shop-place-card" key={place.title}>
                    <Box className="shop-place-index">
                      {String(index + 1).padStart(2, "0")}
                    </Box>
                    <Box className="shop-place-content">
                      <Box className="shop-place-title-row">
                        <StorefrontIcon fontSize="small" />
                        <strong>{place.title}</strong>
                      </Box>
                      <span className="shop-place-area">
                        <LocationOnIcon fontSize="small" />
                        {place.area}
                      </span>
                      <p>{place.address}</p>
                      <Box className="shop-place-meta">
                        <span>
                          <AccessTimeIcon fontSize="small" />
                          {place.hours}
                        </span>
                        <span>
                          <LocalPhoneIcon fontSize="small" />
                          {place.phone}
                        </span>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box className="shop-map-card">
                <iframe
                  src="https://www.google.com/maps?q=Tashkent%20fitness%20shop&output=embed"
                  title="FitShop places map"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Box>
            </Box>
          </Stack>
        </Container>
      </div>
    </div>
  );
}
