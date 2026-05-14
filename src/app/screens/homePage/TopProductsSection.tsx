import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import {
  ProductCategory,
  ProductStatus,
} from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";

interface TopProductsSectionProps {
  onAddToCart?: (item: CartItem) => void;
}

const TOP_PRODUCTS_LIMIT = 4;

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
    DISH: "#f97316",
    SALAD: "#10b981",
    DESERT: "#ec4899",
    DRINK: "#06b6d4",
    OTHER: "#BA7517",
  };

  return colors[category || ""] || "#BA7517";
}

function getProductsFromPayload(payload: any): Product[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.products)) return payload.products;
  return [];
}

function getTopProducts(payload: any): Product[] {
  return getProductsFromPayload(payload)
    .filter((product) => product.productStatus === ProductStatus.ACTIVE)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, TOP_PRODUCTS_LIMIT);
}

function getImagePath(product: Product) {
  return product.productImages?.[0]
    ? `${serverApi}/${product.productImages[0]}`
    : "/icons/noimage-list.svg";
}

function formatWeight(weight?: number | null) {
  if (!weight) return null;

  if (weight < 1000) return `${weight}g`;

  const kilograms = weight / 1000;
  return `${Number.isInteger(kilograms) ? kilograms : kilograms.toFixed(1)}kg`;
}

function getProductDimension(product: Product) {
  const category = String(product.productCollection);
  const weight = formatWeight(product.productWeight);
  const size = product.productSize?.replace("_", " ");

  if (
    category === ProductCategory.NUTRITION ||
    category === ProductCategory.RECOVERY ||
    category === ProductCategory.EQUIPMENT
  ) {
    return weight || size || "Standard";
  }

  if (
    category === ProductCategory.APPAREL ||
    category === ProductCategory.SHOES ||
    category === ProductCategory.COMBAT ||
    category === ProductCategory.OUTDOOR ||
    category === ProductCategory.TECH
  ) {
    return size || weight || "Standard";
  }

  if (product.productVolume) return `${product.productVolume}L`;

  return size || weight || "Standard";
}

function logProductDimension(product: Product) {
  console.log("[TopProducts DIMENSION]", {
    productId: product._id,
    category: product.productCollection,
    size: product.productSize,
    weight: product.productWeight,
    display: getProductDimension(product),
  });
}

function ProductSkeleton() {
  return (
    <Box sx={{ bgcolor: "#1F1F23", borderRadius: 2, overflow: "hidden" }}>
      <Skeleton variant="rectangular" height={250} sx={{ bgcolor: "#2F2F36" }} />
      <Stack spacing={1.2} sx={{ p: 2 }}>
        <Skeleton height={30} sx={{ bgcolor: "#2F2F36" }} />
        <Skeleton width="60%" sx={{ bgcolor: "#2F2F36" }} />
        <Skeleton height={32} sx={{ bgcolor: "#2F2F36" }} />
        <Skeleton height={42} sx={{ bgcolor: "#2F2F36", borderRadius: 1 }} />
      </Stack>
    </Box>
  );
}

