const moment = require('moment')
const validator = require('validator')
var Agents = require('../models/agent')
var Ads = require('../models/ads')
var AdsAgent = require('../models/adsagent')

module.exports = {
  insert: insert,
  getAll: getAll,
  update:update,
  deleteOne:deleteOne,
  detail:detail,
  deleteAll:deleteAll,
  search:search,
  addAgentDisplay:addAgentDisplay,
  editAgentDisplay:editAgentDisplay,
  saveVoucherAgent:saveVoucherAgent,
  deleteVoucherAgent:deleteVoucherAgent
}

function deleteVoucherAgent(req,res,next){
  AdsAgent.findByIdAndRemove(req.params.id, function(err,items){
      if(err)throw err
      var AdsDetail = [];
      Agents.findOne({
        _id:items.agentId
      },(err,resultAgents) => {
            AdsAgent.find({dtExpiry:{
              $gte: Date.now()
            }}).where('agentId').equals(items.agentId).sort({"vendor":"asc"}).exec(function(err,resultAds){
              res.render('agentsDetail', {
                  user : req.user,
                  agents: resultAgents,
                  ads:resultAds
              });
            })
      })
  })
}

function saveVoucherAgent(req,res,next) {
  AdsAgent.update({_id: req.body.adsAgentId}, {
    promoCode: req.body.promoCode
}, function(err, numberAffected, rawResponse) {
    if(err)throw err
    var AdsDetail = [];
    Agents.findOne({
      _id:req.body.agentId
    },(err,resultAgents) => {
          AdsAgent.find({dtExpiry:{
            $gte: Date.now()
          }}).where('agentId').equals(req.body.agentId).sort({"vendor":"asc"}).exec(function(err,resultAds){
            res.render('agentsDetail', {
                user : req.user,
                agents: resultAgents,
                ads:resultAds
            });
          })
    })

})

}

function editAgentDisplay(req, res, next) {
  AdsAgent.findById(req.params.id, function(err,resultAdsAgent){
    if(err)throw err
    res.render('agentsEdit', {
      message : '',
      user : req.user,
      resultAdsAgent : resultAdsAgent
    });
  })
};

function addAgentDisplay(req, res, next) {
  res.render('agentsAdd', {
    message : '',
    user : req.user
  });
};

function deleteOne(req,res,next){
  AdsAgent.find({}).where('agentId').equals(req.params.id).remove().exec(function(err,resultAdsAgent){
    if(err)throw err
    Agents.findOne({
      _id:req.params.id
    },(err,items) => {
        if(err)throw err
        items.remove((err)=> {
          if(err) throw err
          res.redirect('/home')
        })
    })
  })
}

function getAll(req,res,next){
    var monthNames = [
       "January", "February", "March",
       "April", "May", "June", "July",
       "August", "September", "October",
       "November", "December"
    ];
    var dateCustom = [];
    Agents.find({}).sort({"expiredDate":"asc"}).exec(function(err,result){
      // for(var i=0;i<result.length;i++){
      //   dateCustom.push(result[i].expiredDate.getDate()+' '+(monthNames[result[i].expiredDate.getMonth()])+' '+(result[i].expiredDate.getFullYear()))
      // }
      res.render('home.ejs', {
          user : req.user,
          agents: result
      });
    });
}

function search(req,res,next){
    Agents.find({
      agent:req.params.key
    },(err,result) => {
          res.json(result)
    })
}


function insert(req,res,next){
    var adsAgent
    var messages = []
    if(validator.isEmpty(req.body.fullName))messages.push('Fullname is mandatory field')
    if(validator.isEmpty(req.body.nickName))messages.push('Nickname is mandatory field')
    if(messages.length>0){
      console.log(messages);
      res.render('agentsAdd', {
        user : req.user,
        message: messages
      });
    }
    if(!validator.isAlphanumeric(req.body.nickName))messages.push('Nickname must only contains alphabet-numeric')

    Agents.find({}).where('nickName').equals(req.body.nickName).exec(function(err,result){

      if(result.length>0) {
        messages.push('Nickname is already added')
        res.render('agentsAdd', {
          user : req.user,
          message: messages
        });
      }
      else{
        if(messages.length>0){
          res.render('agentsAdd', {
            user : req.user,
            message: messages
          });
        }
        else{
          var items = new Agents({
            fullName:req.body.fullName,
            nickName:req.body.nickName,
            expiredDate:new Date(req.body.expiredDate)
          })
          items.save(function(err,agent){
            if(err) throw err
            Ads.find({dtExpiry:{
              $gte: Date.now()
            }}).exec(function(err,resultAds){
              console.log(resultAds);
              for(var i=0;i<resultAds.length;i++){
                  adsAgent = new AdsAgent({
                    agentId : agent.id,
                    voucherId : resultAds[i].id,
                    promoCode : agent.nickName,
                    counter : 0,
                    vendor : resultAds[i].vendor,
                    imageUrl : resultAds[i].imageUrl,
                    dtExpiry : resultAds[i].dtExpiry
                  })
                  adsAgent.save();
              }
            })
          })
          res.redirect('/home')
        }

      }
    })
}


function update(req,res,next){
  Agents.findOne({
    _id:req.params.id
  },(err,items) => {
      items.agent = req.body.agent
      items.freq = req.body.freq
      items.dtCreated = new Date()

      items.save((err)=> {
        if(err) throw err
        res.json(items)
      })
  })
}



function deleteAll(req,res,next){
    Agents.find({},(err,result) => {
          res.json(result)
    })
}

function detail(req,res,next){
    var AdsDetail = [];
    Agents.findOne({
      _id:req.params.id
    },(err,resultAgents) => {
          AdsAgent.find({dtExpiry:{
            $gte: Date.now()
          }}).where('agentId').equals(req.params.id).sort({"vendor":"asc"}).exec(function(err,resultAds){
            res.render('agentsDetail', {
                user : req.user,
                agents: resultAgents,
                ads:resultAds
            });
          })
    })
}
