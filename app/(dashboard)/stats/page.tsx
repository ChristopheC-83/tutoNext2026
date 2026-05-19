import { Metadata } from "next";

//  Ces metadatas écrasent celles du Layout
export const metadata: Metadata = {
  title: "Tuto Next 2026 | Stats",
  description: "Page Stats",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function StatsPage() {
  return <div>StatsPage</div>;
}
