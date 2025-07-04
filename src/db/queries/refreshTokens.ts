import { eq } from 'drizzle-orm';
import { db } from '../index.js';
import { refreshTokens, NewRefreshToken, users } from '../schema.js';

export async function createRefreshToken(refreshToken: NewRefreshToken) {
  const [result] = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .returning();
  return result;
}

export async function getRefreshToken(token: string) {
  const refreshToken = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));
  return refreshToken[0];
}

export async function getUserFromRefreshToken(token: string) {
  const user = await db
    .select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(refreshTokens)
    .innerJoin(users, eq(refreshTokens.userId, users.id))
    .where(eq(refreshTokens.token, token))
    .limit(1);

  return user;
}

export async function revokeRefreshToken(token: string) {
  const now = new Date();

  const result = await db
    .update(refreshTokens)
    .set({ revokedAt: now, updatedAt: now })
    .where(eq(refreshTokens.token, token));

  return result;
}
