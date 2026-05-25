// import ProfileCard from "@/components/ProfileCard";
import AppearanceCard from "@/components/AppearanceCard";
import Title from "@/components/Title";
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
  return (
    <div className="pl-2">
      <Title text="Settings" sub="Manage your settings" />
      <div className="flex flex-col gap-y-6">
        {/* <ProfileCard /> */}
        <AppearanceCard />
      </div>
    </div>
  );
}
