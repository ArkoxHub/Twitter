'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema Users
var userSchema = new Schema({
    user: String,
    email: String,
    password1: String,
    nickname: String,
    name: String,
    surname: String,
    bio: String,
    birthday: Date,
    creation_date: { type: Date, default: Date.now },
    followers: [],
    following: [],
    tweets_Likes: [],
    tweets_Retweet: []
});


// Crea un Modelo a la DataBase que lo llamará 'users'
var UserModel = mongoose.model('User', userSchema);

/** Hace que los campos user y email sean unique */
UserModel.collection.createIndex({ user: 1 }, { unique: true });
UserModel.collection.createIndex({ email: 1 }, { unique: true });

/** Exportamos el modelo para hacerlo modular */
module.exports = UserModel;