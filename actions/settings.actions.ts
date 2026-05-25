"use server";

import { requireUser } from "@/lib/auth/requireUser";
import { processAvatarFile } from "@/lib/filesystem/img-processor";
import { toUserDTO } from "@/lib/mappers/user.mapper";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations/settings.schemas";
import { UserDTO } from "@/types";
import { hash } from "bcrypt";
import { redirect } from "next/navigation";

// On recupère les infos de l'utilisateur connecté avec son profil
export async function getProfileAction(): Promise<UserDTO> {
  // recupération du user en cours
  const user = await requireUser();

  // Récupération des informations en db
  const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });

  //  si pas de user, on sort
  if (!dbUser) {
    redirect("/");
  }
  // on sécurise les informations en passant par le DTO
  const profile = toUserDTO(dbUser);
  // on retourne les informations
  return profile;
}


//  pour mettre le profil à jour, attention, ici, fonction un peu monolithique !
//  pour ARC on pourra découpler les actions (name, avater, password)
export async function patchProfileAction({
  name,
  password,
  file,
}: {
  name: string;
  password: string;
  file: File | null;
}): Promise<UserDTO> {
  // recupération du user en cours
  const user = await requireUser();
  // Validation des données avec ZOD, safeParse
  const safeParse = profileSchema.safeParse({ name, password });
  if (!safeParse.success) {
    throw new Error("Invalid inputs");
  }
  // On sauvegarde l'avatar
  //  si plantage, on recupère un undefined
  const avatarUrl = await processAvatarFile("user", file);

  //Craft update data
  const updateData: { name?: string; password?: string; avatarUrl?: string } = {
    name: safeParse.data.name,
    ...(avatarUrl ? { avatarUrl } : {}),
  };
  if (safeParse.data.password) {
    updateData.password = await hash(safeParse.data.password, 10);
  }
  //DB entity patch
  const updatedUser = await prisma.user.update({
    where: { id: user.userId },
    data: updateData,
  });
  //Mapper
  const updatedProfile = toUserDTO(updatedUser);
  //Return updatedUser
  return updatedProfile;
}
