import React from 'react'
import { Reflect } from '@rocicorp/reflect'
import type { M } from '../datamodel/mutators'
import { randomGame } from '../datamodel/game'
import { useGameIDs, useGameByID } from '../datamodel/subscriptions'

type BattleshipProps = {
  reflect: Reflect<M>
}

export default function Battleship({reflect} : BattleshipProps) {

  const gameIDs = useGameIDs(reflect)

  console.log(gameIDs[0])

  function makeAGame() {
    let game = randomGame()
    console.log(game)
    reflect.mutate.createGame(game)
  }

  function placeShipAt1(){
    reflect.mutate.updateGame({id: gameIDs[0], shipPlacement: 1})
  }

  return (
    <div>
      <button onClick={() => makeAGame()}>make a game</button>
      <div>
        {gameIDs && gameIDs.map((id) => <div key={id}>{id}</div>)}
      </div>
      {gameIDs && <Game
        gameID={gameIDs[0]}
        reflect={reflect}
      />}
      <table>
        <tbody>
          <tr>
            <div onClick={() => placeShipAt1()}>
              1
            </div>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>1</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function Game({gameID, reflect} : {gameID: string, reflect: Reflect<M>}){

  const game = useGameByID(reflect, gameID)

  console.log("hello", {game})
  return (
    <div>
      Game
      {game && <div>{JSON.stringify(game)}</div>}
    </div>
  )
}
