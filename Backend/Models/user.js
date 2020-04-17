'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema Users
var userSchema = new Schema({
    user: String,
    email: String,
    password1: String,
    password2: String,
    nickname: String,
    name: String,
    surname: String,
    bio: String,
    birthday: Date,
    creation_date: { type: Date, default: Date.now },
    followers: [
        { user: String }
    ],
    following: [
        { user: String }
    ]
});


// Crea un Modelo a la Data Base que lo llamará 'users'
var UserModel = mongoose.model('User', userSchema);

/** Hace que el campo user sea unique */
UserModel.collection.createIndex({ user: 1 }, { unique: true });

/** Exportamos el modelo para hacerlo modular */
module.exports = UserModel;