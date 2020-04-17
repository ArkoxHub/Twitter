'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var trendingSchema = new Schema({
    hashtag: String,
    total_Tweets: { type: Number, default: 0 },
    tweet_ID: [String]
});

/** Hace que el campo hashtag sea unique */

var TrendingModel = mongoose.model('TrendingTopic', trendingSchema);

TrendingModel.collection.createIndex({ hashtag: 1 }, { unique: true });

module.exports = TrendingModel;