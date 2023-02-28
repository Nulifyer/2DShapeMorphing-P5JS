let cirPath = [];
let otherPath = [];

Array.prototype.sample = function (n) {
    const indexes = this.map((_, i) => i);
    return new Array(n)
        .fill(x => undefined)
        .map(() => this[(indexes.splice(Math.random() * indexes.length, 1)[0])]);
}

function randInts(min, max, len) {
    return new Array(max - min)
        .fill(undefined)
        .map((_, i) => i + min)
        .sample(len);
}

function polarToCartesian(r, a) {
    return createVector(r * cos(a), r * sin(a));
}

function GetShapePath(radius, num_segments, degreeStep) {
    const path = [];

    // handle circle
    if (num_segments < 2) {
        for (let a = 0; a < 360; a += degreeStep) {
            const v = polarToCartesian(radius, a);
            path.push(v);
        }
        return path;
    }
    
    const seg_step = 360 / num_segments;

    let segA = 0, 
        segB = seg_step;

    let segAv = polarToCartesian(radius, segA),
        segBv = polarToCartesian(radius, segB);

    for (let a = 0; a < 360; a += degreeStep) {
        const amt = (a % seg_step) / (segB - segA);
        const v = p5.Vector.lerp(segAv, segBv, amt);
        path.push(v);

        if ((a + step) % seg_step === 0) {
            segA += seg_step;
            segB += seg_step;
            segAv = polarToCartesian(radius, segA);
            segBv = polarToCartesian(radius, segB);
        }
    }

    return path;
}

function drawVecList(vectors, drawLines = true, drawDots = false) {
    if (drawLines) {
        beginShape();
        for(const v of vectors) {
            vertex(v.x, v.y);
        }        
        endShape(CLOSE);
    }
    if (drawDots) {
        for(const v of vectors) {
            fill(0);
            ellipse(v.x, v.y, 2, 2);
            noFill();
        }
    }
}

// =============================================

const r = 300, step = 1;

let shapes;
let colors;
function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    colorMode(HSB, 255);
    
    shapes = [0, 3, 4, 5, 6]
        .map(x => GetShapePath(r, x, step));

    colors = randInts(0, 255, shapes.length)
        .map(x => [x, 125, 125]);
}

let frameStep = 0;
function draw() {
    background(220);
    translate(width/2, height/2);
    rotate(90)
    stroke(0);
    noFill();
    
    stroke(200);
    shapes.forEach(s => drawVecList(s));
    
    drawPairs = shapes
        .map((_, i) => [i, i + 1])
        .splice(0, shapes.length - 1)

    frameStep += 1;
    const amt = (sin(frameStep) + 1) / 2;

    const morphs = drawPairs
        .map((pair) => {
            let [a, b] = pair;
            a = shapes[a];
            b = shapes[b];
            return a.map((_, i) => {
                return createVector(
                    lerp(a[i].x, b[i].x, amt),
                    lerp(a[i].y, b[i].y, amt)
                );
            });
        });
    
    stroke(0);
    morphs.forEach((m, i) => {
        [h, s, b] = colors[i];
        stroke(h, s, b);
        drawVecList(m);
    });
}