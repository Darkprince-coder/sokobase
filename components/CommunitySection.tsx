import { MessageCircle, Users } from "lucide-react";
import WhatsAppLink from "@/components/WhatsAppLink";
// Reuses the .ctaBand / .ctaInner / .ctaTitle / .ctaText / .ctaButton
// classes already defined for the homepage's "Got something to list?"
// band, so this section matches that look without new CSS to maintain.
import pageStyles from "@/app/(site)/page.module.css";

// Your WhatsApp GROUP invite link (starts with https://chat.whatsapp.com/...)
// — this is different from the wa.me click-to-chat links used elsewhere in
// lib/format.ts. Easiest way to set it without touching code: add
// NEXT_PUBLIC_WHATSAPP_COMMUNITY_LINK to your environment variables in
// Vercel. Otherwise just replace the placeholder string below directly.
const WHATSAPP_COMMUNITY_LINK =
  process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_LINK ||
  "https://chat.whatsapp.com/KZ8CIumGgLpKhTfAydNuk6";

export default function CommunitySection() {
  return (
    <section className={pageStyles.ctaBand}>
      <div className={`container ${pageStyles.ctaInner}`}>
        <Users size={28} strokeWidth={1.6} style={{ color: "#8fe0b3" }} />
        <h2 className={pageStyles.ctaTitle}>Join the Hometown SokoBase community</h2>
        <p className={pageStyles.ctaText}>
          Get first access to new listings, rental drops, and Hometown Store restocks
          straight on WhatsApp, before they hit the site.
        </p>
        <WhatsAppLink
          href={WHATSAPP_COMMUNITY_LINK}
          label="homepage_join_community"
          className={pageStyles.ctaButton}
        >
          <MessageCircle size={16} strokeWidth={2.2} />
          Join our WhatsApp community
        </WhatsAppLink>
      </div>
    </section>
  );
}
