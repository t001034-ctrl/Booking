"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { CarStatus } from "@/generated/prisma/enums";
import { updateCarStatus } from "./actions";

const ALL_STATUSES: CarStatus[] = ["Available", "Maintenance", "Retired"];

const STATUS_BADGE: Record<CarStatus, string> = {
  Available: "bg-green-100 text-green-800 ring-green-600/20",
  Maintenance: "bg-yellow-100 text-yellow-800 ring-yellow-600/20",
  Retired: "bg-gray-200 text-gray-700 ring-gray-500/20",
};

const STATUS_DOT: Record<CarStatus, string> = {
  Available: "bg-green-500",
  Maintenance: "bg-yellow-500",
  Retired: "bg-gray-400",
};

export type CarCardData = {
  id: number;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  status: CarStatus;
  imagePath: string;
};

export function CarCard({ car }: { car: CarCardData }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  function handleSelect(status: CarStatus) {
    setOpen(false);
    if (status === car.status) return;
    startTransition(async () => {
      await updateCarStatus(car.id, status);
    });
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[16/10] w-full bg-gray-100">
        <Image
          src={car.imagePath}
          alt={`${car.make} ${car.model}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_BADGE[car.status]}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[car.status]}`} />
          {car.status}
        </span>
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

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              disabled={pending}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              aria-haspopup="menu"
              aria-expanded={open}
            >
              {pending ? "Updating…" : "Status"}
              <svg
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {open ? (
              <div
                role="menu"
                className="absolute right-0 z-10 mt-1 w-44 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
              >
                {ALL_STATUSES.map((status) => {
                  const isCurrent = status === car.status;
                  return (
                    <button
                      key={status}
                      type="button"
                      role="menuitem"
                      onClick={() => handleSelect(status)}
                      disabled={isCurrent}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition ${
                        isCurrent
                          ? "cursor-default bg-gray-50 text-gray-400"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`}
                      />
                      Mark as {status}
                      {isCurrent ? (
                        <span className="ml-auto text-[10px] uppercase tracking-wide">
                          Current
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
