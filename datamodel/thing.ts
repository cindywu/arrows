import type { ReadTransaction, WriteTransaction } from "@rocicorp/reflect";
import { nanoid } from "nanoid";
import { z } from "zod";

export const thingSchema = z.object({
  name: z.string(),
  createdAt: z.string(),
  arrows: z.array(z.string()),
  type: z.string(),
  fileIDs: z.array(z.string()),
  publicationDate: z.string(),
  authorArrows: z.array(z.string()),
  tldr: z.string()
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

export async function updateThingTldr(
  tx: WriteTransaction,
  { id, tldr }: { id: string; tldr: string }
): Promise<void> {
  console.log({id}, {tldr})
  const thing = await getThing(tx, id);
  console.log('i am in here!!!')
  if (thing) {
    console.log('i am in here!!!', {thing})
    await putThing(tx, {
      id,
      thing: {
        ...thing,
        tldr: tldr
      }
    });
  }
}

export async function updateThingAddArrow(
  tx: WriteTransaction,
  { id, arrow }: { id: string; arrow: string }
): Promise<void> {
  const thing = await getThing(tx, id);
  if (thing) {
    await putThing(tx, {
      id,
      thing: {
        ...thing,
        arrows: [...thing.arrows, arrow]
      }
    })
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
      arrows: [],
      type: "",
      fileIDs: [],
      publicationDate: "",
      authorArrows: [],
      tldr: "",
    } as Thing,
  };
}
