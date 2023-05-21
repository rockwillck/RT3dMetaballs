var pov = Math.PI*0.3
function parsePixel(sx, sy, sw, sh, dimensions, fields, camera) {
    let canvasData = new Uint8ClampedArray(sw*sh*4)
    for (let x=sx;x<sx+sw;x++) {
        for (let y=sy;y<sy+sh;y++) {
            /* 
            lens is curved, like a sphere
            project sphere onto flat, 2d plane
            */
            // travelDistance = {
            //     x:Math.cos(camera.yRotation - (x - dimensions.x/2)/(dimensions.x)*pov), 
                
            //     y:Math.sin((y - dimensions.y/2)/(dimensions.y)*pov), 
                
            //     z:Math.sin(camera.yRotation - (y - dimensions.y/2)/(dimensions.y)*pov),
            // }

            // currentPosition = {
            //     x:camera.x + travelDistance.x*(camera.focalLength), 

            //     y:camera.y + travelDistance.y*(camera.focalLength), 

            //     z:camera.z + travelDistance.z*(camera.focalLength)
            // }

            /*
            lens is flat
            */
            currentYRotation = Math.atan2((x-dimensions.x/2), camera.focalLength)
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
                    charge += 12/((
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
    postMessage(parsePixel(e.data.position.x, e.data.position.y, e.data.subDimensions.x, e.data.subDimensions.y, e.data.dimensions, e.data.fields, e.data.camera))
}