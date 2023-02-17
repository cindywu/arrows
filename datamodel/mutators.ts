import type { WriteTransaction } from "@rocicorp/reflect";
import {
  initClientState,
  setCursor,
  overShape,
  selectShape,
} from "./client-state";
import {
  putShape,
  deleteShape,
  moveShape,
  scanShape,
  resizeShape,
  rotateShape,
  initShapes,
} from "./shape";
import {
  putItem,
  deleteItem,
  initItems,
} from "./item";
import {
  putUser,
  deleteUser,
  updateUser,
} from "./user";

import {
  putThing,
  deleteThing,
  updateThingName,
  updateThingAddArrow,
  updateThingTldr,
  updateThingPublicationDate,
} from "./thing";

import {
  putArrow,
  deleteArrow,
} from "./arrow";

import {
  putGame,
  updateGamePlay1,
} from "./game";

export type M = typeof serverMutators;

export const serverMutators = {
  createShape: putShape,
  deleteShape,
  moveShape,
  scanShape,
  resizeShape,
  rotateShape,
  initClientState,
  setCursor,
  overShape,
  selectShape,
  initShapes,
  createItem: putItem,
  deleteItem,
  initItems,
  createUser: putUser,
  deleteUser,
  updateUser,
  createThing: putThing,
  deleteThing,
  updateThingName,
  createArrow: putArrow,
  deleteArrow,
  updateThingAddArrow,
  updateThingTldr,
  updateThingPublicationDate,
  createGame: putGame,
  updateGame: updateGamePlay1,
  nop: async (_: WriteTransaction) => {},
};

export const clientMutators: M = {
  ...serverMutators,
  initShapes: async () => {},
};