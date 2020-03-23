// Cargámos módulo express
const express = require('express');

// Cargámos Controllers
var tweetController = require('./Controllers/tweetController');

// Ejecutamos express y la guardamos en una variable
const app = express();

// MiddleWares
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Configurar Cabeceras y Cors Origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Routing
app.get('/tweet', tweetController.helloWorld);
app.get('/tweet/:id', tweetController.getTweet);
app.post('/tweet', tweetController.saveTweet);

// Exportamos la variable app con express configurado
module.exports = app;