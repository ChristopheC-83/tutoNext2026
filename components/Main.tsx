"use client";

import { useAppStore } from "@/store/app.store";
import BurgerButton from "./BurgerButton";
import ButtonsBar from "./ButtonsBar";
import Topbar from "./Topbar";
export default function Main({ children }: { children: React.ReactNode }) {
  const open = useAppStore((store) => store.open);
  return (
    <div
      className={`flex-1 h-screen overflow-y-auto mb-4  flex-col relative transform transition-transform duration-700 ease-in-out ${open ? "ml-20 sm:ml-52" : "ml-0"}`}
    >
      <BurgerButton />
      <Topbar />
      <ButtonsBar />
      <main className="p-6 flex-1 bg-stone-200 text-black min-h-screen">
        {children}
      </main>
    </div>
  );
}
