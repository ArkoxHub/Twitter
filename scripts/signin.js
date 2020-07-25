$('document').ready(() => {
    console.log('Hi friend')

    // Listener Submit Form
    var signForm = document.getElementById('signForm');
    signForm.addEventListener('submit', getDataForm);

    var user = document.getElementById('user');
    var nickname = document.getElementById('nickname');
    var password1 = document.getElementById('password1');
    var password2 = document.getElementById('password2');
    var email = document.getElementById('email');
    var name = document.getElementById('name');
    var surname = document.getElementById('surname');
    var birthday = document.getElementById('birthday');
    var bio = document.getElementById('bio');

    // Listeners validación usuario y email existentes
    user.addEventListener('blur', checkUserMailActive);
    email.addEventListener('blur', checkUserMailActive);

    // Listeners validación passwords
    password1.addEventListener('keyup', togglePassword2);
    password1.addEventListener('blur', passwordValidation);
    password2.addEventListener('blur', checkPasswords);

    // Activa o desactiva el campo input password2 dependiendo de si password1 tiene contenido
    function togglePassword2() {
        if (password1.value.length > 0) {
            password2.removeAttribute('disabled')
            password2.classList.remove('input-disabled');
        } else {
            password2.setAttribute('disabled', 'true');
            password2.classList.add('input-disabled');
        }
        password2.value = '';
    }

    // Comprueba que la password1 y password2 coinciden
    function checkPasswords() {

        clearPasswordWarnings();

        if (password2.value === '') {
            return false;
        }

        if (password1.value !== password2.value) {
            password1.classList.add('input-warning');
            password2.classList.add('input-warning');
            showError(password1, 'Las contraseñas no coinciden');
            password2.setAttribute('disabled', 'true');
            password2.classList.add('input-disabled');
            password2.value = '';
            password1.focus();
        } else {
            password1.classList.remove('input-warning');
            password2.classList.remove('input-warning');
        }
    }

    /**
     * Valida y comprueba que los inputs 'password1' y 'password2' coincidan y tengan
     * un valor
     * La contraseña debe ser alfanumérica
     */
    function passwordValidation() {

        clearPasswordWarnings();

        var passwordValue = password1.value;
        
        if (passwordValue.length === 0) {
            return false;
        }
        if (passwordValue.length < 6) {
            showError(password1, 'La contraseña debe tener una longitud igual o superior a 6 carácteres');
            password1.value = '';
            togglePassword2();
            password1.focus();
            return false;
        }
        if (!isAlphanumeric(passwordValue)) {
            showError(password1, 'La contraseña debe estar formada por carácteres y números a la vez');
            password1.focus();
            password1.value = '';
            togglePassword2();
            password1.focus();
            return false;
        }
    }

    /**
     * Validaciones del formulario
     * @param {*} event 
     */
    function getDataForm(event) {
        event.preventDefault();
        var dataForm = true;

        clearWarnings();

        if (user.value === '') {
            showError(user, 'El campo nombre de usuario es obligatorio.');
            dataForm = false;
        }

        if (nickname.value === '') {
            showError(nickname, 'El campo nickname es obligatorio.');
            dataForm = false;
        }

        if (password1.value === '') {
            showError(password1, 'Debes introducir una contraseña.');
            dataForm = false;
        }

        if (password2.value === '') {
            showError(password2, 'Debes repetir la contraseña.');
            dataForm = false;
        }

        if (email.value === '') {
            showError(email, 'El campo email es obligatorio.');
            dataForm = false;
        }

        if (bio.value === '') {
            showError(bio, 'El campo biografía es obligatorio, habla sobre tí!');
            dataForm = false;
        }

        if (dataForm) {
            console.log('All correct');
            createUserQuery();
        }

    }

    /**
     * Limpia todos los campos de alerta del DOM
     */
    function clearWarnings(input) {
        if (input) {
        var warningElements = document.getElementsByClassName('warning-message-' + input);
        } else {
            var warningElements = document.getElementsByClassName('warning-message');
        }
        if (warningElements.length > 0) {
            while (warningElements.length > 0) {
                warningElements[0].parentNode.removeChild(warningElements[0]);
            }
        }
    }

    /**
     * Limpia todas las alertas del password1
     */
    function clearPasswordWarnings() {
        var warningElements = document.getElementsByClassName('warning-message');
        if (warningElements.length > 0) {
            if (warningElements[0].parentNode.getAttribute('for') === 'password1') {
                warningElements[0].parentNode.removeChild(warningElements[0]);
            }
        }
    }

    /**
     * Crea un mensaje de error que será mostrado en la parte superior de los inputs
     * @param {element} elementDOM donde está el error para mostrar el mensaje
     * @param {*} message mensaje de texto que queramos que aparezca
     */
    function showError(elementDOM, message, inputValue) {
        var p = document.createElement('p');
        p.innerHTML = message;
        if (inputValue) {
            console.log('warning-message-' + inputValue)
            p.classList.add('warning-message-' + inputValue);
        } else {
            console.log('warning-message')
            p.classList.add('warning-message');
        }

        elementDOM.previousElementSibling.appendChild(p);
    }


    /**
     * Listener que difurca y llama a la función de validación
     * de usuario o email según sea el campo que acaba de escribir el usuario
     * @param {*} event 
     */
    function checkUserMailActive(event) {
        if (event.path[0].getAttribute('id') === 'user') {
            userActiveRequest();
        }

        if (event.path[0].getAttribute('id') === 'email') {
            mailActiveRequest();
        }
    }

    /**
     * Llama a la función del servidor para saber si el usuario existe o no
     */
    function userActiveRequest() {
        var userCapitalized = user.value;
        userCapitalized = userCapitalized.charAt(0).toUpperCase() + userCapitalized.slice(1);

        $.ajax({
            method: 'post',
            url: 'http://localhost:3000/user/exists/user',
            dataType: 'json',
            data: {
                user: userCapitalized
            },
            success: activeValidation,
            error: showErrorResponse
        });
    }

    /**
     * Llama a la función del servidor para saber si el email existe o no
     */
    function mailActiveRequest() {
        $.ajax({
            method: 'post',
            url: 'http://localhost:3000/user/exists/email',
            dataType: 'json',
            data: {
                email: email.value.toLowerCase()
            },
            success: activeValidation,
            error: showErrorResponse
        });
    }

    /**
     * Difurca por email y usuario la respuesta y dependiendo de si
     * existe o no en la base de datos, notifica al usuario de manera
     * visual en los inputs
     * @param {*} data 
     */
    function activeValidation(data) {
        console.log(data)
        // El servidor retorna que NO existe el usuario / email
        if (!data.result) {


            if (data.type === 'user') {
                user.classList.remove('input-warning');

                if (user.classList.contains('duplicate-user')) {
                    user.classList.remove('duplicate-user');
                    clearWarnings('user');
                }
            }

            if (data.type === 'email') {
                email.classList.remove('input-warning');

                if (user.classList.contains('duplicate-user')) {
                    user.classList.remove('duplicate-user');
                    clearWarnings('email');
                }
            }
        }

        // El servidor retorna que SÍ existe el usuario / email
        if (data.result) {

            if (data.type === 'user') {
                user.classList.add('input-warning');

                if (!user.classList.contains('duplicate-user')) {
                    user.classList.add('duplicate-user');
                    showError(user, 'El usuario ya existe, intente con otro diferente', 'user');
                    user.focus();
                }
            }

            if (data.type === 'email') {
                email.classList.add('input-warning');

                if (!email.classList.contains('duplicate-user')) {
                    email.classList.add('duplicate-user');
                    showError(email, 'El usuario ya existe, intente con otro diferente', 'email');
                    email.focus();
                }
            }
        }
    }

    /**
     * Envía al servidor todos los datos del formulario
     */
    function createUserQuery() {
        $.ajax({
            method: 'post',
            url: 'http://localhost:3000/user',
            dataType: 'json',
            data: {
                user: user.value,
                nickname: nickname.value,
                password1: password1.value,
                email: email.value,
                name: name.value,
                surname: surname.value,
                birthday: birthday.value,
                bio: bio.value
            },
            success: processResponse,
            error: showErrorResponse
        });
    }

    /**
     * Usuario creado y devuelto correctamente por el servidor
     * Redirigimos al usuario a la página principal
     * @param {User} data 
     */
    function processResponse(data) {
        console.log(data)
        console.log('Se ha creado el usuario correctamente');

        // Redirigimos al usuario a la página principal y guardamos usuario WebStorage

        if (data.status === 'Success') {
            if (!localStorage.getItem('twitter-username') || !localStorage.getItem('twitter-password')) {
                localStorage.setItem('twitter-username', data.user.user);
                localStorage.setItem('twitter-password', data.user.password1);

                redirect = false;

                // Redirect 
                window.location.href = 'http://127.0.0.1:5500/index.html';
            }

            if (localStorage.getItem('twitter-username') !== data.user.user || localStorage.getItem('twitter-password') !== data.user.password1) {
                var clientResponse = confirm('Quiere actualizar su Usuario y Contraseña en este navegador?');
                if (clientResponse) {
                    localStorage.setItem('twitter-username', data.user.user);
                    localStorage.setItem('twitter-password', data.user.password1);

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
    }

    /**
     * Show error when creation user fails
     * @param {*} jqXHR 
     * @param {*} statusText 
     * @param {*} error 
     */
    function showErrorResponse(jqXHR, statusText, error) {
        alert('Servidor caído, inténtelo de nuevo más tarde.\nPara más información visita nuestra página web.');
        console.log(error, statusText);
    }

    /**
     * Devuelve la validación del parámetro pasado para saber
     * si es alfanumérico o no
     * @param {String} str 
     */
    function isAlphanumeric(str) {
        return /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(str);
    }

});