import { UserFromToken } from "@/types";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { JWT_SECRET } from "../config/config";
import { safeLogger } from "../logs/dev-logger";
import { redirect } from "next/navigation";


//  cette fonction permet de verifier si l'utilisateur est connecté
//  on recupère la valeur de la clé "token" dans les cookies
//  si pas "token" on retourne null
//  si "token" on decode le token et on retourne l'user décodé

export async function getUserFromCookies(): Promise<UserFromToken | null> {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;
  if (!token) return null;
  try {
    const decodedUser = verify(token, JWT_SECRET) as UserFromToken;
    return decodedUser;
  } catch (error) {
    safeLogger(error);
    return null;
  }
}

//  on crée la vraie fonction appelée partout, dans toutes les actions
//  si pas de user, on redirige vers la page de login
//  si user, on retourne l'user

export async function requireUser(): Promise<UserFromToken> {
  const user = await getUserFromCookies();
  if (!user) {
    redirect("/login");
  }
  return user;
}
