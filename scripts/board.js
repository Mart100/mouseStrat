const tick = require('./tick.js')
const SocketReceiver = require('./socketReceiver.js')

class Board {
  constructor(id, settings) {
    this.settings = settings
    this.id = id
    this.player1 = undefined
    this.player2 = undefined
    this.buildings = []
    this.socketReceiver = SocketReceiver
    this.tickCount = 0
    this.started = false
    this.size = {x: 1920, y: 937}
    this.tickRunner
  }
  tick() {
    tick(this)
  }
  join(socket) {

    let playerNum = 0

    if(this.player1 == undefined) playerNum = 1
    else if(this.player2 == undefined) playerNum = 2
    else return 'FULL'

    let player = {
      socket: socket,
      energy: 0,
      health: 100,
      position: { x: 0, y: 0 },
      buildings: () => { return this.getPlayerBuildings(player) }
    }
  
    if(playerNum == 1) this.player1 = player
    if(playerNum == 2) this.player2 = player

    if(playerNum == 1) socket.emit('msg', 'Waiting for opponent...')
    if(playerNum == 2) this.start()

    this.socketReceiver(socket, this)

    return 'JOINED'

  }
  start() {

    // send start message
    this.broadcastMSG('Game starting!')

    // start
    this.started = true

    // run ticks
    this.tickRunner = setInterval(() => { this.tick() }, 10)

  }
  reset() {
    if(this.player1 != undefined) this.player1.socket.removeAllListeners()
    if(this.player2 != undefined) this.player2.socket.removeAllListeners()
    this.player1 = undefined
    this.player2 = undefined
    this.started = false
    this.buildings = []
    this.tickCount = 0
    clearInterval(this.tickRunner)
  }
  getPlayerBySocketID(id) {
    if(this.player1.socket.id == id) return this.player1
    if(this.player2.socket.id == id) return this.player2
  }
  broadcastMSG(msg) {
    if(this.player1 != undefined) this.player1.socket.emit('msg', msg)
    if(this.player2 != undefined) this.player2.socket.emit('msg', msg)
  }
  getPlayerBuildings(player) {
    let playerBuildings = []
    for(let building of this.buildings) {
      if(building.owner != player.socket.id) continue
      playerBuildings.push(building)
    }
    return playerBuildings
  }
  build(buildingName, pos, by) {
    let building = {
      owner: by,
      position: pos,
      type: buildingName
    }
    this.buildings.push(building)

    let builder = this.getPlayerBySocketID(by)
    let builderBuildings = this.getPlayerBuildings(builder)

    builder.socket.emit('buildings', builderBuildings)
    
  }
}

module.exports = Board