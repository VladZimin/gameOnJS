import {Game} from "./game.js";

describe ("Game Test", () => {
    const game = new Game();
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
        const coordinates = units.map( u => u.position)
        const uniqueCoordinates = Array.from(
          new Set(coordinates.map(obj => JSON.stringify(obj))),
            str => JSON.parse(str)
        )
        expect(uniqueCoordinates.length).toBe(units.length)
    })
})