var mongoose = require('mongoose')

var adsSchema = mongoose.Schema({
    vendor:String,
    imageUrl: String,
    destinationUrl:String,
    tncFull:String,
    tncBanner:String,
    dtExpiry: Date,
    dtCreated: Date
})

module.exports= mongoose.model('Ads', adsSchema)
