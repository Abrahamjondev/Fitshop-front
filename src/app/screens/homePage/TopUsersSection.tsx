import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { setTopUsers } from "./homeSlice";
import { retrieveTopUsers } from "./homeSelector";
import MemberService from "../../services/MemberService";
import { Member } from "../../../lib/types/member";
import { getMemberImage } from "../../../lib/utils";

const fitShopColors = {
  bg: "#F6F7F9",
  card: "#FFFFFF",
  border: "#E6E8EC",
  accent: "#0E7C5A",
  text: "#0E1116",
  textMuted: "#444C58",
};

/** 1-2-3 o'rin uchun nozik aksent ranglari (oltin/kumush/bronza) */
const rankColors = ["#E3A008", "#8794A1", "#C2773F"];
const rankColor = (index: number) => rankColors[index] ?? fitShopColors.accent;

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setTopUsers: (data: Member[]) => dispatch(setTopUsers(data)),
});

const topUsersRetriever = createSelector(retrieveTopUsers, (topUsers) => ({
  topUsers,
}));

export default function TopUsersSection() {
  const { setTopUsers } = actionDispatch(useDispatch());
  const { topUsers } = useSelector(topUsersRetriever);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const member = new MemberService();
    member
      .getTopUsers()
      .then((data) => setTopUsers(data))
      .catch((err) => console.error("Error, TopUsers:", err))
      .finally(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hech qaysi userда ball bo'lmasa seksiyani umuman ko'rsatmaymiz
  if (loaded && topUsers.length === 0) return null;

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 8 }, bgcolor: fitShopColors.bg }}>
      <Container>
        <Stack spacing={1} alignItems="center" textAlign="center" sx={{ mb: 4 }}>
          <Chip
            icon={
              <EmojiEventsRoundedIcon
                sx={{ color: `${fitShopColors.accent} !important` }}
              />
            }
            label="FitShop Leaderboard"
            sx={{
              color: fitShopColors.accent,
              bgcolor: "rgba(14, 124, 90,0.12)",
              border: "1px solid rgba(14, 124, 90,0.28)",
              fontWeight: 700,
            }}
          />
          <Typography
            component="h2"
            sx={{
              fontFamily: "'Clash Display', sans-serif",
              color: fitShopColors.text,
              fontSize: { xs: 34, md: 46 },
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              mt: 1,
            }}
          >
            Top Athletes
          </Typography>
          <Typography
            sx={{ color: fitShopColors.textMuted, fontSize: 15, fontWeight: 500 }}
          >
            Members earning the most points through completed orders
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
          {topUsers.map((user, index) => {
            const color = rankColor(index);
            return (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={String(user._id)}>
                <Stack
                  alignItems="center"
                  spacing={1.5}
                  sx={{
                    height: "100%",
                    p: 3,
                    borderRadius: "20px",
                    bgcolor: fitShopColors.card,
                    border: `1px solid ${fitShopColors.border}`,
                    boxShadow:
                      "0 1px 2px rgba(14,17,22,0.04), 0 12px 30px -18px rgba(14,17,22,0.12)",
                    transition: "all 420ms cubic-bezier(0.32,0.72,0,1)",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor: "rgba(14,124,90,0.45)",
                      boxShadow:
                        "0 1px 2px rgba(14,17,22,0.05), 0 26px 50px -24px rgba(14,17,22,0.18)",
                    },
                  }}
                >
                  {/* Avatar + rank rangidagi halqa + raqam badge */}
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      src={getMemberImage(user)}
                      alt={user.memberNick}
                      sx={{
                        width: 84,
                        height: 84,
                        border: `3px solid ${color}`,
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -4,
                        right: -4,
                        width: 26,
                        height: 26,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: "50%",
                        bgcolor: color,
                        color: "#FFFFFF",
                        fontSize: 12,
                        fontWeight: 800,
                        border: "2px solid #FFFFFF",
                      }}
                    >
                      {index + 1}
                    </Box>
                  </Box>

                  {/* Ism */}
                  <Typography
                    sx={{
                      color: fitShopColors.text,
                      fontWeight: 700,
                      fontSize: 17,
                      textAlign: "center",
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.memberNick}
                  </Typography>

                  {/* Ochkolar pill */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.75}
                    sx={{
                      px: 1.5,
                      py: 0.6,
                      borderRadius: "999px",
                      bgcolor: "rgba(14, 124, 90,0.1)",
                      border: "1px solid rgba(14, 124, 90,0.24)",
                    }}
                  >
                    <EmojiEventsRoundedIcon
                      sx={{ fontSize: 16, color: fitShopColors.accent }}
                    />
                    <Typography
                      sx={{
                        color: fitShopColors.accent,
                        fontWeight: 800,
                        fontSize: 14,
                      }}
                    >
                      {user.memberPoints ?? 0} pts
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
