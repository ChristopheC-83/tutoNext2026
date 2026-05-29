"use client";

import {
  InvoicesListData,
  InvoicesListMeta,
  InvoicesListStats,
  KpiTitle,
} from "@/types";
import Title from "./Title";
import Link from "next/link";
import KpiCard from "./KpiCard";
import { formatCurrency } from "@/lib/formats/format-helper";
import { useRouter, useSearchParams } from "next/navigation";
import { normalizePagination } from "@/lib/pagination/pagination";
import InvoicesTable from "./InvoicesTable";

function InvoicesPageFront({
  invoices,
  stats,
  meta,
}: {
  invoices: InvoicesListData;
  stats: InvoicesListStats;
  meta: InvoicesListMeta;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { safePage, safeLimit } = normalizePagination(
    searchParams.get("page"),
    searchParams.get("limit"),
  );

  const changeParams = (newPage: number, newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    params.set("limit", String(newLimit));
    router.push(`/invoices?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="pl-2 space-y-6">
      {/* TOP  */}
      <div className="flex flex-wrap justify-between items-center">
        <Title text="Invoices" sub="See here all your invoices" />
        <Link
          href={"/invoices/new"}
          className="px-4 py-2 bg-black text-white rounded-lg cursor-pointer transition-transform hover:bg-stone-400 hover:text-black"
        >
          New invoice
        </Link>
      </div>
      {/* KPIs  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Total revenue"
          label={KpiTitle.REVENUE}
          value={formatCurrency(stats.revenue) || ""}
        />
        <KpiCard
          title="Paid"
          label={KpiTitle.PAID}
          value={formatCurrency(stats.paid) || ""}
        />
        <KpiCard
          title="Overdue"
          label={KpiTitle.OVERDUE}
          value={formatCurrency(stats.overdue) || ""}
        />
        <KpiCard
          title="Sent"
          label={KpiTitle.SENT}
          value={formatCurrency(stats.sent) || ""}
        />
        <KpiCard
          title="Draft"
          label={KpiTitle.DRAFT}
          value={formatCurrency(stats.draft) || ""}
        />
      </div>
      {/* FILTERS  */}
      <div className="flex flex-wrap gap-2 mb-4 items-center gap-x-8">
        <select
          name="limit"
          id="limit"
          value={safeLimit}
          onChange={(evt) => changeParams(1, Number(evt.target.value))}
          className="border px-2 py-1"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <div className="flex gap-x-2 items-center">
          <button
            className={`bg-stone-500 text-white px-2 py-1 rounded hover:bg-stone-600 ${safePage === 1 ? "hover:bg-stone-500" : ""}`}
            disabled={safePage === 1}
            onClick={() => changeParams(Math.max(safePage - 1, 1), safeLimit)}
          >
            Prev
          </button>
          <span className="text-center">
            Page {safePage}/{meta?.totalPages}
          </span>
          <button
            className={`bg-stone-500 text-white px-2 py-1 rounded hover:bg-stone-600 ${safePage === meta?.totalPages ? "hover:bg-stone-500" : ""}`}
            disabled={!meta || safePage >= meta?.totalPages}
            onClick={() => changeParams(safePage + 1, safeLimit)}
          >
            Next
          </button>
        </div>
        <div>({meta?.total || "n"}) invoices</div>
      </div>
      {/* TABLE */}
      <InvoicesTable invoices={invoices} />
    </div>
  );
}

export default InvoicesPageFront;
