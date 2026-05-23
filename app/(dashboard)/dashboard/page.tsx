import { dashboardAction } from "@/actions/dashboard.actions";
import InvoicesTable from "@/components/InvoicesTable";
import KpiCard from "@/components/KpiCard";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { formatCurrency } from "@/lib/formats/format-helper";
import { KpiTitle } from "@/types/dashboard.types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Invoicer",
  description: "Your business dashboard",
};

export default async function DashboardPage  () {
  const data = await dashboardAction();

  return (
    <div className="pl-2 space-y-6">
      {/* TITLE */}
      <Title text="Dashboard" sub="Global overview" />
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Total number of invoices"
          label={KpiTitle.INVOICES}
          value={data.totalInvoices}
        />
        <KpiCard
          title="Total number of clients"
          label={KpiTitle.CLIENTS}
          value={data.clientsCount}
        />
        <KpiCard
          title="Invoices billed for"
          label={KpiTitle.PENDING}
          value={formatCurrency(data.pending)}
        />
        <KpiCard
          title="Invoices overdue for"
          label={KpiTitle.OVERDUE}
          value={formatCurrency(data.overdue)}
        />
      </div>
      {/* PAID REVENUE */}
      <KpiCard
        title="Revenue (paid)"
        label={KpiTitle.PAID}
        value={formatCurrency(data.revenue)}
      />
      {/* SUB TITLE */}
      <SubTitle sub="Latest invoices" />
      {/* TABLE */}
      {!(data.latestInvoices.length > 0) ? (
        <div className="text-sm text-gray-500">No recent invoices yet</div>
      ) : (
        <InvoicesTable invoices={data.latestInvoices} />
      )}
    </div>
  );
};
