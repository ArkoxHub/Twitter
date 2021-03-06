'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema Tweets
var tweetSchema = new Schema({
    nickname: String,
    user: String,
    tweet: String,
    date: { type: Date, default: Date.now },
    total_Retweets: { type: Number, default: 0 },
    total_Likes: { type: Number, default: 0 },
    images: [{
        path: String,
        fileName: String
    }],
    comments: [{
        user: String,
        comment: String,
        date: { type: Date, default: Date.now },
        comment_Retweets: { type: Number, default: 0 },
        comment_Likes: { type: Number, default: 0 }
    }]
});

// Crea un Modelo a la Data Base que lo llamará 'tweets'
var TweetModel = mongoose.model('Tweet', tweetSchema);

module.exports = TweetModel;