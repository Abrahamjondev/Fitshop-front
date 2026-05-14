import React, { CSSProperties, useMemo } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

const heroTitle = "BUILD STRENGTH.";
const heroAccent = "MOVE FASTER.";
const heroDescription = "Premium training gear for modern athletes";

const particleSeeds = [
  { left: 8, top: 72, size: 5, delay: 0, duration: 7, drift: -18 },
  { left: 18, top: 44, size: 8, delay: 0.8, duration: 9, drift: 22 },
  { left: 32, top: 80, size: 4, delay: 1.5, duration: 6, drift: 12 },
  { left: 48, top: 36, size: 7, delay: 0.2, duration: 8, drift: -26 },
  { left: 66, top: 68, size: 6, delay: 1.9, duration: 7.5, drift: 18 },
  { left: 84, top: 42, size: 10, delay: 2.4, duration: 10, drift: -10 },
];

export default function HeroSection() {
  const titleLetters = useMemo(() => heroTitle.split(""), []);
  const accentLetters = useMemo(() => heroAccent.split(""), []);

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        bgcolor: "#0E0E10",
        color: "#FAEEDA",
        py: { xs: 9, md: 13 },
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 72% 34%, rgba(186,117,23,0.24), transparent 34%), linear-gradient(135deg, #0E0E10 0%, #17171A 100%)",
        }}
      />
      <Box className="hero-particles" aria-hidden="true">
        {particleSeeds.map((particle, index) => (
          <span
            className="hero-particle"
            key={index}
            style={
              {
                "--particle-left": `${particle.left}%`,
                "--particle-top": `${particle.top}%`,
                "--particle-size": `${particle.size}px`,
                "--particle-delay": `${particle.delay}s`,
                "--particle-duration": `${particle.duration}s`,
                "--particle-drift": `${particle.drift}px`,
              } as CSSProperties
            }
          />
        ))}
      </Box>
      <Container sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={3} sx={{ maxWidth: 760 }}>
          <Typography
            sx={{
              color: "#BA7517",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {heroDescription}
          </Typography>
          <Typography
            component="h1"
            sx={{
              display: "flex",
              flexDirection: "column",
              color: "#FAEEDA",
              fontSize: { xs: 44, md: 76 },
              fontWeight: 900,
              lineHeight: 0.95,
            }}
          >
            <span>
              {titleLetters.map((char, index) => (
                <span
                  className="title-letter"
                  key={`${char}-${index}`}
                  style={{ animationDelay: `${index * 0.045}s` }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
            <span>
              {accentLetters.map((char, index) => (
                <span
                  className="title-letter"
                  key={`${char}-${index}`}
                  style={{ animationDelay: `${0.62 + index * 0.045}s` }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          </Typography>
          <Typography sx={{ color: "#a1a1aa", maxWidth: 540, fontSize: 18 }}>
            High-performance essentials with an athletic edge, built for daily
            discipline and serious motion.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              component={NavLink}
              to="/products"
              variant="contained"
              sx={{
                bgcolor: "#BA7517",
                color: "#FAEEDA",
                borderRadius: "12px",
                px: 4,
                py: 1.4,
                fontWeight: 800,
                "&:hover": { bgcolor: "#9A6012" },
              }}
            >
              Shop Now
            </Button>
            <Button
              component={NavLink}
              to="/products"
              variant="outlined"
              sx={{
                borderColor: "#BA7517",
                color: "#FAEEDA",
                borderRadius: "12px",
                px: 4,
                py: 1.4,
                fontWeight: 800,
                "&:hover": { bgcolor: "rgba(186,117,23,0.12)" },
              }}
            >
              Explore
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
