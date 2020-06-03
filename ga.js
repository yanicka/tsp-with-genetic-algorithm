// Daniel Shiffman
// The Coding Train
// Traveling Salesperson with Genetic Algorithm

// https://thecodingtrain.com/CodingChallenges/035.4-tsp.html
// https://youtu.be/M3KTWnTrU_c
// https://thecodingtrain.com/CodingChallenges/035.5-tsp.html
// https://youtu.be/hnxn6DtLYcY

// https://editor.p5js.org/codingtrain/sketches/EGjTrkkf9

function calculateFitness(population) {
    var currentRecord = Infinity;
    for (var i = 0; i < population.individuals.length; i++) {
        var d = calcDistance(cities, population.individuals[i]);

        /*textSize(64);
        var s = '';
        for(var i = 0; i < cities; i++){
            s += population[i];
        }
        textSize(64);
        fill (255);
        text(d, 20, height / 2);*/


        if (d < population.recordDistance) {
            population.recordDistance = d;
            population.bestEver = population.individuals[i];
        }
        if (d < population.currentRecord) {
            population.currentRecord = d;
            population.currentBest = population.individuals[i];
        }

        // This fitness function has been edited from the original video
        // to improve performance, as discussed in The Nature of Code 9.6 video,
        // available here: https://www.youtube.com/watch?v=HzaLIO9dLbA
        population.fitness[i] = 1 / (pow(d, 8) + 1);
    }
}

function normalizeFitness(population) {
    var sum = 0;
    for (var i = 0; i < population.fitness.length; i++) {
        sum += population.fitness[i];
    }
    for (var i = 0; i < population.fitness.length; i++) {
        population.fitness[i] = population.fitness[i] / sum;
    }
}

function nextGeneration(population) {
    var newPopulation = [];
    console.log(population)
    for (var i = 0; i < population.individuals.length; i++) {
        var orderA = pickOne(population.individuals, population.fitness);
        var orderB = pickOne(population.individuals, population.fitness);
        var order = crossOver(population.crossoverType, orderA, orderB);
        mutate(order, 0.01);
        newPopulation[i] = order;
    }
    population.individuals = newPopulation;
}

function pickOne(list, prob) {
    var index = 0;
    var r = random(1);

    while (r > 0) {
        r = r - prob[index];
        index++;
    }
    index--;
    return list[index].slice();
}

function getCanonical() {
    /*
    Array(totalCities) // => [undefined,undefined,undefined,undefined] => 0: undefined, ...
    Array(totalCities).keys() // => [0, 1, 2, 3]
    [Array(totalCities).keys()] //  => [[0, 1, 2, 3]]
    [...Array(totalCities).keys()] //  => [0, 1, 2, 3]
    */
    return [...Array(totalCities).keys()];
}

function crossOver(type, orderA, orderB) {
    //console.log(type, orderA, orderB)
    if (type === "original") {
        console.log('original')
        return originalCrossover(orderA, orderB)
    } else if (type === "ordinalOnePoint") {
        console.log('ordinalOnePoint')
        return ordinalOnePointCrossover(orderA, orderB)
    } else {
        console.log('Unknown crossover selected')
    }
}

function ordinalOnePointCrossover(orderA, orderB) {
    const canonical = getCanonical()
    //console.log('Canoncial:', canonical)
    //console.log('orderA:', orderA)
    //console.log('orderB:', orderB)

    const mapOrder = (order, [...canonical]) => {
        return order.map((value, position) => {
            const temp = canonical.indexOf(value)
            canonical.splice(temp, 1)
            return temp
        })
    }

    const unmapOrder = (order, [...canonical]) => {
        return order.map((value, position) => {
            const temp = canonical[value]
            canonical.splice(value, 1)
            return temp
        })
    }

    const ordinalA = mapOrder(orderA, canonical)
    const ordinalB = mapOrder(orderB, canonical)
    //console.log('ordinalA:', ordinalA)
    //console.log('ordinalB:', ordinalB)

    const slicePoint = ceil(totalCities / 2) - 1
    //console.log('slicePoint:', slicePoint)

    const ordinalOffspringA = ordinalA.slice(0,slicePoint).concat(ordinalB.slice(slicePoint))
    const ordinalOffspringB = ordinalB.slice(0,slicePoint).concat(ordinalA.slice(slicePoint))
    //console.log('ordinalOffspringA:', ordinalOffspringA)
    //console.log('ordinalOffspringB:', ordinalOffspringB)

    const offspringA = unmapOrder(ordinalOffspringA, canonical)
    const offspringB = unmapOrder(ordinalOffspringB, canonical)
    //console.log('offspringA:', offspringA)
    //console.log('offspringB:', offspringB)


    return offspringA
}

function originalCrossover(orderA, orderB) {
    var start = floor(random(orderA.length));
    var end = floor(random(start + 1, orderA.length));
    var neworder = orderA.slice(start, end);
    // var left = totalCities - neworder.length;
    for (var i = 0; i < orderB.length; i++) {
        var city = orderB[i];
        if (!neworder.includes(city)) {
            neworder.push(city);
        }
    }
    return neworder;
}

function mutate(order, mutationRate) {
    for (var i = 0; i < totalCities; i++) {
        if (random(1) < mutationRate) {
            var indexA = floor(random(order.length));
            var indexB = (indexA + 1) % totalCities;
            swap(order, indexA, indexB);
        }
    }
}