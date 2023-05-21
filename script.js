const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
var dimensions = {x:128, y:128}
canvas.width = dimensions.x
canvas.height = dimensions.y

var sectorDivs = {x:2, y:5}
var sectors = []
function setup(x, y) {
    sectorDivs = {x:x, y:y}
    for (i=0;i<sectorDivs.x*sectorDivs.y;i++) {
        sectors.push(new Worker("pixelHandler.js"))
    }
    animate()
}

const orbitRadius = 125
window.addEventListener(("keydown"), (e) => {
    switch (e.key) {
        case "ArrowLeft":
            camera.x -= 1
            break
        case "ArrowRight":
            camera.x += 1
            break
        case "ArrowUp":
            camera.z += 1
            break
        case "ArrowDown":
            camera.z -= 1
            break
        case "a":
            camera.yRotation += 0.02
            break
        case "d":
            camera.yRotation -= 0.02
            break
        case " ":
            angle += 0.1
            camera.x = Math.cos(angle)*orbitRadius
            camera.z = Math.sin(angle)*orbitRadius
            camera.yRotation = angle + Math.PI
            break
        default:
            break
    }
})

var touchRotating = false
window.addEventListener(("touchstart"), (e) => {
    touchRotating = true
})
window.addEventListener(("touchend"), (e) => {
    touchRotating = false
})

var fields = [{x:-20, y:-20, z:0, color:[255, 0, 0]}, {x:20, y:20, z:0, color:[0, 255, 0]}]
var angle = -Math.PI/2
var camera = {
    focalLength:100,
    x:0,
    y:0,
    z:-orbitRadius,
    yRotation:angle + Math.PI,
}
var frame = 0
function animate() {
    requestAnimationFrame(animate)
    fields[1].z = Math.cos(frame*0.05)*3
    if (touchRotating) {
        angle += 0.1
        camera.x = Math.cos(angle)*orbitRadius
        camera.z = Math.sin(angle)*orbitRadius
        camera.yRotation = angle + Math.PI
    }
    sectors.forEach((sector, index) => {
        let y = Math.floor(index/sectorDivs.x)
        let x = index - y*sectorDivs.x

        let startXPosition = Math.floor(x*dimensions.x/sectorDivs.x)
        let startYPosition = Math.floor(y*dimensions.y/sectorDivs.y)

        sector.postMessage({
            position: {
                x:startXPosition, 
                y:startYPosition,
            }, 

            subDimensions: {
                x: x == sectorDivs.x - 1 ? 
                dimensions.x - startXPosition 
                : 
                Math.floor((x+1)*dimensions.x/sectorDivs.x) - startXPosition, 

                y: y == sectorDivs.y - 1 ? 
                dimensions.y - startYPosition 
                :
                Math.floor((y+1)*dimensions.y/sectorDivs.y) - startYPosition,

            }, dimensions: dimensions,

            fields: fields,

            camera: camera,
        })
        sector.onmessage = (e) => {
            ctx.putImageData(e.data, startXPosition, startYPosition)
        }
    })
    frame++
}