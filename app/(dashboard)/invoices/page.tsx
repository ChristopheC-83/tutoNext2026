import { Metadata } from "next";

//  Ces metadatas écrasent celles du Layout
export const metadata: Metadata = {
  title: "Tuto Next 2026 | Invoices",
  description: "Page Invoices",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function InvoicesPage() {
  return <div>InvoicesPage</div>;
}
