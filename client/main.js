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
    <br><br>
    <center>
    <a href="https://martvenck.com">Made by: Marto_0</a>
    <br><br>
    <a href="https://discord.gg/3S5SyXP">Join us on discord:<br> <img src="https://i.imgur.com/yoSi7FR.png"/></a>
    <br><br>
    <a href="https://iogames.space/">More IO Games</a>
    </center>
    `)
    $('#play').on('click', () => {
      window.location = './find'
    })
  }
})