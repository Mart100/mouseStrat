// global variables
let energy = 0
let buildingsData = []
let abilitiesData = []
let buildings = []


$(() => {
  let loc = window.location.pathname
  let dir = loc.substring(0, loc.lastIndexOf('/'))

  if(dir != '') {
    $('body').html(`
      <canvas id="canvas"></canvas>
      <div id="HUD">
        <div id="msg"></div>
        <div id="energy">Energy: 0</div>
      </div>
    `)

    socket.emit('findGame', '')
  }
  
  // show homepage
  else {
    $('body').html(`
    <div id="title">MouseStrat</div>
    <div id="play">Click to play</div>
    `)
    $('#play').on('click', () => {
      window.location = './find'
    })
  }
})