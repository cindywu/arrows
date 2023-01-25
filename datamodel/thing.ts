import type { ReadTransaction, WriteTransaction } from "@rocicorp/reflect";
import { nanoid } from "nanoid";
import { z } from "zod";

export const thingSchema = z.object({
  name: z.string(),
  createdAt: z.string(),
});

export type Thing = z.infer<typeof thingSchema>;

export async function getThing(
  tx: ReadTransaction,
  id: string
): Promise<Thing | null> {
  const jv = await tx.get(key(id))
  if (!jv) {
    console.log(`Specified thing ${id} not found.`);
    return null;
  }
  return jv as Thing;
}

export function putThing(
  tx: WriteTransaction,
  { id, thing }: {id: string; thing: Thing}
): Promise<void> {
  return tx.put(key(id), thing);
}

export async function deleteThing(
  tx: WriteTransaction,
  id: string
): Promise<void> {
  await tx.del(key(id));
}

export async function updateThingName(
  tx: WriteTransaction,
  { id, name }: { id: string; name: string }
): Promise<void> {
  const thing = await getThing(tx, id);
  if (thing) {
    await putThing(tx, {
      id,
      thing: {
        ...thing,
        name
      }
    });
  }
}

function key(id: string): string {
  return `${thingPrefix}${id}`;
}

export const thingPrefix = "thing-";

export function randomThing() {
  return {
    id: nanoid(),
    thing: {
      name: "a thing!",
      createdAt: new Date().toISOString(),
    } as Thing,
  };
}
