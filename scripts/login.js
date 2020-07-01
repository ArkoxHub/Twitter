window.onload = function () {
    console.log('Hello friend');

    // Form Events
    var loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', getFormValues);

    /**
     * Recibe los parámetros escritos en el formulario para validarlos
     * @param {*} event 
     */
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

    /**
     * Crea un <div> con el mensaje pasádo por parámetro
     * @param {String} error 
     * @returns elemento <div> para ser insertado
     */
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

    /**
     * Inserta el un ElementNode pasado por parámetro después del referenciado.
     * @param {Element} newNode nuevo que queremos inserir
     * @param {Element} refNode referéncia del nodo al que le queremos inserir
     * un nuevo elemento posterior
     */
    function insertAfter(newNode, refNode) {
        refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
    }

    /**
     * Elimina todos los div con classe 'alert' del DOM
     * @param {Element} divs 
     */
    function clearAlerts(divs) {
        if (divs.length > 0) {
            for (var i = 0; i <= divs.length; i++) {
                divs[0].parentNode.removeChild(divs[0]);
            }
        }
    }

    function loginUser(user, password) {
        $.ajax({
            method: 'post',
            url: 'http://localhost:3000/user/login',
            data: {
                user: user,
                password: password
            },
            datatype: 'json',
            success: processResponse,
            error: showError
        });
    }

    /**
     * Procesa la información de la petición AJAX al servidor que busca un usuario
     * según el mensaje de status recibido
     * @param {*} data 
     */
    function processResponse(data) {
        var redirect = true;
        if (data.status === 'Success') {
            if (!localStorage.getItem('username') || !localStorage.getItem('password')) {
                localStorage.setItem('username', data.user[0].user);
                localStorage.setItem('password', data.user[0].password1);

                redirect = false;

                // Redirect 
                window.location.href = 'http://127.0.0.1:5500/index.html';
            }

            if (localStorage.getItem('username') !== data.user[0].user || localStorage.getItem('password') !== data.user[0].password1) {
                var clientResponse = confirm('Quiere actualizar su Usuario y Contraseña en este navegador?');
                if (clientResponse) {
                    localStorage.setItem('username', data.user[0].user);
                    localStorage.setItem('password', data.user[0].password1);

                    redirect = false;

                    // Redirect 
                    window.location.href = 'http://127.0.0.1:5500/index.html';
                }
            }

            if (redirect) {
                window.location.href = 'http://127.0.0.1:5500/index.html';
            }
            // document.cookie = 'user=' + data.user[0].user + '; max-age=31536000‬; path=/'; // 1 year duration = 60 * 60 * 24 * 365
            // document.cookie = 'password=' + data.user[0].password1 + '; max-age=31536000‬; path=/'; // 1 year duration = 60 * 60 * 24 * 365
        }

        if (data.status === 'User') {
            var username = document.getElementById('username');
            var error = createAlertError('Usuario incorrecto');
            insertAfter(error, username);
        }

        if (data.status === 'Password') {
            var password = document.getElementById('password');
            var error = createAlertError('Contraseña incorrecta');
            insertAfter(error, password);
        }
    }

    function showError(jqXHR, statusText, error) {
        alert('Servidor caído, inténtelo de nuevo más tarde.\nPara más información consulta la consola.');
        console.log(error, statusText);
    }
}