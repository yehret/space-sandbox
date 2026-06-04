-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpaceSystem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT,

    CONSTRAINT "SpaceSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Star" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "color" TEXT NOT NULL,
    "mass" DOUBLE PRECISION NOT NULL,
    "systemId" TEXT NOT NULL,

    CONSTRAINT "Star_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Planet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "mass" DOUBLE PRECISION NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION NOT NULL,
    "orbitalInclination" DOUBLE PRECISION NOT NULL,
    "rotationSpeed" DOUBLE PRECISION NOT NULL,
    "axialTilt" DOUBLE PRECISION NOT NULL,
    "color" TEXT NOT NULL,
    "textureUrl" TEXT,
    "systemId" TEXT NOT NULL,

    CONSTRAINT "Planet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Moon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION NOT NULL,
    "orbitalInclination" DOUBLE PRECISION NOT NULL,
    "color" TEXT NOT NULL,
    "textureUrl" TEXT,
    "planetId" TEXT NOT NULL,

    CONSTRAINT "Moon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanetaryRing" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "innerRadius" DOUBLE PRECISION NOT NULL,
    "outerRadius" DOUBLE PRECISION NOT NULL,
    "color" TEXT NOT NULL,
    "opacity" DOUBLE PRECISION NOT NULL,
    "textureUrl" TEXT,
    "tiltAngle" DOUBLE PRECISION DEFAULT 0,
    "tiltDirection" DOUBLE PRECISION DEFAULT 0,
    "planetId" TEXT NOT NULL,

    CONSTRAINT "PlanetaryRing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsteroidBelt" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "count" INTEGER NOT NULL,
    "speed" DOUBLE PRECISION NOT NULL,
    "orbitalInclination" DOUBLE PRECISION NOT NULL,
    "color" TEXT NOT NULL,
    "systemId" TEXT NOT NULL,

    CONSTRAINT "AsteroidBelt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Star_systemId_key" ON "Star"("systemId");

-- AddForeignKey
ALTER TABLE "SpaceSystem" ADD CONSTRAINT "SpaceSystem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Star" ADD CONSTRAINT "Star_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "SpaceSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planet" ADD CONSTRAINT "Planet_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "SpaceSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Moon" ADD CONSTRAINT "Moon_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "Planet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanetaryRing" ADD CONSTRAINT "PlanetaryRing_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "Planet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsteroidBelt" ADD CONSTRAINT "AsteroidBelt_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "SpaceSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
