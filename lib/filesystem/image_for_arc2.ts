import sharp from "sharp";
import crypto from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const IMAGE_SIZE = 256;
const JPEG_QUALITY = 85;

const STORAGE_HOST = process.env.BUNNY_STORAGE_HOST!;
const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE!;
const STORAGE_KEY = process.env.BUNNY_KEY!;
const CDN_URL = process.env.BUNNY_CDN_URL!;

export async function uploadImage(
  file: File | null | undefined,
  folder: string,
): Promise<string | undefined> {
  if (!(file instanceof File) || file.size === 0) return;

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too big");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Invalid file type");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const optimized = await sharp(buffer)
    .resize(IMAGE_SIZE, IMAGE_SIZE, { fit: "cover" })
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer();

  const filename = `${crypto.randomUUID()}.jpg`;
  const path = `avatars/${folder}/${filename}`;

  const uploadUrl = `${STORAGE_HOST}/${STORAGE_ZONE}/${path}`;

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      AccessKey: STORAGE_KEY,
      "Content-Type": "application/octet-stream",
    },
    body: new Uint8Array(optimized),
  });

  if (!res.ok) {
    throw new Error(`Upload failed (${res.status})`);
  }

  return `${CDN_URL}/${path}`;
}

export async function deleteImage(url?: string) {
  if (!url) return;

  const path = url.split(".net/")[1];
  if (!path) return;

  const deleteUrl = `${process.env.BUNNY_STORAGE_HOST}/${process.env.BUNNY_STORAGE_ZONE}/${path}`;

  const res = await fetch(deleteUrl, {
    method: "DELETE",
    headers: {
      AccessKey: process.env.BUNNY_KEY!,
    },
  });

  if (!res.ok) {
    console.warn("Failed to delete image:", url);
  }
}

export async function replaceImage(params: {
  file: File | null | undefined;
  folder: "users" | "clients";
  oldUrl?: string;
}): Promise<string | undefined> {
  const newUrl = await uploadImage(params.file, params.folder);

  if (newUrl && params.oldUrl) {
    await deleteImage(params.oldUrl);
  }

  return newUrl;
}

// Utilisation côté action (clean)
// const currentUser = await prisma.user.findUnique({
//   where: { id: user.userId },
//   select: { avatarUrl: true },
// });

// const avatarUrl = await replaceImage({
//   file,
//   folder: "users",
//   oldUrl: currentUser?.avatarUrl,
// });