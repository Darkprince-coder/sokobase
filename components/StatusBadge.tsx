import { CircleCheck, Clock, CircleX } from "lucide-react";
import type { ListingStatus } from "@/lib/types";

const LABELS: Record<ListingStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

const CLASS: Record<ListingStatus, string> = {
  available: "status-available",
  reserved: "status-reserved",
  sold: "status-sold",
};

const ICONS: Record<ListingStatus, typeof CircleCheck> = {
  available: CircleCheck,
  reserved: Clock,
  sold: CircleX,
};

export default function StatusBadge({ status }: { status: ListingStatus }) {
  const Icon = ICONS[status];

  return (
    <span
      className={CLASS[status]}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-xs)",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        padding: "4px 10px",
        borderRadius: "999px",
      }}
    >
      <Icon size={12} strokeWidth={2.4} />
      {LABELS[status]}
    </span>
  );
}
