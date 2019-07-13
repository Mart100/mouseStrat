function calculateBuildingPrice(name) {
  let buildingData = buildingsData.find(b => b.name == name)
  
  if(!isNaN(buildingData.price)) return Number(buildingData.price)

  else {
    if(buildingData.price.includes('*a')) {
      let split = buildingData.price.split('*a')
      let number = Number(split[0])
      let amount = buildings.filter(b => b.type == name).length
      return number*amount
    }
  }
}

function normalizeRadians(a) {
  if(a > Math.PI) a -= Math.PI
  if(a < 0) a += Math.PI
  return a
}