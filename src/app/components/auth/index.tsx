import React, { useEffect, useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Fade,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CloseIcon from "@mui/icons-material/Close";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { useGlobals } from "../../hooks/useGlobals";

const modalSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  p: 2,
};

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
  onSwitchToSignup?: () => void;
  onSwitchToLogin?: () => void;
}

function getAuthErrorMessage(err: any) {
  const error = err?.response?.data ?? err;
  return error?.message ?? Messages.error1;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const {
    signupOpen,
    loginOpen,
    handleSignupClose,
    handleLoginClose,
    onSwitchToSignup,
    onSwitchToLogin,
  } = props;

  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { setAuthMember } = useGlobals();

  useEffect(() => {
    // Modal yopilganda/almashtirilganda forma tozalanadi
    setMemberNick("");
    setMemberPhone("");
    setMemberPassword("");
    setAuthError("");
    setIsSubmitting(false);
  }, [signupOpen, loginOpen]);

  /** HANDLERS **/

  const handleUsername = (e: T) => {
    setAuthError("");
    setMemberNick(e.target.value);
  };

  const handlePhone = (e: T) => {
    setAuthError("");
    setMemberPhone(e.target.value);
  };

  const handlePassword = (e: T) => {
    setAuthError("");
    setMemberPassword(e.target.value);
  };

  const handlePasswordKeyDown = (e: T) => {
    if (e.key === "Enter" && signupOpen) {
      handleSignupRequest().then();
    } else if (e.key === "Enter" && loginOpen) {
      handleLoginRequest().then();
    }
  };

  const handleSignupRequest = async () => {
    if (isSubmitting) return;
    try {
      const isFullfill =
        memberNick !== "" && memberPhone !== "" && memberPassword !== "";
      if (!isFullfill) throw new Error(Messages.error3);

      setIsSubmitting(true);
      const signupInput: MemberInput = {
        memberNick: memberNick,
        memberPhone: memberPhone,
        memberPassword: memberPassword,
      };

      const member = new MemberService();
      const result = await member.signup(signupInput);

      setAuthMember(result);
      handleSignupClose();
    } catch (err) {
      console.error(err);
      setAuthError(getAuthErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginRequest = async () => {
    if (isSubmitting) return;
    try {
      const isFullfill = memberNick !== "" && memberPassword !== "";
      if (!isFullfill) throw new Error(Messages.error3);

      setIsSubmitting(true);
      const loginInput: LoginInput = {
        memberNick: memberNick,
        memberPassword: memberPassword,
      };

      const member = new MemberService();
      const result = await member.login(loginInput);

      setAuthMember(result);
      handleLoginClose();
    } catch (err) {
      console.error(err);
      setAuthError(getAuthErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const authShellSx = {
    width: { xs: "100%", sm: 560, md: 860 },
    maxWidth: "calc(100vw - 32px)",
    minHeight: { xs: "auto", md: 560 },
    borderRadius: "24px",
    overflow: "hidden",
    bgcolor: "#FFFFFF",
    border: "1px solid rgba(14, 124, 90, 0.32)",
    boxShadow: "0 30px 90px rgba(0, 0, 0, 0.55)",
    outline: "none",
  };

  const authVisualSx = {
    display: { xs: "none", md: "flex" },
    width: "44%",
    minHeight: 560,
    position: "relative",
    overflow: "hidden",
    p: 4,
    flexDirection: "column",
    justifyContent: "space-between",
    // Default rasm o'rniga — onyx ustida emerald mesh gradient
    background:
      "radial-gradient(120% 80% at 0% 0%, rgba(18,160,116,0.55), transparent 55%)," +
      "radial-gradient(120% 90% at 100% 100%, rgba(10,94,68,0.7), transparent 60%)," +
      "linear-gradient(160deg, #0E1116 0%, #0C1B15 55%, #06120D 100%)",
    // Yengil "blueprint" dot-grid, chetlarga qarab so'nadi
    "&:before": {
      content: '""',
      position: "absolute",
      inset: 0,
      backgroundImage:
        "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
      backgroundSize: "22px 22px",
      WebkitMaskImage:
        "linear-gradient(180deg, transparent, #000 25%, #000 72%, transparent)",
      maskImage:
        "linear-gradient(180deg, transparent, #000 25%, #000 72%, transparent)",
    },
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      color: "#0E1116",
      bgcolor: "#FFFFFF",
      borderRadius: "14px",
      // Belgilangan, ixcham balandlik — qutilar tekis va bir xil
      height: 52,
      pl: 0.5,
      transition: "border-color 0.2s",
      "& fieldset": { borderColor: "rgba(14, 17, 22, 0.22)" },
      "&:hover fieldset": { borderColor: "rgba(14, 124, 90, 0.6)" },
      "&.Mui-focused fieldset": {
        borderColor: "#0E7C5A",
        borderWidth: "1.5px",
      },
    },
    // Yozilgan matn / placeholder
    "& .MuiOutlinedInput-input": {
      height: "100%",
      boxSizing: "border-box",
      padding: "0 14px 0 6px",
      color: "#0E1116",
      fontWeight: 600,
      fontSize: 15,
    },
    "& .MuiOutlinedInput-input::placeholder": {
      color: "#6B7280",
      opacity: 1,
      fontWeight: 500,
    },
    // Ikonka rangi
    "& .MuiInputAdornment-root svg": { color: "#0E7C5A" },
    // Brauzer autofill'i fonni kulrang qilib yubormasligi uchun — oqni majburlaymiz
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #FFFFFF inset",
      WebkitTextFillColor: "#0E1116",
      caretColor: "#0E1116",
      borderRadius: "14px",
      transition: "background-color 9999s ease-in-out 0s",
    },
    "& input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active":
      {
        WebkitBoxShadow: "0 0 0 1000px #FFFFFF inset",
        WebkitTextFillColor: "#0E1116",
      },
  };

  const closeButtonSx = {
    position: "absolute",
    top: 18,
    right: 18,
    color: "#5B6470",
    border: "1px solid rgba(14, 124, 90, 0.18)",
    bgcolor: "rgba(255,255,255,0.04)",
    "&:hover": {
      color: "#0E1116",
      bgcolor: "rgba(14, 124, 90,0.16)",
      borderColor: "rgba(14, 124, 90,0.42)",
    },
  };

  const submitButtonSx = {
    mt: 1,
    height: 52,
    borderRadius: "14px",
    background: "linear-gradient(135deg, #12A074 0%, #0E7C5A 52%, #0A5E44 100%)",
    color: "#FFFFFF",
    fontWeight: 800,
    textTransform: "none",
    fontSize: 16,
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.35), 0 16px 35px -14px rgba(14, 124, 90, 0.7)",
    transition: "all 0.32s cubic-bezier(0.32,0.72,0,1)",
    "&:hover": {
      filter: "brightness(1.05)",
      transform: "translateY(-1px)",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.35), 0 18px 42px -14px rgba(14, 124, 90, 0.82)",
    },
    "&:active": { transform: "scale(0.99)" },
    "&.Mui-disabled": {
      background: "rgba(14,17,22,0.08)",
      color: "#9AA1AB",
      boxShadow: "none",
    },
  };

  const renderAuthPanel = (mode: "signup" | "login") => {
    const isSignup = mode === "signup";
    const title = isSignup ? "Create your account" : "Welcome back";
    const subtitle = isSignup
      ? "Join FitShop and keep your training essentials one step closer."
      : "Login to continue shopping, tracking orders, and building your setup.";
    const onClose = isSignup ? handleSignupClose : handleLoginClose;
    const onSubmit = isSignup ? handleSignupRequest : handleLoginRequest;
    const onSwitch = isSignup ? onSwitchToLogin : onSwitchToSignup;
    const switchText = isSignup
      ? "Already have an account? Login"
      : "No account yet? Sign up";
    const SubmitIcon = isSignup ? PersonAddAlt1Icon : LoginIcon;

    return (
      <Stack direction={{ xs: "column", md: "row" }} sx={authShellSx}>
        <Box sx={authVisualSx}>
          {/* Brand */}
          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "10px",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #12A074, #0A5E44)",
                boxShadow: "0 10px 22px -8px rgba(18,160,116,0.85)",
              }}
            >
              <FitnessCenterRoundedIcon sx={{ fontSize: 18, color: "#FFFFFF" }} />
            </Box>
            <Typography
              sx={{
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.05em",
              }}
            >
              FITSHOP.UZ
            </Typography>
          </Stack>

          {/* Headline */}
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              sx={{
                fontFamily: "'Space Mono', monospace",
                color: "rgba(125, 208, 168, 0.95)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                mb: 1.5,
              }}
            >
              Premium training gear
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Clash Display', sans-serif",
                color: "#FFFFFF",
                fontSize: 40,
                fontWeight: 600,
                lineHeight: 1.04,
                letterSpacing: "-0.02em",
              }}
            >
              Strong gear.
              <br />
              Clean motion.
            </Typography>
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.62)",
                mt: 2,
                fontSize: 14.5,
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              Nutrition, apparel, recovery, and daily discipline — engineered for
              how you train.
            </Typography>
          </Box>

          {/* Feature list */}
          <Stack
            spacing={1.1}
            sx={{
              position: "relative",
              zIndex: 1,
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              pt: 2.25,
            }}
          >
            {[
              "Free delivery over 500,000 UZS",
              "Verified premium products",
              "Track every order in real time",
            ].map((feature) => (
              <Stack
                key={feature}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <CheckCircleRoundedIcon sx={{ fontSize: 16, color: "#12A074" }} />
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.78)",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {feature}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Stack
          spacing={2.4}
          sx={{
            position: "relative",
            flex: 1,
            p: { xs: 3, sm: 4.5 },
            justifyContent: "center",
          }}
        >
          <IconButton
            aria-label="Close authentication modal"
            onClick={onClose}
            sx={closeButtonSx}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Box>
            <Typography
              component="h2"
              sx={{
                color: "#0E1116",
                fontSize: { xs: 30, sm: 36 },
                fontWeight: 900,
                lineHeight: 1.05,
                pr: 5,
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                color: "#444C58",
                mt: 1.2,
                fontSize: 15,
                fontWeight: 500,
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          {authError ? (
            <Alert
              severity="error"
              sx={{
                bgcolor: "rgba(239, 68, 68, 0.12)",
                color: "#0E1116",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                borderRadius: "14px",
                "& .MuiAlert-icon": { color: "#ef4444" },
              }}
            >
              {authError}
            </Alert>
          ) : null}

          <Stack spacing={1.6}>
            <TextField
              placeholder="Username"
              variant="outlined"
              fullWidth
              value={memberNick}
              onChange={handleUsername}
              sx={textFieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            {isSignup ? (
              <TextField
                placeholder="Phone number"
                variant="outlined"
                fullWidth
                value={memberPhone}
                onChange={handlePhone}
                sx={textFieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIphoneIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            ) : null}
            <TextField
              placeholder="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={memberPassword}
              onChange={handlePassword}
              onKeyDown={handlePasswordKeyDown}
              sx={textFieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Button
            fullWidth
            variant="contained"
            onClick={onSubmit}
            disabled={isSubmitting}
            startIcon={<SubmitIcon />}
            sx={submitButtonSx}
          >
            {isSubmitting
              ? "Please wait..."
              : isSignup
              ? "Sign up"
              : "Login"}
          </Button>

          {onSwitch ? (
            <Button
              onClick={onSwitch}
              sx={{
                color: "#0E7C5A",
                textTransform: "none",
                fontWeight: 700,
                alignSelf: "center",
              }}
            >
              {switchText}
            </Button>
          ) : null}
        </Stack>
      </Stack>
    );
  };

  return (
    <div>
      <Modal
        aria-labelledby="signup-modal-title"
        sx={modalSx}
        open={signupOpen}
        onClose={handleSignupClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={signupOpen}>{renderAuthPanel("signup")}</Fade>
      </Modal>

      <Modal
        aria-labelledby="login-modal-title"
        sx={modalSx}
        open={loginOpen}
        onClose={handleLoginClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={loginOpen}>{renderAuthPanel("login")}</Fade>
      </Modal>
    </div>
  );
}
