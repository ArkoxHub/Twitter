// Import Modelo
var tweetModel = require('../Models/tweet');

var controller = {

    /**
     * Test
     * @param {*} req 
     * @param {*} res 
     */
    helloWorld: function (req, res) {
        res.send('Soyunbot es panxo')
    },

    /**
     * Method: GET
     * A través del ID de un Tweet pasado por parámetro de la URL,
     * devuelve el tweet en JSON
     * @param {*} req 
     * @param {*} res 
     */
    getTweet: function (req, res) { 
        var id = req.params.id;

        if (!id) {
            res.status(400).send({
                status: 'Error',
                message: 'No se ha pasado ningun parámetro'
            }); 
        }

        tweetModel.findById(id, function (err, tweetModel) {
            if (err || !tweetModel) {
                res.status(500).send({
                    status: 'Error',
                    message: 'No se ha encontrado ningún Tweet con este ID'
                });
            }
            
            if (tweetModel) {
                res.status(200).send({
                    status: 'Correct',
                    message: 'Tweet encontrado',
                    tweet: tweetModel
                })
            }
        });
    },

    /**
     * Method: POST
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
                message: 'No se ha formulado correctamente el Tweet',
            })
        }

        if (body.nickname !== undefined || body.tweet !== undefined) {

            // Asignar valores al objeto modelo (documento) a guardar
            newTweet.nickname = body.nickname;
            newTweet.tweet = body.tweet;
            newTweet.comments = body.comments;
            newTweet.images = body.images;
            newTweet.total_Retweets = body.total_Retweets;
            newTweet.total_Likes = body.total_Likes;
            newTweet.date = body.date;

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
                    status: 'Correct',
                    message: 'Se ha enviado y guardado el Tweet correctamente',
                    tweet: newTweet
                });
            });
        }
    }
};

module.exports = controller;