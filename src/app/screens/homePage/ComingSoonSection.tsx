import React, { FormEvent, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const fitShopColors = {
  bg: "#0E0E10",
  surface: "#17171A",
  card: "#1F1F23",
  border: "#2F2F36",
  accent: "#BA7517",
  accentHover: "#ffb869",
  text: "#FAEEDA",
  textMuted: "#a1a1aa",
  success: "#10b981",
};

const trustBadges = [
  "Early Access",
  "Exclusive Previews",
  "Special Launch Offers",
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ComingSoonSection() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidEmail(email.trim())) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    setMessage({
      type: "success",
      text: "You are on the FitShop launch list.",
    });
    setEmail("");
  };

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: { xs: 5, md: 7.5, lg: 10 },
        px: { xs: 2, sm: 3, md: 4 },
        background:
          "radial-gradient(circle at 50% 0%, rgba(186,117,23,0.12), transparent 34%), #0E0E10",
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Box
          sx={{
            maxWidth: 1000,
            mx: "auto",
            textAlign: "center",
            "@keyframes orbitSweep": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
            "@keyframes barRise": {
              "0%, 100%": { transform: "scaleY(0.45)", opacity: 0.48 },
              "50%": { transform: "scaleY(1)", opacity: 1 },
            },
            "@keyframes pulseCore": {
              "0%, 100%": {
                transform: "scale(0.96)",
                boxShadow: "0 0 0 0 rgba(186,117,23,0.28)",
              },
              "50%": {
                transform: "scale(1.02)",
                boxShadow: "0 0 0 18px rgba(186,117,23,0)",
              },
            },
            "@keyframes lineDrift": {
              "0%, 100%": { transform: "translateX(-8px)", opacity: 0.35 },
              "50%": { transform: "translateX(8px)", opacity: 0.72 },
            },
          }}
        >
          <Typography
            sx={{
              color: fitShopColors.accent,
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Something exciting is brewing
          </Typography>

          <Typography
            component="h2"
            sx={{
              mt: 2,
              color: fitShopColors.text,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: { xs: 32, md: 40, lg: 48 },
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Coming Soon
          </Typography>

          <Box
            aria-hidden="true"
            sx={{
              position: "relative",
              width: { xs: 180, sm: 230, md: 280 },
              height: { xs: 180, sm: 230, md: 280 },
              mx: "auto",
              my: { xs: 3, md: 4 },
              display: "grid",
              placeItems: "center",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: "10%",
                borderRadius: "50%",
                border: `1px solid ${fitShopColors.border}`,
                background:
                  "linear-gradient(135deg, rgba(31,31,35,0.8), rgba(14,14,16,0.4))",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: "2%",
                borderRadius: "50%",
                borderTop: `1px solid ${fitShopColors.accent}`,
                borderRight: "1px solid rgba(186,117,23,0.08)",
                borderBottom: "1px solid rgba(250,238,218,0.08)",
                borderLeft: "1px solid rgba(186,117,23,0.18)",
                animation: "orbitSweep 7s linear infinite",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: "20%",
                borderRadius: "50%",
                borderTop: "1px solid rgba(250,238,218,0.18)",
                borderRight: "1px solid rgba(186,117,23,0.26)",
                borderBottom: `1px solid ${fitShopColors.border}`,
                borderLeft: "1px solid rgba(250,238,218,0.08)",
                animation: "orbitSweep 9s linear infinite reverse",
              }}
            />
            <Stack
              direction="row"
              spacing={{ xs: 1, md: 1.4 }}
              alignItems="center"
              justifyContent="center"
              sx={{
                position: "relative",
                zIndex: 1,
                width: { xs: 110, md: 150 },
                height: { xs: 92, md: 118 },
                px: { xs: 1.4, md: 2 },
                borderRadius: "16px",
                border: `1px solid ${fitShopColors.border}`,
                background:
                  "linear-gradient(180deg, rgba(31,31,35,0.96), rgba(23,23,26,0.92))",
                boxShadow: "0 28px 70px rgba(0,0,0,0.34)",
                animation: "pulseCore 4s ease-in-out infinite",
              }}
            >
              {[0, 1, 2, 3, 4].map((item) => (
                <Box
                  key={item}
                  sx={{
                    width: { xs: 10, md: 14 },
                    height: { xs: 64, md: 84 },
                    borderRadius: "999px",
                    transformOrigin: "bottom",
                    background:
                      item === 2
                        ? `linear-gradient(180deg, ${fitShopColors.accentHover}, ${fitShopColors.accent})`
                        : "linear-gradient(180deg, rgba(250,238,218,0.34), rgba(186,117,23,0.46))",
                    animation: `barRise ${3 + item * 0.25}s ease-in-out infinite`,
                    animationDelay: `${item * 0.16}s`,
                  }}
                />
              ))}
            </Stack>
            {[0, 1, 2].map((item) => (
              <Box
                key={item}
                sx={{
                  position: "absolute",
                  left: `${12 + item * 15}%`,
                  right: `${18 + item * 8}%`,
                  top: `${27 + item * 18}%`,
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(186,117,23,0.58), transparent)",
                  animation: "lineDrift 4.4s ease-in-out infinite",
                  animationDelay: `${item * 0.55}s`,
                }}
              />
            ))}
          </Box>

          <Typography
            sx={{
              maxWidth: 620,
              mx: "auto",
              color: fitShopColors.text,
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              lineHeight: 1.6,
            }}
          >
            Premium gear. Carefully curated. Coming to FitShop.
          </Typography>
          <Typography
            sx={{
              mt: 1,
              color: fitShopColors.textMuted,
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          ></Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: 560 },
              mx: "auto",
              mt: 4,
            }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                fullWidth
                value={email}
                type="email"
                placeholder="Enter your email"
                onChange={(event) => setEmail(event.target.value)}
                inputProps={{ "aria-label": "Email address" }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 52,
                    borderRadius: "8px",
                    color: fitShopColors.text,
                    fontFamily: "'Inter', sans-serif",
                    background: fitShopColors.card,
                    transition:
                      "border-color 300ms ease, box-shadow 300ms ease, transform 300ms ease",
                    "& fieldset": {
                      borderColor: fitShopColors.border,
                      transition: "border-color 300ms ease",
                    },
                    "&:hover fieldset": { borderColor: fitShopColors.accent },
                    "&.Mui-focused": {
                      transform: "scale(1.01)",
                      boxShadow: "0 0 0 4px rgba(186,117,23,0.2)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: fitShopColors.accent,
                    },
                  },
                  "& input": { px: 2 },
                  "& input::placeholder": {
                    color: fitShopColors.textMuted,
                    opacity: 1,
                  },
                }}
              />
              <Button
                type="submit"
                sx={{
                  px: 4,
                  height: 52,
                  minWidth: { xs: "100%", sm: 164 },
                  borderRadius: "8px",
                  color: fitShopColors.bg,
                  background: fitShopColors.accent,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0px",
                  whiteSpace: "nowrap",
                  transition:
                    "transform 200ms ease, background 200ms ease, box-shadow 200ms ease",
                  "&:hover": {
                    background: fitShopColors.accentHover,
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 16px rgba(186,117,23,0.3)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                    boxShadow: "none",
                  },
                }}
              >
                NOTIFY ME
              </Button>
            </Stack>
          </Box>

          {message ? (
            <Alert
              severity={message.type}
              sx={{
                width: "100%",
                maxWidth: 560,
                mx: "auto",
                mt: 2,
                borderRadius: "8px",
                color:
                  message.type === "success"
                    ? fitShopColors.success
                    : undefined,
                background: fitShopColors.card,
                border: `1px solid ${
                  message.type === "success" ? fitShopColors.success : "#ef4444"
                }`,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {message.text}
            </Alert>
          ) : null}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2.5 }}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 3 }}
          >
            {trustBadges.map((label) => (
              <Stack
                key={label}
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  color: fitShopColors.textMuted,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: fitShopColors.accent,
                    boxShadow: "0 0 12px rgba(186,117,23,0.65)",
                  }}
                />
                <span>{label}</span>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
