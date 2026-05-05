"use server";

import path from "node:path";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getServiceRoleClient,
  STORAGE_BUCKET_CAR_IMAGES,
} from "@/lib/supabase";
import { CAR_STATUSES, type CarStatus } from "@/lib/db-types";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export type AddCarState = {
  error?: string;
};

export async function addCar(
  _prevState: AddCarState,
  formData: FormData,
): Promise<AddCarState> {
  const make = String(formData.get("make") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  const yearRaw = String(formData.get("year") ?? "").trim();
  const priceRaw = String(formData.get("pricePerDay") ?? "").trim();
  const status = String(formData.get("status") ?? "") as CarStatus;
  const image = formData.get("image");

  if (!make || !model) {
    return { error: "Make and model are required." };
  }

  const year = Number.parseInt(yearRaw, 10);
  if (!Number.isFinite(year) || year < 1900 || year > 2100) {
    return { error: "Year must be a valid number between 1900 and 2100." };
  }

  const pricePerDay = Number.parseFloat(priceRaw);
  if (!Number.isFinite(pricePerDay) || pricePerDay < 0) {
    return { error: "Price per day must be a non-negative number." };
  }

  if (!CAR_STATUSES.includes(status)) {
    return { error: "Invalid status value." };
  }

  if (!(image instanceof File) || image.size === 0) {
    return { error: "Please select an image file to upload." };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
    return { error: "Image must be JPEG, PNG, WebP, or GIF." };
  }

  if (image.size > MAX_IMAGE_BYTES) {
    return { error: "Image must be 5 MB or smaller." };
  }

  const supabase = getServiceRoleClient();

  const ext =
    path.extname(image.name) || `.${image.type.split("/")[1] ?? "bin"}`;
  const objectName = `${Date.now()}-${randomUUID()}${ext}`;
  const bytes = Buffer.from(await image.arrayBuffer());

  const { error: uploadErr } = await supabase.storage
    .from(STORAGE_BUCKET_CAR_IMAGES)
    .upload(objectName, bytes, { contentType: image.type, upsert: false });
  if (uploadErr) {
    return { error: `Image upload failed: ${uploadErr.message}` };
  }

  const { data: pub } = supabase.storage
    .from(STORAGE_BUCKET_CAR_IMAGES)
    .getPublicUrl(objectName);
  const imagePath = pub.publicUrl;

  const { error: insertErr } = await supabase
    .from("cars")
    .insert({ make, model, year, pricePerDay, status, imagePath });
  if (insertErr) {
    // best-effort cleanup of the orphaned upload
    await supabase.storage
      .from(STORAGE_BUCKET_CAR_IMAGES)
      .remove([objectName]);
    return { error: insertErr.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/add-car");
  redirect("/admin?added=1");
}
