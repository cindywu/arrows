import type { ReadTransaction, WriteTransaction } from "@rocicorp/reflect";
import { nanoid } from "nanoid";
import { z } from "zod";

export const itemSchema = z.object({
  name: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
});

export type Item = z.infer<typeof itemSchema>;

export async function getItem(
  tx: ReadTransaction,
  id: string
): Promise<Item | null> {
  const jv = await tx.get(key(id));
  if (!jv) {
    console.log(`Specified item ${id} not found.`);
    return null;
  }
  return jv as Item;
  //return shapeSchema.parse(jv);
}

export function putItem(
  tx: WriteTransaction,
  { id, item }: { id: string; item: Item }
): Promise<void> {
  console.log('putItem', item)
  return tx.put(key(id), item);
}

export async function deleteItem(
  tx: WriteTransaction,
  id: string
): Promise<void> {
  await tx.del(key(id));
}

export async function initItems(tx: WriteTransaction) {
  if (await tx.has("initialized")) {
    return;
  }
  const items = Array.from({ length: 5 }, () => randomItem());
  await Promise.all([
    tx.put("initialized", true),
    ...items.map((s) => putItem(tx, s)),
  ]);
}

function key(id: string): string {
  return `${itemPrefix}${id}`;
}

export const itemPrefix = "item-";

export function randomItem() {
  return {
    id: nanoid(),
    item: {
      name: "new item",
      createdAt: new Date().toISOString(),
      createdBy: "anonymous",
    } as Item,
  };
}