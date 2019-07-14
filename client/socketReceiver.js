let msgFadingTimeout
socket.on('msg', (data) => {
  if(data.includes('left to place your core') && buildings.find(b => b.type == 'core') != undefined) return
  $('#msg').html(data)
  $('#msg').fadeIn(500)
  if(msgFadingTimeout != undefined) clearInterval(msgFadingTimeout)
  if(data == 'Waiting for opponent...') return
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
  startDrawing()
  configureInputs()
  setupBuildMenu()
  setupAbilitiesMenu()
  setInterval(() => { tick() }, 10)
})

let abilityEffects = []
socket.on('abilityUsed', data => {
  let abilityEffectData = abilitiesData.find(a => a.name == data.type).effect
  let effect = {
    by: data.by,
    ability: data.type,
    tickCount: 0,
    color: abilityEffectData.color,
    duration: abilityEffectData.duration,
    type: abilityEffectData.type,
    range: abilityEffectData.range,
    follow: abilityEffectData.follow,
    position: data.pos
  }

  abilityEffects.push(effect)
})

let trail = []
socket.on('trail', data => {
  trail = data
  setTimeout(() => {trail = []}, 5000)
})