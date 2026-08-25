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

export default function StatusBadge({
  status,
  showLabel = true,
}: {
  status: ListingStatus;
  showLabel?: boolean;
}) {
  const Icon = ICONS[status];
  const label = LABELS[status];

  return (
    <span
      className={CLASS[status]}
      title={label}
      aria-label={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        fontFamily: "var(--font-mono)",
        fontSize: showLabel ? "var(--text-xs)" : "0",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        padding: showLabel ? "4px 10px" : "6px",
        borderRadius: "999px",
        lineHeight: 1,
        minWidth: showLabel ? "auto" : "26px",
        minHeight: showLabel ? "auto" : "26px",
      }}
    >
      <Icon size={showLabel ? 12 : 14} strokeWidth={2.4} />
      {showLabel && label}
    </span>
  );
}
