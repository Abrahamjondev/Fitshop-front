/** SweetAlertHandling **/
import Swal from "sweetalert2";
import { Messages } from "./config";
import "../css/sweetalert.css";

/** FORGED temasi — barcha modal dialoglarga umumiy ko'rinish.
 *  buttonsStyling: false → tugmalar to'liq fs-swal-* CSS bilan boshqariladi. */
const popupTheme = {
  buttonsStyling: false,
  customClass: {
    popup: "fs-swal-popup",
    title: "fs-swal-title",
    htmlContainer: "fs-swal-text",
    actions: "fs-swal-actions",
    confirmButton: "fs-swal-confirm",
    cancelButton: "fs-swal-cancel",
  },
} as const;

/** Toast (kichik yuqori-o'ng bildirishnomalar) uchun tema.
 *  showClass/hideClass — swal2'ning default animatsiyasini TO'LIQ almashtiradi
 *  (CSS specificity bilan kurashmasdan; default o'ngdan sirg'alish klip qilardi). */
const toastTheme = {
  customClass: {
    popup: "fs-swal-toast",
    title: "fs-swal-toast-title",
    icon: "fs-swal-toast-icon",
  },
  showClass: { popup: "fs-toast-show", backdrop: "", icon: "" },
  hideClass: { popup: "fs-toast-hide", backdrop: "", icon: "" },
} as const;

/** Tasdiqlash dialogi — window.confirm o'rniga */
export const sweetConfirmAlert = async (msg: string): Promise<boolean> => {
  const result = await Swal.fire({
    ...popupTheme,
    icon: "question",
    text: msg,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });
  return result.isConfirmed;
};

export const sweetErrorHandling = async (err: any) => {
  const error = err.response?.data ?? err;
  const message = error?.message ?? Messages.error1;
  await Swal.fire({
    ...popupTheme,
    icon: "error",
    title: "Oops...",
    text: message,
    confirmButtonText: "Got it",
  });
};

export const sweetTopSuccessAlert = async (
  msg: string,
  duration: number = 2000,
) => {
  await Swal.fire({
    ...toastTheme,
    toast: true,
    position: "top-end",
    icon: "success",
    title: msg,
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
  });
};

export const sweetTopSmallSuccessAlert = async (
  msg: string,
  duration: number = 2000,
) => {
  const Toast = Swal.mixin({
    ...toastTheme,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
  });

  Toast.fire({
    icon: "success",
    title: msg,
  }).then();
};

export const sweetTopSmallErrorAlert = async (
  msg: string,
  duration: number = 2000,
) => {
  const Toast = Swal.mixin({
    ...toastTheme,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
  });

  Toast.fire({
    icon: "error",
    title: msg,
  }).then();
};

export const sweetFailureProvider = (
  msg: string,
  show_button: boolean = false,
  forward_url: string = "",
) => {
  Swal.fire({
    ...popupTheme,
    icon: "error",
    title: msg,
    showConfirmButton: show_button,
    confirmButtonText: "OK",
  }).then(() => {
    if (forward_url !== "") {
      window.location.replace(forward_url);
    }
  });
};
