import { ImageResponse } from "next/og";
import { getListingBySlug } from "@/lib/listings";
import { formatPrice } from "@/lib/format";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ListingOpengraphImage({
  params,
}: {
  params: { slug: string };
}) {
  const listing = await getListingBySlug(params.slug);
  const cover = listing?.images?.[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FAF7F2",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 520,
            height: "100%",
            display: "flex",
            background: "#DCE6DE",
          }}
        >
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} width={520} height={630} style={{ objectFit: "cover" }} />
          )}
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 56px",
          }}
        >
          {listing?.verified && (
            <div
              style={{
                display: "flex",
                fontSize: 22,
                fontWeight: 600,
                color: "#1F7A4D",
                marginBottom: 20,
              }}
            >
              &#10003; VERIFIED &middot; SOKOBASE
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: 52,
              fontWeight: 700,
              color: "#14201B",
              lineHeight: 1.15,
              maxWidth: 560,
            }}
          >
            {listing?.title ?? "SokoBase Listing"}
          </div>
          <div style={{ display: "flex", fontSize: 44, color: "#14512F", marginTop: 28 }}>
            {listing ? formatPrice(listing.price) : ""}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
