-- CreateTable
CREATE TABLE "BookingDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookingDetails" ADD CONSTRAINT "BookingDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
