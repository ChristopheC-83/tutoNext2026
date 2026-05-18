"use client";

import {
  ChartColumnStacked,
  LayoutDashboard,
  ScrollText,
  Settings,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/invoices", label: "Invoices", icon: ScrollText },
    { href: "/stats", label: "Stats", icon: ChartColumnStacked },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const pathname = usePathname();

  // const open = useAppStore((store) => store.open);
  return (
    <aside
      className={`fixed top-0 left-0 z-10 h-full w-20 sm:w-52 flex-col rounded-2xl bg-stone-900 text-white transform transition-transform duration-900 ease-in-out `}
    >
      <Link
        className="p-6 text-xl font-bold border-b flex gap-x-4 hover:text-blue-600 hover:border-b-white"
        href={"/dashboard"}
      >
        <Image src={"/favicon.svg"} width={32} height={32} alt="logo" />
        <span className="hidden sm:inline">Invoicer</span>
      </Link>
      <nav className="flex-1 p-4 space-y-2">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              href={href}
              key={href}
              className={`px-4 rounded py-2 hover:bg-stone-50 hover:text-blue-600 flex gap-x-1 ${isActive ? "bg-stone-500" : ""}`}
            >
              <Icon />
              <span>{label}</span>
            </Link>
          );
        })}
        <div>{/* <Logout /> */} Logout</div>
      </nav>
    </aside>
  );
}
