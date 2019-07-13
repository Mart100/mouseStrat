const utils = require('./utils.js')
const Vector = require('./vector.js')
const buildingsData = require('../data/buildings.js')
const abilitiesData = require('../data/abilities.js')

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

    // check
    let buildingData = buildingsData.find(b => b.name == buildingName)
    if(buildingData == undefined) return socket.emit('msg', 'Building Not Found!')
    
    // other
    let buildingPos = player.position
    
    // check if in range of electricityBox
    let inElectricityRange = false
    let playerBuildings = player.buildings()
    for(let building1 of playerBuildings) {
      if(building1.type != 'Electricity Box' && building1.type != 'Core') continue
      let distance = new Vector(building1.position).minus(buildingPos).getMagnitude()
      let building1Data = buildingsData.find(b => b.name == building1.type)
      console.log(distance, building1Data.range)
      if(distance < building1Data.range) inElectricityRange = true
    }
    if(!inElectricityRange) return socket.emit('msg', 'Building needs to be in range of an Electricity Box!')

    // price
    let buildingsPrice = utils.calculateBuildingPrice(buildingName, player)
    if(player.energy < buildingsPrice) return socket.emit('msg', `You need ${Math.round(buildingsPrice-player.energy)} more energy for this building!`)
    player.energy -= buildingsPrice

    // build
    board.build(buildingName, player.position, player.socket.id)
  })

  // on ability
  socket.on('ability', (abilityName) => {
    if(!board.started) return

    let abilitieData = abilitiesData.find(a => a.name == abilityName)
    let opponent = board.getOpponentBySocketID(socket.id)
    let player = board.getPlayerBySocketID(socket.id)
    let opponentBuildings = opponent.buildings()
    let playerBuildings = player.buildings()

    // price
    if(player.energy < abilitieData.price) {
      return socket.emit('msg', `You need ${Math.round(abilitieData.price-player.energy)} more energy for this ability!`)
    }

    console.log('Ability: ', abilityName)

    if(abilityName == 'destroy') {
      for(let building of opponentBuildings) {
        let distance = new Vector(building.position).minus(player.position).getMagnitude()
        if(distance < 30) {
          let index = board.buildings.indexOf(building)
          board.buildings.splice(index, 1)
          board.sendBuildings(opponent)

          if(building.type == 'Core') board.win(player)
        }
      }
    }
    if(abilityName == 'sight') {
      for(let building of opponentBuildings) {
        let distance = new Vector(building.position).minus(player.position).getMagnitude()
        if(distance < 100) {
          if(building.type == 'Core' && distance > 50) continue
          playerBuildings.push(building)
        }
      }

      player.socket.emit('buildings', playerBuildings)

      setTimeout(() => { board.sendBuildings(player) }, 2000)
    }

    player.energy -= abilitieData.price
  })

  // on click
  socket.on('mouseclick', () => {
    if(!board.started) return
    let player = board.getPlayerBySocketID(socket.id)
    let playerBuildings = player.buildings()

    // if in prepare fase (building core)
    if(board.tickCount < 1000) {
      // return if core already found
      if(playerBuildings.find(b => b.type == 'Core') != undefined) return
      // else build new core
      board.build('Core', player.position, player.socket.id)
    }
  })
}