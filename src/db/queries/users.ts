import { db } from '../index.js';
import { NewUser, users } from '../schema.js';
import { eq } from 'drizzle-orm';

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function reset() {
  await db.delete(users);
}

export async function getUserByEmail(email: string) {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
}

export async function updateUser(id: string, user: NewUser) {
  const now = new Date();

  const [result] = await db
    .update(users)
    .set({
      email: user.email,
      hashedPassword: user.hashedPassword,
      updatedAt: now,
    })
    .where(eq(users.id, id))
    .returning();

  return result;
}

export async function updateUserToChirpyRed(userId: string) {
  const now = new Date();

  const [result] = await db
    .update(users)
    .set({
      updatedAt: now,
      isChirpyRed: true,
    })
    .where(eq(users.id, userId))
    .returning();

  return result;
}
