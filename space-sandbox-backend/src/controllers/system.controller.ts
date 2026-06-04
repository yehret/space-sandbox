import { Request, Response } from 'express';
import { prisma } from '../index';

export const getSystems = async (req: Request, res: Response): Promise<void> => {
  try {
    const systems = await prisma.spaceSystem.findMany({
      include: {
        author: { select: { username: true } },
        star: true,
        planets: {
          include: {
            moons: true,
            rings: true,
          },
        },
        belts: true,
      },
    });

    res.status(200).json(systems);
  } catch (error) {
    console.error('Error fetching systems:', error);
    res.status(500).json({ error: 'Failed to fetch systems' });
  }
};

export const createSystem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { name } = req.body;

    const newSystem = await prisma.spaceSystem.create({
      data: {
        name: name || 'New Star System',
        authorId: userId,
        star: {
          create: {
            name: 'Star',
            size: 1,
            color: '#ffdd00',
            mass: 1,
          },
        },
      },
      include: {
        star: true,
        planets: true,
        belts: true,
      },
    });

    res.status(201).json(newSystem);
  } catch (error) {
    console.error('Error creating system:', error);
    res.status(500).json({ error: 'Failed to create system' });
  }
};

export const deleteSystem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const id = req.params.id as string;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const system = await prisma.spaceSystem.findUnique({ where: { id } });

    if (!system) {
      res.status(404).json({ error: 'System not found' });
      return;
    }

    if (system.authorId !== userId) {
      res.status(403).json({ error: 'You do not have permission to delete this system' });
      return;
    }

    await prisma.spaceSystem.delete({ where: { id } });

    res.status(200).json({ message: 'System deleted successfully' });
  } catch (error) {
    console.error('Error deleting system:', error);
    res.status(500).json({ error: 'Failed to delete system' });
  }
};

export const updateSystem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const id = req.params.id as string;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const system = await prisma.spaceSystem.findUnique({ where: { id } });

    if (!system) {
      res.status(404).json({ error: 'System not found' });
      return;
    }

    if (system.authorId !== userId) {
      res.status(403).json({ error: 'Permission denied' });
      return;
    }

    const { name, star, planets, belts } = req.body;

    const updatedSystem = await prisma.$transaction(async (tx) => {
      await tx.planet.deleteMany({ where: { systemId: id } });
      await tx.asteroidBelt.deleteMany({ where: { systemId: id } });
      await tx.star.deleteMany({ where: { systemId: id } });

      const updateData: any = {
        name: name,
      };

      if (star) {
        updateData.star = {
          create: {
            name: star.name,
            size: star.size,
            color: star.color,
            mass: star.mass,
          },
        };
      }

      if (belts && belts.length > 0) {
        updateData.belts = {
          create: belts.map((b: any) => ({
            name: b.name,
            distance: b.distance,
            width: b.width,
            count: b.count,
            speed: b.speed,
            orbitalInclination: b.orbitalInclination,
            color: b.color,
          })),
        };
      }

      if (planets && planets.length > 0) {
        updateData.planets = {
          create: planets.map((p: any) => ({
            name: p.name,
            type: p.type,
            mass: p.mass,
            size: p.size,
            distance: p.distance,
            speed: p.speed,
            orbitalInclination: p.orbitalInclination,
            rotationSpeed: p.rotationSpeed,
            axialTilt: p.axialTilt,
            color: p.color,
            textureUrl: p.textureUrl,
            moons:
              p.moons && p.moons.length > 0
                ? {
                    create: p.moons.map((m: any) => ({
                      name: m.name,
                      size: m.size,
                      distance: m.distance,
                      speed: m.speed,
                      orbitalInclination: m.orbitalInclination,
                      color: m.color,
                      textureUrl: m.textureUrl,
                    })),
                  }
                : undefined,
            rings:
              p.rings && p.rings.length > 0
                ? {
                    create: p.rings.map((r: any) => ({
                      name: r.name,
                      innerRadius: r.innerRadius,
                      outerRadius: r.outerRadius,
                      color: r.color,
                      opacity: r.opacity,
                      textureUrl: r.textureUrl,
                      tiltAngle: r.tiltAngle,
                      tiltDirection: r.tiltDirection,
                    })),
                  }
                : undefined,
          })),
        };
      }

      return await tx.spaceSystem.update({
        where: { id },
        data: updateData,
        include: {
          star: true,
          planets: {
            include: { moons: true, rings: true },
          },
          belts: true,
        },
      });
    });

    res.status(200).json(updatedSystem);
  } catch (error) {
    console.error('Error updating system:', error);
    res.status(500).json({ error: 'Failed to update system' });
  }
};

export const getSystemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    const system = await prisma.spaceSystem.findUnique({
      where: { id },
      include: {
        author: { select: { username: true } },
        star: true,
        planets: {
          include: {
            moons: true,
            rings: true,
          },
        },
        belts: true,
      },
    });

    if (!system) {
      res.status(404).json({ error: 'System not found' });
      return;
    }

    if (!system.isPublic && !system.isDefault && system.authorId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.status(200).json(system);
  } catch (error) {
    console.error('Error fetching system:', error);
    res.status(500).json({ error: 'Failed to fetch system' });
  }
};

export const toggleVisibility = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const id = req.params.id as string;
    const { isPublic } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const system = await prisma.spaceSystem.findUnique({ where: { id } });

    if (!system || system.authorId !== userId) {
      res.status(403).json({ error: 'Permission denied' });
      return;
    }

    const updatedSystem = await prisma.spaceSystem.update({
      where: { id },
      data: { isPublic },
    });

    res.status(200).json(updatedSystem);
  } catch (error) {
    console.error('Error updating visibility:', error);
    res.status(500).json({ error: 'Failed to update visibility' });
  }
};
