type Player = {
  id: number,
  name: string,
  iconClass: string,
  colorClass: string,
}

type Move = {
  squareId: number,
  player: Player
}

type GameStatus = {
  isComplete: boolean,
  winner: Player
}


type Game = {
  moves: Move[],
  status: GameStatus
}


type GameState = {
  currentGameMoves: Move[],
  history: {
    currentRoundGames: Game[],
    allGames: Game[],
  },
}