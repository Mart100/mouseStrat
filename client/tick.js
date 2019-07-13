$(() => {
  setInterval(() => {
    tick()
  }, 10)
})

function tick() {
  // time ability effects
  for(let effect of abilityEffects) {
    effect.tickCount += 10
    if(effect.tickCount > effect.duration) {
      let idx = abilityEffects.indexOf(effect)
      abilityEffects.splice(idx, 1)
    }
  }
}