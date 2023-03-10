import React, { useState, useRef, useEffect } from 'react'
import { useThingIDs, useThingByID, useArrowIDs, useArrowByID } from '../datamodel/subscriptions'
import { randomThing } from '../datamodel/thing'
import { randomArrow } from '../datamodel/arrow'
import { dateInWordsTimeOnly } from '../util/dateInWords'
import Link from 'next/link'

//   name: z.string(),
//   createdAt: z.string(),
//   arrows: z.array(z.string()),
//   type: z.string(),
//   fileIDs: z.array(z.string()),
//   publicationDate: z.string(),
//   authorArrows: z.array(z.string()),
//   tldr: z.string()

export default function Arrows({ reflect } : { reflect: any}) {
  const [selectedThing, setSelectedThing] = useState<string|null>(null)
  const [showAuthors, setShowAuthors] = useState<boolean>(false)
  const [showSelectedThing, setShowSelectedThing] = useState<boolean>(false)


  const thingIDs = useThingIDs(reflect)
  const arrowIDs = useArrowIDs(reflect)

  useEffect(() => {
    setShowSelectedThing(true)
  }, [selectedThing])

  function addThing(){
    const thing = randomThing()
    reflect.mutate.createThing(thing)
  }

  return (
    <div className={"relative h-screen"}>
      <div className={"flex h-screen z-0"}>
        {thingIDs &&
          <>
            <Left
              count={thingIDs.length}
            />
            <Middle
              thingIDs={thingIDs}
              addThing={addThing}
              handleSetSelectedThing={setSelectedThing}
              selectedThing={selectedThing}
              reflect={reflect}
              handleShowAuthors={showAuthors}
              handleSetShowAuthors={setShowAuthors}
            />
          </>
        }
        {showSelectedThing &&
            <Right
            thing={selectedThing || null}
            reflect={reflect}
          />
        }

      </div>
      {/* <Toasts/> */}
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
      <div>???</div>
      <div>Thing added.</div>
      <div>&times;</div>
    </div>
  )
}

function Left({count}: any){
  return (
    <div className={`w-96 border-r-2 border-black h-screen`}>
      <div className={"p-8"}>
        <div className={"text-4xl"}>???</div>
        <div className={"py-4"}>ciindy.wu@gmail.com</div>
        <div>{count} things</div>
      </div>
      <Link href="https://cindy-wu.com"><div className={"absolute p-8 bottom-0 text-4xl"}>???</div></Link>
    </div>
  )
}

function Middle({thingIDs, addThing, handleSetSelectedThing, reflect, handleShowAuthors, handleSetShowAuthors, selectedThing}:any){
  return (
    <div className={"w-full flex flex-col"}>
      <Nav
        addThing={addThing}
        handleShowAuthors={handleShowAuthors}
        handleSetShowAuthors={handleSetShowAuthors}
      />
      <Body
        thingIDs={thingIDs}
        handleSetSelectedThing={handleSetSelectedThing}
        reflect={reflect}
        handleShowAuthors={handleShowAuthors}
        selectedThing={selectedThing}
      />
    </div>
  )
}

