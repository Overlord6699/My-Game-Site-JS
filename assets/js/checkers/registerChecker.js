
async function regUser(email, username, password) {
    const response = await fetch("register", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            username: username,
            password: password
        })
    })
        .catch(function (response) {
            document.getElementById("alert").textContent = "Ошибка сервера! Попробуй позже.";
        })


    const errData = await response.json();

    if (errData.length === 0) {
        window.location.href = '/account';
    } else {
        document.getElementById("alert").textContent = errData;
    }
}

document.forms["regForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["regForm"];

    const email = form.elements["email"].value;
    const username = form.elements["username"].value;
    const password = form.elements["password"].value;
    const confirm_password = form.elements["confirm_password"].value;

    if (password === confirm_password) {
        regUser(email, username, password);
    }
    else {
        document.getElementById("alert").textContent = "Пароли должны совпадать!";
    }
});         