let mousePos = {x: window.innerWidth/2, y: window.innerHeight/2}
let mouseLocked = false

function configureInputs() {

  // set pointerLock things
  let canvas = $('canvas')[0]
  canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock
  canvas.exitPointerLock = canvas.exitPointerLock || canvas.mozExitPointerLock

  // pointerlock change events
  if("onpointerlockchange" in document) document.addEventListener('pointerlockchange', lockChange, false)
  else if("onmozpointerlockchange" in document) document.addEventListener('mozpointerlockchange', lockChange, false)

  // disable right click
  document.addEventListener('contextmenu', event => event.preventDefault())

  // mouse movement
  document.addEventListener('mousemove', (event) => {
    if(rightDown) return
    if(leftDown) return
    mousePos.x += event.movementX
    mousePos.y += event.movementY

    if(mousePos.x > window.innerWidth) mousePos.x = window.innerWidth
    if(mousePos.x < 0) mousePos.x = 0
    if(mousePos.y > window.innerHeight) mousePos.y = window.innerHeight
    if(mousePos.y < 0) mousePos.y = 0
    socket.emit('mouse', mousePos)
  })
  
  // click
  $(document).on('click', (event) => {
    if(!mouseLocked) {
      mousePos = {x: event.clientX, y: event.clientY}
      canvas.requestPointerLock()
    } 
    else socket.emit('mouseclick')
  })
}

function lockChange() {
  if(document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) mouseLocked = true
  else mouseLocked = false
}