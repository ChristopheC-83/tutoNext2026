import { Metadata } from "next";


//  Ces metadatas écrasent celles du Layout
export const metadata: Metadata = {
  title: "Tuto Next 2026 | Clients",
  description:
    "Page Clients",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function ClientsPage() {
  return <div>ClientsPage</div>;
}
