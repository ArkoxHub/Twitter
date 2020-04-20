// Cargámos módulo express
const express = require('express');

/**
 * Cargámos Controllers
 */
var tweetController = require('./Controllers/tweetController');
var userController = require('./Controllers/userController');
var trendingController = require('./Controllers/trendingController');

// Ejecutamos express y la guardamos en una variable
const app = express();

/**
 * MiddleWares
 */
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/**
 * Configurar Cabeceras y Cors Origin
 */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

/**
 * Routing
 */
// Tweet Controller Routing
app.get('/tweet/:id', tweetController.getTweet);
app.get('/tweets/:user', tweetController.getAllTweets);
app.post('/tweet', tweetController.saveTweet);
app.put('/tweet/:id', tweetController.updateTweet);
app.delete('/tweet/:id', tweetController.deleteTweet);

// User Controller Routing
app.post('/user', userController.createUser);
app.post('/user/login', userController.getUserByUser);
app.get('/nickname/:nickname', userController.getUserByNickname);
app.put('/user/:user', userController.modifyUser);
app.delete('/user/:user', userController.deleteUser);

// Trending Topic Routing
app.post('/trending-topic', trendingController.saveOrUpdateTrending);

// Exportamos la variable app con express configurado
module.exports = app;