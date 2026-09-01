"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag, Home as HomeIcon, Store } from "lucide-react";
import WhatsAppLink from "@/components/WhatsAppLink";
import { sellItemLink, whatsappLink } from "@/lib/format";
import styles from "./ListWithUsSheet.module.css";

const OPTIONS = [
  {
    icon: ShoppingBag,
    title: "List a product",
    text: "Sell a secondhand or new item through the marketplace.",
    href: sellItemLink(),
    label: "pwa_list_product",
  },
  {
    icon: HomeIcon,
    title: "List a rental",
    text: "Put a vacant house or business premises up for rent.",
    href: whatsappLink("Hi Hometown SokoBase, I have a property I'd like to list for rent."),
    label: "pwa_list_rental",
  },
  {
    icon: Store,
    title: "List a business or store",
    text: "Get your shop or service featured on Hometown SokoBase.",
    href: whatsappLink("Hi Hometown SokoBase, I'd like to list my business/store with you."),
    label: "pwa_list_business",
  },
];

export default function ListWithUsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.sheet}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="List with us"
          >
            <div className={styles.handle} />
            <div className={styles.header}>
              <h2>List with us</h2>
              <button type="button" onClick={onClose} aria-label="Close" className={styles.close}>
                <X size={20} strokeWidth={2.2} />
              </button>
            </div>

            <div className={styles.options}>
              {OPTIONS.map((opt) => (
                <div key={opt.label} onClick={onClose}>
                  <WhatsAppLink href={opt.href} label={opt.label} className={styles.option}>
                    <span className={styles.optionIcon}>
                      <opt.icon size={19} strokeWidth={2} />
                    </span>
                    <span className={styles.optionText}>
                      <strong>{opt.title}</strong>
                      <span>{opt.text}</span>
                    </span>
                  </WhatsAppLink>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
