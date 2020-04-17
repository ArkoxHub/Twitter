window.onload = function () {
    console.log('Hello friend');

    var loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', getFormValues);

    function getFormValues(event) {
        event.preventDefault();
        
        var divs = document.getElementsByClassName('alert');
        clearAlerts(divs);

        var username = document.getElementById('username');
        var password = document.getElementById('password');

        if (!username.value) {
            var error = createAlertError('El nombre de usuario no puede estar vacío');
            insertAfter(error, username);
            username.style.borderBottom = '3px solid red'
        } else {
            username.style.borderBottom = '3px solid #ffffff'
        }

        if (!password.value) {
            var error = createAlertError('La contraseña no puede estar vacía');
            insertAfter(error, password);
            password.style.borderBottom = '3px solid red'
        } else {
            password.style.borderBottom = '3px solid #ffffff'
        }

        if (username.value && password.value) {
            loginUser(username.value, password.value);
        }
    }

    function createAlertError(error) {
        var div = document.createElement('div');
        var text = document.createElement('p');

        div.classList.add('alert');
        text.classList.add('textAlert');
        text.style.color = 'white';
        text.textContent = error;

        div.appendChild(text);

        return div;
    }

    function insertAfter(newNode, refNode) {
        refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
    }

    function clearAlerts(divs) {
        if (divs.length > 0) {
            for (var i = 0; i <= divs.length; i++) {
                divs[0].parentNode.removeChild(divs[0]);
            }
        }
    }

    function loginUser(user, password) {
        $.ajax({
            method: 'get',
            url: 'http://localhost:3000/user/' + user,
            datatype: 'json',
            data: {
                userValue: user,
                passwordValue: password
            },
            success: processResponse,
            error: showError
        });
    }

    function processResponse(data) {
        console.log(data)
    }

    function showError(jqXHR, statusText, error) {
        alert('Servidor caído, inténtelo de nuevo más tarde.\nPara más información consulta la consola.');
        console.log(error, statusText);
    }
}