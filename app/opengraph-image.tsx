import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF7F2",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: "6px solid #1F7A4D",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50% 50% 50% 0",
              background: "#C97A2B",
              transform: "rotate(-45deg)",
            }}
          />
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, color: "#14201B" }}>
          Soko<span style={{ color: "#1F7A4D" }}>Base</span>
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#5B655E", marginTop: 16 }}>
          Everything Local. One Place.
        </div>
      </div>
    ),
    { ...size }
  );
}
