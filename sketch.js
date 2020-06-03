// Daniel Shiffman
// The Coding Train
// Traveling Salesperson with Genetic Algorithm

// https://thecodingtrain.com/CodingChallenges/035.4-tsp.html
// https://youtu.be/M3KTWnTrU_c
// https://thecodingtrain.com/CodingChallenges/035.5-tsp.html
// https://youtu.be/hnxn6DtLYcY

// https://editor.p5js.org/codingtrain/sketches/EGjTrkkf9

var cities = [];
var totalCities = 7;

var popSize = 10;
let populations = [
    {
        crossoverType: 'original',
        color: '#8C1C13',
        fitness: [],
        bestEver: undefined,
        currentBest: 0,
        recordDistance: Infinity,
        currentRecord: undefined,
        individuals: [],
    },
    {
        crossoverType: 'ordinalOnePoint',
        color: '#E2EF70',
        fitness: [],
        bestEver: undefined,
        currentBest: 0,
        recordDistance: Infinity,
        currentRecord: undefined,
        individuals: []
    },
]

var statusP;

function setup() {
    createCanvas(800, 800);
    frameRate(2)
    var order = [];
    for (var i = 0; i < totalCities; i++) {
        var v = createVector(random(width), random(height / 2));
        cities[i] = v;
        order[i] = i;
    }

    let population = [];
    for (var i = 0; i < popSize; i++) {
        population[i] = shuffle(order);
    }

    for (var i = 0; i < populations.length; i++) {
        populations[i].individuals = population
    }

    statusP = createP('').style('font-size', '32pt');
}

function draw() {
    background(0);

    populations.forEach((population) => {
        // GA
        calculateFitness(population);
        normalizeFitness(population);
        nextGeneration(population);

        stroke(population.color);
        strokeWeight(4);
        noFill();
        beginShape();
        for (var i = 0; i < population.bestEver.length; i++) {
            var n = population.bestEver[i];
            vertex(cities[n].x, cities[n].y);
            ellipse(cities[n].x, cities[n].y, 16, 16);
        }
        endShape();

        translate(0, height / 2);
        stroke(population.color);
        strokeWeight(4);
        noFill();
        beginShape();
        //console.log(population)
        for (var i = 0; i < population.currentBest.length; i++) {
            var n = population.currentBest[i];
            vertex(cities[n].x, cities[n].y);
            ellipse(cities[n].x, cities[n].y, 16, 16);
        }
        endShape();
    })
}

// function shuffle(a, num) {
//   for (var i = 0; i < num; i++) {
//     var indexA = floor(random(a.length));
//     var indexB = floor(random(a.length));
//     swap(a, indexA, indexB);
//   }
// }

function swap(a, i, j) {
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
}

function calcDistance(points, order) {
    var sum = 0;
    for (var i = 0; i < order.length - 1; i++) {
        var cityAIndex = order[i];
        var cityA = points[cityAIndex];
        var cityBIndex = order[i + 1];
        var cityB = points[cityBIndex];
        var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
        sum += d;
    }
    return sum;
}