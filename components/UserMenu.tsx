"use client";

import { useUserStore } from "@/store/user.store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logout from "./Logout";
import { useEffect, useRef, useState } from "react";

export default function UserMenu() {
  const user = useUserStore((store) => store.user);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  //  permet de fermer la popup Settings si click en dehors
  useEffect(() => {
    const handleOuterClick = (evt: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(evt.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOuterClick);
    return () => {
      document.removeEventListener("mousedown", handleOuterClick);
    };
  }, []);

  //  si pas de user, on ne renvoie pas de contexte
  if (!user) {
    return null;
  }

  return (
    <div className="relative text-black" ref={menuRef}>
      <div className="flex items-center gap-x-2">
        <button
          className="w-12 h-12 overflow-hidden"
          // pour ouvrir le menu, on click sur l'image
          onClick={() => setOpen(!open)}
        >
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              width={70}
              height={70}
              alt="user-avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>{user.name}</span>
          )}
        </button>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium leading-none">{user.name}</p>
          <p className="text-xs text-gray-500 leading-none">{user.email}</p>
        </div>
      </div>
      {open && (
        <div className="absolute right-0 mt-2 bg-white w-56 rounded-xl shadow-2xl p-2 border">
          <button
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
            onClick={() => router.push("/settings")}
          >
            Settings
          </button>
          <div className="border-t my-2"></div>
          <div className="px-3 py-2">
            <Logout />
          </div>
        </div>
      )}
    </div>
  );
}
