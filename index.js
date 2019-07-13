// init project
const express = require('express')
const Socket = require('socket.io')
const app = express()

// import custom scripts
const tick = require('./scripts/tick.js')
const utils = require('./scripts/utils.js')
const Board = require('./scripts/board.js')
const buildingsData = require('./data/buildings.js')
const abilitiesData = require('./data/abilities.js')

// listen on port :)
const server = app.listen(process.env.PORT || 3000, () => {
  console.log('FITYMI is listening on port ' + server.address().port)
})

// other global variables
const io = Socket(server)


let boards = []


app.use('/', express.static('client'))

app.use('/:id/', express.static('client'))

// on client connect 
io.on('connection', (socket) => {
  console.log('CONNECT: ', socket.id)

  // always send this
  socket.emit('buildingsData', buildingsData)
  socket.emit('abilitiesData', abilitiesData)

  // get gameID
  let gameID = socket.handshake.headers.referer.split('/')[3]
  if(gameID == '') gameID = findRandomOpenBoard()

  if(boards[gameID] == undefined) {
    if(gameID == 'none') gameID = utils.randomToken(5)
    boards[gameID] = new Board(gameID, {})
  }
  
  let board = boards[gameID]

  let response = board.join(socket)

  if(response == 'FULL') return socket.emit('msg', 'This board is already full!')

})

function findRandomOpenBoard() {
  for(let num in boards) {
    let board = boards[num]
    if(board.player1 == undefined) continue
    return board.id
  }
  for(let num in boards) {
    let board = boards[num]
    if(board.player1 != undefined) continue
    if(board.player2 != undefined) continue
    return board.id
  }
  return 'none'
}