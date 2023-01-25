import React, { useState, useRef, useEffect } from 'react'
import { useUserIDs, useThingIDs, useItemIDs, useThingByID } from '../datamodel/subscriptions'
import { randomThing } from '../datamodel/thing'
import { dateInWordsTimeOnly } from '../util/dateInWords'

export default function Arrows({ reflect } : { reflect: any}) {
  const [selectedThing, setSelectedThing] = useState<string|null>(null)

  const thingIDs = useThingIDs(reflect)

  function addThing(){
    const thing = randomThing()
    reflect.mutate.createThing(thing)
  }

  return (
    <div className={"relative h-screen"}>
      <div className={"flex h-screen z-0"}>
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
          thing={selectedThing || null}
          reflect={reflect}
        />
      </div>
      <Toasts/>
    </div>
  )
}


function Toasts(){
  return (
    <div className={`
      absolute bottom-0 left-0
      flex justify-around
      w-80 h-16
      bg-zinc-100
      p-4
      border-2 border-black
      m-2
    `}>
      <div>✓</div>
      <div>Thing added.</div>
      <div>&times;</div>
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

function Right({ thing, reflect}: any){

  return (
    <div className={"p-4 w-128 bg-green-100 border-l-2 border-black"}>
      {thing &&
        <ThingEdit
          thing={thing}
          name={thing.name}
          reflect={reflect}
        />
      }
    </div>
  )
}

function ThingEdit({thing, name, reflect} : any) {
  const nameRef = useRef<HTMLInputElement>()
  const [x, setX] = useState<any>(name)

  useEffect(() => {
    setX(name)
  }, [name])

  function updateThingName(){
    let value = name
    if (nameRef && nameRef.current && nameRef.current.value) {
      value = nameRef.current.value
    }
    const data = {
      id: thing.id,
      name: value
    }
    setX(value)
    reflect.mutate.updateThingName(data)
  }

  return (
    <div>
      <div className={"font-mono p-4 text-zinc-400"}>{thing.id}</div>
      <input
        className={"px-4 py-2 w-full outline-none bg-zinc-100 focus:bg-white"}
        ref={nameRef}
        placeholder={"name"}
        value={x}
        onChange={() => updateThingName()}
      />
    </div>
  )
}


function Thing({thingID, index, handleSetSelectedThing, reflect}: any){
  const [showDelete, setShowDelete] = useState(false)

  const thing = useThingByID(reflect, thingID)

  function passThingToParent(){
    handleSetSelectedThing({id: thingID, ...thing})
  }
  return (
    <div
      className={index%2 === 1 ? "bg-zinc-200 px-4 py-2" : "bg-white px-4 py-2"}
      onClick={() => passThingToParent()}
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