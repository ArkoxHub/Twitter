// Import express y declaramos puerto
var app = require('./app');
const port = 3000;

// Configuración de la Data Base Mongo DB y conexión
var mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/Twitter';

mongoose.connect(uri, {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log('MongoDB connected!');

    app.listen(port, () => {
        console.log(`Servidor escuchando en el localhost:${port}`)
    });
});

