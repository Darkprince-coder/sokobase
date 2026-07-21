import { notFound } from "next/navigation";
import { getAdminRequest } from "@/lib/adminData";
import { updateRequest } from "@/lib/actions/requests";
import RequestForm from "@/components/admin/RequestForm";

export default async function EditRequestPage({ params }: { params: { id: string } }) {
  const request = await getAdminRequest(params.id);
  if (!request) notFound();

  const boundAction = updateRequest.bind(null, params.id);

  return (
    <div>
      <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-6)" }}>
        Edit client request
      </h1>
      <RequestForm action={boundAction} request={request} />
    </div>
  );
}
