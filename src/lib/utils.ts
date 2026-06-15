import { serverApi, DELIVERY_FREE_THRESHOLD, DELIVERY_COST } from "./config";
import { Order, OrderItem } from "./types/orders";
import { Product } from "./types/product";
import { Member } from "./types/member";
import { ProductStatus } from "./enums/product.enum";

/** NARX **/
export function formatPrice(price: number): string {
  return `${(price ?? 0).toLocaleString()} UZS`;
}

export function getDeliveryCost(subtotal: number): number {
  return subtotal < DELIVERY_FREE_THRESHOLD ? DELIVERY_COST : 0;
}

/** STATISTIKA — katta sonni "50K+" ko'rinishiga keltiradi, kichigini aniq ko'rsatadi */
export function formatStat(n: number): { value: number; suffix: string } {
  if (n >= 1000) return { value: Math.round(n / 1000), suffix: "K+" };
  return { value: n, suffix: "" };
}

/** ORDER **/
export function getOrderProduct(
  order: Order,
  item: OrderItem,
): Product | undefined {
  return order.productData.find((ele: Product) => item.productId === ele._id);
}

export function getOrderSubtotal(order: Order): number {
  return order.orderItems.reduce(
    (total, item) => total + item.itemQuantity * item.itemPrice,
    0,
  );
}

export function getOrderDelivery(order: Order): number {
  return order.orderDelivery ?? 0;
}

export function getOrderTotal(order: Order): number {
  return order.orderTotal ?? getOrderSubtotal(order) + getOrderDelivery(order);
}

/** RASM YO'LLARI **/
export function getImagePath(image?: string | null): string {
  if (!image) return "/icons/noimage-list.svg";
  if (image.startsWith("http")) return image;
  if (image.startsWith("icons/")) return `/${image}`;
  if (image.startsWith("/")) return `${serverApi}${image}`;
  return `${serverApi}/${image}`;
}

export function getProductImage(product?: Product | null): string {
  return getImagePath(product?.productImages?.[0]);
}

export function getMemberImage(member?: Member | null): string {
  const image = member?.memberImage;
  if (!image) return "/icons/default-user.svg";
  return getImagePath(image);
}

/** STOK **/
export function isProductAvailable(product: Product): boolean {
  return (
    product.productStatus === ProductStatus.ACTIVE &&
    product.productLeftCount > 0
  );
}
