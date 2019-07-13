const utils = require('./utils.js')
const buildingsData = require('../data/buildings.js')

module.exports = (socket, board) => {
  socket.on('mouse', (data) => {
    if(!board.started) return
    let player = board.getPlayerBySocketID(socket.id)
    player.position = data
  })

  // On disconnect stop game
  socket.on('disconnect', (socket) => {

    board.broadcastMSG('Game stopped!')
    board.reset()
    
    console.log('RESTART')
  })

  // on build
  socket.on('build', (buildingName) => {
    let player = board.getPlayerBySocketID(socket.id)
    let building = buildingsData.find(b => b.name == buildingName)
    if(building == undefined) return socket.emit('msg', 'Building Not Found!')
    let buildingsPrice = utils.calculateBuildingPrice(buildingName, player)
    if(player.energy < buildingsPrice) return socket.emit('msg', `You need ${Math.round(buildingsPrice-player.energy)} more energy for this building!`)
    board.build(buildingName, player.position, player.socket.id)
    player.energy -= buildingsPrice
  })

  // on ability
  socket.on('ability', (buildingName) => {
    
  })

  // on click
  socket.on('mouseclick', () => {
    let player = board.getPlayerBySocketID(socket.id)
    let playerBuildings = player.buildings()

    // if in prepare fase (building core)
    if(board.tickCount < 1000) {
      // return if core already found
      if(playerBuildings.find(b => b.type == 'core') != undefined) return
      // else build new core
      board.build('core', player.position, player.socket.id)
    }
  })
}