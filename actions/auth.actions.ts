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
  //Check type
  const safeParse = loginSchema.safeParse(data);
  if (!safeParse.success) {
    safeLogger(safeParse);
    const message = zodParseErrorsToReadable(safeParse);
    throw new Error(message);
  }
  //Type is fine
  const { email, password } = safeParse.data;
  //Check user exists
  const user = await prisma.user.findUnique({ where: { email } });
  //Take user hashedPass, or invalid one (to always compare two ashes)
  const hashedPassword =
    user?.password ?? "invalidinvalidinvalidinvalidinvalidinvalidinv";
  const isPassValid = compare(password, hashedPassword);
  //If no user or wrong password
  if (!user || !isPassValid) {
    throw new Error("Invalid credentials");
  }
  //If user found, and good password, make token
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  const token = sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
  //Set cookie with cookies API :
  const cookiesStore = await cookies();
  cookiesStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function logoutAction() {
  const cookiesStore = await cookies();
  cookiesStore.delete("token");
}
