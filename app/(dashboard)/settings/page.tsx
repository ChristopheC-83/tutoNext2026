import { Metadata } from "next";

//  Ces metadatas écrasent celles du Layout
export const metadata: Metadata = {
  title: "Tuto Next 2026 | Settings",
  description: "Page Settings",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function SettingsPage() {
  return <div>SettingsPage</div>;
}
