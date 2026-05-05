export type CarStatus = "Available" | "Maintenance" | "Retired";

export const CAR_STATUSES: CarStatus[] = [
  "Available",
  "Maintenance",
  "Retired",
];

export type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  status: CarStatus;
  imagePath: string;
  createdAt: string;
  updatedAt: string;
};

export type Booking = {
  id: number;
  carId: number;
  customerName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
};
