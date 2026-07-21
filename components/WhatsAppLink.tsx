"use client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function WhatsAppLink({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        window.gtag?.("event", "whatsapp_click", { event_label: label });
      }}
    >
      {children}
    </a>
  );
}
