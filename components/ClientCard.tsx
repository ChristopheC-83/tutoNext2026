"use client";

import { formatCurrency } from "@/lib/formats/format-helper";
import { ClientListItem } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ClientCard = ({ client }: { client: ClientListItem }) => {
  const router = useRouter();

  function handleCreateInvoiceBtnClick  (
    evt: React.MouseEvent<HTMLButtonElement>,
  )  {
    evt.preventDefault();
    //  l'idée est
    //  clic sur carte -> fichie client
    //  clic sur bouton -> nouvelle facture
    //  on doit stopper la propagation du clic bouton sur le bouton seulement
    evt.stopPropagation();
    router.push(`/invoices/new?clientId=${client.id}`);
  };

  return (
    <div className="h-full bg-white flex flex-col rounded-2xl px-4 py-8 items-center gap-4 hover: shadow-2xl hover:bg-stone-800 hover:text-white duration-300 cursor-pointer transition-transform overflow-x-hidden hover:-translate-x-2 hover:-translate-y-2     ">
      {/* AVATAR  */}
      <div className="border-2 border-black w-16 h-16 overflow-hidden rounded-full">
        <Image
          src={client.avatarUrl || "/uploads/avatars/clients/default.svg"}
          alt={client.name}
          width={64}
          height={64}
          className="object-cover w-full h-full"
        />
      </div>
      {/* INFOS  */}
      <div className="flex-1">
        <p className="font-semibold">{client.name}</p>
        <p className="text-sm">{client.email}</p>
        <div className="flex space-x-2 text-xs mt-4">
          <span className="">Total: {formatCurrency(client.totalAmount)}</span>
          <span>{client.invoicesCount} invoices</span>
          {client.overdueCount > 0 && (
            <span className="bg-red-100 text-red-700 px-2 rounded-full">
              {client.overdueCount} late
            </span>
          )}
        </div>
      </div>
      {/* ACTIONS */}
      <div className="">
        <button
          onClick={handleCreateInvoiceBtnClick}
          className="text-sm px-3 py-1 border rounded-lg cursor-pointer transition-transform hover:bg-stone-200 hover:text-black"
        >
          Create invoice
        </button>
      </div>
    </div>
  );
};
export default ClientCard;
