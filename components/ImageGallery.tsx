"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera } from "lucide-react";
import styles from "./ImageGallery.module.css";

export default function ImageGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className={styles.mainWrap}>
        <div className={styles.placeholder}>
          <Camera size={22} strokeWidth={1.5} />
          <span>Photos coming soon</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.mainWrap}>
        <AnimatePresence mode="wait">
          <motion.img
            key={images[active]}
            src={images[active]}
            alt={alt}
            className={styles.main}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className={styles.thumbRow}>
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={styles.thumbButton}
              data-active={i === active}
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1} of ${images.length}`}
            >
              <img src={src} alt="" className={styles.thumb} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
