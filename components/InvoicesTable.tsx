"use client";

import { InvoicesListData } from "@/types/invoices.types";
import Image from "next/image";
import StatusBadge from "./StatusBadge";
import { formatCurrency } from "@/lib/formats/format-helper";
import { useRouter } from "next/navigation";

export default function InvoicesTable({
  invoices,
}: {
  invoices: InvoicesListData | null;
}) {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/invoices/${id}`);
  };

  return (
    <div className="rounded-xl shadow-2xl overflow-hidden bg-white">
      <table className="w-full text-sm">
        <thead className="uppercase border-b bg-stone-400 rounded-t-4xl">
          <tr>
            <th className="px-4 py-3" scope="col">
              #
            </th>
            <th className="px-4 py-3" scope="col">
              Client
            </th>
            <th className="px-4 py-3" scope="col">
              Status
            </th>
            <th className="px-4 py-3 hidden sm:table-cell" scope="col">
              Due date
            </th>
            <th className="px-4 py-3 hidden sm:table-cell" scope="col">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {!invoices || invoices.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-3">
                No results
              </td>
            </tr>
          ) : (
            invoices.map(({ invoiceDetails, invoiceClient }) => (
              <tr
                onClick={() => handleClick(invoiceDetails.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick(invoiceDetails.id);
                  }
                }}
                role="button"
                tabIndex={0}
                key={invoiceDetails.id}
                className="border-b border-gray-200 cursor-pointer transition-transform hover:bg-stone-400/50 duration-100 "
              >
                <td className="px-4 py-3">{invoiceDetails.number}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Image
                      height={32}
                      width={32}
                      src={
                        invoiceClient.avatarUrl ||
                        "/uploads/avatars/clients/default.svg"
                      }
                      alt={invoiceClient.name}
                      className="rounded-full object-cover"
                    />
                    <span>{invoiceClient.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={invoiceDetails.status} />
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  {new Date(invoiceDetails.dueDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  {formatCurrency(invoiceDetails.amount)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
