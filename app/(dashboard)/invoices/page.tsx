import { getAllInvoicesAction } from "@/actions/invoices.actions";
import InvoicesPageFront from "@/components/InvoicesPageFront";
import { normalizePagination } from "@/lib/pagination/pagination";
import { Metadata } from "next";

//  Ces metadatas écrasent celles du Layout
export const metadata: Metadata = {
  title: "Tuto Next 2026 | Invoices",
  description: "Page Invoices",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const { page, limit } = await searchParams;

  const { safePage, safeLimit } = normalizePagination(page, limit);

  const data = await getAllInvoicesAction({ page: safePage, limit: safeLimit });

  return (
    <InvoicesPageFront
      invoices={data.data}
      meta={data.meta}
      stats={data.stats}
    />
  );
}
