import { get } from 'svelte/store'
import { totalCitiesCount } from '../../../store'
import { calcFitnessForOffspring, getCanonicalOrder } from '../helpers'

const mapOrder = (order, [...canonical]) => {
  return order.map((value) => {
    const temp = canonical.indexOf(value)
    canonical.splice(temp, 1)
    return temp
  })
}

const unmapOrder = (order, [...canonical]) => {
  return order.map((value) => {
    const temp = canonical[value]
    canonical.splice(value, 1)
    return temp
  })
}

const ordinalOnePointCrossover = (orderA, orderB) => {
  const canonical = getCanonicalOrder()
  //console.log('Canoncial:', canonical)
  //console.log('orderA:', orderA)
  //console.log('orderB:', orderB)

  const ordinalA = mapOrder(orderA, canonical)
  const ordinalB = mapOrder(orderB, canonical)
  //console.log('ordinalA:', ordinalA)
  //console.log('ordinalB:', ordinalB)

  const slicePoint = Math.ceil(get(totalCitiesCount) / 2) - 1
  //console.log('slicePoint:', slicePoint)

  const ordinalOffspringA = ordinalA.slice(0, slicePoint).concat(ordinalB.slice(slicePoint))
  const ordinalOffspringB = ordinalB.slice(0, slicePoint).concat(ordinalA.slice(slicePoint))
  //console.log('ordinalOffspringA:', ordinalOffspringA)
  //console.log('ordinalOffspringB:', ordinalOffspringB)

  const offspringA = unmapOrder(ordinalOffspringA, canonical)
  const offspringB = unmapOrder(ordinalOffspringB, canonical)
  //console.log('offspringA:', offspringA)
  //console.log('offspringB:', offspringB)

  return calcFitnessForOffspring(offspringA) > calcFitnessForOffspring(offspringB) ? offspringA : offspringB
}

export {
  ordinalOnePointCrossover
}