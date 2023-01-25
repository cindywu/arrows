import React, { useState } from 'react'

export default function Arrows() {
  const [things, setThings] = useState(["reference 1", "reference 2", "reference 3"])
  const [selectedThing, setSelectedThing] = useState<string|null>(null)

  function addThing(){
    let thing = "reference " + (things.length + 1)
    setThings([...things, thing])
  }

  return (
    <div className={"h-screen"}>
      <div className={"flex h-screen"}>
        <Left/>
        <Middle
          things={things}
          addThing={addThing}
          handleSetSelectedThing={setSelectedThing}
        />
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

function Middle({things, addThing, handleSetSelectedThing, handleSetThings}:any){
  return (
    <div className={"w-full flex flex-col"}>
      <Nav
        addThing={addThing}
      />
      <Body
        things={things}
        handleSetSelectedThing={handleSetSelectedThing}
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

function Body({things, handleSetSelectedThing}: any){
  const reversedThings = things.slice().reverse()


  return (
    <div className={"overflow-auto"}>
      {reversedThings && reversedThings.map((thing: any, index: any) =>
        <Thing
          key={thing}
          thing={thing}
          index={index}
          handleSetSelectedThing={handleSetSelectedThing}
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

function Thing({thing, index, handleSetSelectedThing}: any){
  const [showDelete, setShowDelete] = useState(false)

  return (
    <div
      key={thing}
      className={index%2 === 1 ? "bg-zinc-200 px-4 py-2" : "bg-white px-4 py-2"}
      onClick={() => handleSetSelectedThing(thing)}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <span>{thing}</span>
      {showDelete && <button className={"px-2"}>delete</button>}
    </div>
  )
}