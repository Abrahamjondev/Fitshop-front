import axios from "axios";
import { serverApi } from "../../lib/config";

/** Sessiya tugaganda (401) butun app xabardor bo'lishi uchun event nomi */
export const UNAUTHORIZED_EVENT = "fitshop:unauthorized";

const api = axios.create({
  baseURL: serverApi,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("memberData");
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  },
);

export default api;