function Nav({addThing, handleShowAuthors, handleSetShowAuthors}: any){
  return(
    <div className={"border-b-2 border-black h-16 p-4"}>
      <div className={"flex h-full"}>
        <div className={"w-full"}>
          <div onClick={() => handleSetShowAuthors(!handleShowAuthors)}>{handleShowAuthors ? "hide authors" : "show authors"}</div>
        </div>
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

function Body({thingIDs, handleSetSelectedThing, reflect, handleShowAuthors, selectedThing}: any){
  return (
    <div className={"overflow-auto"}>
      {thingIDs.length > 0 ? thingIDs.map((thingID: any, index: any) =>
        <Thing
          key={thingID}
          thingID={thingID}
          index={index}
          handleSetSelectedThing={handleSetSelectedThing}
          reflect={reflect}
          handleShowAuthors={handleShowAuthors}
          isSelectedThing= {selectedThing ? selectedThing.id === thingID : false}
        />
      )
      :
      <div
        className={"flex justify-center w-full pt-40"}
        onClick={() => reflect.mutate.createThing(randomThing())}
      >
        <button>what's on your mind?</button>
      </div>}
    </div>
  )
}

function Right({ thing, reflect}: any){
  return (
    <div className={"p-4 w-128 border-l-2 border-black"}>
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
  console.log({thing})
  const nameRef = useRef<any>()
  const authorRef = useRef<any>()
  const tldrRef = useRef<any>()
  const publicationDateRef = useRef<any>()
  const [x, setX] = useState<any>(name)
  const [tldr, setTldr] = useState<any>(thing.tldr)
  const [publicationDate, setPublicationDate] = useState<any>(thing.publicationDate)
  const [showAuthorForm, setShowAuthorForm] = useState<boolean>(false)
  const [showEditName, setShowEditName] = useState<boolean>(false)
  const [showEditTldr, setShowEditTldr] = useState<boolean>(false)
  const [showEditPublicationDate, setShowEditPublicationDate] = useState<boolean>(false)

  const [arrowIDs, setArrowIDs] = useState<string[]>([])

  useEffect(() => {
    setX(name)
  }, [name])

  useEffect(() => {
    setArrowIDs(thing.arrows)
  }, [thing.arrows])

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

  function updateThingTldr(){
    let value = thing.tldr
    if (tldrRef && tldrRef.current && tldrRef.current.value) {
      value = tldrRef.current.value
    }
    const data = {
      id: thing.id,
      tldr: value
    }
    console.log({data})
    setTldr(value)
    reflect.mutate.updateThingTldr(data)
  }

  function updateThingPublicationDate(){
    let value = thing.publicationDate
    if (publicationDateRef && publicationDateRef.current && publicationDateRef.current.value) {
      value = publicationDateRef.current.value
    }
    const data = {
      id: thing.id,
      publicationDate: value
    }
    console.log("data", data)
    console.log({data})

    setPublicationDate(value)
    reflect.mutate.updateThingPublicationDate(data)
  }

  function saveAuthor(){
    // create a new thing
    const authorThing : any = randomThing()
    authorThing.thing.name = authorRef && authorRef.current && authorRef.current.value

    // create a new arrow
    const authorArrow : {id: string, arrow: {back: string, front: string, createdAt: string}}= randomArrow()

    // update arrow with front and back
    authorArrow.arrow.front = authorThing.id
    authorArrow.arrow.back = thing.id

    // update new thing with new arrow
    authorThing.thing.arrows = [authorArrow.id, ...authorThing.thing.arrows]
    authorThing.thing.type = "author"

    // save everything
    // save arrow
    reflect.mutate.createArrow(authorArrow)
    // create new thing
    reflect.mutate.createThing(authorThing)
    // add arrow to existing thing
    reflect.mutate.updateThingAddArrow({id: thing.id, arrow: authorArrow.id, authorArrow: authorArrow.id })
  }

  return (
    <div>
      <div className={"font-mono p-4 text-zinc-400"}>{thing.id}</div>
      {!showEditName ?
        <div
          className={"px-4 py-2 w-full"}
          onClick={() => setShowEditName(!showEditName)}
        >{thing.name}</div>
      :
        <textarea
          className={"px-4 py-2 w-full outline-none bg-zinc-100 bg-white focus:bg-zinc-100"}
          ref={nameRef}
          placeholder={"name"}
          value={x}
          onChange={() => updateThingName()}
        />
      }
      {!showEditPublicationDate ?
        <div
          className={"px-4 py-2 w-full"}
          onClick={() => setShowEditPublicationDate(!showEditPublicationDate)}
        >{thing.publicationDate ? thing.publicationDate : 'no date'}</div>
      :
        <textarea
          className={"px-4 py-2 w-full outline-none bg-zinc-100 bg-white focus:bg-zinc-100"}
          ref={publicationDateRef}
          placeholder={"publication date"}
          value={publicationDate}
          onChange={() => updateThingPublicationDate()}
        />
      }
      <div className={"px-4 py-2"}>
        <div className={"py-2"}>
          {arrowIDs && arrowIDs.map((arrowID: any) => {
            return (
              <AuthorArrow
                key={arrowID}
                arrowID={arrowID}
                reflect={reflect}
              />
            )
          })}
        </div>
        {showAuthorForm ?
          <>
            <div className={"flex"}>
            <input
              className={"px-2 py-2 w-full outline-none bg-zinc-100 bg-white focus:bg-zinc-100"}
              placeholder={"author name"}
              ref={authorRef}
            />
            <div><button onClick={() => saveAuthor()}>save</button></div>
            <div><button onClick={() => setShowAuthorForm(!showAuthorForm)}>&times;</button></div>
            </div>
          </>
          :
          <button className={"py-2"} onClick={() => setShowAuthorForm(!showAuthorForm)}>Add author</button>
        }
      </div>
      {!showEditTldr ?
        <div
          className={"px-4 py-2 w-full"}
          onClick={() => setShowEditTldr(!showEditTldr)}
        >{thing.tldr ? thing.tldr : "empty"}</div>
      :
        <textarea
          className={"px-4 py-2 w-full outline-none bg-zinc-100 bg-white focus:bg-zinc-100"}
          ref={tldrRef}
          placeholder={"tldr"}
          value={tldr}
          onChange={() => updateThingTldr()}
        />
      }

      <div
        className={"px-4 py-2"}
        onClick={() => reflect.mutate.deleteThing(thing.id)}
      >Delete</div>
    </div>
  )
}

function AuthorArrow({reflect, arrowID}: {reflect: any, arrowID: string}){
  const arrow = useArrowByID(reflect, arrowID)
  return(
    arrow &&
      <>
        <Author
          reflect={reflect}
          thingID={arrow.front}
        />
      </>
  )
}

function Author({reflect, thingID}: any) {
  const thing = useThingByID(reflect, thingID)
  return (
    thing &&

    <div>{thing.name}</div>
  )
}


function Thing({thingID, index, handleSetSelectedThing, reflect, handleShowAuthors, isSelectedThing}: any){
  const [showDelete, setShowDelete] = useState(false)

  const thing = useThingByID(reflect, thingID)

  function passThingToParent(){
    handleSetSelectedThing({id: thingID, ...thing})
  }

  console.log("beep boop" , thing?.authorArrows.length)

  if (!handleShowAuthors  && thing && thing.type === "author") {
    return (
      <></>
    )
  }


  return (
    <div
      className={index%2 === 1 ? "bg-zinc-200 px-4 py-2" : "bg-white px-4 py-2"}
      onClick={() => passThingToParent()}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div className={"flex "}>
      <div className={"w-24"}>{thingID.slice(-6)}</div>
      {thing &&
        <>
          <div className={"w-full"}>{thing.name}</div>
          <div className={"w-24"}>{dateInWordsTimeOnly(new Date(thing.createdAt))}</div>
        </>
      }

      </div>
      {isSelectedThing &&
      <div className={"flex pt-2"}>
        <div className={"w-24"}></div>
        <div className={"w-full py-2 pr-20 text-zinc-500"}>
        {thing &&
          <ShortName
            publicationDate={thing.publicationDate}
            firstAuthorThingID={thing.authorArrows.length > 0 ? thing.authorArrows[0] : null}
            reflect={reflect}
          />
        }
        </div>
        <div className={"w-24"}></div>
      </div>
      }
      {isSelectedThing &&
      <div className={"flex"}>
        <div className={"w-24"}></div>
        <div className={"w-full py-2 pr-20 text-zinc-500"}>{thing && thing.tldr}</div>
        <div className={"w-24"}>  </div>
      </div>
      }
    </div>
  )
}

function ShortName({publicationDate, firstAuthorThingID, reflect} : any){
  const arrow = useArrowByID(reflect, firstAuthorThingID)

  return (
    <div>
      {arrow &&
        <>
          <FirstAuthorLastName
            thingID={arrow.front}
            reflect={reflect}
          />
          <span>{` et al. `}</span>
        </>
      }
      {publicationDate}
    </div>
  )
}

function FirstAuthorLastName({thingID, reflect}:any){
  const thing = useThingByID(reflect, thingID)
  return (
    <>
      {thing &&
      <span className={""}>{
        thing.name.split(" ")[1]
      }</span>
      }
    </>
  )
}