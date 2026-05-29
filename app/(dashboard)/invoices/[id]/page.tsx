import { getAllClientsAction } from "@/actions/clients.actions";
import { getOneInvoiceAction } from "@/actions/invoices.actions";
import InvoiceForm from "@/components/InvoiceForm";
import { redirect } from "next/navigation";

export default  async function InvoiceDetailsPage  ({
  params,
}: {
  params: Promise<{ id: string }>;
})  {
  const { id } = await params;

  const invoice = await getOneInvoiceAction({ id });

  if (!invoice) {
    redirect("/invoices");
  }

  const clients = (await getAllClientsAction({ page: 1, limit: 10 }))?.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Invoice details</h1>
      <InvoiceForm mode="edit" clients={clients} invoice={invoice} />
    </div>
  );
};
