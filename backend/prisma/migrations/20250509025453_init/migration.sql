-- CreateTable
CREATE TABLE "Complaint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "issueType" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
