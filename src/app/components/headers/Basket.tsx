import React from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { Messages, serverApi } from "../../../lib/config";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";

interface BasketProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

export default function Basket(props: BasketProps) {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const history = useHistory();
  const itemsPrice: number = cartItems.reduce(
    (a: number, c: CartItem) => a + c.quantity * c.price,
    0,
  );

  const shippingCost: number = itemsPrice < 500000 ? 30000 : 0;
  const totalPrice = (itemsPrice + shippingCost).toFixed(1);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  /** HANDLERS **/
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const proceedOrderHandler = async () => {
    try {
      handleClose();
      if (!authMember) throw new Error(Messages.error2);

      const order = new OrderService();
      await order.createOrder(cartItems);

      onDeleteAll();

      // REFRESH VIA CONTEXT
      setOrderBuilder(new Date());
      history.push("/orders");
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const formatPrice = (price: number) => `${price.toLocaleString()} UZS`;

  return (
    <Box className={"hover-line"}>
      <Tooltip title="Basket">
        <IconButton
          aria-label="cart"
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{
            width: 46,
            height: 46,
            border: "1px solid rgba(186, 117, 23, 0.38)",
            bgcolor: open
              ? "rgba(186, 117, 23, 0.18)"
              : "rgba(255,255,255,0.04)",
            color: "#BA7517",
            transition: "all 200ms ease",
            "&:hover": {
              bgcolor: "rgba(186, 117, 23, 0.16)",
              borderColor: "rgba(186, 117, 23, 0.72)",
              transform: "translateY(-1px)",
            },
          }}
        >
          <Badge
            badgeContent={cartItems.length}
            sx={{
              "& .MuiBadge-badge": {
                bgcolor: "#BA7517",
                color: "#FAEEDA",
                fontWeight: 800,
                minWidth: 18,
                height: 18,
                fontSize: 11,
                boxShadow: "0 0 0 2px #0E0E10",
              },
            }}
          >
            <ShoppingBagOutlinedIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            mt: 1.5,
            width: { xs: "calc(100vw - 28px)", sm: 440 },
            maxWidth: "calc(100vw - 28px)",
            borderRadius: "22px",
            bgcolor: "#0E0E10",
            color: "#FAEEDA",
            border: "1px solid rgba(186, 117, 23, 0.3)",
            boxShadow: "0 26px 70px rgba(0,0,0,0.5)",
            backgroundImage:
              "linear-gradient(180deg, rgba(186,117,23,0.13), rgba(14,14,16,0) 42%)",
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
        <Stack
          sx={{
            width: "100%",
            p: 2,
            bgcolor: "transparent",
            borderRadius: "22px",
            gap: 1.5,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ gap: 2 }}
          >
            <Box>
              <Typography
                sx={{ color: "#FAEEDA", fontSize: 22, fontWeight: 900 }}
              >
                Basket
              </Typography>
              <Typography sx={{ color: "#a1a1aa", fontSize: 13 }}>
                {cartItems.length === 0
                  ? "No products selected"
                  : `${cartItems.length} selected product${
                      cartItems.length > 1 ? "s" : ""
                    }`}
              </Typography>
            </Box>
            {cartItems.length === 0 ? (
              <IconButton
                aria-label="Close basket"
                onClick={handleClose}
                sx={{
                  color: "#a1a1aa",
                  border: "1px solid rgba(250,238,218,0.12)",
                  "&:hover": {
                    color: "#FAEEDA",
                    bgcolor: "rgba(255,255,255,0.06)",
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            ) : (
              <Tooltip title="Clear basket">
                <IconButton
                  aria-label="Clear basket"
                  onClick={() => onDeleteAll()}
                  sx={{
                    color: "#ef4444",
                    border: "1px solid rgba(239,68,68,0.32)",
                    bgcolor: "rgba(239,68,68,0.08)",
                    "&:hover": {
                      bgcolor: "rgba(239,68,68,0.16)",
                      borderColor: "rgba(239,68,68,0.52)",
                    },
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>

          <Divider sx={{ borderColor: "rgba(250,238,218,0.1)" }} />

          {cartItems.length === 0 ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                minHeight: 230,
                textAlign: "center",
                px: 3,
              }}
            >
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "18px",
                  display: "grid",
                  placeItems: "center",
                  color: "#BA7517",
                  bgcolor: "rgba(186,117,23,0.12)",
                  border: "1px solid rgba(186,117,23,0.28)",
                  mb: 2,
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: 34 }} />
              </Box>
              <Typography
                sx={{ color: "#FAEEDA", fontSize: 18, fontWeight: 800 }}
              >
                Cart is empty
              </Typography>
              <Typography sx={{ color: "#a1a1aa", mt: 0.6, fontSize: 14 }}>
                Add your favorite training essentials and they will appear here.
              </Typography>
            </Stack>
          ) : (
            <Box
              sx={{
                height: 310,
                overflow: "hidden",
              }}
            >
              <Stack
                sx={{
                  height: "100%",
                  overflowY: "auto",
                  gap: 1.2,
                  pr: 0.5,
                  "&::-webkit-scrollbar": { width: 6 },
                  "&::-webkit-scrollbar-thumb": {
                    bgcolor: "rgba(186,117,23,0.65)",
                    borderRadius: 99,
                  },
                  "&::-webkit-scrollbar-track": {
                    bgcolor: "rgba(255,255,255,0.05)",
                    borderRadius: 99,
                  },
                }}
              >
                {cartItems.map((item: CartItem) => {
                  const imagePath = item.image
                    ? `${serverApi}/${item.image}`
                    : "/icons/noimage-list.svg";
                  return (
                    <Stack
                      key={item._id}
                      direction="row"
                      alignItems="center"
                      sx={{
                        position: "relative",
                        gap: 1.5,
                        p: 1.2,
                        borderRadius: "16px",
                        bgcolor: "rgba(255,255,255,0.045)",
                        border: "1px solid rgba(250,238,218,0.08)",
                      }}
                    >
                      <Box
                        component="img"
                        src={imagePath}
                        alt={item.name}
                        onError={(
                          event: React.SyntheticEvent<HTMLImageElement>,
                        ) => {
                          event.currentTarget.src = "/icons/noimage-list.svg";
                        }}
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: "14px",
                          objectFit: "cover",
                          bgcolor: "#17171A",
                          border: "1px solid rgba(186,117,23,0.18)",
                        }}
                      />

                      <Stack sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          sx={{
                            color: "#FAEEDA",
                            fontSize: 15,
                            fontWeight: 800,
                            lineHeight: 1.25,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#BA7517",
                            fontSize: 13,
                            fontWeight: 800,
                            mt: 0.5,
                          }}
                        >
                          {formatPrice(item.price)} x {item.quantity}
                        </Typography>
                        <Typography
                          sx={{ color: "#a1a1aa", fontSize: 12, mt: 0.2 }}
                        >
                          Subtotal {formatPrice(item.price * item.quantity)}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        alignItems="center"
                        sx={{
                          flex: "0 0 auto",
                          border: "1px solid rgba(250,238,218,0.12)",
                          borderRadius: "12px",
                          overflow: "hidden",
                          bgcolor: "rgba(14,14,16,0.7)",
                        }}
                      >
                        <IconButton
                          aria-label={`Remove one ${item.name}`}
                          onClick={() => onRemove(item)}
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: 0,
                            color: "#FAEEDA",
                            "&:hover": { bgcolor: "rgba(186,117,23,0.16)" },
                          }}
                        >
                          <RemoveIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <Typography
                          sx={{
                            width: 28,
                            textAlign: "center",
                            color: "#FAEEDA",
                            fontSize: 13,
                            fontWeight: 800,
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          aria-label={`Add one ${item.name}`}
                          onClick={() => onAdd(item)}
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: 0,
                            color: "#BA7517",
                            "&:hover": { bgcolor: "rgba(186,117,23,0.16)" },
                          }}
                        >
                          <AddIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Stack>

                      <Tooltip title="Remove product">
                        <IconButton
                          aria-label={`Remove ${item.name} from basket`}
                          onClick={() => onDelete(item)}
                          sx={{
                            position: "absolute",
                            top: 6,
                            right: 6,
                            width: 24,
                            height: 24,
                            color: "#a1a1aa",
                            bgcolor: "rgba(14,14,16,0.66)",
                            "&:hover": {
                              color: "#ef4444",
                              bgcolor: "rgba(239,68,68,0.14)",
                            },
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
          )}

          {cartItems.length !== 0 ? (
            <Stack sx={{ gap: 1.5 }}>
              <Divider sx={{ borderColor: "rgba(250,238,218,0.1)" }} />
              <Stack spacing={0.8}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography sx={{ color: "#a1a1aa", fontSize: 13 }}>
                    Products
                  </Typography>
                  <Typography
                    sx={{ color: "#FAEEDA", fontSize: 13, fontWeight: 700 }}
                  >
                    {formatPrice(itemsPrice)}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" alignItems="center" spacing={0.7}>
                    <LocalShippingOutlinedIcon
                      sx={{ color: "#BA7517", fontSize: 17 }}
                    />
                    <Typography sx={{ color: "#a1a1aa", fontSize: 13 }}>
                      Shipping
                    </Typography>
                  </Stack>
                  <Typography
                    sx={{ color: "#FAEEDA", fontSize: 13, fontWeight: 700 }}
                  >
                    {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                  </Typography>
                </Stack>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography sx={{ color: "#a1a1aa", fontSize: 12 }}>
                    Total
                  </Typography>
                  <Typography
                    sx={{ color: "#FAEEDA", fontSize: 24, fontWeight: 900 }}
                  >
                    {formatPrice(Number(totalPrice))}
                  </Typography>
                </Box>
                <Button
                  onClick={proceedOrderHandler}
                  startIcon={<ShoppingCartIcon />}
                  variant={"contained"}
                  sx={{
                    height: 48,
                    px: 3,
                    borderRadius: "14px",
                    bgcolor: "#BA7517",
                    color: "#FAEEDA",
                    fontWeight: 900,
                    textTransform: "none",
                    boxShadow: "0 14px 30px rgba(186,117,23,0.28)",
                    "&:hover": {
                      bgcolor: "#9A6012",
                      boxShadow: "0 16px 34px rgba(186,117,23,0.36)",
                    },
                  }}
                >
                  Order
                </Button>
              </Stack>
            </Stack>
          ) : null}
        </Stack>
      </Menu>
    </Box>
  );
}
