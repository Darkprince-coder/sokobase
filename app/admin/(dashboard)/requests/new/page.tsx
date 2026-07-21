import { createRequest } from "@/lib/actions/requests";
import RequestForm from "@/components/admin/RequestForm";

export default function NewRequestPage() {
  return (
    <div>
      <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-6)" }}>
        New client request
      </h1>
      <RequestForm action={createRequest} />
    </div>
  );
}
