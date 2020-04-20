var user_Model = require('../Models/User');
var validator = require('validator');

var userController = {

    // CRUD USERS

    /**
     * Method: POST
     * CREATE USER
     * Create user with all the body params with the user
     * @param {*} req 
     * @param {*} res 
     */
    createUser: function (req, res) {
        var user_Params = req.body;

        try {
            if (validator.isEmpty(user_Params.user)) {
                return res.status(400).send({
                    status: 'Failed',
                    message: 'El campo user es obligatorio'
                });
            } else if (!validator.isEmail(user_Params.email)) {
                return res.status(400).send({
                    status: 'Failed',
                    message: 'El campo email no es correcto'
                });
            } else if (validator.isEmpty(user_Params.password1)) {
                return res.status(400).send({
                    status: 'Failed',
                    message: 'El campo contraseña 1 es obligatorio'
                });
            } else if (validator.isEmpty(user_Params.password2)) {
                return res.status(400).send({
                    status: 'Failed',
                    message: 'El campo contraseña 2 es obligatorio'
                });
            } else if (user_Params.password1 !== user_Params.password2) {
                return res.status(400).send({
                    status: 'Failed',
                    message: 'Las contraseñas no coinciden'
                });
            } else {
                // All ok, asignamos valores y guardamos en la base de datos
                var user = new user_Model();
                user.user = user_Params.user;
                user.email = user_Params.email;
                user.password1 = user_Params.password1;
                if (user_Params.nickname) {
                    user.nickname = user_Params.nickname;
                }
                user.save(function (err, user_Saved) {
                    if (!user_Saved || err) {
                        return res.status(500).send({
                            status: 'Failed',
                            message: 'El nombre de usuario ya está ocupado'
                        });
                    }

                    /**
                     * Save Cookies to client
                     * user: Saves the user name
                     * password: Saves de password * ¡¡¡¡HACE FALTA ENCRIPTARLA!!!! *
                     */
                    res.cookie('user', user.user, { maxAge: 8760 * 60 * 60 * 1000 }); // 1 year
                    res.cookie('password', user.password1, { maxAge: 8760 * 60 * 60 * 1000 }); // 1 year

                    return res.status(200).send({
                        status: 'Success',
                        message: 'Usuario creado correctamente',
                        user: user_Saved
                    })
                });
            }
        } catch (err) {
            return res.status(500).send({
                status: 'Failed',
                message: 'Error with the server, please try later'
            });
        }
    },

    /**
     * Method: POST
     * READ user
     * Se obteiene el valor de un usuario pasado en la URL y buscamos la única 
     * coincidencia en la colección "users" de la base de datos
     * @param {*} req 
     * @param {*} res 
     * @returns El usuario encontrado en formato json de la collección de datos
     */
    getUserByUser: function (req, res) {
        var user_Name = req.body.user;
        var user_Password = req.body.password;

        if (validator.isEmpty(user_Name) || validator.isEmpty(user_Password)) {
            res.status(400).send({
                status: 'Failed',
                message: 'No se ha pasado correctamente el usuario por parámetro'
            });
        } else {
            user_Model.find({ user: user_Name }, function (err, user_Response) {
                if (!user_Response[0]) {
                    return res.status(200).send({
                        status: 'User',
                        message: 'No se ha encontrado ningún usuario con este nombre',
                        user: user_Response
                    });
                }

                if (err) {
                    return res.status(500).send({
                        status: 'Failed',
                        message: 'Error en la Base de Datos, por favor inténtelo de nuevo más tarde.'
                    });
                }

                if (user_Response[0]) {
                    if (user_Response[0].password1 === user_Password) {
                        return res.status(200).send({
                            status: 'Success',
                            message: 'Usuario encontrado',
                            user: user_Response

                        });
                    } else {
                        return res.status(200).send({
                            status: 'Password',
                            message: 'La contraseña introducida no coincide',
                            user: null
                        });
                    }
                }
            });
        }
    },

    /**
     * METHOD: GET
     * READ USER
     * Se obtiene el valor del nickname por la URL.
     * Buscamos todas las coincidencias en la colección "users" y devolvemos la respuesta en formato json
     * Devuelve máximo 5 objetos
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns Devuelve todos los resultados que ha obtenido de la búsqueda
     */
    getUserByNickname: function (req, res) {
        var user_Nickname = req.params.nickname;
        console.log(req.params)

        if (validator.isEmpty(user_Nickname)) {
            res.status(400).send({
                status: 'Failed',
                message: 'No se ha pasado correctamente el usuario por parámetro'
            });
        } else {
            user_Model.find({ nickname: user_Nickname }, null, { limit: 5 }, function (err, users_Response) {
                if (!users_Response[0] || err) {
                    return res.status(500).send({
                        status: 'Failed',
                        message: 'No se ha encontrado ningún usuario con este nombre'
                    });
                }

                return res.status(200).send({
                    status: 'Success',
                    message: 'Se ha encontrado un usuario',
                    user: users_Response
                });
            });
        }
    },

    /**
     * Method: PUT
     * UPDATE USER
     * Modifica el usuario a través del nombre de usuario pasado por parámetros
     * con los valores que le pasan en el body de la petición
     * @param {*} req 
     * @param {*} res 
     * @returns El documento user actualizado
     */
    modifyUser: function (req, res) {
        var user_Name = req.params.user;
        var user_Body = req.body;

        console.log('user_Name', user_Name)
        console.log('user_Body', user_Body)

        // Validamos usuario pasado por parámetro URL
        if (validator.isEmpty(user_Name)) {
            return res.status(500).send({
                status: 'Failed',
                message: 'No se ha pasado ningún usuario a buscar'
            });
        }

        // Validamos que tengamos datos que modificar
        if ((Object.keys(user_Body).length) === 0) {
            return res.status(500).send({
                status: 'Failed',
                message: 'No se ha pasado ningún usuario para modificar'
            });
        }

        // Buscamos que exista el usuario en nuestra colección de datos y lo modificamos
        user_Model.findOneAndUpdate({ user: user_Name }, user_Body, { new: true }, function (err, userModified) {
            if (err || !userModified) {
                return res.status(500).send({
                    status: 'Failed',
                    message: 'No se ha encontrado a ningun usuario con este nombre en la base de datos'
                });
            }
            return res.status(500).send({
                status: 'Success',
                message: 'Usuario modificado!',
                user: userModified
            });
        });
    },

    deleteUser: function (req, res) {
        var userToDelete = req.params.user;
        console.log(userToDelete);

        if (validator.isEmpty(userToDelete)) {
            return res.status(500).send({
                status: 'Failed',
                message: 'No se ha pasado ningún parámetro a la petición'
            });
        } else {
            user_Model.find({ user: userToDelete }, function (err, user) {
                if (err || !user[0]) {
                    return res.status(500).send({
                        status: 'Failed',
                        message: 'No se ha encontrado ningún usuario con el nombre \'' + userToDelete + '\''
                    });
                }
                try {
                    user_Model.findByIdAndRemove(user[0]._id, function (err, userDeleted) {
                        if (err || !userDeleted) {
                            return res.status(500).send({
                                status: 'Failed',
                                message: 'Error al eliminar el usuario \'' + userDeleted + '\' de la Base de Datos'
                            });
                        }
                        return res.status(200).send({
                            status: 'Success',
                            message: 'Se ha eliminado correctamente al usuario \'' + userDeleted.user + '\' de la base de datos.',
                            response: userDeleted
                        });
                    });
                } catch (err) {
                    return res.status(500).send({
                        status: 'Failed',
                        message: 'Error al intentar eliminar el usuario de la Base de Datos'
                    });
                }
            });
        }
    }


}

module.exports = userController;