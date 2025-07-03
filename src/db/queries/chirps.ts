import { db } from '../index.js';
import { chirps, NewChirp } from '../schema.js';
import { asc, eq } from 'drizzle-orm';

export async function createChirp(chirp: NewChirp) {
  const [rows] = await db.insert(chirps).values(chirp).returning();
  return rows;
}

export async function getAllChirps() {
  const rows = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
  return rows;
}

export async function getChirpById(chirpId: string) {
  const chirp = await db.select().from(chirps).where(eq(chirps.id, chirpId));

  return chirp[0] || null;
}
