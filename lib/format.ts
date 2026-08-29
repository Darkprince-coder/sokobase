export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(price);
}

// NEW — drives the discount badge on product cards and the product page.
// Returns null when there's nothing to show (no old price, or old price
// isn't actually higher than the current price).
export function discountPercent(price: number, compareAtPrice: number | null | undefined): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254700000000";

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function sellItemLink(): string {
  return whatsappLink(
    "Hi SokoBase, I'd like to sell an item. Here are the photos and details:"
  );
}

export function requestItemLink(): string {
  return whatsappLink(
    "Hi SokoBase, I'm looking for a product you don't currently have listed. Here's what I need:"
  );
}

// UPDATED — size/color are optional so every existing call site still
// works unchanged; pass them when you have a selection to include.
export function inquireListingLink(
  title: string,
  url: string,
  size?: string | null,
  color?: string | null
): string {
  const details = [size ? `Size: ${size}` : null, color ? `Color: ${color}` : null]
    .filter(Boolean)
    .join(", ");
  return whatsappLink(
    `Hi SokoBase, I'm interested in "${title}"${details ? ` (${details})` : ""} (${url}). Is it still available?`
  );
}

export function merchOrderLink(
  productName: string,
  size: string | null,
  color: string | null,
  price: number,
  url: string
): string {
  const details = [size ? `Size: ${size}` : null, color ? `Color: ${color}` : null]
    .filter(Boolean)
    .join(", ");
  return whatsappLink(
    `Hi Hometown SokoBase, I'd like to order "${productName}"${
      details ? ` (${details})` : ""
    } — ${formatPrice(price)}. ${url}`
  );
}
