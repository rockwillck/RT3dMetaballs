const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
var dimensions = {x:128, y:128}
canvas.width = dimensions.x
canvas.height = dimensions.y

var sectorDivs = {x:4, y:4}
var sectors = []
for (i=0;i<sectorDivs.x*sectorDivs.y;i++) {
    sectors.push(new Worker("pixelHandler.js"))
}

window.addEventListener(("keydown"), (e) => {
    if (e.key == "ArrowLeft") {
        fields[1].x -= 1
    }
    if (e.key == "ArrowRight") {
        fields[1].x += 1
    }
    if (e.key == "ArrowUp") {
        fields[1].y -= 1
    }
    if (e.key == "ArrowDown") {
        fields[1].y += 1
    }
    if (e.key == "w") {
        fields[1].z += 1
    }
    if (e.key == "s") {
        fields[1].z -= 1
    }
})

var fields = [{x:dimensions.x/2, y:dimensions.y/2, z:20, color:[255, 0, 0]}, {x:dimensions.x/2, y:dimensions.y/2, z:20, color:[0, 255, 0]}]
function animate() {
    requestAnimationFrame(animate)
    sectors.forEach((sector, index) => {
        // fields[1].x += 0.1
        // if (fields[1].x > dimensions.x*1.2) {
        //     fields[1].x = -dimensions.x*0.2
        // }
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
            fields: fields
        })
        sector.onmessage = (e) => {
            ctx.putImageData(e.data, x*dimensions.x/sectorDivs.x, y*dimensions.y/sectorDivs.y)
        }
    })
}
animate()