export const metadata = {
  title: "My Bookings | Booking",
};

export default function MyBookingsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
        My Bookings
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Your reservations will show up here.
      </p>

      <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-sm font-medium text-gray-700">No bookings yet</p>
        <p className="mt-1 text-sm text-gray-500">
          Once you reserve a car, it will appear in this list.
        </p>
      </div>
    </div>
  );
}
