const DateValidator = require('DateValidator').DateValidator;
const validator = require('validator')
const moment = require('moment')
var Ads = require('../models/ads')
var Agent = require('../models/agent')
var AdsAgent = require('../models/adsagent')
var Subscriber = require('../models/subscriber')

module.exports = {
  getAdvByNickname: getAdvByNickname,
  getAdvByVoucherId: getAdvByVoucherId,
  addSubscriber: addSubscriber
}

function addSubscriber(req,res,next){
  if(req.body.adsId!='all'){
    Ads.findById(req.body.adsId).exec(function(err,ads){
      if(err)throw err
      subscriber = new Subscriber({
        fullName:req.body.fullName,
        phoneNo:req.body.phoneNo,
        email:req.body.email,
        adsPurposes:ads._id,
        dtCreated:Date.now()
      })
      subscriber.save(function(err,subs){
        if(err) throw err
      })
      res.redirect(`/adv/${req.body.nickName}`)
    })
  }
  else{
    subscriber = new Subscriber({
      fullName:req.body.fullName,
      phoneNo:req.body.phoneNo,
      email:req.body.email,
      adsPurposes:req.body.adsId,
      dtCreated:Date.now()
    })
    subscriber.save(function(err,subs){
      if(err) throw err
    })
    res.redirect(`/adv/${req.body.nickName}`)
  }
}

function getAdvByVoucherId(req,res,next){
  var voucherId = req.params.id
  AdsAgent.findById(voucherId).exec(function(err,adsAgent){
    if(err)throw err
    Ads.findById(adsAgent.voucherId).exec(function(err,ads){
      if(err)throw err
      adsAgent.counter++
      adsAgent.save()
      res.redirect(ads.destinationUrl)
    })
  })
}

function getAdvByNickname(req,res,next){
  var nickname = req.params.nickname
  var adsArray = []
  Agent.findOne({nickName:nickname}).exec(function(err,agent){
    if(!agent)res.redirect('http://klana.in/')
    else{
      AdsAgent.find({agentId:agent._id}).sort({"vendor":"asc"}).exec(function(err,adsAgentList){
        //console.log(adsAgentList);
        for(var i=0; i<adsAgentList.length;i++){
            Ads.findOne({_id:adsAgentList[i].voucherId}).exec(function(err,ads){
              adsArray.push(ads)
              if(adsArray.length==adsAgentList.length){

                adsArray.sort(function(a, b){
                	var nameA=a.vendor.toLowerCase(), nameB=b.vendor.toLowerCase()
                	if (nameA < nameB) //sort string ascending
                 		return -1
                	if (nameA > nameB)
                		return 1
                	return 0 //default return value (no sorting)
                })
                res.render('adv.ejs',{
                  agent:agent,
                  adsAgentList : adsAgentList,
                  adsArray: adsArray
                });
              }
            })
        }


      })
    }
  })
}
