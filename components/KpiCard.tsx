import { KpiTitle } from "@/types/dashboard.types";

export default function KpiCard({
  label,
  title,
  value,
}: {
  label: KpiTitle;
  title: string;
  value: string | number;
}) {
  const colorMapper = {
    INVOICES: { bg: "bg-sky-200", text: "text-sky-900" },
    REVENUE: { bg: "bg-pink-200", text: "text-pink-900" },
    PENDING: { bg: "bg-orange-200", text: "text-orange-900" },
    OVERDUE: { bg: "bg-indigo-200", text: "text-indigo-900" },
    CLIENTS: { bg: "bg-fuchsia-200", text: "text-fuchsia-900" },
    PAID: { bg: "bg-emerald-200", text: "text-emerald-900" },
    SENT: { bg: "bg-amber-200", text: "text-amber-900" },
    DRAFT: { bg: "bg-red-200", text: "text-red-900" },
  };

  return (
    <div className={`rounded-xl p-4 shadow-2xl bg-white flex`}>
      <div className={`p-1 mr-1 ${colorMapper[label].bg}`}></div>
      <div>
        <p className={`text-xl font-semibold ${colorMapper[label].text}`}>
          {/*  mettre le 1er caractere en Majuscule */}
          {title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()}
        </p>
        <p className="font-semibold mt-1">{value}</p>
      </div>
    </div>
  );
}
