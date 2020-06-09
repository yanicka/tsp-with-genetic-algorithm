import _ from 'lodash'

const getNeighborsFor = (parent) => {
	let neighborList = {}
	// for (let [index, city] of combination)
	parent.forEach((city, index, combination) => {
		const first = 0
		const previous = index - 1
		const next = index + 1
		const last = combination.length - 1

		if (!neighborList.hasOwnProperty(city)) {
			neighborList[city] = []
		}

		if (index === first) {
			neighborList[city].push(combination[next], combination[last])
		} else if (index === last) {
			neighborList[city].push(combination[previous], combination[first])
		} else {
			neighborList[city].push(combination[previous], combination[next])
		}
	})
	return neighborList
}

const mergeNeighbors = ({...neighborsA}, neighborsB) => {
	for (let [city, _neighbors] of Object.entries(neighborsA)) {
		neighborsA[city] = _.uniq(neighborsA[city].concat(neighborsB[city]))
	}
	return neighborsA
}

const getNeighborList = (parentA, parentB) => {
	return mergeNeighbors(getNeighborsFor(parentA), getNeighborsFor(parentB))
}

const removeFromNeighbors = (neighborList, city) => {
	delete neighborList[city]
	return _.mapValues(neighborList, (combination) => {
		let position = combination.indexOf(city)
		
		if(position !== -1) {
			combination.splice(position, 1)
		}

		return combination
	})
}

const getLeastConnection = (neighborList) => {
	let least, leastCount = Infinity
	for(let [city, neighbors] of Object.entries(neighborList)) {
		if(neighbors.length < leastCount) {
			least = city
			leastCount = neighbors.length
		} else if (neighbors.length === leastCount) {
			least = [least, city][Math.round(Math.random())]
			leastCount = neighbors.length
		}
	}

	return parseInt(least)
}

const edgeRecombinationCrossover = (parentA, parentB) => {
	//console.log('orderA:', parentA)
	//console.log('orderB:', parentB)
	let neighborList = getNeighborList(parentA, parentB)

	let leastConnection = [parentA[0], parentB[0]][Math.round(Math.random())]
	let offspring = []

	//console.log('neighborList:',JSON.stringify(neighborList))
	
	do {
		//console.log('leastConnection', leastConnection)
		offspring.push(leastConnection)
		neighborList = removeFromNeighbors(neighborList, leastConnection)
		leastConnection = getLeastConnection(neighborList)
		//console.log('neighborList:',JSON.stringify(neighborList))
	} while (Object.keys(neighborList).length !== 0)
	//console.log('offspring', offspring)

	return offspring
}


export {
	edgeRecombinationCrossover
}
