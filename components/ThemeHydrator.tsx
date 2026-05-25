"use client";

import { useUiStore } from "@/store/ui.store";
import { useEffect } from "react";


export default function ThemeHydrator() {
  const theme = useUiStore((store) => store.theme);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return null;
}
