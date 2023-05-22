var best = [0, Number.MAX_SAFE_INTEGER]
function test(x) {
    issueModal("Optimizing...", true)
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
                    dismissModal(true)
                    setup(findClosestIntegerDivisors(best[0]), best[0]/findClosestIntegerDivisors(best[0]))
                }
                updateProgressBar(x/16)
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