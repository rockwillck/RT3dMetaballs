var focalLength = 15
function parsePixel(sx, sy, sw, sh, dimensions, fields) {
    let canvasData = new Uint8ClampedArray(sw*sh*4)
    for (let x=sx;x<sx+sw;x++) {
        for (let y=sy;y<sy+sh;y++) {
            normalizingFactor = Math.sqrt((dimensions.x/2 - x)**2 + (dimensions.y/2 - y)**2 + focalLength**2)
            travelDistance = {x:-(dimensions.x/2 - x)/normalizingFactor, y:-(dimensions.y/2 - y)/normalizingFactor, z:focalLength/normalizingFactor}
            currentPosition = {x:x, y:y, z:0}
            charge = 0
            for (i=0;i<50;i++) {
                for (field of fields) {
                    charge += 10/((
                        (currentPosition.x - field.x)**2 + (currentPosition.y - field.y)**2 + (currentPosition.z - field.z)**2
                    ))
                    if (charge > 1) {
                        charge = 1
                        break
                    }
                }

                currentPosition.x += travelDistance.x
                currentPosition.y += travelDistance.y
                currentPosition.z += travelDistance.z
                if (charge*255 > 150) {
                    charge = 255*((50-i)/50)
                    break;
                }
                if (i == 50) {
                    charge = 0
                }
            }
            // charge = Math.floor(charge/20)*20
            
            let pixelColor = [charge, charge, charge]
            canvasData[((y-sy)*sw + (x-sx))*4] = pixelColor[0]
            canvasData[((y-sy)*sw + (x-sx))*4 + 1] = pixelColor[1]
            canvasData[((y-sy)*sw + (x-sx))*4 + 2] = pixelColor[2]
            canvasData[((y-sy)*sw + (x-sx))*4 + 3] = 255
        }
    }
    canvas = new ImageData(canvasData, sw)
    return canvas
}

onmessage = (e) => {
    postMessage(parsePixel(e.data.position.x, e.data.position.y, e.data.subDimensions.x, e.data.subDimensions.y, e.data.dimensions, e.data.fields))
}