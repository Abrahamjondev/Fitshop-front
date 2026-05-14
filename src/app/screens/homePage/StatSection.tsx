import React, { useEffect, useRef, useState } from "react";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";

const fitShopColors = {
  bg: "#0E0E10",
  surface: "#17171A",
  card: "#1F1F23",
  border: "#2F2F36",
  accent: "#BA7517",
  text: "#FAEEDA",
  textMuted: "#a1a1aa",
};

const stats = [
  {
    value: 50,
    suffix: "K+",
    label: "Fit Athletes",
    Icon: PeopleAltRoundedIcon,
  },
  {
    value: 2,
    suffix: "K+",
    label: "Premium Items",
    Icon: Inventory2RoundedIcon,
  },
  {
    value: 24,
    suffix: "/7",
    label: "Fast Support",
    Icon: SupportAgentRoundedIcon,
  },
  {
    value: 200,
    suffix: "+",
    label: "Destinations",
    Icon: PublicRoundedIcon,
  },
];

interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
  Icon: typeof PeopleAltRoundedIcon;
}

function StatCard({ value, suffix, label, Icon }: StatCardProps) {
  const [count, setCount] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const startedAt = performance.now();
        const duration = 1300;

        const tick = (time: number) => {
          const progress = Math.min((time - startedAt) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(value * eased));

          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [value]);

  return (
    <Box
      ref={cardRef}
      sx={{
        height: "100%",
        p: { xs: 3, md: 3.5 },
        border: `1px solid ${fitShopColors.border}`,
        borderRadius: "16px",
        background:
          "linear-gradient(145deg, rgba(31,31,35,0.98), rgba(23,23,26,0.96))",
        boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
        transition: "transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease",
        "&:hover": {
          transform: "translateY(-6px) scale(1.02)",
          borderColor: fitShopColors.accent,
          boxShadow: "0 26px 60px rgba(186,117,23,0.18)",
        },
      }}
    >
      <Stack spacing={2.25} alignItems="center" textAlign="center">
        <Box
          sx={{
            width: 58,
            height: 58,
            display: "grid",
            placeItems: "center",
            borderRadius: "16px",
            color: fitShopColors.accent,
            background: "rgba(186,117,23,0.12)",
            border: "1px solid rgba(186,117,23,0.24)",
          }}
        >
          <Icon fontSize="large" />
        </Box>
        <Typography
          component="div"
          sx={{
            color: fitShopColors.text,
            fontSize: { xs: 38, md: 44 },
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {count}
          {suffix}
        </Typography>
        <Typography
          sx={{
            color: fitShopColors.textMuted,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>
      </Stack>
    </Box>
  );
}

export default function StatSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        background: fitShopColors.bg,
      }}
    >
      <Container>
        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={stat.label}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
