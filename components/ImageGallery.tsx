"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./ImageGallery.module.css";

export default function ImageGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  // Handle keyboard navigation for fullscreen modal
  useEffect(() => {
    if (!fullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreen, active, images.length]);

  const goToNext = () => {
    setActive((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setActive((prev) => (prev - 1 + images.length) % images.length);
  };

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
      <div className={styles.mainWrap} onClick={() => setFullscreen(true)}>
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

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            className={styles.fullscreenOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreen(false)}
          >
            <motion.div
              className={styles.fullscreenContainer}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeButton}
                onClick={() => setFullscreen(false)}
                aria-label="Close fullscreen"
              >
                <X size={24} />
              </button>

              <div className={styles.fullscreenImageWrap}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={images[active]}
                    src={images[active]}
                    alt={alt}
                    className={styles.fullscreenImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </AnimatePresence>
              </div>

              {images.length > 1 && (
                <>
                  <button
                    className={styles.navButtonprev}
                    onClick={goToPrev}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    className={styles.navButtonnext}
                    style={{ right: 16 }}
                    onClick={goToNext}
                    aria-label="Next image"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}

              <div className={styles.counter}>
                {active + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
