import { useEffect, useState } from "react";
import { useGlobals } from "./useGlobals";
import WishlistService from "../services/WishlistService";

const WISHLIST_KEY = "wishlistData";

function readStoredWishlist(): string[] {
  try {
    const json = localStorage.getItem(WISHLIST_KEY);
    const parsed = json ? JSON.parse(json) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(WISHLIST_KEY);
    return [];
  }
}

/**
 * Sevimlilar ro'yxati.
 * - Mehmon (login bo'lmagan) uchun: localStorage'da saqlanadi.
 * - Login bo'lgan member uchun: backend'da saqlanadi (qurilmalar aro sinxron).
 */
const useWishlist = () => {
  const { authMember, setLoginOpen } = useGlobals();
  const [wishlist, setWishlist] = useState<string[]>(readStoredWishlist);

  // Login holatiga qarab manbani almashtiramiz
  useEffect(() => {
    if (!authMember) {
      setWishlist(readStoredWishlist());
      return;
    }

    // Login bo'lganda mehmon (localStorage) ro'yxatini backend bilan birlashtiramiz —
    // shunda login qilishdan oldin saqlangan sevimlilar yo'qolmaydi.
    const service = new WishlistService();
    let cancelled = false;

    (async () => {
      try {
        const backendIds = await service.getWishlistIds();

        const guestIds = readStoredWishlist();
        // Faqat backendda yo'q mehmon id'larini qo'shamiz (toggle idempotent emas —
        // mavjudini toggle qilish uni o'chirib yuborardi).
        const toAdd = guestIds.filter((id) => !backendIds.includes(id));

        const results = await Promise.allSettled(
          toAdd.map((id) => service.toggle(id)),
        );
        const added = toAdd.filter((_, i) => results[i].status === "fulfilled");

        // Mehmon ro'yxatini tozalaymiz — endi manba backend
        localStorage.removeItem(WISHLIST_KEY);

        if (!cancelled) {
          setWishlist(Array.from(new Set([...backendIds, ...added])));
        }
      } catch (err) {
        console.error("Error, loadWishlist:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authMember]);

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const toggleWishlist = (productId: string) => {
    // Mehmon (login bo'lmagan) sevimlilarga qo'sha olmaydi —
    // avval login oynasini ochamiz
    if (!authMember) {
      setLoginOpen(true);
      return;
    }

    // Optimistik yangilash — UI darhol javob beradi
    const next = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    setWishlist(next);

    // Login bo'lsa backend bilan sinxronlaymiz; xato bo'lsa orqaga qaytaramiz
    const service = new WishlistService();
    service.toggle(productId).catch((err) => {
      console.error("Error, toggleWishlist:", err);
      setWishlist(wishlist);
    });
  };

  return { wishlist, isInWishlist, toggleWishlist };
};

export default useWishlist;
