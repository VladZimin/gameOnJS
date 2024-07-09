import {Game} from './game.js'

describe('Game Test', () => {
  let game
  beforeEach(() => {
    game = new Game()
  })
  afterEach(() => {
    game.stop()
  })
  it('set settings', () => {
    game.settings = {
      gridSize: {
        rows: 4,
        columns: 5
      }
    }
    const settings = game.settings
    expect(settings.gridSize.columns).toBe(5)
  })
  it('start game', async () => {
    game.settings = {
      gridSize: {
        rows: 4,
        columns: 4
      }
    }
    expect(game.status).toBe('pending')
    await game.start()
    expect(game.status).toBe('in-process')
  })
  it('game units should have unique coordinates', async () => {
    game.settings = {
      gridSize: {
        rows: 1,
        columns: 3
      }
    }
    await game.start()
    const units = [game.player1, game.player2, game.google]
    const coordinates = units.map(u => u.position)
    const uniqueCoordinates = Array.from(
      new Set(coordinates.map(obj => JSON.stringify(obj))),
      str => JSON.parse(str)
    )
    expect(uniqueCoordinates.length).toBe(units.length)
  })
  it('google position should be changed', async () => {
    game.settings = {
      gridSize: {
        rows: 1,
        columns: 4
      },
      googleJumpInterval: 100
    }
    await game.start()

    const prevPosition = game.google.position.clone()
    await delay(150)

    expect(game.google.position.equals(prevPosition)).toBe(false)
  })
  it('catch google by player1 or player2 for one columns', async () => {
    for (let i = 0; i < 10; i++) {
      game = new Game()
      // setter
      game.settings = {
        gridSize: {
          columns: 1,
          rows: 3,
        },
      }

      await game.start()

      const deltaForPlayer1 = game.google.position.y - game.player1.position.y

      const prevGooglePosition = game.google.position.clone()

      if (Math.abs(deltaForPlayer1) === 2) {
        const deltaForPlayer2 = game.google.position.y - game.player2.position.y

        if (deltaForPlayer2 > 0) game.movePlayer2Down()
        else game.movePlayer2Up()

        expect(game.score[1].points).toBe(0)
        expect(game.score[2].points).toBe(1)
      } else {

        if (deltaForPlayer1 > 0) game.movePlayer1Down()
        else game.movePlayer1Up()

        expect(game.score[1].points).toBe(1)
        expect(game.score[2].points).toBe(0)
      }

      expect(game.google.position.equals(prevGooglePosition)).toBe(false)
    }
  })
  it('should finish the game when necessary points are scored', async () => {
    game.settings = {
      gridSize: {
        columns: 1,
        rows: 3,
      },
      pointsToWin: 5
    }

    await game.start()

    do {
      const deltaForPlayer1 = game.google.position.y - game.player1.position.y
      if (Math.abs(deltaForPlayer1) === 2) {
        const deltaForPlayer2 = game.google.position.y - game.player2.position.y
        if (deltaForPlayer2 > 0) game.movePlayer2Down()
        else game.movePlayer2Up()
      } else {
        if (deltaForPlayer1 > 0) game.movePlayer1Down()
        else game.movePlayer1Up()
      }
    } while (
      game.score[1].points !== game.settings.pointsToWin &&
      game.score[2].points !== game.settings.pointsToWin
      )


    expect(game.status).toBe('finished')
    expect(game.google.position).toEqual({x: 0, y: 0})
  })
})

const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}