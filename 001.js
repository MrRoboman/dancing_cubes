let song
let fft
let smoothing = 0.8
let bins = 256
let c
let r
c = r = 35
let grid
let size = 20

let sizes = []

let angle

let X, Y, Z

function preload() {
    // song = loadSound('./SunnySide_10second_87bpm.wav')
    // song = loadSound('./StrangeUnusual_10seconds.wav')
    // song = loadSound('./Trippin_12seconds.wav')
    song = loadSound('./battleThemeA.mp3')
}

function setup() {
    noiseSeed(4)
    createCanvas(400, 400, WEBGL)
    background(200)
    noStroke()
    fill(0, 0, 255)
    grid = createGrid(c, r)
    for (let i = 0; i < c * r; i++) {
        sizes.push(random(10, size))
    }
    ortho(-width / 2, width / 2, -height / 2, height / 2, -500, 800)

    fft = new p5.FFT(smoothing, bins)
    // song.play()
    setTimeout(() => song.play(), 1000)
    angle = PI / 4
}

let coords = { 88: 0, 89: 0, 90: 0 }
let cur

// function keyPressed() {
//     if (88 <= keyCode && keyCode <= 90) {
//         cur = keyCode
//     }
//     if (cur) {
//         if (keyCode === UP_ARROW) {
//             coords[cur] += 10
//         } else if (keyCode === DOWN_ARROW) {
//             coords[cur] -= 10
//         }
//         console.log(coords[88], coords[89], coords[90])
//     }
// }

function draw() {
    // directionalLight(-1, -1, -1)
    pointLight(255, 0, 0, 500, 0, 0)
    pointLight(0, 255, 0, 0, -400, 0)
    pointLight(0, 0, 255, 0, 0, 500)

    // let nudge = 245
    // camera(-200 + nudge, -300 + nudge, -200 + nudge, 0, 0, 0, 0, 1, 0)

    let X = cos(angle) * 400
    let Y = -350
    let Z = sin(angle) * 400
    camera(X, Y, Z, 0, 0, 0, 0, 1, 0)

    // angle += 0.01
    // directionalLight(255, 255, 0, -1, 0, 0)

    background(0)

    const spectrum = fft.analyze()

    grid.forEach(({ u, v }, i) => {
        const col = (size / 2) * c
        const row = (size / 2) * r

        const _x = map(u, 0, 1, -col, col)
        const _z = map(v, 0, 1, -row, row)
        let nudge = 2
        let _size = noise(u * nudge, v * nudge)
        _size = Expo.easeInOut(_size)
        // _size = Expo.easeIn(_size)
        _size = _size > 0.2 ? _size : 0
        const bucket = floor(map(_size, 0, 1, 0, spectrum.length))
        const amp = map(spectrum[bucket], 0, 255, 0, 1)
        _size = amp * (size * 4)

        // if (_size < size*.5) {
        //     _size = map(_size, 0,)
        // } else {

        // }
        // if (_size < size / 3) {
        //     _size = 0
        // } else {
        //     _size = map(_size, 0, size, size / 3, size)
        // }

        push()
        translate(_x, -_size / 2, _z)
        ambientMaterial(255, 255, 255)
        X = _size < size ? _size : size
        Y = _size < size ? _size : _size
        Z = _size < size ? _size : size
        box(X, Y, Z)
        pop()
    })

    // rectMode(CENTER)
    // rotateX(angle)
    // rotateY(angle)
    // rect(0, 0, 150, 150)
    // box(100)
}

function createGrid(cols, rows) {
    const grid = []
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let u = map(c, 0, cols - 1, 0, 1)
            let v = map(r, 0, rows - 1, 0, 1)

            grid.push({ u, v })
        }
    }
    return grid
}

function getGridPositions(grid, _width, _height, _margin) {
    const w = _width - _margin * 2
    const h = _height - _margin * 2
    return grid.map(({ u, v }) => ({ x: u * w + _margin, y: v * h + _margin }))
}
