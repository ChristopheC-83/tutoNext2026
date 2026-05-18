import Main from "@/components/Main";
import Sidebar from "@/components/Sidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen overflow-hiddendark:bg-gray-800 bg-gray-200">
      <Sidebar />
      <Main>{children}</Main>
    </div>
  );
}
