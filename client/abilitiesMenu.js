let leftDown = false
let abilitiesMenuCurrentOption = 0

$(() => {

  $(document).on('mousedown', (e) => {
    if(e.button != 0) return
    if(rightDown) return
    leftDown = true
    abilitiesMenuCurrentOption = 4
  })

  $(document).on('mouseup', (e) => {
    if(e.button != 0) return
    leftDown = false
    let slots = abilitiesData.filter(b => b.slot != undefined)
    let slot = slots.find(s => s.slot == abilitiesMenuCurrentOption)
    socket.emit('ability', slot.name)
  })

  // Scroll
  $('canvas').on('DOMMouseScroll mousewheel',  (e) => {
    if(!leftDown) return
    if(e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) {
      abilitiesMenuCurrentOption++
      if(abilitiesMenuCurrentOption >= abilitiesData.length) abilitiesMenuCurrentOption = 0
    } else {
      abilitiesMenuCurrentOption--
      if(abilitiesMenuCurrentOption < 0) abilitiesMenuCurrentOption = abilitiesData.length-1
    }
  })
})