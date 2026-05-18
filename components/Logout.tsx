import { LogOut } from "lucide-react";

export default function Logout() {
  return (
    <button
      className="w-full rounded text-left cursor-pointer px-4 py-2 hover:bg-stone-50 hover:text-blue-600 flex gap-x-1 duration-300"
    >
      <LogOut />
      <span>Logout</span>
    </button>
  );
}
