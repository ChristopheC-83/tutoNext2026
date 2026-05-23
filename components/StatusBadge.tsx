import { InvoiceStatus } from "@prisma/client";

export default function StatusBadge({ status }: { status: InvoiceStatus }) {
  const colorMapper = {
    PAID: "bg-green-100 text-green-700",
    SENT: "bg-blue-100 text-blue-700",
    OVERDUE: "bg-red-100 text-red-700",
    DRAFT: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`px-2 py-1 rounded text-sm font-medium ${colorMapper[status]}`}
    >
      {status}
    </span>
  );
}
