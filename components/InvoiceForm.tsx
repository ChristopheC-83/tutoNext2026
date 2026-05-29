"use client";

import {
  createInvoiceAction,
  deleteOneInvoiceAction,
  patchOneInvoiceAction,
} from "@/actions/invoices.actions";
import { ClientDTO, ClientListItem, InvoiceWithClient } from "@/types";
import { InvoiceStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  mode: "edit" | "create";
  invoice?: InvoiceWithClient;
  clients: ClientListItem[];
  client?: ClientDTO;
};

export default function InvoiceForm({ mode, invoice, client, clients }: Props) {
  //  on a clients pour le menu deroulant pour choisir le client qu'on facture
  //  on a client pour le recupérer si on genere new facture du btn de la carte du client
  //  si new invoice depuis page invoices, pas de client renvoyé

  const router = useRouter();

  const [clientId, setClientId] = useState(initializeClientId() ?? "");
  const [amount, setAmount] = useState(invoice?.invoiceDetails?.amount ?? 0);
  const [status, setStatus] = useState(
    invoice?.invoiceDetails?.status ?? "DRAFT",
  );
  const [dueDate, setDueDate] = useState(
    invoice?.invoiceDetails.dueDate
      ? new Date(invoice.invoiceDetails.dueDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  );
  const [isLoading, setIsLoading] = useState(false);

  function initializeClientId() {
    if (client) {
      return client.id;
    }
    return invoice?.invoiceDetails.clientId;
  }

  function getSubmitBtnLabel ()  {
    if (isLoading) {
      return mode === "create" ? "Saving..." : "Updating...";
    }
    return mode === "create" ? "Save" : "Update";
  };

  async function handleDelete() {
    setIsLoading(true);
    //Guard
    if (!invoice?.invoiceDetails.id) {
      return;
    }
    //Confirm box
    const deleteConfirm = confirm("Delete this invoice ?");
    if (!deleteConfirm) {
      setIsLoading(false);
      return
    };
    //Call backend
    try {
      await deleteOneInvoiceAction({ id: invoice.invoiceDetails.id });
      toast.success("Invoice deleted");
      setTimeout(() => {
        router.push(`/invoices`);
      }, 1200);
    } catch (error) {
      console.log(error);
      toast.error("Error deleting invoice");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    setIsLoading(true);
    const payload = { amount, status, dueDate: new Date(dueDate), clientId };
    try {
      if (mode === "create") {
        await createInvoiceAction(payload);
      } else {
        if (invoice?.invoiceDetails.id) {
          await patchOneInvoiceAction({
            id: invoice?.invoiceDetails.id,
            payload,
          });
        }
      }
      toast.success(mode === "create" ? "Invoice created" : "Invoice updated");
      setTimeout(() => {
        router.push(`/invoices`);
      }, 1200);
    } catch (error) {
      console.log(error);
      toast.error("Error white creating/updating invoice");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-2xl rounded-2xl p-6 space-y-6 w-full"
    >
      <h2 className="text-xl font-semibold">
        {mode === "edit"
          ? `Invoice #${invoice?.invoiceDetails?.number}`
          : `Create a new invoice`}
      </h2>
      <div className="grid grid-cols-1 gap-y-4">
        {/* PICK CLIENT  */}
        <div className="w-full flex flex-wrap items-center justify-between gap-x-2">
          <label htmlFor="client" className="text-sm font-medium w-32">
            Client
          </label>
          <select
            required
            disabled={mode === "edit"}
            name="client"
            id="client"
            className="w-full border rounded px-3 py-2"
            value={clientId}
            onChange={(evt) => setClientId(evt.target.value)}
          >
            <option value={""} disabled>
              Select client
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        {/* CHOOSE AMOUNT  */}
        <div className="w-full flex flex-wrap items-center justify-between gap-x-2">
          <label htmlFor="amount" className="text-sm font-medium w-32">
            Amount ($)
          </label>
          <input
            name="amount"
            id="amount"
            type="number"
            required
            className="w-full border rounded px-3 py-2"
            value={amount}
            onChange={(evt) => setAmount(Number(evt.target.value))}
          />
        </div>
        {/* STATUS  */}
        <div className="w-full flex flex-wrap items-center justify-between gap-x-2">
          <label htmlFor="status" className="text-sm font-medium w-32">
            status
          </label>
          <select
            name="status"
            id="status"
            className="w-full border rounded px-3 py-2"
            value={status}
            onChange={(evt) => setStatus(evt.target.value as InvoiceStatus)}
          >
            <option value="DRAFT">DRAFT</option>
            <option value="SENT">SENT</option>
            <option value="OVERDUE">OVERDUE</option>
            <option value="PAID">PAID</option>
          </select>
        </div>
        {/* ISSUE DATE  */}
        <div className="w-full flex flex-wrap items-center justify-between gap-x-2">
          <label htmlFor="due-date" className="text-sm font-medium w-32">
            Issue date
          </label>
          <input
            name="due-date"
            id="due-date"
            type="date"
            required
            className="w-full border rounded px-3 py-2"
            value={dueDate}
            onChange={(evt) => setDueDate(evt.target.value)}
          />
        </div>
      </div>
      {/* ACTIONS */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 justify-end">
        <button
          type="button" // pour ne pas soumettre le formulaire
          className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-500 disabled:opacity-50"
          onClick={handleDelete}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-stone-700 disabled:opacity-50"
        >
          {getSubmitBtnLabel()}
        </button>
      </div>
    </form>
  );
};

