import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Browse cars | Booking",
};

export default async function UserGallery() {
  const cars = await prisma.car.findMany({
    where: { status: "Available" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Find your next ride
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          {cars.length === 0
            ? "No cars are available right now. Check back soon."
            : `${cars.length} car${cars.length === 1 ? "" : "s"} ready to book.`}
        </p>
      </header>

      {cars.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-sm text-gray-600">
            Nothing to show yet. An admin needs to add cars and mark them as
            Available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <article
              key={car.id}
              className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative aspect-[16/10] w-full bg-gray-100">
                <Image
                  src={car.imagePath}
                  alt={`${car.make} ${car.model}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-sm text-gray-500">{car.year}</p>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <p className="text-sm">
                    <span className="text-lg font-semibold text-gray-900">
                      ${car.pricePerDay.toFixed(2)}
                    </span>
                    <span className="ml-1 text-gray-500">/ day</span>
                  </p>

                  <Link
                    href={`/cars/${car.id}`}
                    className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
