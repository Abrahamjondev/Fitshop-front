import React, {
  CSSProperties,
  useMemo,
} from "react";
import {
  Box,
  Button,
  Container,
  ListItemIcon,
  MenuItem,
  Stack,
  Menu,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import Basket from "./Basket";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";

import { Logout } from "@mui/icons-material";

const heroTitle = "BUILD STRENGTH.";
const heroAccent = "MOVE FASTER.";

function FitShopLogo() {
  return (
    <span className="fitshop-logo" aria-label="FitShop.uz">
      <svg
        className="fitshop-mark"
        viewBox="0 0 44 44"
        role="img"
        aria-hidden="true"
      >
        <path
          d="M8 13.5C8 10.5 10.5 8 13.5 8H36L32.3 15.2H17.5C16.1 15.2 15.2 16.1 15.2 17.5V20H30.4L27 26.8H15.2V36H8V13.5Z"
          fill="currentColor"
        />
        <path
          d="M28.8 27.3H36L32.4 36H23.8L28.8 27.3Z"
          fill="currentColor"
          opacity="0.72"
        />
      </svg>
      <span className="fitshop-word">
        FitShop<span></span>
      </span>
    </span>
  );
}

const particleSeeds = [
  { left: 6, top: 77, size: 5, delay: 0, duration: 7, drift: -18 },
  { left: 12, top: 50, size: 9, delay: 0.8, duration: 9, drift: 22 },
  { left: 18, top: 72, size: 4, delay: 1.5, duration: 6, drift: 12 },
  { left: 24, top: 38, size: 7, delay: 0.2, duration: 8, drift: -26 },
  { left: 31, top: 84, size: 5, delay: 1.9, duration: 7.5, drift: 18 },
  { left: 37, top: 58, size: 10, delay: 2.4, duration: 10, drift: -10 },
  { left: 43, top: 29, size: 4, delay: 0.5, duration: 6.5, drift: 24 },
  { left: 49, top: 68, size: 8, delay: 1.2, duration: 9.5, drift: -24 },
  { left: 55, top: 46, size: 5, delay: 2.1, duration: 8.5, drift: 14 },
  { left: 61, top: 79, size: 7, delay: 0.1, duration: 7, drift: -16 },
  { left: 67, top: 34, size: 11, delay: 1.7, duration: 11, drift: 20 },
  { left: 72, top: 64, size: 5, delay: 2.8, duration: 7.2, drift: -20 },
  { left: 77, top: 23, size: 6, delay: 0.6, duration: 8.8, drift: 26 },
  { left: 82, top: 74, size: 9, delay: 1.3, duration: 10.5, drift: -12 },
  { left: 88, top: 42, size: 4, delay: 2.2, duration: 6.8, drift: 16 },
  { left: 93, top: 62, size: 7, delay: 0.4, duration: 9, drift: -28 },
  { left: 9, top: 26, size: 6, delay: 2.6, duration: 8, drift: 16 },
  { left: 29, top: 17, size: 4, delay: 1.1, duration: 7.6, drift: -18 },
  { left: 52, top: 16, size: 8, delay: 2.9, duration: 10.2, drift: 22 },
  { left: 71, top: 87, size: 5, delay: 1.8, duration: 7.4, drift: -14 },
  { left: 96, top: 28, size: 10, delay: 0.9, duration: 9.8, drift: 18 },
  { left: 39, top: 91, size: 6, delay: 2.5, duration: 8.4, drift: -22 },
  { left: 15, top: 88, size: 4, delay: 3.1, duration: 7.8, drift: 20 },
  { left: 58, top: 92, size: 7, delay: 1.6, duration: 9.1, drift: -18 },
];

interface HomeNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignupOpen: (isopen: boolean) => void;
  setLoginOpen: (isopen: boolean) => void;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: null | HTMLElement;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

export default function HomeNavbar(props: HomeNavbarProps) {
  const {
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
    setSignupOpen,
    setLoginOpen,
    handleLogoutClick,
    anchorEl,
    handleCloseLogout,
    handleLogoutRequest,
  } = props;
  const { authMember } = useGlobals();
  const titleLetters = useMemo(() => heroTitle.split(""), []);
  const accentLetters = useMemo(() => heroAccent.split(""), []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--spotlight-x",
      `${e.clientX - rect.left}px`,
    );
    e.currentTarget.style.setProperty(
      "--spotlight-y",
      `${e.clientY - rect.top}px`,
    );
  };

  /*HANDLERS*/

  return (
    <div className="home-navbar" onMouseMove={handleHeroMouseMove}>
      <div className="hero-gradient-layer" />
      <div className="hero-spotlight" />
      <div className="hero-orb hero-orb-one" />
      <div className="hero-orb hero-orb-two" />
      <div className="hero-orb hero-orb-three" />
      <div className="hero-particles" aria-hidden="true">
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
      </div>
      <div className="hero-geometry" aria-hidden="true">
        <span className="hero-ring hero-ring-one" />
        <span className="hero-ring hero-ring-two" />
        <span className="hero-slash hero-slash-one" />
        <span className="hero-slash hero-slash-two" />
      </div>
      <Container className="navbar-container">
        <Stack className="menu">
          <Box className="brand-box">
            <NavLink to={"/"} aria-label="FitShop.uz home">
              <FitShopLogo />
            </NavLink>
          </Box>
          <Stack className="links nav-links">
            <Box className={"hover-line "}>
              <NavLink to="/" activeClassName={"underline"}>
                Home
              </NavLink>
            </Box>
            <Box className={"hover-line "}>
              <NavLink to="/products" activeClassName={"underline"}>
                Products
              </NavLink>
            </Box>
            {authMember ? (
              <Box className={"hover-line "}>
                <NavLink to="/orders" activeClassName={"underline"}>
                  Orders
                </NavLink>
              </Box>
            ) : null}
            {authMember ? (
              <Box className={"hover-line "}>
                <NavLink to="/member-page" activeClassName={"underline"}>
                  My Page
                </NavLink>
              </Box>
            ) : null}
            {authMember ? (
              <Box className={"hover-line "}>
                <NavLink to="/wishlist" activeClassName={"underline"}>
                  Wishlist
                </NavLink>
              </Box>
            ) : null}
            <Box className={"hover-line "}>
              <NavLink to="/help" activeClassName={"underline"}>
                Help
              </NavLink>
            </Box>
          </Stack>
          <Stack className="header-actions">
            {/* BASKET — faqat login bo'lgan member uchun ko'rinadi */}
            {authMember ? (
              <Basket
                cartItems={cartItems}
                onAdd={onAdd}
                onRemove={onRemove}
                onDelete={onDelete}
                onDeleteAll={onDeleteAll}
              />
            ) : null}
            {!authMember ? (
              <Stack className="auth-buttons">
                <Button
                  variant="contained"
                  className="signup-button nav-signup-button"
                  onClick={() => setSignupOpen(true)}
                >
                  SIGN UP
                </Button>
                <Button
                  variant="outlined"
                  className="login-button"
                  onClick={() => setLoginOpen(true)}
                >
                  LOGIN
                </Button>
              </Stack>
            ) : (
              <img
                className="user-avatar"
                alt="Account menu"
                role="button"
                tabIndex={0}
                src={
                  authMember?.memberImage
                    ? `${serverApi}/${authMember?.memberImage}`
                    : "/icons/default-user.svg"
                }
                aria-haspopup={"true"}
                onClick={handleLogoutClick}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    handleLogoutClick(
                      event as unknown as React.MouseEvent<HTMLElement>,
                    );
                  }
                }}
              />
            )}

            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={Boolean(anchorEl)}
              onClose={handleCloseLogout}
              onClick={handleCloseLogout}
              PaperProps={{
                elevation: 0,

                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleLogoutRequest}>
                <ListItemIcon>
                  <Logout fontSize="small" style={{ color: "blue" }} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>
        <Stack className="header-frame">
          <Stack className="detail">
            <Box className="hero-kicker">Premium Training Equipment</Box>
            <Box className="head-main-txt" component="h1">
              <span className="animated-title-line">
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
              <span className="animated-title-line title-accent">
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
            </Box>
            <Box className="wel-txt">
              High-performance essentials with an athletic edge, built for daily
              discipline and serious motion.
            </Box>
            <Box className="signup hero-actions">
              <Button
                component={NavLink}
                to="/products"
                variant={"contained"}
                className={"signup-button hero-primary-button"}
              >
                SHOP NOW
              </Button>
              <Button
                component={NavLink}
                to="/products"
                variant={"outlined"}
                className={"signup-button hero-secondary-button"}
              >
                EXPLORE
              </Button>
            </Box>
          </Stack>
          <Box className="hero-visual-panel" aria-hidden="true">
            <div className="hero-visual-ring hero-visual-ring-one" />
            <div className="hero-visual-ring hero-visual-ring-two" />
            <div className="hero-visual-pulse" />
          </Box>
        </Stack>
        <div className="hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 130" preserveAspectRatio="none">
            <path
              className="wave-back"
              d="M0,88 C180,30 300,120 470,68 C620,22 780,18 940,70 C1120,128 1260,36 1440,82 L1440,130 L0,130 Z"
            />
            <path
              className="wave-front"
              d="M0,96 C210,58 340,116 520,82 C710,46 840,52 1030,92 C1190,126 1320,78 1440,54 L1440,130 L0,130 Z"
            />
          </svg>
        </div>
      </Container>
    </div>
  );
}
