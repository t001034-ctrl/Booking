"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServiceRoleClient } from "@/lib/supabase";
import type { Car } from "@/lib/db-types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type CreateBookingState = {
  error?: string;
};

function parseDateOnly(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function billableDays(start: Date, end: Date): number {
  const diff = (end.getTime() - start.getTime()) / MS_PER_DAY;
  return Math.max(1, Math.ceil(diff));
}

export async function createBooking(
  _prevState: CreateBookingState,
  formData: FormData,
): Promise<CreateBookingState> {
  const carIdRaw = String(formData.get("carId") ?? "").trim();
  const startRaw = String(formData.get("startDate") ?? "").trim();
  const endRaw = String(formData.get("endDate") ?? "").trim();
  const customerName = String(formData.get("customerName") ?? "").trim();

  const carId = Number.parseInt(carIdRaw, 10);
  if (!Number.isInteger(carId) || carId <= 0) {
    return { error: "Invalid car selection." };
  }

  if (!customerName) {
    return { error: "Please enter your name." };
  }

  const startDate = parseDateOnly(startRaw);
  const endDate = parseDateOnly(endRaw);
  if (!startDate || !endDate) {
    return { error: "Please choose valid start and end dates." };
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (startDate.getTime() < today.getTime()) {
    return { error: "Start date cannot be in the past." };
  }
  if (endDate.getTime() < startDate.getTime()) {
    return { error: "End date must be on or after the start date." };
  }

  const supabase = getServiceRoleClient();

  const { data: carData, error: carErr } = await supabase
    .from("cars")
    .select("id, pricePerDay, status")
    .eq("id", carId)
    .maybeSingle();
  if (carErr) {
    return { error: carErr.message };
  }
  const car = carData as Pick<Car, "id" | "pricePerDay" | "status"> | null;
  if (!car) {
    return { error: "That car could not be found." };
  }
  if (car.status !== "Available") {
    return { error: "This car is no longer available for booking." };
  }

  const days = billableDays(startDate, endDate);
  const totalPrice = Number((car.pricePerDay * days).toFixed(2));

  const { data: booking, error: insertErr } = await supabase
    .from("bookings")
    .insert({
      carId: car.id,
      customerName,
      startDate: startRaw,
      endDate: endRaw,
      totalPrice,
    })
    .select("id")
    .single();
  if (insertErr || !booking) {
    return { error: insertErr?.message ?? "Could not create booking." };
  }

  revalidatePath("/admin/orders");
  redirect(`/booking/success?id=${booking.id}`);
}
