let leftDown = false
let abilitiesMenuCurrentOption = 0

$(() => {

  $(document).on('mousedown', (e) => {
    if(e.button != 0) return
    if(rightDown) return
    leftDown = true
  })

  $(document).on('mouseup', (e) => {
    if(e.button != 0) return
    leftDown = false
  })

  // right click
  $(document).on('mouseup', (e) => {
    if(e.button != 2) return
    if(!leftDown) return
    let slots = abilitiesData.filter(b => b.slot != undefined)
    let slot = slots.find(s => s.slot == abilitiesMenuCurrentOption)
    console.log('Ability: ', slot.name)
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