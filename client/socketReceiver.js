let msgFadingTimeout
socket.on('msg', (data) => {
  if(data.includes('left to place your core') && buildings.find(b => b.type == 'core') != undefined) return
  $('#msg').html(data)
  $('#msg').fadeIn(500)
  if(msgFadingTimeout != undefined) clearInterval(msgFadingTimeout)
  msgFadingTimeout = setTimeout(() => {
    $('#msg').html('')
    $('#msg').fadeOut(0)
  }, 2000)
})

let opponentMousePos
socket.on('opponentMousePos', (data) => {
  opponentMousePos = data
})

socket.on('buildingsData', (data) => {
  buildingsData = []
  for(let building of data) buildingsData.push(building)
  slotsAmount = buildingsData.filter(b => b.slot != undefined).length
})

socket.on('abilitiesData', (data) => {
  abilitiesData = []
  for(let ability of data) abilitiesData.push(ability)
})

socket.on('energy', (data) => {
  energy = Math.round(data)
  $('#energy').html('Energy: '+energy)
})

socket.on('buildings', (data) => {
  buildings = data
})

socket.on('joined', (data) => {
  console.log('yes')
  buildings = []
  history.replaceState(data.id, '', `/${data.id}/`)    
})