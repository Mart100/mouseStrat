let gameID = 'testBot'
let buildings = []

const socket = require('socket.io-client')(`http://localhost:3000`)

// wait on socket connect
socket.on('connect', () => {
  console.log('Bot Socket connected!')

  // search for game
  socket.emit('findGame', gameID)

})

socket.on('joined', () => {
  console.log(`Bot Joined game ${gameID}!`)

})

socket.on('msg', (msg) => {
  if(msg == 'Game starting!') gameStart()
})

async function gameStart() {
  // place core at 1000 500
  socket.emit('mouse', {x: 10, y: 10})
  socket.emit('mouseclick')

  // place energyTower at 1050 500
  socket.emit('mouse', {x: 50, y: 10})
  socket.emit('build', 'Power Tower')
}

socket.on('buildings', (data) => {
  buildings = data
  console.log(buildings)
})

function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}