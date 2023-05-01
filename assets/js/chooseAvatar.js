$(document).ready(function () {
    $('.edit_user_button').click(function (event) {
        $('.edit_user_button, .edit_user_panel, .edit_user_text').toggleClass('active');
    });

    const icons = document.getElementsByClassName("user_icon")
    let prevIcon = null;

    let userImage = document.getElementsByClassName("user_image")
    let headerImage = document.getElementsByClassName("nav_icon_login")

    for (let i = 0; i < icons.length; i++) {
        icons[i].addEventListener("click", (e) => {
            const elem = e.target

            //выключение активности старой пикчи
            if (prevIcon != null) {
                $(prevIcon).toggleClass('active')
            }

            $(elem).toggleClass('active')
            prevIcon = icons[i] //запоминаем новую пикчу

            //меняем все пикчи на новую
            $(userImage).attr("src", $(elem).attr("src"));
            $(headerImage).attr("src", $(elem).attr("src"));
        })
    }
});