export default function TopProductsSection({
  onAddToCart,
}: TopProductsSectionProps) {
  const history = useHistory();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setErrorMessage("");

    console.log("[TopProducts DEBUG] API URL:", serverApi);
    console.log("[TopProducts DEBUG] Primary endpoint:", `${serverApi}/products`);

    try {
      const response = await axios.get(`${serverApi}/products`, {
        params: {
          limit: TOP_PRODUCTS_LIMIT,
          status: ProductStatus.ACTIVE,
          sort: "-createdAt",
        },
      });

      const receivedProducts = getTopProducts(response.data);

      console.log("[TopProducts DEBUG] Primary status:", response.status);
      console.log("[TopProducts DEBUG] Primary data:", response.data);
      console.log("[TopProducts DEBUG] Products count:", receivedProducts.length);
      receivedProducts.forEach(logProductDimension);
      setProducts(receivedProducts);
    } catch (primaryError: any) {
      console.error("[TopProducts DEBUG] Primary endpoint failed:", primaryError);
      console.error("[TopProducts DEBUG] Primary status:", primaryError.response?.status);
      console.error("[TopProducts DEBUG] Primary message:", primaryError.message);
      console.error("[TopProducts DEBUG] Primary URL tried:", primaryError.config?.url);

      try {
        const fallbackUrl = `${serverApi}/product/all`;
        console.log("[TopProducts DEBUG] Fallback endpoint:", fallbackUrl);

        const fallbackResponse = await axios.get(fallbackUrl, {
          params: {
            limit: TOP_PRODUCTS_LIMIT,
            page: 1,
            order: "createdAt",
            productStatus: ProductStatus.ACTIVE,
          },
        });

        const fallbackProducts = getTopProducts(fallbackResponse.data);

        console.log("[TopProducts DEBUG] Fallback status:", fallbackResponse.status);
        console.log("[TopProducts DEBUG] Fallback data:", fallbackResponse.data);
        console.log(
          "[TopProducts DEBUG] Fallback products count:",
          fallbackProducts.length,
        );
        fallbackProducts.forEach(logProductDimension);
        setProducts(fallbackProducts);
      } catch (fallbackError: any) {
        console.error("[TopProducts DEBUG] Fallback endpoint failed:", fallbackError);
        console.error(
          "[TopProducts DEBUG] Fallback status:",
          fallbackError.response?.status,
        );
        console.error("[TopProducts DEBUG] Fallback message:", fallbackError.message);
        console.error("[TopProducts DEBUG] Fallback URL tried:", fallbackError.config?.url);
        setProducts([]);
        setErrorMessage("Failed to load products from backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!onAddToCart) return;

    onAddToCart({
      _id: product._id,
      name: product.productName,
      price: product.productPrice,
      image: product.productImages?.[0] || "",
      quantity: 1,
    });
  };

  return (
    <Box sx={{ bgcolor: "#0E0E10", py: { xs: 6, md: 8 } }}>
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
                component="h2"
                sx={{
                  color: "#FAEEDA",
                  mb: 1,
                  fontSize: { xs: 32, md: 40 },
                  fontWeight: 800,
                }}
              >
                Top Products
              </Typography>
              <Typography sx={{ color: "#a1a1aa" }}>
                Engineered selections for every discipline
              </Typography>
            </Box>
            <Button
              onClick={() => history.push("/products")}
              variant="outlined"
              sx={{
                borderColor: "#BA7517",
                color: "#BA7517",
                borderRadius: "12px",
                fontWeight: 700,
                "&:hover": { bgcolor: "rgba(186, 117, 23, 0.1)" },
              }}
            >
              View All Products
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
                color: "#FAEEDA",
                border: "1px solid #ef4444",
                borderRadius: 2,
              }}
            >
              {errorMessage}
            </Alert>
          ) : products.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography sx={{ color: "#a1a1aa", fontSize: 18 }}>
                Products coming soon...
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {products.map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product._id}>
                  <Card
                    sx={{
                      bgcolor: "#1F1F23",
                      border: "1px solid #2F2F36",
                      borderRadius: 2,
                      position: "relative",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        borderColor: "#BA7517",
                        boxShadow: "0 10px 25px rgba(186, 117, 23, 0.2)",
                      },
                    }}
                  >
                    <Chip
                      label={String(product.productCollection)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        bgcolor: getCategoryColor(String(product.productCollection)),
                        color: "#FAEEDA",
                        zIndex: 1,
                        fontWeight: 700,
                      }}
                    />

                    <Button
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        minWidth: "auto",
                        width: 36,
                        height: 36,
                        bgcolor: "rgba(0,0,0,0.5)",
                        color: "#BA7517",
                        "&:hover": { bgcolor: "rgba(186, 117, 23, 0.2)" },
                        zIndex: 1,
                      }}
                    >
                      {"♡"}
                    </Button>

                    <CardMedia
                      component="img"
                      height="250"
                      image={getImagePath(product)}
                      alt={product.productName}
                      onError={(event: React.SyntheticEvent<HTMLImageElement>) => {
                        event.currentTarget.src = "/icons/noimage-list.svg";
                      }}
                      sx={{
                        objectFit: "cover",
                        bgcolor: "#0E0E10",
                        minHeight: 250,
                      }}
                    />

                    <CardContent>
                      <Typography
                        component="h3"
                        sx={{
                          color: "#FAEEDA",
                          mb: 0.5,
                          fontSize: 20,
                          fontWeight: 800,
                          lineHeight: 1.25,
                        }}
                      >
                        {product.productName}
                      </Typography>

                      <Typography sx={{ color: "#a1a1aa", fontSize: 12, mb: 1 }}>
                        {product.productBrand || "FitShop"}
                      </Typography>

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2 }}
                      >
                        <Typography
                          sx={{ color: "#BA7517", fontWeight: 700, fontSize: 18 }}
                        >
                          {product.productPrice?.toLocaleString()} UZS
                        </Typography>
                        <Typography sx={{ color: "#BA7517", fontSize: 12 }}>
                          Rating 4.5
                        </Typography>
                      </Stack>

                      <Typography sx={{ color: "#a1a1aa", fontSize: 12, mb: 2 }}>
                        {getProductDimension(product)}
                      </Typography>

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleAddToCart(product)}
                        sx={{
                          bgcolor: "#BA7517",
                          color: "#FAEEDA",
                          fontWeight: 700,
                          borderRadius: 1,
                          "&:hover": { bgcolor: "#9A6012" },
                        }}
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
