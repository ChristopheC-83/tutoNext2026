import {
  getAllClientsAction,
  getOneClientAction,
} from "@/actions/clients.actions";
import InvoiceForm from "@/components/InvoiceForm";

const NewInvoicePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) => {
  const { clientId } = await searchParams;

  let client;
  if (clientId) {
    client = await getOneClientAction({ id: clientId });
  }

  const clients = (await getAllClientsAction({ page: 1, limit: 10 }))?.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Invoice details</h1>
      <InvoiceForm mode="create" clients={clients} client={client} />
    </div>
  );
};

export default NewInvoicePage;
