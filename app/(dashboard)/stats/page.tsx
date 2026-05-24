import { statsAction } from "@/actions/stats.actions";
import KpiCard from "@/components/KpiCard";
import RevenueChart from "@/components/RevenueChart";
import InvoicesStatusChart from "@/components/InvoicesStatusChart";
import TopClientsChart from "@/components/TopClientsChart";
import Title from "@/components/Title";
import { KpiTitle } from "@/types/dashboard.types";
import { Metadata } from "next";

//  Ces metadatas écrasent celles du Layout
export const metadata: Metadata = {
  title: "Tuto Next 2026 | Stats",
  description: "Page Stats",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function StatsPage() {

  const data = await statsAction();

  return (
    <div className="pl-2 space-y-6">
      <Title text="Stats" sub="Monitor your performances" />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard
            title="total number of clients"
            label={KpiTitle.CLIENTS}
            value={data.totalClients}
          />
          <KpiCard
            title="total number of invoices"
            label={KpiTitle.INVOICES}
            value={data.totalInvoices}
          />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <RevenueChart data={data} />
          <TopClientsChart data={data} />
          <InvoicesStatusChart data={data} />
        </div>
      </div>
    </div>
  );
}
