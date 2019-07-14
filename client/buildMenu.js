let rightDown = false
let buildMenuCurrentOption = 0
let slotsAmount = 0
let buildMenuMousePos = new Vector(0, 0)
let buildMenuPos = new Vector(0, 0)

function setupBuildMenu() {
  $(document).on('mousedown', (e) => {
    if(e.button != 2) return
    if(leftDown) return
    rightDown = true
    buildMenuPos = new Vector(mousePos)
    buildMenuMousePos = new Vector(buildMenuMousePos).setMagnitude(1)
  })

  $(document).on('mouseup', (e) => {
    if(e.button != 2) return
    rightDown = false
    if(buildMenuCurrentOption == 999) return
    let slots = buildingsData.filter(b => b.slot != undefined)
    let slot = slots.find(s => s.slot == buildMenuCurrentOption)
    socket.emit('build', slot.name)
  })

  document.addEventListener('mousemove', (e) => {
    if(!rightDown) return
    let vec = buildMenuPos.clone().minus(new Vector(mousePos))
    if(vec.getMagnitude() > 200) return buildMenuCurrentOption = 999
    let angle = vec.clone().rotate(Math.PI).getAngle()/2
    angle = normalizeRadians(angle)
    let radiusPerOption = (Math.PI/slotsAmount)
    let fits = Math.floor(angle/radiusPerOption)
    buildMenuCurrentOption = fits
  })

  // normal click
  $(document).on('mouseup', (e) => {
    if(e.button != 0) return
    if(!rightDown) return
  })

  // Scroll
  $('canvas').on('DOMMouseScroll mousewheel',  (e) => {
    if(!rightDown) return
    if(e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) {
      buildMenuCurrentOption++
      if(buildMenuCurrentOption >= slotsAmount) buildMenuCurrentOption = 0
    } else {
      buildMenuCurrentOption--
      if(buildMenuCurrentOption < 0) buildMenuCurrentOption = slotsAmount-1
    }
  })
}