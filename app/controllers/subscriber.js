const DateValidator = require('DateValidator').DateValidator;
const validator = require('validator')
const moment = require('moment')
var Ads = require('../models/ads')
var Agent = require('../models/agent')
var AdsAgent = require('../models/adsagent')
var Subscriber = require('../models/subscriber')

module.exports = {
  getAll: getAll
}

function getAll(req,res,next){
  var vendorList = []
  Subscriber.find().sort({"vendor":"asc","dtCreated":"asc"}).exec(function(err,subscribers){

          res.render('subscriber',{
            user : req.user,
            subscribers : subscribers
          })
  })
}
