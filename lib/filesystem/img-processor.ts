import path from "path";
import sharp from "sharp";
import fs from "fs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const AVATAR_SIZE = 256;
const JPEG_QUALITY = 85;

// export async function processAvatarFile(
//   mode: "client" | "user",
//   file?: File | null,
// ): Promise<string | undefined> {
//   if (!(file instanceof File) || file.size === 0) return;

//   if (file.size > 5 * 1024 * 1024) {
//     throw new Error("File too big");
//   }

//   if (!file.type.startsWith("image/")) {
//     throw new Error("Invalid file type");
//   }

//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);

//   const croppedBuffer = await sharp(buffer)
//     .resize(512, 512, { fit: "cover" })
//     .jpeg({ quality: 90 })
//     .toBuffer();

//   const filename = `${crypto.randomUUID()}.jpg`;

//   const folder = mode === "client" ? "clients" : "users";

//   // chemin dans Bunny Storage
//   const uploadPath = `avatars/${folder}/${filename}`;

//   // upload vers Bunny Storage
//   const uploadUrl = `${process.env.BUNNY_STORAGE_HOST}/${process.env.BUNNY_STORAGE_ZONE}/${uploadPath}`;

//   const response = await fetch(uploadUrl, {
//     method: "PUT",
//     headers: {
//       AccessKey: process.env.BUNNY_KEY!,
//       "Content-Type": "application/octet-stream",
//     },
//     body: new Uint8Array(croppedBuffer),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to upload avatar to Bunny");
//   }

//   // URL publique via CDN
//   return `${process.env.BUNNY_CDN_URL}/${uploadPath}`;
// }

export async function processAvatarFile(
  mode: "client" | "user",
  file?: File | null,
): Promise<string | undefined> {
  if (!(file instanceof File) || file.size === 0) return;

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too big");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Invalid file type");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const croppedBuffer = await sharp(buffer)
    .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: "cover" })
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer();

  const filename = `${crypto.randomUUID()}.jpg`;

  const folder = mode === "client" ? "clients" : "users";

  const uploadPath = `avatars/${folder}/${filename}`;

  const uploadUrl =
    `${process.env.BUNNY_STORAGE_HOST}/` +
    `${process.env.BUNNY_STORAGE_ZONE}/` +
    uploadPath;

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      AccessKey: process.env.BUNNY_KEY!,
      "Content-Type": "application/octet-stream",
    },
    body: new Uint8Array(croppedBuffer),
  });

  if (!response.ok) {
    throw new Error(`Bunny upload failed (${response.status})`);
  }

  return `${process.env.BUNNY_CDN_URL}/${uploadPath}`;
}

export async function deleteOldAvatar(url?: string) {
  if (!url) return;

  const path = url.split(".net/")[1];
  if (!path) return;

  const deleteUrl = `${process.env.BUNNY_STORAGE_HOST}/${process.env.BUNNY_STORAGE_ZONE}/${path}`;

  await fetch(deleteUrl, {
    method: "DELETE",
    headers: {
      AccessKey: process.env.BUNNY_KEY!,
    },
  });
}

export function fileFromPath(filePath: string): File {
  const buffer = fs.readFileSync(filePath);
  return new File([buffer], path.basename(filePath), { type: "image/webp" });
}