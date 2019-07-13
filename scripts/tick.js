const Vector = require('./vector.js')

module.exports = (board) => {

  board.tickCount++

  // time to place core
  if(board.tickCount < 1000) {
    let secLeft = 10 - Math.round(board.tickCount/100)
    if(board.tickCount % 100 == 0) board.broadcastMSG(`You have <b>${secLeft}</b> seconds left to place your core! (click anywhere)`)
  }

  // return if player undefined
  if(board.player1 == undefined) return
  if(board.player2 == undefined) return

  // playerTicks
  playerTick(board, board.player1, board.player2)
  playerTick(board, board.player2, board.player1)

}

function playerTick(board, player, opponent) {

  // some variables
  let playerBuildings = board.getPlayerBuildings(player)

  // if prepare fase over. But not placed core. Random place
  if(board.tickCount == 1000) {
    if(playerBuildings.find(b => b.type == 'Core') == undefined) {
      let randomPos = new Vector(Math.round(Math.random()*board.size.x), Math.round(Math.random()*board.size.y))
      board.build('Core', randomPos, player.socket.id)
    }
  }

  // increase energy by core
  player.energy += 0.3

  // increase energy by powerTowers
  let powerTowerAmount = playerBuildings.filter(b => b.type == 'Power Tower').length
  player.energy += (0.1*powerTowerAmount)

  // if opponent detected by radar show
  let opponentDetected = false
  let radios = playerBuildings.filter(b => b.type == 'Radio')
  for(let radio of radios) {
    let distance = new Vector(radio.position).minus(opponent.position).getMagnitude()
    if(distance < 250) opponentDetected = true
  }

  if(opponentDetected) player.socket.emit('opponentMousePos', opponent.position)
  else player.socket.emit('opponentMousePos', {x:-111,y:-111})

  // send energy amount
  player.socket.emit('energy', player.energy)
  
}