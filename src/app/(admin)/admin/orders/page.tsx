export const metadata = {
  title: "Orders | Admin",
};

export default function OrdersPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-600">
          Bookings made by customers will appear here.
        </p>
      </header>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-sm font-medium text-gray-700">No bookings yet</p>
        <p className="mt-1 text-sm text-gray-500">
          Once the customer-facing booking flow is live, new orders will show up
          on this page.
        </p>
      </div>
    </div>
  );
}
