var pov = Math.PI*0.1
function parsePixel(sx, sy, sw, sh, dimensions, fields, camera, span) {
    let canvasData = new Uint8ClampedArray(sw*sh*4)
    for (let x=sx;x<sx+sw;x++) {
        for (let y=sy;y<sy+sh;y++) {
            travelDistance = {
                x:Math.cos(camera.yRotation - (x - dimensions.x/2)/(dimensions.x/2)*pov), 
                
                y:Math.sin((y - dimensions.y/2)/(dimensions.y/2)*pov), 
                
                z:1,
            }

            currentPosition = {
                x:camera.x + travelDistance.x*span, 

                y:camera.y + travelDistance.y*span, 

                z:camera.z + Math.sin(camera.yRotation)*(camera.focalLength)
            }

            charge = 0
            for (i=0;i<50;i++) {
                for (field of fields) {
                    charge += 2/((
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
                if (charge > 0.95) {
                    charge = ((50-i)/10)
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
    postMessage(parsePixel(e.data.position.x, e.data.position.y, e.data.subDimensions.x, e.data.subDimensions.y, e.data.dimensions, e.data.fields, e.data.camera, e.data.span))
}