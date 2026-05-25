"use client";


import { Menu } from "lucide-react";
import { useAppStore } from "@/store/app.store";

export default function BurgerButton() {
  const toggle = useAppStore((store) => store.toggleOpen);
  
  return (
    <div
      onClick={toggle}
      className="absolute top-6 left-4 rounded-full border-2 p-2 hover:bg-stone-400 hover:dark:bg-stone-400 hover:dark:text-black cursor-pointer"
    >
      <Menu />
    </div>
  );
}
