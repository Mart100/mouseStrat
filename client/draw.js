let canvas
let ctx


$(() => {
  // prepare ctx and canvas
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext("2d")

  // Set Canvas size
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // begin frame
  frame()
})



function frame() {
  requestAnimationFrame(frame)

  // Set Canvas size
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // Clear Screen
  ctx.clearRect(0, 0, canvas.width, canvas.height)


  draw.buildings()
  draw.opponentMouse()
  draw.trail()
  draw.buildMenu()
  draw.abilitiesMenu()
  draw.ownMouse()

}


const draw = {
  ownMouse() {
    if(!mouseLocked) return
    ctx.fillStyle = 'rgb(200, 200, 255)'
    ctx.beginPath()
    ctx.arc(mousePos.x, mousePos.y, 5, 0, 2*Math.PI)
    ctx.fill()
  },
  opponentMouse() {
    if(opponentMousePos == undefined) return
    ctx.fillStyle = 'rgb(255, 0, 0)'
    ctx.beginPath()
    ctx.arc(opponentMousePos.x, opponentMousePos.y, 5, 0, 2*Math.PI)
    ctx.fill()
  },
  buildings() {
    for(let building of buildings) {
      let buildingData = buildingsData.find(b => b.name == building.type)

      // if range. Draw range
      if(buildingData.range != undefined) {
        ctx.fillStyle = `rgba(${buildingData.color[0]},${buildingData.color[1]},${buildingData.color[2]},0.02)`
        ctx.beginPath()
        let posX = building.position.x
        let posY = building.position.y
        ctx.arc(posX, posY, buildingData.range, 0, 2*Math.PI)
        ctx.fill()
      }
      ctx.strokeStyle = 'rgba(0, 0, 0, 1)'
      if(building.owner != socket.id) ctx.strokeStyle = 'rgba(255, 0, 0, 1)'
      ctx.fillStyle = `rgba(${buildingData.color[0]},${buildingData.color[1]},${buildingData.color[2]},0.5)`
      ctx.beginPath()
      let posX = building.position.x - buildingData.size.x/2
      let posY = building.position.y - buildingData.size.y/2
      ctx.rect(posX, posY, buildingData.size.x, buildingData.size.y)
      ctx.fill()
      ctx.stroke()
    }
  },
  trail() {
    ctx.beginPath()
    ctx.strokeStyle = 'rgb(255,0,0)'
    ctx.lineWidth = 2

    for(let i in trail) {
      let pos = trail[i]

      if(i == 0) ctx.moveTo(pos.x, pos.y)
      else ctx.lineTo(pos.x, pos.y)
      
    }
    ctx.stroke()
  },
  buildMenu() {
    if(!rightDown) return
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.beginPath()
    ctx.arc(mousePos.x, mousePos.y, 50, 0, 2*Math.PI)
    ctx.fill()

    let radiusPerOption = (Math.PI/slotsAmount)*2
    let BMCO = buildMenuCurrentOption
    let currentRadius = BMCO*radiusPerOption

    // draw slots
    let slots = buildingsData.filter(b => b.slot != undefined)
    for(let i=0;i<slots.length;i++) {
      let slot = slots.find(s => s.slot == i)
      let slotRadius = i*radiusPerOption
      let vec = new Vector(Math.cos(slotRadius), Math.sin(slotRadius)).setMagnitude(50).plus(mousePos)
      ctx.beginPath()
      ctx.moveTo(mousePos.x, mousePos.y)
      ctx.lineTo(vec.x, vec.y)
      ctx.stroke()

      // draw slot

      ctx.fillStyle = `rgba(${slot.color[0]},${slot.color[1]},${slot.color[2]},0.3)`
      if(slot.slot == BMCO) ctx.fillStyle = ctx.fillStyle = `rgba(${slot.color[0]/1.5},${slot.color[1]/1.5},${slot.color[2]/1.5},1)`

      // draw end of pie
      let vec1 = new Vector(Math.cos(slotRadius), Math.sin(slotRadius)).setMagnitude(50).plus(mousePos)
      let vec2 = new Vector(Math.cos(slotRadius+radiusPerOption), Math.sin(slotRadius+radiusPerOption)).setMagnitude(50).plus(mousePos)
      ctx.beginPath()
      ctx.moveTo(mousePos.x, mousePos.y)
      ctx.lineTo(vec1.x, vec1.y)
      ctx.lineTo(vec2.x, vec2.y)
      ctx.fill()

      // draw middle of pie
      ctx.beginPath()
      ctx.arc(mousePos.x, mousePos.y, 50, slotRadius, slotRadius+radiusPerOption)
      ctx.fill()

      // draw text
      let middlePos = new Vector(Math.cos((i+0.5)*radiusPerOption), Math.sin((i+0.5)*radiusPerOption))
      middlePos.setMagnitude(50).plus(mousePos)
      ctx.fillStyle = 'white'
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(slot.name, middlePos.x, middlePos.y)
      // draw price
      let price = calculateBuildingPrice(slot.name) + '⚡'
      middlePos.minus(mousePos).setMagnitude(35).plus(mousePos)
      ctx.fillText(price, middlePos.x, middlePos.y)
    }

  },
  abilitiesMenu() {
    if(!leftDown) return
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.beginPath()
    ctx.arc(mousePos.x, mousePos.y, 50, 0, 2*Math.PI)
    ctx.fill()

    let radiusPerOption = (Math.PI/abilitiesData.length)*2
    let BMCO = abilitiesMenuCurrentOption
    let currentRadius = BMCO*radiusPerOption

    // draw slots
    for(let i=0;i<abilitiesData.length;i++) {
      let slot = abilitiesData.find(s => s.slot == i)
      let slotRadius = i*radiusPerOption
      let vec = new Vector(Math.cos(slotRadius), Math.sin(slotRadius)).setMagnitude(50).plus(mousePos)
      ctx.beginPath()
      ctx.moveTo(mousePos.x, mousePos.y)
      ctx.lineTo(vec.x, vec.y)
      ctx.stroke()

      ctx.fillStyle = `rgba(${slot.color[0]},${slot.color[1]},${slot.color[2]},0.3)`
      if(slot.slot == BMCO) ctx.fillStyle = ctx.fillStyle = `rgba(${slot.color[0]},${slot.color[1]},${slot.color[2]},1)`

      // draw end of pie
      let vec1 = new Vector(Math.cos(slotRadius), Math.sin(slotRadius)).setMagnitude(50).plus(mousePos)
      let vec2 = new Vector(Math.cos(slotRadius+radiusPerOption), Math.sin(slotRadius+radiusPerOption)).setMagnitude(50).plus(mousePos)
      ctx.beginPath()
      ctx.moveTo(mousePos.x, mousePos.y)
      ctx.lineTo(vec1.x, vec1.y)
      ctx.lineTo(vec2.x, vec2.y)
      ctx.fill()

      // draw middle of pie
      ctx.beginPath()
      ctx.arc(mousePos.x, mousePos.y, 50, slotRadius, slotRadius+radiusPerOption)
      ctx.fill()

      // draw text
      let middlePos = new Vector(Math.cos((i+0.5)*radiusPerOption), Math.sin((i+0.5)*radiusPerOption))
      middlePos.setMagnitude(50).plus(mousePos)
      ctx.fillStyle = 'white'
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(slot.name, middlePos.x, middlePos.y)
      // draw price
      let price = slot.price + '⚡'
      middlePos.minus(mousePos).setMagnitude(35).plus(mousePos)
      ctx.fillText(price, middlePos.x, middlePos.y)
      
    }

  }
}