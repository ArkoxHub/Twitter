'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var trendingSchema = new Schema({
    hashtag: String,
    total_Tweets: { type: Number, default: 0 },
    tweet_ID: [String]
});


var TrendingModel = mongoose.model('TrendingTopic', trendingSchema);

/** Hace que el campo hashtag sea unique */
TrendingModel.collection.createIndex({ hashtag: 1 }, { unique: true });

module.exports = TrendingModel;