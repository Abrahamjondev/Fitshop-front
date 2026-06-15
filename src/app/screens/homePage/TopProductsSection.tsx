import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { setTopProducts } from "./homeSlice";
import { retrieveTopProducts } from "./homeSelector";
import ProductService from "../../services/ProductService";
import { ProductCategory } from "../../../lib/enums/product.enum";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";
import {
  getProductImage,
  isProductAvailable,
  formatPrice,
} from "../../../lib/utils";
import {
  sweetTopSmallSuccessAlert,
  sweetTopSmallErrorAlert,
} from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import useWishlist from "../../hooks/useWishlist";

interface TopProductsSectionProps {
  onAddToCart?: (item: CartItem) => void;
}

const TOP_PRODUCTS_LIMIT = 4;

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setTopProducts: (data: Product[]) => dispatch(setTopProducts(data)),
});

const topProductsRetriever = createSelector(
  retrieveTopProducts,
  (topProducts) => ({ topProducts }),
);

function getCategoryColor(category?: string) {
  const colors: Record<string, string> = {
    NUTRITION: "#10b981",
    APPAREL: "#3b82f6",
    SHOES: "#a855f7",
    EQUIPMENT: "#f97316",
    RECOVERY: "#ec4899",
    TECH: "#06b6d4",
    COMBAT: "#ef4444",
    OUTDOOR: "#84cc16",
  };

  return colors[category || ""] || "#0E7C5A";
}

function formatWeight(weight?: number | null) {
  if (!weight) return null;

  if (weight < 1000) return `${weight}g`;

  const kilograms = weight / 1000;
  return `${Number.isInteger(kilograms) ? kilograms : kilograms.toFixed(1)}kg`;
}

function getProductDimension(product: Product) {
  const category = String(product.productCollection);
  const weight = formatWeight(Number(product.productWeight) || 0);
  const size =
    product.productSize && product.productSize !== "N/A"
      ? String(product.productSize).replace("_", " ")
      : null;

  if (
    category === ProductCategory.NUTRITION ||
    category === ProductCategory.RECOVERY ||
    category === ProductCategory.EQUIPMENT
  ) {
    return weight || size || "Standard";
  }

  return size || weight || "Standard";
}

function ProductSkeleton() {
  return (
    <Box sx={{ bgcolor: "#F4F5F7", borderRadius: 2, overflow: "hidden" }}>
      <Skeleton variant="rectangular" height={250} sx={{ bgcolor: "#E5E7EB" }} />
      <Stack spacing={1.2} sx={{ p: 2 }}>
        <Skeleton height={30} sx={{ bgcolor: "#E5E7EB" }} />
        <Skeleton width="60%" sx={{ bgcolor: "#E5E7EB" }} />
        <Skeleton height={32} sx={{ bgcolor: "#E5E7EB" }} />
        <Skeleton height={42} sx={{ bgcolor: "#E5E7EB", borderRadius: 1 }} />
      </Stack>
    </Box>
  );
}

