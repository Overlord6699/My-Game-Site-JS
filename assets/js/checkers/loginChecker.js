
async function logUser(email, password) {
    const response = await fetch("login", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
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

document.forms["logForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["logForm"];

    const email = form.elements["email"].value;
    const password = form.elements["password"].value;

    logUser(email, password);
});