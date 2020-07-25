// Import Modelo
var tweetModel = require('../Models/Tweet');
var validator = require('validator');

var tweetController = {

    /**
     * Method: GET
     * CRUD: R - READ
     * A través del ID de un Tweet pasado por parámetro de la URL,
     * devuelve el tweet en JSON
     * @param {*} req 
     * @param {*} res 
     */
    getTweet: function (req, res) {
        var id = req.params.id;

        if (!id) {
            res.status(400).send({
                status: 'Failed',
                message: 'No se ha pasado ningun parámetro'
            });
        }

        tweetModel.findById(id, function (err, tweetModel) {
            if (err || !tweetModel) {
                res.status(500).send({
                    status: 'Failed',
                    message: 'No se ha encontrado ningún Tweet con este ID'
                });
            }

            if (tweetModel) {
                res.status(200).send({
                    status: 'Success',
                    message: 'Tweet encontrado',
                    tweet: tweetModel
                })
            }
        });
    },

    /**
     * Method: GET
     * CRUD: READ
     * Recibe el nombre de un usuario por parámetro y obtiene 
     * todos los tweets del usuario ordenados por fecha
     * @param {*} req 
     * @param {*} res 
     */
    getAllTweets: function (req, res) {
        var userName = req.params.user;

        try {
            if (userName) {
                tweetModel.find({ user: userName }, null, { sort: { date: 1 } }, function (err, tweets) {
                    if (err) {
                        return res.status(500).send({
                            status: 'Failed',
                            message: 'Error al consultar en la base de datos'
                        });
                    }
                    // if (Object.keys(tweets).length === 0) {
                    //     return res.status(500).send({
                    //         status: 'Failed',
                    //         message: 'No hay Tweets a mostrar para este usuario',
                    //         t: tweets
                    //     });
                    // }
                    return res.status(200).send({
                        status: 'Success',
                        message: 'See the tweets of ' + userName + ' below',
                        tweets: tweets
                    })
                });
            }
        } catch (err) {
            return res.status(500).send({
                status: 'Failed',
                message: 'Error al conectar con la base de datos'
            });
        }
    },

    /**
     * Method: POST
     * CRUD: C - CREATE
     * Recibe en el cuerpo del mensaje los valores para crear un documento Tweet
     * Notificamos si se ha introducido todo correctamente
     * @param {*} req 
     * @param {*} res 
     */
    saveTweet: function (req, res) {
        var newTweet = new tweetModel();
        var body = req.body;

        if (body.nickname === undefined || body.tweet === undefined) {
            return res.status(404).send({
                status: 'Failed',
                message: 'Faltan campos obligatorios para crear un Tweet',
            })
        }

        if (body.nickname !== undefined || body.tweet !== undefined) {

            // Asignar valores al objeto modelo (documento) a guardar
            newTweet.user = body.user;
            newTweet.nickname = body.nickname;
            newTweet.tweet = body.tweet;
            newTweet.comments = body.comments;
            newTweet.total_Retweets = body.total_Retweets;
            newTweet.total_Likes = body.total_Likes;
            if (req.files) {
                console.log(req.files)
            }

            // Guardamos Tweet a la Data Base
            newTweet.save(function (err, newTweet) {
                if (err) {
                    return res.status(500).send({
                        status: 'Failed',
                        message: 'Error al guardar el Tweet en la base de datos'
                    });
                }

                // Si todo ha ido bien y el Tweet se ha guardado en la Data Base...
                return res.status(200).send({
                    status: 'Success',
                    message: 'Se ha enviado y guardado el Tweet correctamente',
                    tweet: newTweet
                });
            });
        }
    },

    /**
     * Method: PUT
     * CRUD: U - Update
     * A través del ID de un Tweet, lo obtiene de la base de datos
     * y lo vuelve a guardar con los parámetros obtenidos en la petición
     * @param {*} req 
     * @param {*} res 
     */
    updateTweet: function (req, res) {
        var tweetToUpdate = req.body.tweet
        
        tweetModel.findOneAndUpdate({ _id: tweetToUpdate._id }, tweetToUpdate, { new: true },
            (err, tweetUpdated) => {
                if (err, !tweetUpdated) {
                    return res.status(500).send({
                        status: 'Failed',
                        message: 'Error trying to update the Tweet'
                    });
                }

                return res.status(200).send({
                    status: 'Success',
                    message: 'Tweet updated',
                    tweet: tweetUpdated
                });
            });
    },

    /**
     * Method: DELETE
     * CRUD: D - Delete
     * Obtiene el ID de un Tweet de la base de datos pasado por parámetro 
     * en la URL y lo elimina definitivamente
     * @param {*} req 
     * @param {*} res 
     */
    deleteTweet: function (req, res) {
        var id = req.params.id;

        try {
            if (id) {
                tweetModel.findByIdAndRemove(id, (err, tweetRemoved) => {
                    if (err) {
                        res.status(500).send({
                            status: 'Failed',
                            message: 'No se ha encontrado el Tweet'
                        });
                    }

                    res.status(200).send({
                        status: 'Success',
                        message: 'Tweet eliminado',
                        tweet: tweetRemoved
                    });
                });
            }
        } catch (err) {
            res.status(500).send({
                status: 'Failed',
                message: 'Error en la base de datos, inténtelo de nuevo más tarde'
            });
        }
    }
};

module.exports = tweetController;