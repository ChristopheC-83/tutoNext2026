import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { Metadata } from "next";

//  Ces metadatas écrasent celles du Layout
export const metadata: Metadata = {
  title: "Tuto Next 2026 | Dashboard",
  description: "Page Dashboard",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function DashboardPage() {
  return <div>
    <Title text="Dashboard" sub="Global Overview" />
    <SubTitle sub="Latest Invoices" />
  </div>;
}
