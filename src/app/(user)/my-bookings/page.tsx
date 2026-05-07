import Link from "next/link";
import { getServiceRoleClient } from "@/lib/supabase";
import type { Booking, Car } from "@/lib/db-types";

export const metadata = {
  title: "My Bookings | Booking",
};

export const dynamic = "force-dynamic";

type LookupResult = Booking & {
  car: Pick<Car, "make" | "model" | "year"> | null;
};

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

async function lookupBooking(
  id: number,
): Promise<{ booking: LookupResult | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, car:cars(make, model, year)")
    .eq("id", id)
    .maybeSingle();
  if (error) return { booking: null, error: error.message };
  return { booking: (data as LookupResult | null) ?? null, error: null };
}

export default async function MyBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const submitted = typeof id === "string" && id.length > 0;
  const parsedId = submitted ? Number.parseInt(id ?? "", 10) : NaN;
  const validId = Number.isInteger(parsedId) && parsedId > 0;

  let booking: LookupResult | null = null;
  let lookupError: string | null = null;
  if (submitted && validId) {
    const result = await lookupBooking(parsedId);
    booking = result.booking;
    lookupError = result.error;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
        My Bookings
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Enter the booking ID from your confirmation page to look up your
        reservation.
      </p>

      <form
        method="GET"
        className="mt-6 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label
            htmlFor="id"
            className="block text-sm font-medium text-gray-700"
          >
            Booking ID
          </label>
          <input
            id="id"
            name="id"
            type="number"
            min={1}
            required
            defaultValue={submitted ? id : ""}
            placeholder="e.g. 42"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          Look up
        </button>
      </form>

      {submitted && !validId ? (
        <div className="mt-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          Please enter a valid booking ID.
        </div>
      ) : null}

      {submitted && validId && lookupError ? (
        <div className="mt-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {lookupError}
        </div>
      ) : null}

      {submitted && validId && !lookupError && !booking ? (
        <div className="mt-6 rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          No booking found with that ID.
        </div>
      ) : null}

      {booking ? (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Booking #{booking.id}
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Confirmed
            </span>
          </div>

          <dl className="mt-4 divide-y divide-gray-200 rounded-md border border-gray-200 text-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <dt className="text-gray-600">Customer</dt>
              <dd className="font-medium text-gray-900">
                {booking.customerName}
              </dd>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <dt className="text-gray-600">Car</dt>
              <dd className="font-medium text-gray-900">
                {booking.car
                  ? `${booking.car.make} ${booking.car.model} (${booking.car.year})`
                  : "—"}
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

          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              Browse more cars
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
