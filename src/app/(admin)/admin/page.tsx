import Link from "next/link";
import { getServiceRoleClient } from "@/lib/supabase";
import type { Car } from "@/lib/db-types";
import { CarCard } from "./CarCard";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ added?: string }>;
}) {
  const params = await searchParams;
  const justAdded = params.added === "1";

  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .order("createdAt", { ascending: false });
  if (error) throw error;
  const cars = (data ?? []) as Car[];

  return (
    <div>
      {justAdded ? (
        <div className="mb-4 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
          Car added successfully.
        </div>
      ) : null}

      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Fleet</h1>
          <p className="mt-1 text-sm text-gray-600">
            {cars.length === 0
              ? "No cars in the fleet yet."
              : `${cars.length} car${cars.length === 1 ? "" : "s"} in the fleet.`}
          </p>
        </div>
        <Link
          href="/admin/add-car"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <span aria-hidden="true">+</span>
          Add Car
        </Link>
      </header>

      {cars.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-sm text-gray-600">
            Your fleet is empty. Add your first car to get started.
          </p>
          <Link
            href="/admin/add-car"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            Add a car
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
