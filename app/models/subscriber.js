var mongoose = require('mongoose')

var subscriberSchema = mongoose.Schema({
    fullName:String,
    phoneNo:String,
    email:String,
    adsPurposes:String,
    dtCreated:Date
})

module.exports= mongoose.model('Subscriber', subscriberSchema)
