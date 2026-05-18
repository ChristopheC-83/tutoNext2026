import { Menu } from "lucide-react";

export default function BurgerButton() {
  return (
    <div className="absolute top-4 left-4 rounded-full p-2 hover:bg-stone-400 hover:dark:bg-stone-400 hover:dark:text-black cursor-pointer dark:text-white">
      <Menu />
    </div>
  );
}
