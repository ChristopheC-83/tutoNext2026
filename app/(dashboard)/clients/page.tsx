import { getAllClientsAction } from "@/actions/clients.actions";
import ClientsPageFront from "@/components/ClientsPageFront";
import { normalizePagination } from "@/lib/pagination/pagination";
import { Metadata } from "next";

//  Ces metadatas écrasent celles du Layout
export const metadata: Metadata = {
  title: "Tuto Next 2026 | Clients",
  description: "Page Clients",
  icons: {
    icon: "/favicon.svg",
  },
};


//  depuis next  15 ou 16,
//  SearchParams est asynchrone, c'est une promesse

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const { page, limit } = await searchParams;

  const { safePage, safeLimit } = normalizePagination(page, limit);

  const data = await getAllClientsAction({ page: safePage, limit: safeLimit });

  return (
    <ClientsPageFront clients={data.data} meta={data.meta} stats={data.stats} />
  );
}
