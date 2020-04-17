'use strict'

/** Import del Modelo TrendingTopic */
var TrendingModel = require('../Models/TrendingTopic');

var trendingController = {

    /**
     * METHOD POST
     * Create or Update a TrendingTopic
     * 
     * Nos llega por parámetro en la URL el valor de un TT
     * Si este valor no se encuentra en la base de datos, lo crea de nuevo.
     * Si el valor ya existe en la base de datos, sumamos en 1 la cantidad total que
     * veces que se ha usado este HashTag.
     * 
     * Tanto si es la primera vez que se publica un Tweet con este HashTag como si ya existía,
     * se guardara el ID de referéncia de éste Tweet en un Arrat del modelo para poder listarlos
     * todos en una vista
     * @param {*} req 
     * @param {*} res 
     */
    saveOrUpdateTrending: function (req, res) {
        var requestBody = req.body;
        console.log(requestBody);
        try {
            if (!requestBody.hashtag || !requestBody.tweet_ID) {
                return res.status(400).send({
                    status: 'Failed',
                    message: 'Faltan parámetros en la petición'
                });
            }

            TrendingModel.find({ hashtag: requestBody.hashtag }, function (err, responseHashTag) {
                if (err) {
                    return res.status(500).send({
                        status: 'Failed',
                        message: 'Error al obtener el hashtag de la Base de Datos'
                    });
                }

                // Si no encuentra ningún HashTag, añadimos uno nuevo en la base de datos
                if (Object.keys(responseHashTag).length === 0) {
                    var createHashTag = new TrendingModel();
                    createHashTag.hashtag = requestBody.hashtag;
                    createHashTag.total_Tweets++;
                    createHashTag.tweet_ID.push(requestBody.tweet_ID);

                    createHashTag.save((err, createHashTag) => {
                        if (err || !createHashTag) {
                            return res.status(500).send({
                                status: 'Failed',
                                message: 'No se ha podido crear un HasthTag nuevo por un error en el servidor'
                            });
                        }
                        return res.status(200).send({
                            status: 'Success',
                            message: '¡Se ha creado un nuevo HashTag!',
                            response: createHashTag
                        });
                    });
                } else {
                    // Ya se encuentra un HashTag creado, sumamos cantidad de Tweets en 1 el existente
                    var hasthTag_Update = responseHashTag[0];
                    hasthTag_Update.total_Tweets ++;
                    hasthTag_Update.tweet_ID.push(requestBody.tweet_ID);
                    TrendingModel.findByIdAndUpdate(responseHashTag[0]._id, hasthTag_Update, (err, response) => {
                        if (err || !response) {
                            return res.status(500).send({
                                status: 'Failed',
                                message: 'No se ha podido actualizar el HashTag ' + response
                            });
                        }

                        return res.status(200).send({
                            status: 'Success',
                            message: 'HashTag actualizado con éxito',
                            hashTag: response
                        });
                    });
                }
            })

        } catch (err) {
            return res.status(500).send({
                status: 'Failed',
                message: '¡Ops!\nHa habido algún error, inténtelo de nuevo más tarde.\nPerdone las moléstias :('
            });
        }
    },

    getTweetsID_OfHashTag: function (req, res) {
        var hasthag = req.params.hashtag;
        console.log(hashtag)
    }

}


module.exports = trendingController;