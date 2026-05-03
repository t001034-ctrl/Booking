import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "./BookingForm";

export const dynamic = "force-dynamic";

function todayIsoUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const carId = Number.parseInt(id, 10);
  if (!Number.isFinite(carId)) return { title: "Car not found" };
  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) return { title: "Car not found" };
  return { title: `${car.make} ${car.model} | Booking` };
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const carId = Number.parseInt(id, 10);
  if (!Number.isInteger(carId) || carId <= 0) notFound();

  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car || car.status !== "Available") notFound();

  return (
    <div>
      <div className="mb-6 text-sm">
        <Link href="/" className="text-blue-700 hover:underline">
          &larr; Back to all cars
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
            <Image
              src={car.imagePath}
              alt={`${car.make} ${car.model}`}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {car.make} {car.model}
            </h1>
            <p className="mt-1 text-sm text-gray-600">{car.year}</p>

            <dl className="mt-5 grid grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-white p-4 text-sm">
              <div>
                <dt className="text-gray-500">Make</dt>
                <dd className="mt-1 font-medium text-gray-900">{car.make}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Model</dt>
                <dd className="mt-1 font-medium text-gray-900">{car.model}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Year</dt>
                <dd className="mt-1 font-medium text-gray-900">{car.year}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Daily rate</dt>
                <dd className="mt-1 font-medium text-gray-900">
                  ${car.pricePerDay.toFixed(2)}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-gray-500">Status</dt>
                <dd className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {car.status}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Book this car
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Pick your dates and we&rsquo;ll calculate the total.
            </p>
            <div className="mt-5">
              <BookingForm
                carId={car.id}
                pricePerDay={car.pricePerDay}
                todayIso={todayIsoUtc()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
