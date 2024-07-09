export class Game {
  #settings = {
    gridSize: {
      rows: 4,
      columns: 4,
    },
    googleJumpInterval: 2000,
    pointsToWin: 10
  }
  #status = 'pending'
  #player1
  #player2
  #google
  #jumpGoogleIntervalId
  #score = {
    1: {points: 0},
    2: {points: 0}
  }

  #getRandomPosition(coordinates) {
    let newX
    let newY
    do {
      newX = NumberUtils.getRandomNumber(this.#settings.gridSize.columns)
      newY = NumberUtils.getRandomNumber(this.#settings.gridSize.rows)
    } while (
      coordinates.some(p => p.x === newX && p.y === newY)
      )
    return new Position(newX, newY)
  }

  #createUnits() {
    const randomPosForPlayer1 = this.#getRandomPosition([])
    const randomPosForPlayer2 = this.#getRandomPosition([randomPosForPlayer1])
    this.#player1 = new Player(randomPosForPlayer1, 1)
    this.#player2 = new Player(randomPosForPlayer2, 2)
    this.#moveGoogleToRandomPosition(true)
  }
  #moveGoogleToRandomPosition(excludeGoogle) {
    let notCrossedPosition = [this.#player1.position, this.#player2.position]
    if (!excludeGoogle) {
      notCrossedPosition.push(this.#google.position)
    }
    this.#google = new Google(this.#getRandomPosition(notCrossedPosition))
  }
  #runGoogleJumpInterval () {
    this.#jumpGoogleIntervalId = setInterval(() => {
      this.#moveGoogleToRandomPosition()
    }, this.#settings.googleJumpInterval)
  }
  #checkBorders(player, delta) {
    const newPosition = player.position.clone()
    if (delta.x) {
      newPosition.x += delta.x
    }
    if (delta.y) {
      newPosition.y += delta.y
    }
    if (newPosition.x < 1 || newPosition.x > this.settings.gridSize.columns) {
      return true
    }
    if (newPosition.y < 1 || newPosition.y > this.settings.gridSize.rows) {
      return true
    }
    return false
  }
  #checkOtherPlayer(movingPlayer, otherPlayer, delta) {
    const newPosition = movingPlayer.position.clone()
    if (delta.x) {
      newPosition.x += delta.x
    }
    if (delta.y) {
      newPosition.y += delta.y
    }

    return otherPlayer.position.equals(newPosition)
  }
  async #checkGoogleCatching (player) {
     if (player.position.equals(this.google.position)) {
       this.#score[player.id].points += 1
       if (this.#score[player.id].points === this.#settings.pointsToWin) {
         await this.finishGame()
       } else {
         this.#moveGoogleToRandomPosition()
       }
     }
  }
  #movePlayer(movingPlayer, otherPlayer, delta) {
    const isBorder = this.#checkBorders(movingPlayer, delta)
    if (isBorder) {
      return
    }
    const isOtherPlayer = this.#checkOtherPlayer(movingPlayer, otherPlayer, delta)
    if (isOtherPlayer) {
      return
    }
    if (delta.x) {
      movingPlayer.position.x += delta.x
    }
    if (delta.y) {
      movingPlayer.position.y += delta.y
    }
    this.#checkGoogleCatching(movingPlayer)
  }
  movePlayer1Right() {
    const delta = {x: 1}
    this.#movePlayer(this.#player1, this.#player2, delta)
  }
  movePlayer1Left() {
    const delta = {x: -1}
    this.#movePlayer(this.#player1, this.#player2, delta)
  }
  movePlayer1Up() {
    const delta = {y: -1}
    this.#movePlayer(this.#player1, this.#player2, delta)
  }
  movePlayer1Down() {
    const delta = {y: 1}
    this.#movePlayer(this.#player1, this.#player2, delta)
  }
  movePlayer2Right() {
    const delta = {x: 1}
    this.#movePlayer( this.#player2, this.#player1,delta)
  }
  movePlayer2Left() {
    const delta = {x: -1}
    this.#movePlayer( this.#player2, this.#player1, delta)
  }
  movePlayer2Up() {
    const delta = {y: -1}
    this.#movePlayer(this.#player2, this.#player1,delta)
  }
  movePlayer2Down() {
    const delta = {y: 1}
    this.#movePlayer(this.#player2, this.#player1, delta)
  }
  get status() {
    return this.#status
  }

  get player1() {
    return this.#player1
  }

  get player2() {
    return this.#player2
  }
  get google() {
    return this.#google
  }
  get score() {
    return this.#score
  }

  get settings() {
    return this.#settings
  }

  set settings(settings) {
    if (settings.gridSize.rows * settings.gridSize.columns < 3) {
      throw new Error('grid size too small')
    }
    this.#settings = {...this.#settings, ...settings }
    this.#settings.gridSize = settings.gridSize ? {...this.#settings.gridSize, ...settings.gridSize } : this.#settings.gridSize
  }

  async start() {
    if (this.#status === 'pending') {
      this.#createUnits()
      this.#status = 'in-process'
    }
    this.#runGoogleJumpInterval()
  }
  async stop() {
    clearInterval(this.#jumpGoogleIntervalId)
  }
  async finishGame() {
    clearInterval(this.#jumpGoogleIntervalId)

    this.#google.position = new Position(0,0)
    this.#status = 'finished'
  }
}

class Unit {
  constructor(position) {
    this.position = position
  }
}

class Player extends Unit {
  constructor(position, id) {
    super(position)
    this.id = id
  }

}

class Google extends Unit {
  constructor(position) {
    super(position)
  }
}

class Position {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  clone () {
    return new Position(this.x, this.y)
  }
  equals (otherPosition) {
    return otherPosition.x === this.x && otherPosition.y === this.y
  }
}

class NumberUtils {
  static getRandomNumber(max) {
    return Math.floor(Math.random() * max + 1)
  }

}