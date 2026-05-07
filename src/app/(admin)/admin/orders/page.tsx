import { getServiceRoleClient } from "@/lib/supabase";
import type { Booking, Car } from "@/lib/db-types";

export const metadata = {
  title: "Orders | Admin",
};

export const dynamic = "force-dynamic";

type OrderRow = Booking & {
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

function formatTimestamp(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function OrdersPage() {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, car:cars(make, model, year)")
    .order("createdAt", { ascending: false });
  if (error) throw error;
  const orders = (data ?? []) as OrderRow[];

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-600">
          {orders.length === 0
            ? "Bookings made by customers will appear here."
            : `${orders.length} booking${orders.length === 1 ? "" : "s"}.`}
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-sm font-medium text-gray-700">No bookings yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Once customers reserve cars, their bookings will show up here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Booking</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Car</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {order.customerName}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {order.car
                      ? `${order.car.make} ${order.car.model} (${order.car.year})`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {formatIsoDate(order.startDate)} →{" "}
                    {formatIsoDate(order.endDate)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatTimestamp(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
