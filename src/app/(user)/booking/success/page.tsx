import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceRoleClient } from "@/lib/supabase";
import type { Booking, Car } from "@/lib/db-types";

export const metadata = {
  title: "Booking confirmed | Booking",
};

export const dynamic = "force-dynamic";

function formatIsoDate(value: string): string {
  const d = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

type BookingWithCar = Booking & {
  car: Pick<Car, "make" | "model" | "year">;
};

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const bookingId = Number.parseInt(id ?? "", 10);
  if (!Number.isInteger(bookingId) || bookingId <= 0) notFound();

  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, car:cars(make, model, year)")
    .eq("id", bookingId)
    .maybeSingle();
  if (error) throw error;
  const booking = data as BookingWithCar | null;
  if (!booking) notFound();

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-xl border border-green-200 bg-white p-8 shadow-sm">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Confirmed
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Your booking is confirmed
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Booking #{booking.id} &middot; Thanks, {booking.customerName}.
        </p>

        <dl className="mt-6 divide-y divide-gray-200 rounded-md border border-gray-200 text-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <dt className="text-gray-600">Car</dt>
            <dd className="font-medium text-gray-900">
              {booking.car.make} {booking.car.model} ({booking.car.year})
            </dd>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <dt className="text-gray-600">Pickup</dt>
            <dd className="font-medium text-gray-900">
              {formatIsoDate(booking.startDate)}
            </dd>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <dt className="text-gray-600">Return</dt>
            <dd className="font-medium text-gray-900">
              {formatIsoDate(booking.endDate)}
            </dd>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <dt className="text-base font-semibold text-gray-900">Total</dt>
            <dd className="text-base font-semibold text-gray-900">
              ${booking.totalPrice.toFixed(2)}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            Browse more cars
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            View in admin
          </Link>
        </div>
      </div>
    </div>
  );
}
