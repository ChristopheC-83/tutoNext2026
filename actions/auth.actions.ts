//  use server car toutes les fonctions ici sont des servers actions
"use server";

import { safeLogger } from "@/lib/logs/dev-logger";
import { prisma } from "@/lib/prisma";
import {
  LoginInputsType,
  loginSchema,
  RegisterInputsType,
  registerSchema,
} from "@/lib/validations/auth.schemas";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { ZodSafeParseResult } from "zod";

//  cette fonction helper permet de transformer les erreurs de zod en message lisible

function zodParseErrorsToReadable(
  safeParse: ZodSafeParseResult<RegisterInputsType>,
): string {
  if (safeParse.success) return "";
  const errors = safeParse?.error?.flatten().fieldErrors;
  const message = Object.entries(errors)
    .map(([field, msgs]) => `${field}: ${msgs?.join(", ")}`)
    .join(" | ");
  return message;
}

export async function registerAction(data: RegisterInputsType) {
  //On valide l'état des données dans les inputs
  const safeParse = registerSchema.safeParse(data);
  if (!safeParse.success) {
    safeLogger(safeParse);
    const message = zodParseErrorsToReadable(safeParse);
    throw new Error(message);
  }
  //on récupère les données
  const { name, email, password } = safeParse.data;
  //on vérifie que l'email n'est pas deja utilisé
  const registeredUser = await prisma.user.findUnique({ where: { email } });
  //  si email dejà utilisé, on lance une erreur
  if (registeredUser) {
    throw new Error("Email already exists");
  }
  // si pas d'erreurs, on créer l'utilisateur
  //  on va hasher le password grace à bcrypt
  const hashedPassword = await hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword, // on pense à envoyer le password hashé
    },
  });
}

export async function loginAction(data: LoginInputsType) {
  // on vérifie le type des données
  const safeParse = loginSchema.safeParse(data);
  if (!safeParse.success) {
    safeLogger(safeParse);
    const message = zodParseErrorsToReadable(safeParse);
    throw new Error(message);
  }
  // si Type est ok
  const { email, password } = safeParse.data;
  // le user existe il ?
  //  on cherche une réponse unique dans la db
  const user = await prisma.user.findUnique({ where: { email } });
  // on récupère le password hashé
  //  si on a un user et si on a un passhashé
  //  sinon on revoie "invalid"
  const hashedPassword = user?.password ?? "invalid";
  //  on compare avec bcrypt le mot de passe envoyé et le mot de passe hashé de la db
  const isPassValid = await compare(password, hashedPassword);
  // si pas de user ou si password pas bon, on sort
  if (!user || !isPassValid) {
    throw new Error("Invalid credentials");
  }
  // on va chercher le jwt_secret, le grain de sel
  //  si pas de secret, on sort
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  //  si tout va bien, on genere le token
  const token = sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    //  on donne une durée de vie
    { expiresIn: "7d" },
  );
  // on envoie le token dans les cookies
  const cookiesStore = await cookies();
  cookiesStore.set("token", token, {
    //  on ajoute des parametres
    //  http only, plus sécurisé, inaccessible en javascript du front
    httpOnly: true,
    //  secure => https en production
    //  en dev, on reste en http, sinon on ne pourrait pas tester
    secure: process.env.NODE_ENV === "production",
    // protection contre CSRF
    // Empêche un site malveillant de faire des requêtes à ton API
    //  en utilisant la session utilisateur.
    sameSite: "lax",
    //  valide sur tout le site
    path: "/",
    //  validité 7 jours
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function logoutAction() {
  //  on vire tout simplement le JWT des cookies de l'utilisateur
  const cookiesStore = await cookies();
  cookiesStore.delete("token");
}
