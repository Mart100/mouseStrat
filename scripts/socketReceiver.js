const utils = require('./utils.js')
const Vector = require('./vector.js')
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
    if(!board.started) return
    let player = board.getPlayerBySocketID(socket.id)
    let building = buildingsData.find(b => b.name == buildingName)
    if(building == undefined) return socket.emit('msg', 'Building Not Found!')
    let buildingsPrice = utils.calculateBuildingPrice(buildingName, player)
    if(player.energy < buildingsPrice) return socket.emit('msg', `You need ${Math.round(buildingsPrice-player.energy)} more energy for this building!`)
    board.build(buildingName, player.position, player.socket.id)
    player.energy -= buildingsPrice
  })

  // on ability
  socket.on('ability', (abilityName) => {
    if(!board.started) return
    console.log('Ability: ', abilityName)
    if(abilityName == 'destroy') {
      let opponent = board.getOpponentBySocketID(socket.id)
      let player = board.getPlayerBySocketID(socket.id)
      let opponentBuildings = opponent.buildings()

      for(let building of opponentBuildings) {
        let distance = new Vector(building.position).minus(player.position).getMagnitude()
        if(distance < 50) {
          let index = board.buildings.indexOf(building)
          board.buildings.splice(index, 1)
          board.sendBuildings(opponent)

          if(building.type == 'core') board.win(player)
        }
      }
    } 
  })

  // on click
  socket.on('mouseclick', () => {
    if(!board.started) return
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