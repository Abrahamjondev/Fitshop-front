import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
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
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { useGlobals } from "../../hooks/useGlobals";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  paper: {
    outline: "none",
  },
}));

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
}

function getAuthErrorMessage(err: any) {
  const error = err?.response?.data ?? err;
  return error?.message ?? Messages.error1;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const { signupOpen, loginOpen, handleSignupClose, handleLoginClose } = props;
  const classes = useStyles();

  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const { setAuthMember } = useGlobals();

  React.useEffect(() => {
    if (signupOpen || loginOpen) setAuthError("");
  }, [signupOpen, loginOpen]);

  /** HANDLERS **/

  const handleUsername = (e: T) => {
    console.log(e.target.value);
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
    try {
      const isFullfill =
        memberNick !== "" && memberPhone !== "" && memberPassword !== "";
      if (!isFullfill) throw new Error(Messages.error3);

      const signupInput: MemberInput = {
        memberNick: memberNick,
        memberPhone: memberPhone,
        memberPassword: memberPassword,
      };

      const member = new MemberService();
      const result = await member.signup(signupInput);

      // Saving AUTHNICATed user
      setAuthMember(result);
      handleSignupClose();
    } catch (err) {
      console.log(err);
      setAuthError(getAuthErrorMessage(err));
    }
  };

  const handleLoginRequest = async () => {
    try {
      const isFullfill = memberNick !== "" && memberPassword !== "";
      if (!isFullfill) throw new Error(Messages.error3);

      const loginInput: LoginInput = {
        memberNick: memberNick,
        memberPassword: memberPassword,
      };

      const member = new MemberService();
      const result = await member.login(loginInput);

      // Saving AUTHNICATed user
      setAuthMember(result);
      handleLoginClose();
    } catch (err) {
      console.log(err);
      setAuthError(getAuthErrorMessage(err));
    }
  };

  const authShellSx = {
    width: { xs: "100%", sm: 560, md: 860 },
    maxWidth: "calc(100vw - 32px)",
    minHeight: { xs: "auto", md: 560 },
    borderRadius: "24px",
    overflow: "hidden",
    bgcolor: "#0E0E10",
    border: "1px solid rgba(186, 117, 23, 0.32)",
    boxShadow: "0 30px 90px rgba(0, 0, 0, 0.55)",
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
    background:
      "linear-gradient(180deg, rgba(14,14,16,0.2), rgba(14,14,16,0.92)), url('/img/auth.webp') center/cover",
    "&:before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(135deg, rgba(186,117,23,0.74), rgba(14,14,16,0.2) 48%, rgba(14,14,16,0.86))",
    },
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      color: "#FAEEDA",
      bgcolor: "rgba(255, 255, 255, 0.045)",
      borderRadius: "14px",
      "& fieldset": { borderColor: "rgba(250, 238, 218, 0.14)" },
      "&:hover fieldset": { borderColor: "rgba(186, 117, 23, 0.68)" },
      "&.Mui-focused fieldset": { borderColor: "#BA7517" },
    },
    "& .MuiInputLabel-root": { color: "#a1a1aa" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#BA7517" },
    "& .MuiInputAdornment-root svg": { color: "#BA7517" },
  };

  const closeButtonSx = {
    position: "absolute",
    top: 18,
    right: 18,
    color: "#a1a1aa",
    border: "1px solid rgba(250, 238, 218, 0.12)",
    bgcolor: "rgba(255,255,255,0.04)",
    "&:hover": {
      color: "#FAEEDA",
      bgcolor: "rgba(186,117,23,0.16)",
      borderColor: "rgba(186,117,23,0.42)",
    },
  };

  const submitButtonSx = {
    mt: 1,
    height: 52,
    borderRadius: "14px",
    bgcolor: "#BA7517",
    color: "#FAEEDA",
    fontWeight: 800,
    textTransform: "none",
    fontSize: 16,
    boxShadow: "0 16px 35px rgba(186, 117, 23, 0.28)",
    "&:hover": {
      bgcolor: "#9A6012",
      boxShadow: "0 18px 40px rgba(186, 117, 23, 0.36)",
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
    const SubmitIcon = isSignup ? PersonAddAlt1Icon : LoginIcon;

    return (
      <Stack className={classes.paper} direction={{ xs: "column", md: "row" }} sx={authShellSx}>
        <Box sx={authVisualSx}>
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography sx={{ color: "#FAEEDA", fontSize: 13, fontWeight: 800 }}>
              FITSHOP.UZ
            </Typography>
            <Typography
              sx={{
                color: "#FAEEDA",
                mt: 2,
                fontSize: 38,
                fontWeight: 900,
                lineHeight: 1.02,
              }}
            >
              Strong gear. Clean motion.
            </Typography>
          </Box>
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              borderTop: "1px solid rgba(250, 238, 218, 0.2)",
              pt: 2,
            }}
          >
            <Typography sx={{ color: "rgba(250, 238, 218, 0.82)", fontSize: 14 }}>
              Premium products for nutrition, apparel, recovery, and daily discipline.
            </Typography>
          </Box>
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
          <IconButton aria-label="Close authentication modal" onClick={onClose} sx={closeButtonSx}>
            <CloseIcon fontSize="small" />
          </IconButton>

          <Box>
            <Typography
              component="h2"
              sx={{
                color: "#FAEEDA",
                fontSize: { xs: 30, sm: 36 },
                fontWeight: 900,
                lineHeight: 1.05,
                pr: 5,
              }}
            >
              {title}
            </Typography>
            <Typography sx={{ color: "#a1a1aa", mt: 1.2, fontSize: 15, lineHeight: 1.6 }}>
              {subtitle}
            </Typography>
          </Box>

          {authError ? (
            <Alert
              severity="error"
              sx={{
                bgcolor: "rgba(239, 68, 68, 0.12)",
                color: "#FAEEDA",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                borderRadius: "14px",
                "& .MuiAlert-icon": { color: "#ef4444" },
              }}
            >
              {authError}
            </Alert>
          ) : null}

          <Stack spacing={2}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
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
                label="Phone number"
                variant="outlined"
                fullWidth
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
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
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
            startIcon={<SubmitIcon />}
            sx={submitButtonSx}
          >
            {isSignup ? "Sign up" : "Login"}
          </Button>
        </Stack>
      </Stack>
    );
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={signupOpen}
        onClose={handleSignupClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={signupOpen}>
          {renderAuthPanel("signup")}
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={loginOpen}
        onClose={handleLoginClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={loginOpen}>
          {renderAuthPanel("login")}
        </Fade>
      </Modal>
    </div>
  );
}
