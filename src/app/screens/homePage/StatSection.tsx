import React, { useEffect, useRef, useState } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import MemberService from "../../services/MemberService";
import { formatStat } from "../../../lib/utils";

const fitShopColors = {
  bg: "#F6F7F9",
  accent: "#0E7C5A",
  text: "#0E1116",
  textMuted: "#444C58",
};

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

/** Backend javobi kelguncha (yoki xato bo'lsa) ko'rsatiladigan zaxira holat */
const fallbackStats: Stat[] = [
  { value: 0, suffix: "+", label: "Fit Athletes" },
  { value: 0, suffix: "+", label: "Premium Items" },
  { value: 24, suffix: "/7", label: "Fast Support" },
  { value: 0, suffix: "+", label: "Orders Delivered" },
];

interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
  index: number;
}

function StatCard({ value, suffix, label, index }: StatCardProps) {
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
        position: "relative",
        height: "100%",
        p: { xs: 2.5, md: 2.75 },
        border: "1px solid #E6E8EC",
        borderRadius: "18px",
        background: "#FFFFFF",
        overflow: "hidden",
        boxShadow:
          "0 1px 2px rgba(14,17,22,0.04), 0 12px 30px -18px rgba(14,17,22,0.14)",
        transition: "all 460ms cubic-bezier(0.32,0.72,0,1)",
        // Yuqori chetda yashil "machined" highlight chizig'i
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(14,124,90,0.45), transparent)",
          opacity: 0,
          transition: "opacity 460ms cubic-bezier(0.32,0.72,0,1)",
        },
        "&:hover": {
          transform: "translateY(-5px)",
          borderColor: "rgba(14, 124, 90, 0.4)",
          boxShadow:
            "0 1px 2px rgba(14,17,22,0.05), 0 24px 48px -22px rgba(14,17,22,0.18)",
        },
        "&:hover::before": { opacity: 1 },
        "&:hover .stat-accent": { width: 44 },
      }}
    >
      <Typography
        component="div"
        sx={{
          fontFamily: "'Space Mono', monospace",
          color: fitShopColors.accent,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.16em",
          mb: { xs: 1.25, md: 1.75 },
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </Typography>

      <Typography
        component="div"
        sx={{
          fontFamily: "'Clash Display', sans-serif",
          color: fitShopColors.text,
          fontSize: { xs: 34, md: 42 },
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        {count}
        {suffix}
      </Typography>

      <Box
        className="stat-accent"
        sx={{
          height: "3px",
          width: 24,
          mt: 1.5,
          mb: 1.25,
          borderRadius: "999px",
          background: "linear-gradient(90deg, #12A074, #0E7C5A)",
          transition: "width 520ms cubic-bezier(0.32,0.72,0,1)",
        }}
      />

      <Typography
        sx={{
          fontFamily: "'Space Mono', monospace",
          color: fitShopColors.textMuted,
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export default function StatSection() {
  const [stats, setStats] = useState<Stat[]>(fallbackStats);

  useEffect(() => {
    const service = new MemberService();
    service
      .getStats()
      .then((data) => {
        setStats([
          { ...formatStat(data.athletes), label: "Fit Athletes" },
          { ...formatStat(data.products), label: "Premium Items" },
          // 24/7 — bu hisob emas, statik qoladi
          { value: 24, suffix: "/7", label: "Fast Support" },
          { ...formatStat(data.orders), label: "Orders Delivered" },
        ]);
      })
      .catch((err) => console.error("Error, loadStats:", err));
  }, []);

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 3.5, md: 4.5 },
        background: fitShopColors.bg,
      }}
    >
      <Container>
        <Grid container spacing={2}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 6, lg: 3 }} key={stat.label}>
              <StatCard {...stat} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
