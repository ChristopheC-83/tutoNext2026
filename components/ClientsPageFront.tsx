"use client";

import {
  ClientListItem,
  ClientListMeta,
  ClientListStats,
  KpiTitle,
} from "@/types";
import Title from "./Title";
import Link from "next/link";
import KpiCard from "./KpiCard";
import { useRouter, useSearchParams } from "next/navigation";
import { normalizePagination } from "@/lib/pagination/pagination";
import ClientCard from "./ClientCard";

export default function ClientsPageFront({
  clients,
  meta,
  stats,
}: {
  clients: ClientListItem[];
  meta: ClientListMeta;
  stats: ClientListStats;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { safePage, safeLimit } = normalizePagination(
    searchParams.get("page"),
    searchParams.get("limit"),
  );

  function changeParams(newPage: number, newLimit: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    params.set("limit", String(newLimit));
    router.push(`/clients?${params.toString()}`, { scroll: false });
  }

  console.log(clients);

  return (
    <div className="pl-2 space-y-6">
      {/* TOP */}
      <div className="flex flex-wrap justify-between items-center">
        <Title text="Clients" sub="All details about your clients" />
        <Link
          href={"/clients/new"}
          className="px-4 py-2 bg-black text-white rounded-lg cursor-pointer transition-transform hover:bg-stone-400 hover:text-black"
        >
          New client
        </Link>
      </div>
      {/* KPIs */}
      <KpiCard
        title="Clients"
        label={KpiTitle.REVENUE}
        value={stats.totalClients}
      />
      {/* PAGE AND LIMIT SELECT BOXES */}
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
        <div>({meta?.total || "n"}) clients</div>
      </div>
      {/* GRID CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {clients.map((client: ClientListItem) => (
          <Link key={client.id} href={`/clients/${client.id}`}>
            <ClientCard client={client} />
          </Link>
        ))}
      </div>
    </div>
  );
}
