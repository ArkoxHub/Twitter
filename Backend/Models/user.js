'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema Users
var userSchema = new Schema({
    name: String,
    surname: String,
    nickname: String,
    birthday: Date,
    creation_date: {type: Date, default: Date.now},
    bio: String,
    total_Tweets: Number,
    total_Follows: Number,
    total_Followers: Number
});

// Crea un Modelo a la Data Base que lo llamará 'users'
var UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;