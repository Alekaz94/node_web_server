import { db } from '../index.js';
import { chirps, NewChirp } from '../schema.js';
import { asc, desc, eq } from 'drizzle-orm';

export async function createChirp(chirp: NewChirp) {
  const [rows] = await db.insert(chirps).values(chirp).returning();
  return rows;
}

export async function getAllChirps() {
  return await db.select().from(chirps).orderBy(asc(chirps.createdAt));
}

export async function getAllChirpsDesc() {
  return await db.select().from(chirps).orderBy(desc(chirps.createdAt));
}

export async function getAllChirpsByAuthorAsc(authorId: string) {
  return await db
    .select()
    .from(chirps)
    .where(eq(chirps.userId, authorId))
    .orderBy(asc(chirps.createdAt));
}

export async function getAllChirpsByAuthorDesc(authorId: string) {
  return await db
    .select()
    .from(chirps)
    .where(eq(chirps.userId, authorId))
    .orderBy(desc(chirps.createdAt));
}
export async function getChirpById(chirpId: string) {
  const chirp = await db.select().from(chirps).where(eq(chirps.id, chirpId));

  return chirp[0] || null;
}

export async function deleteChirpById(chirpId: string) {
  const chirp = await db.delete(chirps).where(eq(chirps.id, chirpId));

  return chirp;
}
