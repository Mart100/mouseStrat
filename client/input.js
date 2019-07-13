let mousePos = {x: 0, y: 0}

$(() => {
  $(document).on('mousemove', (event) => {
    mousePos = {x: event.clientX, y: event.clientY}
    socket.emit('mouse', mousePos)
  })
  $(document).on('click', (event) => {
    socket.emit('mouseclick')
  })
})