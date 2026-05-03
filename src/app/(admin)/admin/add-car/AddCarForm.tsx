"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addCar, type AddCarState } from "./actions";

const STATUS_OPTIONS = ["Available", "Maintenance", "Retired"] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
    >
      {pending ? "Saving..." : "Add Car"}
    </button>
  );
}

export function AddCarForm({ added }: { added: boolean }) {
  const [state, formAction] = useActionState<AddCarState, FormData>(addCar, {});

  return (
    <form action={formAction} className="space-y-5">
      {added && !state.error ? (
        <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
          Car added successfully.
        </div>
      ) : null}
      {state.error ? (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-700">
            Make
          </label>
          <input
            id="make"
            name="make"
            type="text"
            required
            placeholder="Toyota"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">
            Model
          </label>
          <input
            id="model"
            name="model"
            type="text"
            required
            placeholder="Corolla"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">
            Year
          </label>
          <input
            id="year"
            name="year"
            type="number"
            min={1900}
            max={2100}
            required
            placeholder="2024"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700">
            Price per day
          </label>
          <input
            id="pricePerDay"
            name="pricePerDay"
            type="number"
            min={0}
            step="0.01"
            required
            placeholder="49.99"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue="Available"
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Image
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          required
          className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="mt-1 text-xs text-gray-500">
          PNG, JPEG, WebP, or GIF up to 5 MB. Saved to /public/uploads.
        </p>
      </div>

      <SubmitButton />
    </form>
  );
}
