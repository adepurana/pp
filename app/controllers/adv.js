const DateValidator = require('DateValidator').DateValidator;
const validator = require('validator')
const moment = require('moment')
var Ads = require('../models/ads')
var Agent = require('../models/agent')
var AdsAgent = require('../models/adsagent')


module.exports = {
  getAdvByNickname: getAdvByNickname,
  getAdvByVoucherId: getAdvByVoucherId
}

function getAdvByVoucherId(req,res,next){
  var voucherId = req.params.id
  AdsAgent.findById(voucherId).exec(function(err,adsAgent){
    Ads.findById(adsAgent.voucherId).exec(function(err,ads){
      adsAgent.counter++
      adsAgent.save()
      res.redirect(ads.destinationUrl)
    })
  })
}

function getAdvByNickname(req,res,next){
  var nickname = req.params.nickname

  Agent.findOne({nickName:nickname}).exec(function(err,agent){
    if(!agent)res.redirect('http://klana.in/')
    else{
      AdsAgent.find({agentId:agent._id}).sort({"vendor":"asc"}).exec(function(err,adsList){
        res.render('adv.ejs',{
          agent:agent,
          adsList : adsList
        });
      })
    }

  })

}
