import { AddCarForm } from "./AddCarForm";

export const metadata = {
  title: "Add Car | Admin",
};

export default async function AddCarPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string }>;
}) {
  const params = await searchParams;
  const added = params.added === "1";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Add a car</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create a new car listing. The image is uploaded to{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5">/public/uploads</code>.
        </p>
      </header>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <AddCarForm added={added} />
      </div>
    </div>
  );
}
