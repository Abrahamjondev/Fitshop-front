import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Footers = styled.footer`
  width: 100%;
  position: relative;
  background: #f6f7f9;
  border-top: 1px solid #e6e8ec;

  &::before {
    content: "";
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(14, 124, 90, 0.5),
      transparent
    );
  }
`;

const colors = {
  bg: "#FFFFFF",
  borderSoft: "rgba(14, 124, 90, 0.1)",
  socialBg: "rgba(14, 124, 90, 0.1)",
  socialBorder: "rgba(14, 124, 90, 0.2)",
  accent: "#0E7C5A",
  accentHover: "#12A074",
  text: "#0E1116",
  textMuted: "#444C58",
};

// Faqat mavjud routelarga yo'naltiramiz
const shopLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "My Orders", to: "/orders" },
  { label: "My Page", to: "/member-page" },
];

const supportLinks = [
  { label: "Contact Us", to: "/help" },
  { label: "FAQ", to: "/help" },
  { label: "Terms & Privacy", to: "/help" },
];

const socialLinks = [
  { label: "Facebook", icon: "/icons/facebook.svg", href: "#" },
  { label: "Twitter/X", icon: "/icons/twitter.svg", href: "#" },
  { label: "Instagram", icon: "/icons/instagram.svg", href: "#" },
  { label: "YouTube", icon: "/icons/youtube.svg", href: "#" },
];

const linkStyles = {
  width: "fit-content",
  color: colors.textMuted,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: 14,
  lineHeight: 1.6,
  textDecoration: "none",
  transition: "color 0.2s ease",
  "&:hover": {
    color: colors.accentHover,
  },
};

const sectionTitleStyles = {
  mb: 3,
  color: colors.text,
  fontFamily: "'Clash Display', sans-serif",
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: "1px",
  lineHeight: 1.2,
  textTransform: "uppercase",
};

export default function Footer() {
  return (
    <Footers>
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 3, lg: 4 },
          py: { xs: 5, md: 6, lg: 8 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            columnGap: { md: 5, lg: 6 },
            rowGap: { xs: 4, md: 4 },
            alignItems: "start",
          }}
        >
          <Box sx={{ gridColumn: { xs: "auto", md: "1", lg: "auto" } }}>
            <Typography
              component="h2"
              sx={{
                mb: 1.5,
                fontFamily: "'Clash Display', sans-serif",
                fontSize: 24,
                fontWeight: 700,
                lineHeight: 1.2,
                color: colors.text,
              }}
            >
              Fit
              <Box component="span" sx={{ color: colors.accent }}>
                Shop
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 280,
                color: colors.textMuted,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              Shop premium sports gear, training essentials, and fitness equipment
              built for everyday athletes. FitShop helps you move, train, and recover
              with confidence.
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
              {socialLinks.map((social) => (
                <Box
                  key={social.label}
                  component="a"
                  href={social.href}
                  aria-label={social.label}
                  sx={{
                    width: 32,
                    height: 32,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "6px",
                    border: `1px solid ${colors.socialBorder}`,
                    background: colors.socialBg,
                    transition:
                      "background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
                    "& img": {
                      width: 16,
                      height: 16,
                      display: "block",
                      transition: "filter 0.2s ease",
                    },
                    "&:hover": {
                      background: colors.accent,
                      borderColor: colors.accent,
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 16px rgba(14, 124, 90, 0.24)",
                    },
                    "&:hover img": {
                      filter: "brightness(0) invert(1)",
                    },
                  }}
                >
                  <img alt="" src={social.icon} />
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ gridColumn: { xs: "auto", md: "1", lg: "auto" } }}>
            <Typography component="h3" sx={sectionTitleStyles}>
              Shop
            </Typography>
            <Stack spacing={1.5}>
              {shopLinks.map((link) => (
                <Box key={link.label} component={Link} to={link.to} sx={linkStyles}>
                  {link.label}
                </Box>
              ))}
            </Stack>
          </Box>

          <Box
            sx={{
              gridColumn: { xs: "auto", md: "2", lg: "auto" },
              gridRow: { xs: "auto", md: "1 / span 2", lg: "auto" },
            }}
          >
            <Typography component="h3" sx={sectionTitleStyles}>
              Support
            </Typography>
            <Stack spacing={1.5}>
              {supportLinks.map((link) => (
                <Box key={link.label} component={Link} to={link.to} sx={linkStyles}>
                  {link.label}
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>

        <Box
          sx={{
            height: "1px",
            my: { xs: 4, md: 6 },
            background: colors.borderSoft,
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              color: colors.textMuted,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 12,
              lineHeight: 1.6,
            }}
          >
            © Copyright FitShop. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={4}>
            <Box component={Link} to="/help" sx={{ ...linkStyles, fontSize: 12 }}>
              Terms of Service
            </Box>
            <Box component={Link} to="/help" sx={{ ...linkStyles, fontSize: 12 }}>
              Privacy Policy
            </Box>
          </Stack>
        </Box>
      </Container>
    </Footers>
  );
}
