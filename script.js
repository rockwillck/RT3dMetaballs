const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
var dimensions = {x:128, y:128}
var span = Math.sqrt(dimensions.x**2 + dimensions.y**2)/2
canvas.width = dimensions.x
canvas.height = dimensions.y

var sectorDivs = {x:4, y:4}
var sectors = []
for (i=0;i<sectorDivs.x*sectorDivs.y;i++) {
    sectors.push(new Worker("pixelHandler.js"))
}

window.addEventListener(("keydown"), (e) => {
    if (e.key == "ArrowLeft") {
        camera.x -= 1
    }
    if (e.key == "ArrowRight") {
        camera.x += 1
    }
    if (e.key == "ArrowUp") {
        camera.z += 1
    }
    if (e.key == "ArrowDown") {
        camera.z -= 1
    }
    if (e.key == "a") {
        camera.yRotation += 0.01
    }
    if (e.key == "d") {
        camera.yRotation -= 0.01
    }
})

var fields = [{x:-6, y:-6, z:0, color:[255, 0, 0]}, {x:6, y:6, z:0, color:[0, 255, 0]}]
var camera = {
    focalLength: 1,
    x:0,
    y:0,
    z:-40,
    yRotation:Math.PI/2,
}
var frame = 0
function animate() {
    requestAnimationFrame(animate)
    // camera = {
    //     focalLength: 1,
    //     x:Math.cos(frame*Math.PI*0.005 + Math.PI)*40,
    //     y:0,
    //     z:Math.sin(frame*Math.PI*0.005 + Math.PI)*40,
    //     yRotation:frame*Math.PI*0.005,
    // }
    sectors.forEach((sector, index) => {
        let y = Math.floor(index/sectorDivs.x)
        let x = index - y*sectorDivs.x
        sector.postMessage({
            position: {
                x:x*dimensions.x/sectorDivs.x, 
                y: y*dimensions.y/sectorDivs.y
            }, 
            subDimensions: {
                x:dimensions.x/sectorDivs.x, 
                y:dimensions.y/sectorDivs.y
            }, dimensions: dimensions,
            fields: fields,
            camera: camera,
            span: span,
        })
        sector.onmessage = (e) => {
            ctx.putImageData(e.data, x*dimensions.x/sectorDivs.x, y*dimensions.y/sectorDivs.y)
        }
    })
    frame++
}
animate()