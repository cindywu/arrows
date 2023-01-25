import type { Reflect } from "@rocicorp/reflect";
import { useSubscribe } from "replicache-react";
import { getClientState, clientStatePrefix } from "./client-state";
import { getShape, shapePrefix } from "./shape";
import { getItem, itemPrefix } from "./item";
import { getUser, userPrefix } from "./user";
import { getThing, thingPrefix } from "./thing";
import type { M } from "./mutators";

export function useThingIDs(reflect: Reflect<M>) {
  return useSubscribe(
    reflect,
    async (tx) => {
      const things = (await tx
        .scan({ prefix: thingPrefix})
        .keys()
        .toArray()) as string[];
      return things.map((k) => k.substring(thingPrefix.length));
    },
    []
  );
}

export function useThingByID(reflect: Reflect<M>, id: string) {
  return useSubscribe(
    reflect,
    async (tx) => {
      return await getThing(tx, id);
    },
    null
  );
}

export function useUserIDs(reflect: Reflect<M>) {
  return useSubscribe(
    reflect,
    async (tx) => {
      const users = (await tx
        .scan({ prefix: userPrefix})
        .keys()
        .toArray()) as string[];
      return users.map((k) => k.substring(userPrefix.length));
    },
    []
  );
}

export function useUserByID(reflect: Reflect<M>, id: string) {
  return useSubscribe(
    reflect,
    async (tx) => {
      return await getUser(tx, id);
    },
    null
  );
}

export function useItemIDs(reflect: Reflect<M>) {
  return useSubscribe(
    reflect,
    async (tx) => {
      const items = (await tx
        .scan({ prefix: itemPrefix})
        .keys()
        .toArray()) as string[];
      return items.map((k) => k.substring(itemPrefix.length));
    },
    []
  );
}

export function useItemByID(reflect: Reflect<M>, id: string) {
  return useSubscribe(
    reflect,
    async (tx) => {
      return await getItem(tx, id);
    },
    null
  );
}

export function useItems(reflect: Reflect<M>) {
  return useSubscribe(
    reflect,
    async(tx) => {
      const items = await tx.scan({prefix: itemPrefix }).entries().toArray();
      console.log('useItems', items)
      return items
    },
    []
  )
}


export function useShapeIDs(reflect: Reflect<M>) {
  return useSubscribe(
    reflect,
    async (tx) => {
      const shapes = (await tx
        .scan({ prefix: shapePrefix })
        .keys()
        .toArray()) as string[];
      return shapes.map((k) => k.substring(shapePrefix.length));
    },
    []
  );
}

export function useShapeByID(reflect: Reflect<M>, id: string) {
  return useSubscribe(
    reflect,
    async (tx) => {
      return await getShape(tx, id);
    },
    null
  );
}

export function useUserInfo(reflect: Reflect<M>) {
  return useSubscribe(
    reflect,
    async (tx) => {
      return (await getClientState(tx, await reflect.clientID)).userInfo;
    },
    null
  );
}

export function useOverShapeID(reflect: Reflect<M>) {
  return useSubscribe(
    reflect,
    async (tx) => {
      return (await getClientState(tx, await reflect.clientID)).overID;
    },
    ""
  );
}

export function useSelectedShapeID(reflect: Reflect<M>) {
  return useSubscribe(
    reflect,
    async (tx) => {
      return (await getClientState(tx, await reflect.clientID)).selectedID;
    },
    ""
  );
}

export function useCollaboratorIDs(reflect: Reflect<M>) {
  return useSubscribe(
    reflect,
    async (tx) => {
      const clientIDs = (await tx
        .scan({ prefix: clientStatePrefix })
        .keys()
        .toArray()) as string[];
      const myClientID = await reflect.clientID;
      return clientIDs
        .filter((k) => !k.endsWith(myClientID))
        .map((k) => k.substr(clientStatePrefix.length));
    },
    []
  );
}

export function useClientInfo(reflect: Reflect<M>, clientID: string) {
  return useSubscribe(
    reflect,
    async (tx) => {
      return await getClientState(tx, clientID);
    },
    null
  );
}