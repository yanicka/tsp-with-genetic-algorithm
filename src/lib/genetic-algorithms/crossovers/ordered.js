
import { calcFitnessForOffspring, generateBitMask } from '../helpers'

const deriveOrderedChild = (parentA, [...parentB], mask) => {
  const maskedA = parentA.map((value, position) => {
    if (mask[position] === 1) {
      parentB.splice(parentB.indexOf(value), 1)
      return value
    }
  })

  return maskedA.map((value, position) => {
    if (value === undefined) {
      return parentB.shift()
    }

    return value
  })
}

const orderedCrossover = (orderA, orderB) => {
  // console.log('orderA:', orderA)
  // console.log('orderB:', orderB)
  const mask = generateBitMask()
  // console.log('Mask:', mask)

  const offspringA = deriveOrderedChild(orderA, orderB, mask)
  const offspringB = deriveOrderedChild(orderB, orderA, mask)

  // console.log('offspringA:', offspringA)
  // console.log('offspringB:', offspringB)

  return calcFitnessForOffspring(offspringA) > calcFitnessForOffspring(offspringB) ? offspringA : offspringB
}

export {
  orderedCrossover
}