var mongoose = require('mongoose');

var adsagentSchema = mongoose.Schema({
    agentId      : String,
    voucherId    : String,
    promoCode    : String,
    counter      : Number,
    vendor       : String,
    imageUrl     : String,
    dtExpiry     : Date
});

module.exports = mongoose.model('AdsAgent', adsagentSchema);
