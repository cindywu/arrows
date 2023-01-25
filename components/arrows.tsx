import React, { useState } from 'react'
import { useUserIDs, useThingIDs, useItemIDs, useThingByID } from '../datamodel/subscriptions'
import { randomThing } from '../datamodel/thing'
import { dateInWordsTimeOnly } from '../util/dateInWords'

export default function Arrows({ reflect } : { reflect: any}) {
  const [things, setThings] = useState(["reference 1", "reference 2", "reference 3"])
  const [selectedThing, setSelectedThing] = useState<string|null>(null)

  const userIDs = useUserIDs(reflect)
  const thingIDs = useThingIDs(reflect)
  const itemIDs = useItemIDs(reflect)

  console.log({userIDs}, {thingIDs}, {itemIDs})

  // OLD
  // function addThing(){
  //   let thing = "reference " + (things.length + 1)
  //   setThings([...things, thing])
  // }

  function addThing(){
    const thing = randomThing()
    reflect.mutate.createThing(thing)
  }

  return (
    <div className={"h-screen"}>
      <div className={"flex h-screen"}>
        <Left/>
        {thingIDs &&
          <Middle
            thingIDs={thingIDs}
            addThing={addThing}
            handleSetSelectedThing={setSelectedThing}
            reflect={reflect}
          />
        }
        <Right
          thing={selectedThing}
        />
      </div>
    </div>
  )
}

function Left(){
  return (
    <div className={"w-96 border-r-2 border-black bg-yellow-100"}>
      <div className={"p-8"}>
        <div className={"text-4xl"}>⤏</div>
        <div>ciindy.wu@gmail.com</div>
      </div>
    </div>
  )
}

function Middle({thingIDs, addThing, handleSetSelectedThing, reflect}:any){
  return (
    <div className={"w-full flex flex-col"}>
      <Nav
        addThing={addThing}
      />
      <Body
        thingIDs={thingIDs}
        handleSetSelectedThing={handleSetSelectedThing}
        reflect={reflect}
      />
    </div>
  )
}

function Nav({addThing}: any){
  return(
    <div className={"bg-blue-100 border-b-2 border-black h-16 p-4"}>
      <div className={"flex h-full"}>
        <div className={"w-full"}></div>
        <div className={"flex flex-col justify-center"}>
          <AddButton
            addThing={addThing}
          />
        </div>
      </div>
    </div>
  )
}

function AddButton({addThing}: any){
  return(
    <button
      className={"relative z-0 w-8 h-8 bg-black hover:bg-zinc-700"}
      onClick={addThing}
    >
      <div className={"absolute inset-0 flex justify-center items-center z-10 text-white"}>
        +
      </div>
    </button>
  )
}

function Body({thingIDs, handleSetSelectedThing, reflect}: any){
  return (
    <div className={"overflow-auto"}>
      {thingIDs && thingIDs.map((thingID: any, index: any) =>
        <Thing
          key={thingID}
          thingID={thingID}
          index={index}
          handleSetSelectedThing={handleSetSelectedThing}
          reflect={reflect}
        />
      )}
    </div>
  )
}

function Right({ thing }: any){
  return (
    <div className={"p-4 w-128 bg-green-100 border-l-2 border-black"}>{thing && thing}</div>
  )
}

function Thing({thingID, index, handleSetSelectedThing, reflect}: any){
  const [showDelete, setShowDelete] = useState(false)

  const thing = useThingByID(reflect, thingID)
  console.log({thing})
  return (
    <div
      className={index%2 === 1 ? "bg-zinc-200 px-4 py-2" : "bg-white px-4 py-2"}
      onClick={() => handleSetSelectedThing(thingID)}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div className={"grid grid-cols-3"}>
      <div>{thingID.slice(-6)}</div>
      {thing &&
        <>
        <div>{thing.name}</div>
        <div>{dateInWordsTimeOnly(new Date(thing.createdAt))}</div>
        </>
      }

      {/* {showDelete ? <button className={"px-2"}>delete</button> : <button></button>} */}
      </div>
    </div>
  )
}