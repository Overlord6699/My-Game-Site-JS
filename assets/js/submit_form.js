"use strict"

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    form.addEventListener('submit', formSend);


    function formValidate(form) {
        let error = 0;
        let formReq = form.querySelectorAll('._req');

        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            removeError(input);

            if (input.classList.contains('_email')) {
                if (!emailTest(input)) {
                    addError(input);
                    error++;
                }
            } else if (input.getAttribute("type") == "checkbox" &&
                input.checked == false) {
                addError(input);
                error++;
            }
            else {
                if (input.value == "") {
                    addError(input);
                    error++;
                }
            }

        }

        return error;




        function addError(object) {
            object.parentElement.classList.add('._error');
            object.classList.add('._error');
        }

        function removeError(object) {
            object.parentElement.classList.remove('._error');
            object.classList.remove('._error');
        }


        function emailTest(object) {
            return /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(object.value);
        }
    }

    async function formSend(e) {
        e.preventDefault();

        let error = formValidate(form);

        //const formData = new FormData(form);
        let email = form.elements["email"].value;
        let username = form.elements["username"].value;

        console.log("Send email to " + email + " " + username)

        if (error === 0) {
            form.classList.add('_sending');

            let response = await fetch('sendEmail', {
                method: 'POST',
                headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    username: username
                })
                //body: formData
            });

            if (response.ok) {
                let result = await response.json();
                console.log(result);
                alert("Данные успешно отправлены");

                form.reset();
                form.classList.remove('_sending');
            } else {
                alert("Ошибка отправки формы");
                form.classList.remove('_sending');
            }

        } else {
            alert("Заполните корректно поля");
        }

    }

})



