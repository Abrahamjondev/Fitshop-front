import React, { FormEvent, useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MemberService from "../../services/MemberService";

const c = {
  ink: "#0E1116",
  white: "#FFFFFF",
  emerald: "#0E7C5A",
  emeraldDeep: "#0A5E44",
  emeraldBright: "#12A074",
};

const perks = ["Early access", "Exclusive previews", "Launch-day offers"];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ComingSoonSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage(null);
      await new MemberService().subscribe(trimmed);
      setMessage({ type: "success", text: "You're on the FitShop launch list." });
      setEmail("");
    } catch (err: any) {
      const text =
        err?.response?.data?.message ??
        "Could not subscribe right now. Please try again.";
      setMessage({ type: "error", text });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="section"
      sx={{ bgcolor: c.white, py: { xs: 6, md: 9 }, px: { xs: 2, md: 3 } }}
    >
      <Container maxWidth="lg" disableGutters>
        {/* Dadil emerald panel */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: "28px", md: "36px" },
            px: { xs: 3, sm: 5, md: 9 },
            py: { xs: 6, md: 10 },
            background: `linear-gradient(135deg, ${c.emeraldBright} 0%, ${c.emerald} 46%, ${c.emeraldDeep} 100%)`,
            boxShadow: "0 40px 80px -40px rgba(10,94,68,0.7)",
          }}
        >
          {/* Dekor: konsentrik "track-lane" arklar */}
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage:
                "repeating-radial-gradient(circle at 100% 0%, transparent 0 86px, rgba(255,255,255,0.07) 86px 88px)",
              maskImage:
                "radial-gradient(120% 120% at 100% 0%, #000 30%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(120% 120% at 100% 0%, #000 30%, transparent 75%)",
            }}
          />
          {/* Dekor: yumshoq oq nur */}
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              top: "-30%",
              right: "-10%",
              width: 420,
              height: 420,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.22), transparent 68%)",
              pointerEvents: "none",
            }}
          />

          <Stack spacing={3} sx={{ position: "relative", maxWidth: 720 }}>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                color: "rgba(255,255,255,0.85)",
                fontFamily: "'Space Mono', monospace",
                fontSize: 11.5,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                "&::before": {
                  content: '""',
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: "#FFFFFF",
                  boxShadow: "0 0 12px rgba(255,255,255,0.9)",
                },
              }}
            >
              Launching soon
            </Typography>

            <Typography
              component="h2"
              sx={{
                fontFamily: "'Clash Display', sans-serif",
                color: c.white,
                fontSize: { xs: 36, sm: 46, md: 60 },
                fontWeight: 600,
                lineHeight: 0.98,
                letterSpacing: "-0.02em",
              }}
            >
              Get first access
              <br />
              to the drop.
            </Typography>

            <Typography
              sx={{
                maxWidth: 520,
                color: "rgba(255,255,255,0.82)",
                fontSize: { xs: 15, md: 17 },
                lineHeight: 1.6,
              }}
            >
              Join the launch list and be first to shop new gear, limited
              releases, and members-only pricing.
            </Typography>

            {/* Email pill */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%", maxWidth: 540 }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1.5, sm: 0 }}
                sx={{
                  p: { sm: "7px" },
                  bgcolor: { sm: c.white },
                  borderRadius: { xs: 0, sm: "999px" },
                  boxShadow: { sm: "0 14px 40px -16px rgba(10,94,68,0.6)" },
                }}
              >
                <TextField
                  fullWidth
                  value={email}
                  type="email"
                  placeholder="you@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                  inputProps={{ "aria-label": "Email address" }}
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    bgcolor: c.white,
                    borderRadius: { xs: "999px", sm: 0 },
                    "& .MuiInputBase-root": { height: 52 },
                    "& input": {
                      px: 3,
                      color: c.ink,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 15,
                    },
                    "& input::placeholder": { color: "#9aa1ab", opacity: 1 },
                  }}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  sx={{
                    flexShrink: 0,
                    height: 52,
                    px: 3.5,
                    borderRadius: "999px",
                    background: c.ink,
                    color: c.white,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    transition: "all 360ms cubic-bezier(0.32,0.72,0,1)",
                    "&:hover": {
                      background: "#000000",
                      transform: "translateY(-1px)",
                    },
                    "&.Mui-disabled": { color: "rgba(255,255,255,0.6)" },
                  }}
                >
                  {isSubmitting ? "Joining…" : "Notify me  →"}
                </Button>
              </Stack>

              {message ? (
                <Typography
                  role="status"
                  sx={{
                    mt: 1.5,
                    fontSize: 13.5,
                    fontWeight: 500,
                    color: message.type === "success" ? "#FFFFFF" : "#FFE0E0",
                  }}
                >
                  {message.type === "success" ? "✓ " : "• "}
                  {message.text}
                </Typography>
              ) : null}
            </Box>

            {/* Perks */}
            <Stack
              direction="row"
              flexWrap="wrap"
              sx={{ gap: { xs: 1.5, sm: 3 }, pt: 1 }}
            >
              {perks.map((label) => (
                <Stack
                  key={label}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}
                >
                  <Box
                    sx={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      bgcolor: "#FFFFFF",
                    }}
                  />
                  <span>{label}</span>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
