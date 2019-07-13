let rightDown = false
let buildMenuCurrentOption = 0
let slotsAmount = 0

$(() => {
  $(document).on('mousedown', (e) => {
    if(e.button != 2) return
    if(leftDown) return
    rightDown = true
  })

  $(document).on('mouseup', (e) => {
    if(e.button != 2) return
    rightDown = false
  })

  // normal click
  $(document).on('mouseup', (e) => {
    if(e.button != 0) return
    if(!rightDown) return
    let slots = buildingsData.filter(b => b.slot != undefined)
    let slot = slots.find(s => s.slot == buildMenuCurrentOption)
    socket.emit('build', slot.name)
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
})