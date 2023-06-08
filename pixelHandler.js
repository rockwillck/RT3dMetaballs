var pov = Math.PI*0.3
function parsePixel(sx, sy, sw, sh, dimensions, fields, camera, precalcAngles) {
    let canvasData = new Uint8ClampedArray(sw*sh*4)
    for (let x=sx;x<sx+sw;x++) {
        for (let y=sy;y<sy+sh;y++) {
            // lens is flat
            currentYRotation = precalcAngles[`${x}/${y}`]
            travelDistance = {
                x:Math.cos(camera.yRotation - currentYRotation),
                y:(y-dimensions.y/2)/camera.focalLength,
                z:Math.sin(camera.yRotation - currentYRotation)
            }
            span = Math.sqrt((x-dimensions.x/2)**2 + (y-dimensions.y/2)**2 + camera.focalLength**2)
            currentPosition = {
                x: camera.x + travelDistance.x*span,
                y: camera.y + y - dimensions.y/2,
                z: camera.z + travelDistance.z*span,
            }

            charge = 0
            for (i=0;i<50;i++) {
                for (field of fields) {
                    let power = 2
                    let multiplier = 12
                    switch(field.type) {
                        case "sphere":
                            power = 2
                            multiplier = 12
                            break;
                        case "rect":
                            power = 8
                            multiplier = 1200000000
                            break
                    }
                    charge += multiplier/((
                        (currentPosition.x - field.x)**power + (currentPosition.y - field.y)**power + (currentPosition.z - field.z)**power
                    ))
                    if (charge > 1) {
                        charge = 1
                        break
                    }
                }

                currentPosition.x += travelDistance.x
                currentPosition.y += travelDistance.y
                currentPosition.z += travelDistance.z
                if (charge > 0.99) {
                    charge = ((50-i)/50)
                    // charge = 1
                    break
                }
                if (i == 49) {
                    charge = 0
                }
            }
            
            let pixelColor = [charge*100, charge*100, charge*255]
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
    postMessage(parsePixel(e.data.position.x, e.data.position.y, e.data.subDimensions.x, e.data.subDimensions.y, e.data.dimensions, e.data.fields, e.data.camera, e.data.precalc))
}