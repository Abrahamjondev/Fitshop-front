import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useHistory } from "react-router-dom";
import { Product } from "../../../lib/types/product";
import WishlistService from "../../services/WishlistService";
import {
  formatPrice,
  getProductImage,
  isProductAvailable,
} from "../../../lib/utils";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
  sweetTopSmallErrorAlert,
} from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import { CartItem } from "../../../lib/types/search";

interface WishlistPageProps {
  onAdd: (item: CartItem) => void;
}

const ITEMS_PER_PAGE = 8;

const c = {
  ink: "#0E1116",
  muted: "#444C58",
  emerald: "#0E7C5A",
  border: "#E6E8EC",
};

export default function WishlistPage({ onAdd }: WishlistPageProps) {
  const history = useHistory();
  const { authMember } = useGlobals();
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  // Server-side pagination — har sahifa alohida so'rov
  const loadWishlist = (targetPage: number) => {
    const service = new WishlistService();
    return service
      .getWishlist(targetPage, ITEMS_PER_PAGE)
      .then((data) => {
        setItems(data.list);
        setTotal(data.total);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Login talab qilinadi — mehmon /'ga yo'naltiriladi
    if (!authMember) {
      history.push("/");
      return;
    }
    loadWishlist(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authMember, page]);

  /** HANDLERS **/
  const handlePageChange = (value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeHandler = async (productId: string) => {
    try {
      const wasLastOnPage = items.length === 1 && page > 1;
      // Optimistik o'chirish — UI darhol javob beradi
      setItems((prev) => prev.filter((p) => p._id !== productId));
      setTotal((t) => Math.max(0, t - 1));
      await new WishlistService().toggle(productId);
      // Serverdan qayta yuklab, sahifani keyingi mahsulot bilan to'ldiramiz
      if (wasLastOnPage) setPage((p) => p - 1);
      else loadWishlist(page);
    } catch (err) {
      console.error(err);
      sweetErrorHandling(err).then();
      loadWishlist(page);
    }
  };

  const addToCartHandler = (product: Product) => {
    if (!isProductAvailable(product)) return;
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

  if (!authMember) return null;

  return (
    <Box
      component="section"
      sx={{
        minHeight: "80vh",
        background:
          "radial-gradient(circle at 12% 6%, rgba(14,124,90,0.16), transparent 28%)," +
          "linear-gradient(180deg, #FFFFFF 0%, #F4F5F7 54%, #FFFFFF 100%)",
        py: { xs: 6, md: 9 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Stack spacing={1} sx={{ mb: { xs: 4, md: 5 } }}>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "fit-content",
              px: 1.6,
              py: 0.9,
              borderRadius: "999px",
              border: "1px solid rgba(14,124,90,0.38)",
              bgcolor: "rgba(14,124,90,0.12)",
              color: c.emerald,
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            FitShop Wishlist
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontFamily: "'Clash Display', sans-serif",
              color: c.ink,
              fontSize: { xs: 36, md: 52 },
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.04,
            }}
          >
            Your saved products
          </Typography>
          <Typography
            sx={{ color: c.muted, fontSize: 15, fontWeight: 500 }}
          >
            {total > 0
              ? `${total} item${total > 1 ? "s" : ""} ready when you are`
              : "Tap the heart on any product to keep it here"}
          </Typography>
        </Stack>

        {loading ? (
          <Stack alignItems="center" sx={{ py: 8 }}>
            <CircularProgress sx={{ color: c.emerald }} />
          </Stack>
        ) : total === 0 ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{
              minHeight: 320,
              borderRadius: "20px",
              border: `1px solid ${c.border}`,
              bgcolor: "#FFFFFF",
              boxShadow:
                "0 1px 2px rgba(14,17,22,0.04), 0 18px 40px -26px rgba(14,17,22,0.14)",
              p: 4,
              textAlign: "center",
            }}
          >
            <FavoriteRoundedIcon sx={{ fontSize: 46, color: "rgba(14,124,90,0.3)" }} />
            <Typography sx={{ color: c.ink, fontSize: 20, fontWeight: 800 }}>
              Your wishlist is empty
            </Typography>
            <Typography sx={{ color: c.muted, fontSize: 14, fontWeight: 500 }}>
              Browse the catalog and save the gear you love.
            </Typography>
            <Button
              onClick={() => history.push("/products")}
              sx={{
                mt: 1,
                px: 3,
                height: 46,
                borderRadius: "999px",
                background:
                  "linear-gradient(135deg, #12A074 0%, #0E7C5A 52%, #0A5E44 100%)",
                color: "#FFFFFF",
                fontWeight: 800,
                textTransform: "none",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.35), 0 12px 26px -14px rgba(14,124,90,0.8)",
                "&:hover": { filter: "brightness(1.05)" },
              }}
            >
              Browse products
            </Button>
          </Stack>
        ) : (
          <>
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {items.map((product) => {
              const available = isProductAvailable(product);
              return (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product._id}>
                  <Card
                    onClick={() => history.push(`/products/${product._id}`)}
                    sx={{
                      bgcolor: "#FFFFFF",
                      border: `1px solid ${c.border}`,
                      borderRadius: "20px",
                      position: "relative",
                      cursor: "pointer",
                      overflow: "hidden",
                      transition: "all 460ms cubic-bezier(0.32,0.72,0,1)",
                      boxShadow:
                        "0 1px 2px rgba(14,17,22,0.04), 0 12px 30px -18px rgba(14,17,22,0.12)",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        borderColor: "rgba(14,124,90,0.45)",
                        boxShadow:
                          "0 1px 2px rgba(14,17,22,0.05), 0 28px 54px -24px rgba(14,17,22,0.2)",
                      },
                    }}
                  >
                    <Chip
                      label={
                        available
                          ? String(product.productCollection)
                          : "OUT OF STOCK"
                      }
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        zIndex: 2,
                        height: 26,
                        bgcolor: "rgba(14,17,22,0.6)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.14)",
                        color: "#FFFFFF",
                        fontWeight: 700,
                        fontSize: 10.5,
                        letterSpacing: "0.04em",
                      }}
                    />
                    <IconButton
                      aria-label="Remove from wishlist"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeHandler(product._id);
                      }}
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        zIndex: 2,
                        width: 38,
                        height: 38,
                        bgcolor: "rgba(255,255,255,0.85)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(14,17,22,0.08)",
                        color: "#ef4444",
                        boxShadow: "0 6px 18px -8px rgba(14,17,22,0.45)",
                        transition: "all 320ms cubic-bezier(0.32,0.72,0,1)",
                        "&:hover": {
                          bgcolor: "#FFFFFF",
                          transform: "scale(1.08)",
                        },
                      }}
                    >
                      <FavoriteRoundedIcon sx={{ fontSize: 19 }} />
                    </IconButton>

                    <CardMedia
                      component="img"
                      height="250"
                      image={getProductImage(product)}
                      alt={product.productName}
                      onError={(
                        event: React.SyntheticEvent<HTMLImageElement>,
                      ) => {
                        event.currentTarget.src = "/icons/noimage-list.svg";
                      }}
                      sx={{ objectFit: "cover", bgcolor: "#FFFFFF", minHeight: 250 }}
                    />

                    <CardContent>
                      <Typography
                        component="h3"
                        sx={{
                          color: c.ink,
                          mb: 1,
                          fontSize: 18,
                          fontWeight: 800,
                          lineHeight: 1.3,
                          minHeight: 48,
                        }}
                      >
                        {product.productName}
                      </Typography>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2 }}
                      >
                        <Typography
                          sx={{ color: c.emerald, fontWeight: 900, fontSize: 19 }}
                        >
                          {formatPrice(product.productPrice)}
                        </Typography>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                          sx={{ color: c.muted, fontSize: 13, fontWeight: 700 }}
                        >
                          <RemoveRedEyeIcon
                            sx={{ fontSize: 15, color: c.emerald }}
                          />
                          {product.productViews ?? 0}
                        </Stack>
                      </Stack>
                      <Button
                        fullWidth
                        disableElevation
                        disabled={!available}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCartHandler(product);
                        }}
                        startIcon={<AddShoppingCartIcon sx={{ fontSize: 18 }} />}
                        sx={{
                          height: 46,
                          borderRadius: "999px",
                          background:
                            "linear-gradient(135deg, #12A074 0%, #0E7C5A 52%, #0A5E44 100%)",
                          color: "#FFFFFF",
                          fontWeight: 800,
                          fontSize: 14,
                          textTransform: "none",
                          boxShadow:
                            "inset 0 1px 0 rgba(255,255,255,0.35), 0 12px 26px -14px rgba(14,124,90,0.8)",
                          transition: "all 320ms cubic-bezier(0.32,0.72,0,1)",
                          "&:hover": {
                            filter: "brightness(1.05)",
                            transform: "translateY(-1px)",
                          },
                          "&.Mui-disabled": {
                            background: "rgba(14,17,22,0.06)",
                            color: "#9AA1AB",
                            boxShadow: "none",
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

            {totalPages > 1 ? (
              <Stack alignItems="center" sx={{ mt: { xs: 4, md: 5 } }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => handlePageChange(value)}
                  shape="rounded"
                  variant="outlined"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#0E1116",
                      borderColor: "#E6E8EC",
                      fontWeight: 700,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    },
                    "& .MuiPaginationItem-root:hover": {
                      borderColor: "rgba(14,124,90,0.5)",
                      backgroundColor: "rgba(14,124,90,0.08)",
                    },
                    "& .Mui-selected": {
                      backgroundImage:
                        "linear-gradient(135deg, #12A074 0%, #0E7C5A 52%, #0A5E44 100%) !important",
                      color: "#FFFFFF !important",
                      borderColor: "transparent !important",
                    },
                  }}
                />
              </Stack>
            ) : null}
          </>
        )}
      </Container>
    </Box>
  );
}
