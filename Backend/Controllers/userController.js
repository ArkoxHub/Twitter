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
            // All ok, asignamos valores y guardamos en la base de datos
            var user = new user_Model();
            user.user = user_Params.user;
            user.email = user_Params.email;
            user.password1 = user_Params.password1;
            user.nickname = user_Params.nickname;
            user.bio = user_Params.bio;
            if (user_Params.name) {
                user.name = user_Params.name;
            }
            if (user_Params.surname) {
                user.surname = user_Params.surname;
            }
            if (user_Params.birthday) {
                user.birthday = user_Params.birthday;
            }

            user.save(function (err, user_Saved) {
                // Si da error
                if (!user_Saved || err) {
                    return res.status(500).send({
                        status: 'Failed',
                        message: 'Error al intentar crear el usuario. Inténtelo de nuevo más tarde.'
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
                });

            });

        } catch (err) {
            return res.status(500).send({
                status: 'Failed',
                message: 'Error with the server, please try later',
                error: err
            });
        }
    },

    checkUserExists: function (req, res) {
        var user = req.body.user;

        user_Model.exists({ user: user }, function (err, result) {
            if (err) {
                return res.status(500).send({
                    status: 'Failed',
                    message: 'Ha habido un error al intentar conectar con el servidor'
                })
            } else {
                return res.status(200).send({
                    status: 'Success',
                    result: result,
                    type: 'user'
                })
            }
        });
    },


    checkMailExists: function (req, res) {
        var email = req.body.email;

        user_Model.exists({ email: email }, function (err, result) {
            if (err) {
                return res.status(500).send({
                    status: 'Failed',
                    message: 'Ha habido un error al intentar conectar con el servidor'
                })
            } else {
                return res.status(200).send({
                    status: 'Success',
                    result: result,
                    type: 'email'
                })
            }
        });
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
     * Se obtiene el valor del user por la URL.
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
            user_Model.find({ user: user_Nickname }, null, { limit: 5 }, function (err, users_Response) {
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
     * METHOD: GET
     * Obtain the user using the url param request
     * @param {*} req 
     * @param {*} res 
     */
    getUserByUserName: function (req, res) {
        var userName = req.params.user;

        user_Model.findOne({ user: userName}, (err, userFound) => {
            if (err || !userFound) {
                return res.status(500).send({
                    status: 'Failed',
                    message: 'Usuario no encontrado',
                })
            }
            return res.status(200).send({
                status: 'Success',
                message: 'Usuario encontrado',
                user: userFound
            });
        });
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
        var userID = req.params.user;
        var user = req.body.user;

        console.log('userID', userID)
        console.log('Usuario a actualizar', user)

        // Validamos usuario pasado por parámetro URL
        if (validator.isEmpty(userID)) {
            return res.status(500).send({
                status: 'Failed',
                message: 'No se ha pasado ningún usuario a buscar'
            });
        }

        // Validamos que tengamos datos que modificar
        if ((Object.keys(user).length) === 0) {
            return res.status(500).send({
                status: 'Failed',
                message: 'No se ha pasado ningún usuario para modificar'
            });
        }
        
        user_Model.findByIdAndUpdate(userID, user, { new: true }, function (err, userModified) {
            if (err) {
                return res.status(500).send({
                    status: 'Failed',
                    message: 'Error al actualizar el usuario', user,
                });
            }
            return res.status(200).send({
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
    },

    updateUser: function(req, res) {
        var user = req.body.user;
        if (!user.tweets_Likes) { user.tweets_Likes = new Array() };
        if (!user.tweets_Retweet) { user.tweets_Retweet = new Array() };
        
        user_Model.findOneAndUpdate({_id : user._id}, user, {new: true}, (err, userUpdated) => {
            if (err || !userUpdated) {
                return res.status(500).send({
                    status: 'Failed',
                    message: 'No se ha encontrado ningún usuario'
                });
            }

            return res.status(200).send( {
                status: 'Success',
                message: 'Se ha actualizado el usuario',
                user: userUpdated
            });
        });

    }
}

module.exports = userController;