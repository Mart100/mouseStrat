const buildings = [
  {
    name: 'Power Tower',
    color: [255, 255, 0],
    size: {x: 20, y: 20},
    slot: 0,
    price: '50*a'
  },
  {
    name: 'Radio',
    color: [55, 255, 5],
    size: {x: 20, y: 20},
    slot: 1,
    price: '250',
    range: 250
  },
  {
    name: 'Core',
    color: [255, 255, 255],
    size: {x: 30, y: 30},
    price: '1000',
    range: 150
  },
  {
    name: 'Fake Core',
    color: [255, 255, 255],
    size: {x: 30, y: 30},
    price: '5000'
  },
  {
    name: 'Electricity Box',
    color: [200, 200, 50],
    size: {x: 15, y: 15},
    price: '100',
    range: 100,
    slot: 2
  }
]

module.exports = buildings