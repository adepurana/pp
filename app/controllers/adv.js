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
  console.log(req.body);
  if(req.body.adsId!='all'){
    Ads.findById(req.body.adsId).exec(function(err,ads){
      if(err)throw err
      subscriber = new Subscriber({
        fullName:req.body.fullName,
        phoneNo:req.body.phoneNo,
        email:req.body.email,
        note:req.body.note,
        adsId:ads._id,
        vendor:ads.vendor,
        dtCreated:Date.now()
      })
      subscriber.save(function(err,subs){
        if(err) throw err
      })
      res.redirect(`/${req.body.nickName}`)
    })
  }
  else{
    subscriber = new Subscriber({
      fullName:req.body.fullName,
      phoneNo:req.body.phoneNo,
      email:req.body.email,
      note:req.body.note,
      adsId:req.body.adsId,
      vendor:'All',
      dtCreated:Date.now()
    })
    subscriber.save(function(err,subs){
      if(err) throw err
    })
    res.redirect(`/${req.body.nickName}`)
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
  var empty = 0
  var adsAgentListNew = []
  Agent.findOne({nickName:nickname}).exec(function(err,agent){
    if(!agent)res.redirect('/')
    else{
      AdsAgent.find({agentId:agent._id}).sort({"vendor":"asc"}).exec(function(err,adsAgentList){
        //console.log(adsAgentList);
        for(var i=0; i<adsAgentList.length;i++){
            Ads.findOne({_id:adsAgentList[i].voucherId, dtExpiry: {
              $gte: Date.now()
            }}).exec(function(err,ads){
              if(ads==null)empty++;
              else adsArray.push(ads)
              if(adsArray.length==adsAgentList.length-empty){

                adsArray.sort(function(a, b){
                	var nameA=a.vendor.toLowerCase(), nameB=b.vendor.toLowerCase()
                	if (nameA < nameB) //sort string ascending
                 		return -1
                	if (nameA > nameB)
                		return 1
                	return 0 //default return value (no sorting)
                })

                //function for only take adsagentlist which not expired ,
                for(var i=0;i<adsAgentList.length;i++){
                  for(var j=0;j<adsArray.length;j++){
                      if(adsAgentList[i].vendor==adsArray[j].vendor)adsAgentListNew.push(adsAgentList[i])
                  }
                }

                res.render('adv.ejs',{
                  agent:agent,
                  adsAgentList : adsAgentListNew,
                  adsArray: adsArray
                });
              }
            })
        }


      })
    }
  })
}
