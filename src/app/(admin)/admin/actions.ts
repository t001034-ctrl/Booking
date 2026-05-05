"use server";

import { revalidatePath } from "next/cache";
import { getServiceRoleClient } from "@/lib/supabase";
import { CAR_STATUSES, type CarStatus } from "@/lib/db-types";

export async function updateCarStatus(carId: number, status: CarStatus) {
  if (!Number.isInteger(carId) || carId <= 0) {
    throw new Error("Invalid car id.");
  }
  if (!CAR_STATUSES.includes(status)) {
    throw new Error("Invalid status value.");
  }

  const supabase = getServiceRoleClient();
  const { error } = await supabase
    .from("cars")
    .update({ status })
    .eq("id", carId);
  if (error) throw error;

  revalidatePath("/admin");
}
