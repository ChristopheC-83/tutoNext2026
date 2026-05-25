"use client";

import { useUserStore } from "@/store/user.store";
import { UserDTO } from "@/types";
import { useEffect } from "react";

export default function UserHydrator({ user }: { user: UserDTO }) {
    const setUser = useUserStore((store) => store.setUser);
    
    //  on controle le fait qu'on a un user
    //  mais on ne renvoie pas de vue
    //  donc return null

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return null;
};

