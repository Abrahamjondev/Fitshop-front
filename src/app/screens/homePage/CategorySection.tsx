import React from "react";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import CheckroomRoundedIcon from "@mui/icons-material/CheckroomRounded";
import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import SelfImprovementRoundedIcon from "@mui/icons-material/SelfImprovementRounded";
import WatchRoundedIcon from "@mui/icons-material/WatchRounded";
import SportsMmaRoundedIcon from "@mui/icons-material/SportsMmaRounded";
import TerrainRoundedIcon from "@mui/icons-material/TerrainRounded";
import { ProductCategory } from "../../../lib/enums/product.enum";

const c = {
  ink: "#0E1116",
  muted: "#444C58",
  emerald: "#0E7C5A",
  border: "#E6E8EC",
};

const categories = [
  { value: ProductCategory.NUTRITION, label: "Nutrition", desc: "Fuel & supplements", Icon: RestaurantRoundedIcon },
  { value: ProductCategory.APPAREL, label: "Apparel", desc: "Training wear", Icon: CheckroomRoundedIcon },
  { value: ProductCategory.SHOES, label: "Shoes", desc: "Performance footwear", Icon: DirectionsRunRoundedIcon },
  { value: ProductCategory.EQUIPMENT, label: "Equipment", desc: "Gym & weights", Icon: FitnessCenterRoundedIcon },
  { value: ProductCategory.RECOVERY, label: "Recovery", desc: "Rest & mobility", Icon: SelfImprovementRoundedIcon },
  { value: ProductCategory.TECH, label: "Tech", desc: "Wearables & gear", Icon: WatchRoundedIcon },
  { value: ProductCategory.COMBAT, label: "Combat", desc: "Fight & boxing", Icon: SportsMmaRoundedIcon },
  { value: ProductCategory.OUTDOOR, label: "Outdoor", desc: "Trail & open air", Icon: TerrainRoundedIcon },
];

export default function CategorySection() {
  const history = useHistory();

  const openCategory = (collection: ProductCategory) => {
    history.push("/products", { collection });
  };

  return (
    <Box component="section" sx={{ bgcolor: "#FFFFFF", py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: { xs: 4, md: 5 } }}>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: c.emerald,
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              "&::before": {
                content: '""',
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: c.emerald,
                boxShadow: "0 0 10px #12A074",
              },
            }}
          >
            Shop by category
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: "'Clash Display', sans-serif",
              color: c.ink,
              fontSize: { xs: 34, md: 46 },
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Find your discipline
          </Typography>
          <Typography sx={{ color: c.muted, fontSize: 15, fontWeight: 500 }}>
            Jump straight to the gear built for how you train
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 2, md: 2.5 }}>
          {categories.map(({ value, label, desc, Icon }) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={label}>
              <Box
                role="button"
                tabIndex={0}
                onClick={() => openCategory(value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") openCategory(value);
                }}
                sx={{
                  cursor: "pointer",
                  height: "100%",
                  p: { xs: 2.5, md: 3 },
                  borderRadius: "20px",
                  bgcolor: "#FFFFFF",
                  border: `1px solid ${c.border}`,
                  boxShadow:
                    "0 1px 2px rgba(14,17,22,0.04), 0 12px 30px -18px rgba(14,17,22,0.12)",
                  transition: "all 420ms cubic-bezier(0.32,0.72,0,1)",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    borderColor: "rgba(14,124,90,0.45)",
                    boxShadow:
                      "0 1px 2px rgba(14,17,22,0.05), 0 26px 50px -24px rgba(14,124,90,0.4)",
                  },
                  "&:hover .cat-icon": {
                    bgcolor: c.emerald,
                    color: "#FFFFFF",
                  },
                  "&:hover .cat-arrow": {
                    transform: "translateX(4px)",
                    color: c.emerald,
                  },
                }}
              >
                <Stack spacing={2}>
                  <Box
                    className="cat-icon"
                    sx={{
                      width: 52,
                      height: 52,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "14px",
                      color: c.emerald,
                      bgcolor: "rgba(14,124,90,0.1)",
                      transition: "all 420ms cubic-bezier(0.32,0.72,0,1)",
                    }}
                  >
                    <Icon />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        color: c.ink,
                        fontWeight: 700,
                        fontSize: 18,
                        lineHeight: 1.2,
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      sx={{ color: c.muted, fontSize: 13, fontWeight: 500 }}
                    >
                      {desc}
                    </Typography>
                  </Box>
                  <Typography
                    className="cat-arrow"
                    sx={{
                      color: c.muted,
                      fontSize: 14,
                      fontWeight: 600,
                      transition: "all 360ms cubic-bezier(0.32,0.72,0,1)",
                    }}
                  >
                    Shop →
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