export default function TopProductsSection({
  onAddToCart,
}: TopProductsSectionProps) {
  const history = useHistory();
  const { authMember } = useGlobals();
  const { setTopProducts } = actionDispatch(useDispatch());
  const { topProducts } = useSelector(topProductsRetriever);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    setErrorMessage("");

    const product = new ProductService();
    product
      .getProducts({
        page: 1,
        limit: TOP_PRODUCTS_LIMIT,
        order: "createdAt",
      })
      .then((data) => setTopProducts(data.list))
      .catch((err) => {
        console.error("Error, TopProducts:", err);
        setErrorMessage("Failed to load products from backend.");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddToCart = (product: Product) => {
    if (!onAddToCart || !isProductAvailable(product)) return;

    // Login bo'lmagan foydalanuvchi savatga qo'sha olmaydi
    if (!authMember) {
      sweetTopSmallErrorAlert("Please login to add items to your basket!", 1500);
      return;
    }

    onAddToCart({
      _id: product._id,
      name: product.productName,
      price: product.productPrice,
      image: product.productImages?.[0] || "",
      quantity: 1,
    });
    sweetTopSmallSuccessAlert("Added to basket!", 1200);
  };

  return (
    <Box sx={{ bgcolor: "#FFFFFF", py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Box>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  mb: 1.5,
                  color: "#0E7C5A",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  "&::before": {
                    content: '""',
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "#0E7C5A",
                    boxShadow: "0 0 10px #12A074",
                  },
                }}
              >
                Curated Catalog
              </Typography>
              <Typography
                component="h2"
                sx={{
                  fontFamily: "'Clash Display', sans-serif",
                  color: "#0E1116",
                  mb: 1,
                  fontSize: { xs: 34, md: 46 },
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                Top Products
              </Typography>
              <Typography
                sx={{ color: "#444C58", fontSize: 15, fontWeight: 500 }}
              >
                Engineered selections for every discipline
              </Typography>
            </Box>
            <Button
              onClick={() => history.push("/products")}
              sx={{
                height: 48,
                px: 3,
                border: "1px solid rgba(14, 17, 22, 0.16)",
                color: "#0E1116",
                borderRadius: "999px",
                fontWeight: 600,
                fontSize: 14,
                textTransform: "none",
                transition: "all 360ms cubic-bezier(0.32,0.72,0,1)",
                "&:hover": {
                  borderColor: "rgba(14, 124, 90, 0.55)",
                  bgcolor: "rgba(14, 124, 90, 0.08)",
                  color: "#12A074",
                  transform: "translateY(-2px)",
                },
              }}
            >
              View all products&nbsp;→
            </Button>
          </Stack>

          {loading ? (
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {Array.from({ length: TOP_PRODUCTS_LIMIT }).map((_, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <ProductSkeleton />
                </Grid>
              ))}
            </Grid>
          ) : errorMessage ? (
            <Alert
              severity="error"
              sx={{
                bgcolor: "rgba(239, 68, 68, 0.1)",
                color: "#0E1116",
                border: "1px solid #ef4444",
                borderRadius: 2,
              }}
            >
              {errorMessage}
            </Alert>
          ) : topProducts.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography sx={{ color: "#444C58", fontSize: 18 }}>
                Products coming soon...
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {topProducts.map((product) => {
                const available = isProductAvailable(product);
                const wished = isInWishlist(product._id);
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product._id}>
                    <Card
                      onClick={() => history.push(`/products/${product._id}`)}
                      sx={{
                        bgcolor: "#FFFFFF",
                        border: "1px solid #E6E8EC",
                        borderRadius: "20px",
                        position: "relative",
                        transition: "all 460ms cubic-bezier(0.32,0.72,0,1)",
                        cursor: "pointer",
                        overflow: "hidden",
                        boxShadow:
                          "0 1px 2px rgba(14,17,22,0.04), 0 12px 30px -18px rgba(14,17,22,0.12)",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          borderColor: "rgba(14, 124, 90, 0.45)",
                          boxShadow:
                            "0 1px 2px rgba(14,17,22,0.05), 0 28px 54px -24px rgba(14,17,22,0.20)",
                        },
                        "&:hover .product-img": { transform: "scale(1.06)" },
                      }}
                    >
                      <Chip
                        label={
                          available
                            ? String(product.productCollection)
                            : "OUT OF STOCK"
                        }
                        size="small"
                        icon={
                          <Box
                            sx={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              ml: "10px !important",
                              bgcolor: available
                                ? getCategoryColor(
                                    String(product.productCollection),
                                  )
                                : "#a1a1aa",
                            }}
                          />
                        }
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          zIndex: 2,
                          height: 26,
                          bgcolor: "rgba(14, 17, 22, 0.6)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255,255,255,0.14)",
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: 10.5,
                          letterSpacing: "0.04em",
                          "& .MuiChip-label": { px: 1, pl: 0.75 },
                        }}
                      />

                      <IconButton
                        aria-label={
                          wished ? "Remove from wishlist" : "Add to wishlist"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product._id);
                        }}
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          zIndex: 2,
                          width: 38,
                          height: 38,
                          bgcolor: "rgba(255,255,255,0.82)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(14,17,22,0.08)",
                          color: wished ? "#ef4444" : "#0E1116",
                          boxShadow: "0 6px 18px -8px rgba(14,17,22,0.45)",
                          transition: "all 320ms cubic-bezier(0.32,0.72,0,1)",
                          "&:hover": {
                            bgcolor: "#FFFFFF",
                            color: "#ef4444",
                            transform: "scale(1.08)",
                          },
                        }}
                      >
                        {wished ? (
                          <FavoriteRoundedIcon sx={{ fontSize: 19 }} />
                        ) : (
                          <FavoriteBorderRoundedIcon sx={{ fontSize: 19 }} />
                        )}
                      </IconButton>

                      <CardMedia
                        className="product-img"
                        component="img"
                        height="250"
                        image={getProductImage(product)}
                        alt={product.productName}
                        onError={(
                          event: React.SyntheticEvent<HTMLImageElement>,
                        ) => {
                          event.currentTarget.src = "/icons/noimage-list.svg";
                        }}
                        sx={{
                          objectFit: "cover",
                          bgcolor: "#FFFFFF",
                          minHeight: 250,
                          transformOrigin: "center",
                          transition:
                            "transform 620ms cubic-bezier(0.32,0.72,0,1)",
                        }}
                      />

                      <CardContent>
                        <Typography
                          component="h3"
                          sx={{
                            color: "#0E1116",
                            mb: 0.5,
                            fontSize: 20,
                            fontWeight: 800,
                            lineHeight: 1.25,
                          }}
                        >
                          {product.productName}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#444C58",
                            fontSize: 12,
                            fontWeight: 500,
                            mb: 1,
                          }}
                        >
                          FitShop
                        </Typography>

                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 2 }}
                        >
                          <Typography
                            sx={{
                              color: "#0E7C5A",
                              fontWeight: 700,
                              fontSize: 18,
                            }}
                          >
                            {formatPrice(product.productPrice)}
                          </Typography>
                          <Typography sx={{ color: "#0E7C5A", fontSize: 12 }}>
                            {product.productViews ?? 0} views
                          </Typography>
                        </Stack>

                        <Typography
                          sx={{
                            color: "#444C58",
                            fontSize: 12,
                            fontWeight: 500,
                            mb: 2,
                          }}
                        >
                          {getProductDimension(product)}
                        </Typography>

                        <Button
                          fullWidth
                          variant="contained"
                          disableElevation
                          disabled={!available}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          endIcon={
                            available ? (
                              <Box
                                className="cart-arrow"
                                sx={{
                                  width: 26,
                                  height: 26,
                                  display: "grid",
                                  placeItems: "center",
                                  borderRadius: "50%",
                                  bgcolor: "rgba(255,255,255,0.22)",
                                  transition:
                                    "transform 360ms cubic-bezier(0.32,0.72,0,1)",
                                }}
                              >
                                <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
                              </Box>
                            ) : null
                          }
                          sx={{
                            height: 48,
                            pl: 2.5,
                            pr: 0.75,
                            justifyContent: "space-between",
                            background:
                              "linear-gradient(135deg, #12A074 0%, #0E7C5A 52%, #0A5E44 100%)",
                            color: "#FFFFFF",
                            fontWeight: 700,
                            fontSize: 14,
                            letterSpacing: "0.02em",
                            textTransform: "none",
                            borderRadius: "999px",
                            boxShadow:
                              "inset 0 1px 0 rgba(255,255,255,0.35), 0 10px 24px -12px rgba(14, 124, 90,0.8)",
                            transition: "all 360ms cubic-bezier(0.32,0.72,0,1)",
                            "&:hover": {
                              filter: "brightness(1.05)",
                              transform: "translateY(-1px)",
                            },
                            "&:hover .cart-arrow": {
                              transform: "translateX(3px)",
                            },
                            "&:active": { transform: "scale(0.98)" },
                            "& .MuiButton-endIcon": { ml: 1 },
                            "&.Mui-disabled": {
                              background: "rgba(14, 17, 22,0.06)",
                              color: "#71717a",
                              boxShadow: "none",
                              justifyContent: "center",
                            },
                          }}
                        >
                          {available ? "Add to Cart" : "Out of Stock"}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
