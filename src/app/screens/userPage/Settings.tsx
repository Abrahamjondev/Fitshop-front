import { Box } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@mui/material/Button";
import { useGlobals } from "../../hooks/useGlobals";
import { useEffect, useState } from "react";
import { MemberUpdateInput } from "../../../lib/types/member";
import { T } from "../../../lib/types/common";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { Messages } from "../../../lib/config";
import { getMemberImage } from "../../../lib/utils";
import MemberService from "../../services/MemberService";

export function Settings() {
  const { authMember, setAuthMember } = useGlobals();
  const [memberImage, setMemberImage] = useState<string>(
    getMemberImage(authMember),
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>(
    {
      memberNick: authMember?.memberNick ?? "",
      memberPhone: authMember?.memberPhone ?? "",
      memberAddress: authMember?.memberAddress ?? "",
      memberDesc: authMember?.memberDesc ?? "",
      memberPassword: "",
    },
  );

  useEffect(() => {
    setMemberImage(getMemberImage(authMember));
    setMemberUpdateInput((prev) => ({
      ...prev,
      memberNick: authMember?.memberNick ?? "",
      memberPhone: authMember?.memberPhone ?? "",
      memberAddress: authMember?.memberAddress ?? "",
      memberDesc: authMember?.memberDesc ?? "",
      memberPassword: "",
    }));
  }, [authMember]);

  /** HANDLERS **/
  const inputHandler = (field: keyof MemberUpdateInput) => (e: T) => {
    const value = e.target.value;
    setMemberUpdateInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitButton = async () => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      if (!memberUpdateInput.memberNick || !memberUpdateInput.memberPhone) {
        throw new Error(Messages.error3);
      }

      setIsSaving(true);
      const member = new MemberService();
      const result = await member.updateMember(memberUpdateInput);
      const updatedMember = { ...authMember, ...result };
      setAuthMember(updatedMember);

      await sweetTopSmallSuccessAlert("Modified successfully!", 700);
    } catch (err) {
      console.error(err);
      sweetErrorHandling(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageViewer = (e: T) => {
    const file = e.target.files[0];
    if (!file) return;
    const validateImageTypes = ["image/jpg", "image/jpeg", "image/png"];

    if (!validateImageTypes.includes(file.type)) {
      sweetErrorHandling(Messages.error5).then();
      return;
    }

    setMemberUpdateInput((prev) => ({ ...prev, memberImage: file }));
    setMemberImage(URL.createObjectURL(file));
  };

  return (
    <Box className={"settings"}>
      <Box className={"member-media-frame"}>
        <img src={memberImage} className={"mb-image"} alt="" />
        <div className={"media-change-box"}>
          <span>Profile image</span>
          <p>Upload a clean JPG, JPEG, or PNG for your FitShop account</p>
          <div className={"up-del-box"}>
            <Button component="label">
              <CloudDownloadIcon />
              <input
                type="file"
                hidden
                accept="image/png,image/jpg,image/jpeg"
                onChange={handleImageViewer}
              />
            </Button>
          </div>
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>Username</label>
          <input
            className={"spec-input mb-nick"}
            type="text"
            placeholder="Username"
            value={memberUpdateInput.memberNick}
            name="memberNick"
            onChange={inputHandler("memberNick")}
          />
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"short-input"}>
          <label className={"spec-label"}>Phone</label>
          <input
            className={"spec-input mb-phone"}
            type="text"
            placeholder="Phone number"
            value={memberUpdateInput.memberPhone}
            name="memberPhone"
            onChange={inputHandler("memberPhone")}
          />
        </div>
        <div className={"short-input"}>
          <label className={"spec-label"}>Address</label>
          <input
            className={"spec-input  mb-address"}
            type="text"
            placeholder="Delivery address"
            value={memberUpdateInput.memberAddress}
            name="memberAddress"
            onChange={inputHandler("memberAddress")}
          />
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"short-input"}>
          <label className={"spec-label"}>New password</label>
          <input
            className={"spec-input mb-password"}
            type="password"
            placeholder="Leave blank to keep current"
            value={memberUpdateInput.memberPassword}
            name="memberPassword"
            onChange={inputHandler("memberPassword")}
          />
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>Description</label>
          <textarea
            className={"spec-textarea mb-description"}
            placeholder="Tell us about yourself"
            value={memberUpdateInput.memberDesc}
            name="memberDesc"
            onChange={inputHandler("memberDesc")}
          />
        </div>
      </Box>
      <Box className={"save-box"}>
        <Button
          variant={"contained"}
          onClick={handleSubmitButton}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
}
