import { Box, Container, Stack } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Settings } from "./Settings";
import "../../../css/userPage.css";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { getMemberImage } from "../../../lib/utils";
import { MemberType } from "../../../lib/enums/member.enum";

function getFitShopMemberLabel(memberType?: MemberType) {
  if (memberType === MemberType.SHOP) return "FitShop Partner";
  return "FitShop Member";
}

export default function UserPage() {
  const history = useHistory();
  const { authMember } = useGlobals();

  // Auth guard — render paytida emas, effect ichida redirect qilamiz
  useEffect(() => {
    if (!authMember) history.push("/");
  }, [authMember, history]);

  if (!authMember) return null;
  return (
    <div className={"user-page"}>
      <Container>
        <Stack className={"my-page-frame"}>
          <Stack className={"my-page-left"}>
            <Box display={"flex"} flexDirection={"column"}>
              <Box className={"menu-name"}>
                <span>FitShop Account</span>
                <h1>Profile settings</h1>
                <p>
                  Keep your delivery details and training profile ready for the
                  next order.
                </p>
              </Box>
              <Box className={"menu-content"}>
                <Settings />
              </Box>
            </Box>
          </Stack>

          <Stack className={"my-page-right"}>
            <Box className={"order-info-box"}>
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <div className={"order-user-img"}>
                  <img
                    src={getMemberImage(authMember)}
                    alt=""
                    className={"order-user-avatar"}
                    onError={(event) => {
                      event.currentTarget.src = "/icons/default-user.svg";
                    }}
                  />
                </div>
                <span className={"order-user-name"}>
                  {authMember?.memberNick}
                </span>
                <span className={"order-user-prof"}>
                  <FitnessCenterIcon fontSize="small" />
                  {getFitShopMemberLabel(authMember?.memberType)}
                </span>
                <span className={"order-user-prof address-chip"}>
                  <LocationOnIcon fontSize="small" />
                  {authMember?.memberAddress
                    ? authMember.memberAddress
                    : "no address"}
                </span>
              </Box>
              <Box className={"user-media-box"}>
                <FacebookIcon />
                <InstagramIcon />
                <TelegramIcon />
                <YouTubeIcon />
              </Box>
              <p className={"user-desc"}>
                {authMember?.memberDesc
                  ? authMember.memberDesc
                  : "no description"}
              </p>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
