//будет работать только в порядке индексов 
//без конкретного соответствия

window.addEventListener("load", () => {
    const elements = document.getElementsByClassName("burger")
    const panels = document.getElementsByClassName("burger-panel")

    for (let i = 0; i < elements.length; i++)
        elements[i].addEventListener("click", (e) => {
            const elem = e.target

            $(elem).toggleClass('active')
            $(panels[i]).toggleClass('active');
            $('body').toggleClass('lock')

            console.log("бургер " + e)
        })
})