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
    user.addEventListener('keyup', checkUserMailActive);
    email.addEventListener('keyup', checkUserMailActive);

    // Listeners validación passwords
    password1.addEventListener('keyup', togglePassword2);
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
    function clearWarnings() {
        var warningElements = document.getElementsByClassName('warning-message');
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
    function showError(elementDOM, message) {
        var p = document.createElement('p');
        p.innerHTML = message;
        p.classList.add('warning-message');

        elementDOM.previousElementSibling.appendChild(p);
    }

    function checkUserMailActive(event) {
        if (event.path[0].getAttribute('id') === 'user') {
            userActiveRequest();
        }

        if (event.path[0].getAttribute('id') === 'email') {
            mailActiveRequest();
        }
    }

    function userActiveRequest() {
        $.ajax({
            method: 'post',
            url: 'http://localhost:3000/user/exists/user',
            dataType: 'json',
            data: {
                user: user.value.toLowerCase()
            },
            success: activeValidation,
            error: showErrorResponse
        });
    }

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

    function activeValidation(data) {
        console.log(data)
        // El servidor retorna que NO existe el usuario / email
        if (!data.result) {
            console.log('No Existe')

            if (data.type === 'user') {
                user.classList.remove('input-warning');
            }

            if (data.type === 'email') {
                email.classList.remove('input-warning');
            }
        }

        // El servidor retorna que SÍ existe el usuario / email
        if (data.result) {
            console.log('Existe')

            if (data.type === 'user') {
                user.classList.add('input-warning');
            }

            if (data.type === 'email') {
                email.classList.add('input-warning');
            }
        }
    }

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

    function processResponse(data) {
        console.log(data)
        console.log('Se ha creado el usuario correctamente')
    }

    function showErrorResponse(jqXHR, statusText, error) {
        alert('Servidor caído, inténtelo de nuevo más tarde.\nPara más información visita nuestra página web.');
        console.log(error, statusText);
    }

});