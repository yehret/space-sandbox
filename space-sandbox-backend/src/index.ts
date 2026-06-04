// src/index.ts
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { Pool } from 'pg';

// Імпортуємо роути
import authRoutes from './routes/auth.routes';
import systemRoutes from './routes/system.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN, 'http://localhost:5173'].filter(Boolean) as string[],
    credentials: true,
  }),
);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/systems', systemRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Space Sandbox API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
