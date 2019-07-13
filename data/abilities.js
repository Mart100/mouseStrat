const abilities = [
  {
    name: 'destroy',
    color: [255, 50, 50],
    slot: 0,
    price: 100,
    effect: {
      color: [255, 0, 0],
      duration: 1000,
      type: 'expand',
      follow: false,
      to: [true, true],
      range: 30
    }
  },
  {
    name: 'sight',
    color: [150, 150, 255],
    slot: 1,
    price: 100,
    effect: {
      color: [150, 150, 255],
      duration: 2000,
      type: 'circle',
      follow: true,
      to: [true, true],
      range: 100
    }
  },
  {
    name: 'trail',
    color: [255, 150, 150],
    slot: 2,
    price: 100
  },
  {
    name: 'invisible',
    color: [200, 200, 200],
    price: 50,
    slot: 3,
    effect: {
      color: [255, 255, 255],
      duration: 10000,
      type: 'circle',
      follow: true,
      to: [true, false],
      range: 50
    }
  },
  {
    name: 'cancel',
    slot: 4,
    color: [0,0,0],
    price: 0
  }
]

module.exports = abilities