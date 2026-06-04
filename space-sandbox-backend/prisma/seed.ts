import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL!;

const pool = new pg.Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'hashed_password_placeholder',
    },
  });

  // Видаляємо старі дефолтні системи
  await prisma.spaceSystem.deleteMany({
    where: {
      isDefault: true,
    },
  });

  // =====================================
  // SOLAR SYSTEM
  // =====================================

  await prisma.spaceSystem.create({
    data: {
      name: 'Solar System',
      isDefault: true,
      isPublic: true,
      authorId: admin.id,

      star: {
        create: {
          name: 'Sun',
          size: 2.5,
          color: '#fff4e8',
          mass: 1,
        },
      },

      planets: {
        create: [
          {
            name: 'Mercury',
            type: 'terrestrial',
            mass: 0.055,
            size: 0.19,
            distance: 8,
            speed: 0.16,
            orbitalInclination: 7,
            rotationSpeed: 0.01,
            axialTilt: 0.03,
            color: '#a8a8a8',
          },

          {
            name: 'Venus',
            type: 'terrestrial',
            mass: 0.815,
            size: 0.47,
            distance: 14,
            speed: 0.12,
            orbitalInclination: 3.4,
            rotationSpeed: -0.004,
            axialTilt: 177,
            color: '#e8c27a',
          },

          {
            name: 'Earth',
            type: 'terrestrial',
            mass: 1,
            size: 0.5,
            distance: 20,
            speed: 0.1,
            orbitalInclination: 0,
            rotationSpeed: 1,
            axialTilt: 23.4,
            color: '#2b82c9',

            moons: {
              create: [
                {
                  name: 'Moon',
                  size: 0.15,
                  distance: 1.5,
                  speed: 1.2,
                  orbitalInclination: 5.1,
                  color: '#aaaaaa',
                },
              ],
            },
          },

          {
            name: 'Mars',
            type: 'terrestrial',
            mass: 0.107,
            size: 0.27,
            distance: 28,
            speed: 0.08,
            orbitalInclination: 1.85,
            rotationSpeed: 0.97,
            axialTilt: 25.2,
            color: '#c1440e',

            moons: {
              create: [
                {
                  name: 'Phobos',
                  size: 0.05,
                  distance: 0.6,
                  speed: 2,
                  orbitalInclination: 1,
                  color: '#999999',
                },
                {
                  name: 'Deimos',
                  size: 0.03,
                  distance: 1,
                  speed: 1.3,
                  orbitalInclination: 1.8,
                  color: '#bbbbbb',
                },
              ],
            },
          },

          {
            name: 'Jupiter',
            type: 'gas_giant',
            mass: 317,
            size: 1.6,
            distance: 55,
            speed: 0.04,
            orbitalInclination: 1.3,
            rotationSpeed: 2.4,
            axialTilt: 3.1,
            color: '#d39c7e',

            rings: {
              create: [
                {
                  name: 'Main Ring',
                  innerRadius: 1.8,
                  outerRadius: 2.1,
                  color: '#cfa27d',
                  opacity: 0.3,
                },
              ],
            },
          },

          {
            name: 'Saturn',
            type: 'gas_giant',
            mass: 95,
            size: 1.4,
            distance: 80,
            speed: 0.03,
            orbitalInclination: 2.5,
            rotationSpeed: 2.2,
            axialTilt: 26.7,
            color: '#e7d3a8',

            rings: {
              create: [
                {
                  name: 'Saturn Main Rings',
                  innerRadius: 1.8,
                  outerRadius: 3.5,
                  color: '#e8dfc8',
                  opacity: 0.8,
                },
              ],
            },
          },

          {
            name: 'Uranus',
            type: 'ice_giant',
            mass: 14.5,
            size: 1.0,
            distance: 105,
            speed: 0.02,
            orbitalInclination: 0.77,
            rotationSpeed: -1.4,
            axialTilt: 98,
            color: '#8fd8f0',
          },

          {
            name: 'Neptune',
            type: 'ice_giant',
            mass: 17,
            size: 0.98,
            distance: 125,
            speed: 0.018,
            orbitalInclination: 1.77,
            rotationSpeed: 1.5,
            axialTilt: 28.3,
            color: '#3c63ff',
          },
        ],
      },

      belts: {
        create: [
          {
            name: 'Main Asteroid Belt',
            distance: 40,
            width: 12,
            count: 5000,
            speed: 0.06,
            orbitalInclination: 10,
            color: '#777777',
          },
        ],
      },
    },
  });

  // =====================================
  // ALPHA CENTAURI SYSTEM
  // =====================================

  await prisma.spaceSystem.create({
    data: {
      name: 'Alpha Centauri System',
      isDefault: true,
      isPublic: true,
      authorId: admin.id,

      star: {
        create: {
          name: 'Alpha Centauri A',
          size: 2.8,
          color: '#fff2d6',
          mass: 1.1,
        },
      },

      planets: {
        create: [
          {
            name: 'Proxima b',
            type: 'terrestrial',
            mass: 1.3,
            size: 0.55,
            distance: 15,
            speed: 0.18,
            orbitalInclination: 0,
            rotationSpeed: 0.5,
            axialTilt: 10,
            color: '#6e8f5c',
          },

          {
            name: 'Proxima d',
            type: 'terrestrial',
            mass: 0.3,
            size: 0.3,
            distance: 9,
            speed: 0.22,
            orbitalInclination: 2,
            rotationSpeed: 0.8,
            axialTilt: 5,
            color: '#a87a52',
          },

          {
            name: 'Alpha Centauri Gas Giant',
            type: 'gas_giant',
            mass: 120,
            size: 1.3,
            distance: 50,
            speed: 0.05,
            orbitalInclination: 1,
            rotationSpeed: 2,
            axialTilt: 12,
            color: '#d6a66f',
          },
        ],
      },

      belts: {
        create: [
          {
            name: 'Outer Debris Belt',
            distance: 70,
            width: 15,
            count: 3500,
            speed: 0.04,
            orbitalInclination: 7,
            color: '#666666',
          },
        ],
      },
    },
  });

  console.log('Default systems created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
