"use client";

import { useState } from "react";
import styles from "./HeroBackground.module.css";

/**
 * Renders behind the hero content. If `src` is missing or fails to
 * load (404, slow network, bad env), we just don't render the <img> —
 * the CSS gradient in .fallback shows through underneath, so the hero
 * never looks broken. The dark overlay sits on top in both cases,
 * which is why hero text in page.module.css is set to white/light
 * colors regardless of whether the photo loaded.
 */
export default function HeroBackground({ src }: { src?: string }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.fallback} />
      {showImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className={styles.image}
          onError={() => setFailed(true)}
        />
      )}
      <div className={styles.overlay} />
    </div>
  );
}
