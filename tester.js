var best = [0, Number.MAX_SAFE_INTEGER]
function test(x) {
    document.getElementById("modal").style.top = "50%"
    start = Date.now()
    complete = 0
    let sectors = []
    for (i=0;i<x;i++) {
        sectors.push(new Worker("testWorker.js"))
    }
    sectors.forEach((worker) => {
        worker.postMessage(10000/x)
        worker.onmessage = (e) => {
            complete++
            worker.terminate()
            if (complete == x) {
                if (Date.now() - start < best[1]) {
                    best[0] = x
                    best[1] = Date.now() - start
                }
                if (x < 16) {
                    test(x+1)
                } else {
                    setup(findClosestIntegerDivisors(best[0]), best[0]/findClosestIntegerDivisors(best[0]))
                    document.getElementById("modal").style.top = "150%"
                }
                document.getElementById("progressBar").value = x/16
            }
        }
    })
}
test(1)

function findClosestIntegerDivisors(x) {
    for (i=Math.floor(Math.sqrt(x));i>0;i--) {
        if (x/i % 1 == 0) {
            return i
        }
    }
}