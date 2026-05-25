import path from "path";
import sharp from "sharp";
import { supabase } from "../supabase/supabase";
import fs from "fs";

export async function processAvatarFile(
  mode: "client" | "user",
  file?: File | null,
): Promise<string | undefined> {
  //On valide qu'un reçoit un fichier et size > 0
  if (!(file instanceof File) || file.size === 0) return;

  //  si fichier trop gros, ici 3Mo
  if (file.size > 3 * 1024 * 1024) {
    throw new Error("File too big");
  }

  //  si fichier pas une image
  if (!file.type.startsWith("image/")) {
    throw new Error("Invalid file type");
  }
  //si tout bon, on continue
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const croppedBuffer = await sharp(buffer)
    .resize(512, 512, { fit: "cover" })
    .jpeg({ quality: 90 })
    .toBuffer();

  const folder = mode === "client" ? "clients" : "users";
  //  on donne un nom de fichier unique random
  const fileName = `${folder}/${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage
    .from("invoicer-avatars")
    .upload(fileName, croppedBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    });
  if (error) {
    throw new Error("Failed to upload avatar: " + error);
  }
  const { data: publicUrl } = supabase.storage
    .from("invoicer-avatars")
    .getPublicUrl(fileName);
  return publicUrl.publicUrl;
}

export function fileFromPath(filePath: string): File {
  const buffer = fs.readFileSync(filePath);
  return new File([buffer], path.basename(filePath), { type: "image/webp" });
}
