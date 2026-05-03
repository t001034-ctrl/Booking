"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CarStatus } from "@/generated/prisma/enums";

export async function updateCarStatus(carId: number, status: CarStatus) {
  if (!Number.isInteger(carId) || carId <= 0) {
    throw new Error("Invalid car id.");
  }
  if (!Object.values(CarStatus).includes(status)) {
    throw new Error("Invalid status value.");
  }

  await prisma.car.update({
    where: { id: carId },
    data: { status },
  });

  revalidatePath("/admin");
}
