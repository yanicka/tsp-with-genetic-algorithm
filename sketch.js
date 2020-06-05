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

var popSize = 1000;
let populations = [
    /*{
        crossoverType: 'original',
        color: '#8C1C13',
        fitness: [],
        bestEver: undefined,
        currentBest: 0,
        recordDistance: Infinity,
        distanceHistory: [],
        currentRecord: undefined,
        individuals: [],
    },*/
    {
        crossoverType: 'ordinalOnePoint',
        color: '#E2EF70',
        fitness: [],
        bestEver: undefined,
        currentBest: 0,
        recordDistance: Infinity,
        distanceHistory: [],
        currentRecord: undefined,
        individuals: []
    },
    {
        crossoverType: 'orderedCrossover',
        color: '#008080',
        fitness: [],
        bestEver: undefined,
        currentBest: 0,
        recordDistance: Infinity,
        distanceHistory: [],
        currentRecord: undefined,
        individuals: []
    },
]

var statusP;

let ctx, chart

const getGraphData = () => {
    return {
        labels: [],
        datasets: populations.map((population) => {
            return {
                label: population.crossoverType,
                borderColor: population.color,
                data: population.distanceHistory
            }
        })
    }
}

let run = 0;
const updateChart = () => {
    chart.data.labels.push(run)
    run++;
    chart.update()
}

var callback = function(){
    ctx = document.getElementById('myChart')
    chart = new Chart(ctx, {
        type: 'line',
        data:  getGraphData()
    })
};

if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    callback();
} else {
    document.addEventListener("DOMContentLoaded", callback);
}

console.log(ctx)

function setup() {
    let canvas = createCanvas(800, 800);
    canvas.parent('sketch-holder')
    frameRate(0.3)
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

    for(let [_index, population] of Object.entries(populations)) {
        console.log(population)
        // GA
        calculateFitness(population);
        normalizeFitness(population);

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


        nextGeneration(population);
    }

    updateChart()
}

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