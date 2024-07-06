export class Game {
  #settings = {
    gridSize: {
      rows: 4,
      columns: 4,
    }
  }
  #status = 'pending'
  #player1
  #player2
  #google

  #getRandomPosition(coordinates) {
    let newX
    let newY
    do {
      newX = NumberUtils.getRandomNumber(this.#settings.gridSize.rows)
      newY = NumberUtils.getRandomNumber(this.#settings.gridSize.columns)
    } while (
      coordinates.some(p => p.x === newX && p.y === newY)
      )
    return new Position(newX, newY)
  }

  #createUnits() {
    const randomPosForPlayer1 = this.#getRandomPosition([])
    const randomPosForPlayer2 = this.#getRandomPosition([randomPosForPlayer1])
    const randomPosForGoogle = this.#getRandomPosition([randomPosForPlayer1, randomPosForPlayer2])
    this.#player1 = new Player(randomPosForPlayer1, 1)
    this.#player2 = new Player(randomPosForPlayer2, 2)
    this.#google = new Google(randomPosForGoogle)
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

  get settings() {
    return this.#settings
  }

  set settings(settings) {
    if (settings.gridSize.rows * settings.gridSize.columns < 3) {
      throw new Error('grid size too small')
    }
    this.#settings = settings
  }

  async start() {
    if (this.#status === 'pending') {
      this.#createUnits()
      this.#status = 'in-process'
    }
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
}

class NumberUtils {
  static getRandomNumber(max) {
    return Math.floor(Math.random() * max + 1)
  }

}