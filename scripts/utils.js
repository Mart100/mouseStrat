const buildingsData = require('../data/buildings.js')

module.exports = {
  calculateBuildingPrice(name, player) {
    let building = buildingsData.find(b => b.name == name)
    let playerBuildings = player.buildings()
    
    if(!isNaN(building.price)) return Number(building.price)

    else {
      if(building.price.includes('*a')) {
        let split = building.price.split('*a')
        let number = Number(split[0])
        let amount = playerBuildings.filter(b => b.type == name).length
        return number*amount
      }
    }
  },
  sleep(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  }
}