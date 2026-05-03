-- CreateTable
CREATE TABLE "Car" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "pricePerDay" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "imagePath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
