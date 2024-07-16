import {Game} from './game.js'
import {EventEmitter} from './observer/eventEmitter.js'

const score = document.querySelector('#score')
const table = document.querySelector('#grid')
const startBtn = document.querySelector('#startBtn')

const eventEmitter = new EventEmitter()
const game = new Game(eventEmitter)
game.settings = {
  gridSize: {
    columns: 3,
    rows: 3,
  },
  pointsToWin: 5
}

function render() {
  table.innerHTML = ''
  score.innerHTML = ''

  score.append(`player 1: ${game.score[1].points} - player 2: ${game.score[2].points}`)

  for (let y = 1; y <= game.settings.gridSize.rows; y++) {
    const tr = document.createElement('tr')
    for (let x = 1; x <= game.settings.gridSize.columns; x++) {
      const cell = document.createElement('td')
      tr.append(cell)

      if (x === game.player1.position.x && y === game.player1.position.y) {
        const player1 = document.createElement('img')
        player1.src = 'assets/player1.png'
        cell.append(player1)
      }
      if (x === game.player2.position.x && y === game.player2.position.y) {
        const player2 = document.createElement('img')
        player2.src = 'assets/player2.png'
        cell.append(player2)
      }
      if (x === game.google.position.x && y === game.google.position.y) {
        const google = document.createElement('img')
        google.src = 'assets/google.png'
        cell.append(google)
      }

    }
    table.append(tr)
  }
}

startBtn.addEventListener('click', async () => {
  await game.start()
  render()
  eventEmitter.subscribe('changePosition', () => render())
})

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowRight':
      game.movePlayer1Right()
      break
    case 'ArrowLeft':
      game.movePlayer1Left()
      break
    case 'ArrowDown':
      game.movePlayer1Down()
      break
    case 'ArrowUp':
      game.movePlayer1Up()
      break
    case 'd':
      game.movePlayer2Right()
      break
    case 'a':
      game.movePlayer2Left()
      break
    case 's':
      game.movePlayer2Down()
      break
    case 'w' +
    '':
      game.movePlayer2Up()
      break
  }
})
