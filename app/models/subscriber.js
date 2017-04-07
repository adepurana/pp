var mongoose = require('mongoose')

var subscriberSchema = mongoose.Schema({
    fullName:String,
    phoneNo:String,
    email:String,
    note:String,
    adsId:String,
    vendor:String,
    dtCreated:Date
})

module.exports= mongoose.model('Subscriber', subscriberSchema)
