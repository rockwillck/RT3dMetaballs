var best = [0, Number.MAX_SAFE_INTEGER]
function test(x) {
    if (!localStorage.getItem("optimizedValue")) {
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
                        localStorage.setItem("optimizedValue", `${findClosestIntegerDivisors(best[0])},${best[0]/findClosestIntegerDivisors(best[0])}`)
                        dismissModal(true)
                        setup(findClosestIntegerDivisors(best[0]), best[0]/findClosestIntegerDivisors(best[0]))
                    }
                    updateProgressBar(x/16)
                }
            }
        })
    } else {
        issueModal("Loading cache...", true)
        let id = setInterval(() => {
            try {
                setup(parseInt(localStorage.getItem("optimizedValue").split(",")[0]), parseInt(localStorage.getItem("optimizedValue").split(",")[1]))
            } catch (e) {
            } finally {
                clearInterval(id)
            }
        }, 100)
    }
}
test(1)

function findClosestIntegerDivisors(x) {
    for (i=Math.floor(Math.sqrt(x));i>0;i--) {
        if (x/i % 1 == 0) {
            return i
        }
    }
}