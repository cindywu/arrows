import type { ReadTransaction, WriteTransaction } from "@rocicorp/reflect"
import { nanoid } from "nanoid";
import { z } from "zod";

export const arrowSchema = z.object({
  createdAt: z.string(),
  back: z.string(),
  front: z.string(),
  type: z.string()
})

export type Arrow = z.infer<typeof arrowSchema>

export async function getArrow(
  tx: ReadTransaction,
  id: string
): Promise<Arrow | null> {
  const jv = await tx.get(key(id))
  if (!jv) {
    console.log(`Specified arrow ${id} not found.`)
    return null
  }
  return jv as Arrow
}

export function putArrow(
  tx: WriteTransaction,
  { id, arrow }: {id: string; arrow: Arrow}
): Promise<void> {
  return tx.put(key(id), arrow)
}

export async function deleteArrow(
  tx: WriteTransaction,
  id: string
): Promise<void> {
  await tx.del(key(id))
}

function key(id: string): string {
  return `${arrowPrefix}${id}`
}

export const arrowPrefix = "arrow-";

export function randomArrow() {
  return {
    id: nanoid(),
    arrow: {
      createdAt: new Date().toISOString(),
      back: '',
      front: '',
    }
  }
}

