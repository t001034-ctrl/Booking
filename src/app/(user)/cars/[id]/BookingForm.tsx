"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { createBooking, type CreateBookingState } from "../../actions";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function billableDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const s = new Date(`${start}T00:00:00.000Z`).getTime();
  const e = new Date(`${end}T00:00:00.000Z`).getTime();
  if (Number.isNaN(s) || Number.isNaN(e) || e < s) return 0;
  return Math.max(1, Math.ceil((e - s) / MS_PER_DAY));
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
    >
      {pending ? "Booking..." : "Confirm Booking"}
    </button>
  );
}

export function BookingForm({
  carId,
  pricePerDay,
  todayIso,
}: {
  carId: number;
  pricePerDay: number;
  todayIso: string;
}) {
  const [state, formAction] = useActionState<CreateBookingState, FormData>(
    createBooking,
    {},
  );

  const [startDate, setStartDate] = useState(todayIso);
  const [endDate, setEndDate] = useState(todayIso);

  const days = useMemo(
    () => billableDays(startDate, endDate),
    [startDate, endDate],
  );
  const total = days * pricePerDay;
  const validRange = days > 0;

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="carId" value={carId} />

      {state.error ? (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="customerName"
          className="block text-sm font-medium text-gray-700"
        >
          Your name
        </label>
        <input
          id="customerName"
          name="customerName"
          type="text"
          required
          placeholder="Jane Doe"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Start date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            required
            min={todayIso}
            value={startDate}
            onChange={(e) => {
              const next = e.target.value;
              setStartDate(next);
              if (endDate && next > endDate) setEndDate(next);
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            End date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            required
            min={startDate || todayIso}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <dl className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-gray-600">Daily rate</dt>
          <dd className="font-medium text-gray-900">
            ${pricePerDay.toFixed(2)}
          </dd>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <dt className="text-gray-600">Days</dt>
          <dd className="font-medium text-gray-900">
            {validRange ? days : "—"}
          </dd>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
          <dt className="text-base font-semibold text-gray-900">Total</dt>
          <dd className="text-base font-semibold text-gray-900">
            {validRange ? `$${total.toFixed(2)}` : "—"}
          </dd>
        </div>
      </dl>

      <SubmitButton disabled={!validRange} />
    </form>
  );
}
