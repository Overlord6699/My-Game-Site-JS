const video1Start = () => {
    document.getElementById("video1").classList.toggle("active")
    document.getElementById("video1").play()
    document.getElementById("preview1").classList.toggle("active")
}

document.getElementById("video1").addEventListener("ended", () => {
    document.getElementById("video1").classList.toggle("active")
    document.getElementById("preview1").classList.toggle("active")
})