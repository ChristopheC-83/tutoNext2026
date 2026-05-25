"use client";

import { useUiStore } from "@/store/ui.store";
import { toast } from "react-toastify";

export default function AppearanceCard() {

    const theme = useUiStore((store) => store.theme);
    const toggle = useUiStore((store) => store.toggleTheme);

    const handleClick = () => {
      toggle();
      toast.success("User profile updated");
    };
  return (
    <div className="pt-6  shadow-2xl rounded-2xl w-full p-6 space-y-6 bg-neutral-300 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 duration-500">
      <h2 className="text-lg mb-2 font-bold text-indigo-900">Appearance</h2>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Theme ({theme})</p>
          <p className="font-sm text-gray-500">Switch light / dark mode</p>
        </div>
        {/* <button
          onClick={handleClick}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:opacity-80 cursor-pointer transition-transform"
        > */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input className="sr-only peer" type="checkbox" />
            <div  onClick={handleClick} className="w-20 h-10 rounded-full bg-linear-to-r from-yellow-300 to-orange-400 peer-checked:from-blue-400 peer-checked:to-indigo-500 transition-all duration-500 after:content-['☀️'] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-8 after:w-8 after:flex after:items-center after:justify-center after:transition-all after:duration-500 peer-checked:after:translate-x-10 peer-checked:after:content-['🌙'] after:shadow-md after:text-lg"></div>
            <span className="ml-3 text-sm font-medium text-gray-900">
              {theme==="light" ? "Light" : "Dark"}
            </span>
          </label>
        {/* </button> */}
      </div>
    </div>
  );
}
