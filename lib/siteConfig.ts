// Edit these once you have your real office details — they're used on the
// Contact page and can be reused anywhere else contact info is needed.
export const siteConfig = {
  officeName: "SokoBase Office",
  addressLine: "Kimana Town, Rotext building, next to perfect comm offices",
  hours: "Mon &ndash; Sat: 8:00 AM &ndash; 6:00 PM",
  phoneDisplay: "+254 7XX XXX XXX", // update with your real number
  mapsQuery: "Kimana Town", // used to build a Google Maps search link below
};

export function mapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
}
