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
} from "./thing";

import {
  putArrow,
  deleteArrow,
} from "./arrow";

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
  nop: async (_: WriteTransaction) => {},
};

export const clientMutators: M = {
  ...serverMutators,
  initShapes: async () => {},
};