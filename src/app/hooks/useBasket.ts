import { useState } from "react";
import { CartItem } from "../../lib/types/search";
import { useGlobals } from "./useGlobals";

function readStoredCart(): CartItem[] {
  try {
    const cartJson = localStorage.getItem("cartData");
    const parsed = cartJson ? JSON.parse(cartJson) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem("cartData");
    return [];
  }
}

const useBasket = () => {
  const { authMember } = useGlobals();
  // Lazy initializer — localStorage faqat birinchi renderda o'qiladi
  const [cartItems, setCartItems] = useState<CartItem[]>(readStoredCart);

  const persist = (cartUpdate: CartItem[]) => {
    setCartItems(cartUpdate);
    localStorage.setItem("cartData", JSON.stringify(cartUpdate));
  };

  const onAdd = (input: CartItem) => {
    // Markaziy himoya: faqat login bo'lgan member savatga qo'sha oladi.
    // Call-site allaqachon login so'rovini ko'rsatadi; bu — oxirgi to'siq.
    if (!authMember) return;

    const exist = cartItems.find((item: CartItem) => item._id === input._id);

    if (exist) {
      persist(
        cartItems.map((item: CartItem) =>
          item._id === input._id
            ? { ...exist, quantity: exist.quantity + 1 }
            : item,
        ),
      );
    } else {
      persist([...cartItems, { ...input, quantity: 1 }]);
    }
  };

  const onRemove = (input: CartItem) => {
    const exist = cartItems.find((item: CartItem) => item._id === input._id);
    if (!exist) return;

    if (exist.quantity === 1) {
      persist(cartItems.filter((item: CartItem) => item._id !== input._id));
    } else {
      persist(
        cartItems.map((item: CartItem) =>
          item._id === input._id
            ? { ...exist, quantity: exist.quantity - 1 }
            : item,
        ),
      );
    }
  };

  const onDelete = (input: CartItem) => {
    persist(cartItems.filter((item: CartItem) => item._id !== input._id));
  };

  const onDeleteAll = () => {
    setCartItems([]);
    localStorage.removeItem("cartData");
  };

  return {
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
  };
};

export default useBasket;
