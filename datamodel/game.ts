import type { ReadTransaction, WriteTransaction } from "@rocicorp/reflect"
import { nanoid } from "nanoid";
import { z } from "zod";

export const gameSchema = z.object({
  board: z.array(z.string()),
  ships: z.array(z.string()),
})

export type Game = z.infer<typeof gameSchema>

export async function getGame(
  tx: ReadTransaction,
  id: string
): Promise<Game | null> {
  const jv = await tx.get(key(id))
  if (!jv) {
    console.log(`Specified game ${id} not found.`)
    return null
  }
  return jv as Game
}

export function putGame(
  tx: WriteTransaction,
  { id, game }: {id: string; game: Game}
): Promise<void> {
  return tx.put(key(id), game)
}

export async function updateGamePlay1(
  tx: WriteTransaction,
  { id, shipPlacement}: {id: string, shipPlacement: number}
): Promise<void> {
  const game = await getGame(tx, id);
  if (game) {
    let ships = game.ships;
    ships[shipPlacement - 1] = "X";
    await putGame(tx, {
      id,
      game: {
        ...game,
        ships: ships,
      }
    })
  }

}

// export async function updateThingAddArrow(
//   tx: WriteTransaction,
//   { id, arrow, authorArrow }: { id: string; arrow: string, authorArrow: string }
// ): Promise<void> {
//   const thing = await getThing(tx, id);
//   if (thing) {
//     await putThing(tx, {
//       id,
//       thing: {
//         ...thing,
//         arrows: [...thing.arrows, arrow],
//         authorArrows: [...thing.authorArrows, authorArrow]
//       }
//     })
//   }
// }

function key(id: string): string {
  return `${gamePrefix}${id}`
}

export const gamePrefix = "game-";

export function randomGame() {
  return {
    id: nanoid(),
    game: {
      board: ["","","","","","","","",""],
      ships: ["","","","","","","","",""],
    }
  }
}



// export const arrowSchema = z.object({
//   createdAt: z.string(),
//   back: z.string(),
//   front: z.string(),
//   type: z.string()
// })

// export type Arrow = z.infer<typeof arrowSchema>

// export async function getArrow(
//   tx: ReadTransaction,
//   id: string
// ): Promise<Arrow | null> {
//   const jv = await tx.get(key(id))
//   if (!jv) {
//     console.log(`Specified arrow ${id} not found.`)
//     return null
//   }
//   return jv as Arrow
// }

// export function putArrow(
//   tx: WriteTransaction,
//   { id, arrow }: {id: string; arrow: Arrow}
// ): Promise<void> {
//   return tx.put(key(id), arrow)
// }

// export async function deleteArrow(
//   tx: WriteTransaction,
//   id: string
// ): Promise<void> {
//   await tx.del(key(id))
// }

// function key(id: string): string {
//   return `${arrowPrefix}${id}`
// }

// export const arrowPrefix = "arrow-";

// export function randomArrow() {
//   return {
//     id: nanoid(),
//     arrow: {
//       createdAt: new Date().toISOString(),
//       back: '',
//       front: '',
//     }
//   }
// }

