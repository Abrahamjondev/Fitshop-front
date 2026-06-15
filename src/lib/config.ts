export const serverApi: string =
  process.env.REACT_APP_API_URL ?? "http://localhost:3005";

export const Messages = {
  error1: "Something went wrong!",
  error2: "Please login first!",
  error3: "Please fulfill all inputs!",
  error4: "Message is empty!",
  error5: "Only images with jpeg, jpg, png format allowed!",
};

/** Delivery pricing (UZS) — backend bilan bir xil qiymatlar */
export const DELIVERY_FREE_THRESHOLD = 500000;
export const DELIVERY_COST = 30000;
