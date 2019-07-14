let mousePos = {x: window.innerWidth/2, y: window.innerHeight/2}
let mouseLocked = false

function configureInputs() {

  // set pointerLock things
  let canvas = $('canvas')[0]

  // disable right click
  document.addEventListener('contextmenu', event => event.preventDefault())

  // mouse movement
  document.addEventListener('mousemove', (event) => {
    mousePos = {x: event.clientX, y: event.clientY}
    socket.emit('mouse', mousePos)
  })
  
  // click
  $(document).on('click', (event) => {
    socket.emit('mouseclick')
  })
}