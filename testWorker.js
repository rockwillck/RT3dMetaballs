onmessage = (e) => {
    testValue = 0
    for (i=0;i<e.data*1000;i++) {
        testValue += Math.atan2(Math.random(), Math.random())/Math.sqrt(Math.random())
    }
    postMessage(testValue)
}