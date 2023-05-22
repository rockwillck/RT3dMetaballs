function issueModal(text, progressBar=false) {
    document.getElementById("modal").style.top = "50%"
    document.getElementById("progressBar").hidden = !progressBar
    document.getElementById("modalText").style.color = progressBar ? "white" : "black"
    document.getElementById("modalText").innerText = text
}

var dismissible = false
function dismissModal(force=false) {
    if (dismissible || force) {
        document.getElementById("modal").style.top = "150%"
    }
}

function toggleModalDismissible() {
    dismissible = !dismissible
}

var targetValue = 0
function updateProgressBar(value) {
    targetValue = value
}

function updateProgressBarBuffer() {
    requestAnimationFrame(updateProgressBarBuffer)
    document.getElementById("progressBar").value += (targetValue - document.getElementById("progressBar").value)*0.15
}
updateProgressBarBuffer()