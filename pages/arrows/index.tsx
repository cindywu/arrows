import React, { useState, useEffect } from 'react'
import { Reflect } from '@rocicorp/reflect'
import { M, clientMutators } from '../../datamodel/mutators'
import Arrows from '../../components/arrows'
import { consoleLogSink, OptionalLoggerImpl } from '@rocicorp/logger'
import { DataDogBrowserLogSink } from '../../components/data-dog-browser-log-sink'
import { workerWsURI } from '../../util/host'
import { nanoid } from 'nanoid'
import { randUserInfo } from '../../datamodel/client-state'
import Battleship from '../../components/battleship'

export default function Home() {
  const [reflect, setReflectClient] = useState<Reflect<M> | null>(null)
  const [_, setOnline] = useState(false)

  const [clientUserID, setClientUserID] = useState<string | null>(null)

  const logSink = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN
    ? new DataDogBrowserLogSink()
    : consoleLogSink;
  const logger = new OptionalLoggerImpl(logSink);

  useEffect(() => {
    const roomID = `crdt-papers`;

    (async () => {
      logger.info?.(`Connecting to worker at ${workerWsURI}`);
      // const userID = clientUserID ? clientUserID : nanoid();
      const userID = "cindy" // FIX THIS!!
      const r = new Reflect<M>({
        socketOrigin: workerWsURI,
        onOnlineChange: setOnline,
        userID,
        roomID,
        auth: JSON.stringify({
          userID,
          roomID,
        }),
        logSinks: [logSink],
        mutators: clientMutators,
      });

      const defaultUserInfo = randUserInfo();
      await r.mutate.initClientState({
        id: await r.clientID,
        defaultUserInfo,
      });
      await r.mutate.initShapes();

      setReflectClient(r);
    })();
  }, []);

  if (!reflect) {
    return null
  }

  return (
    // <Arrows
    //   reflect={reflect}
    // />
    <Battleship
      reflect={reflect}
    />
  )
}
