import type { ReadTransaction, WriteTransaction } from "@rocicorp/reflect";
import { nanoid } from "nanoid";
import { z } from "zod";

export const userSchema = z.object({
  email: z.string(),
  username: z.string(),
  createdAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

export async function getUser(
  tx: ReadTransaction,
  id: string
): Promise<User | null> {
  const jv = await tx.get(key(id));
  if (!jv) {
    console.log(`Specified user ${id} not found.`);
    return null;
  }
  return jv as User;
}

export function putUser(
  tx: WriteTransaction,
  { id, user }: { id: string; user: User }
): Promise<void> {
  return tx.put(key(id), user);
}

export function updateUser(
  tx: WriteTransaction,
  { id, user }: { id: string; user: User }
): Promise<void> {
  return tx.put(key(id), user);
}

export async function deleteUser(
  tx: WriteTransaction,
  id: string
): Promise<void> {
  await tx.del(key(id));
}

export async function initUsers(tx: WriteTransaction) {
  if (await tx.has("initialized")) {
    return;
  }
  const users = Array.from({ length: 5 }, () => randomUser());
  await Promise.all([
    tx.put("initialized", true),
    ...users.map((s) => putUser(tx, s)),
  ]);
}

function key(id: string): string {
  return `${userPrefix}${id}`;
}

export const userPrefix = "user-";

export function randomUser() {
  return {
    id: nanoid(),
    user: {
      email: "email@email.com",
      username: "anon",
      createdAt: new Date().toISOString(),
    } as User,
  };
}