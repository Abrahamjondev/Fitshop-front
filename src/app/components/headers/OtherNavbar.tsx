import React from "react";
import {
  Box,
  Button,
  Container,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { Logout } from "@mui/icons-material";
import Basket from "./Basket";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";

interface OtherNavbarProps {
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

function FitShopCompactLogo() {
  return (
    <span className="fitshop-logo compact" aria-label="FitShop.uz">
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

export default function OtherNavbar(props: OtherNavbarProps) {
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

  return (
    <div className="other-navbar">
      <div className="other-navbar-bg" aria-hidden="true" />
      <Container className="navbar-container">
        <Stack className="menu">
          <Box className="brand-box">
            <NavLink to={"/"} aria-label="FitShop.uz home">
              <FitShopCompactLogo />
            </NavLink>
          </Box>
          <Stack className="links nav-links">
            <Box className={"hover-line "}>
              <NavLink to="/">Home</NavLink>
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
            <Box className={"hover-line "}>
              <NavLink to="/help" activeClassName={"underline"}>
                Help
              </NavLink>
            </Box>
          </Stack>
          <Stack className="header-actions">
            <Basket
              cartItems={cartItems}
              onAdd={onAdd}
              onRemove={onRemove}
              onDelete={onDelete}
              onDeleteAll={onDeleteAll}
            />
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
                  className="login-button"
                  variant="outlined"
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
                  bgcolor: "#151518",
                  color: "#FAEEDA",
                  border: "1px solid rgba(186, 117, 23, 0.3)",
                  borderRadius: "14px",
                  boxShadow: "0 18px 44px rgba(0,0,0,0.45)",
                  mt: 1.5,
                  "& .MuiMenuItem-root": {
                    fontWeight: 700,
                    gap: 0.5,
                    "&:hover": {
                      bgcolor: "rgba(186,117,23,0.14)",
                    },
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "#151518",
                    borderLeft: "1px solid rgba(186, 117, 23, 0.3)",
                    borderTop: "1px solid rgba(186, 117, 23, 0.3)",
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
                  <Logout fontSize="small" style={{ color: "#BA7517" }} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>
        <Stack className="other-hero-copy">
          <Box className="hero-kicker">FitShop essentials</Box>
          <Typography component="h1" className="other-title"></Typography>
          <Typography className="other-subtitle"></Typography>
        </Stack>
      </Container>
    </div>
  );
}
