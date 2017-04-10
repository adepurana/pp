const DateValidator = require('DateValidator').DateValidator;
const validator = require('validator')
const moment = require('moment')
var Ads = require('../models/ads')
var Agent = require('../models/agent')
var AdsAgent = require('../models/adsagent')
var RealAdsAgent = require('../models/adsagent')
var Subscriber = require('../models/subscriber')

module.exports = {
  insert: insert,
  getAll: getAll,
  getAllDetail:getAllDetail,
  update:update,
  deleteOne:deleteOne,
  deleteAll:deleteAll,
  search:search,
  detailads:detailads,
  updateAds:updateAds
}

function updateAds(req,res,next){
  var message = []
  var adsAgentPromoCodeList = []
  var tempAdsAgentPromoCodeList = []

  if(validator.isEmpty(req.body.vendor))message.push('Vendor is mandatory field')
  if(validator.isEmpty(req.body.imageUrl))message.push('Banner URL is mandatory field')
  if(validator.isEmpty(req.body.dtExpiry))message.push('Expired Date is mandatory field')
  if(validator.isEmpty(req.body.destinationUrl))message.push('Destination URL is mandatory field')
  if(validator.isEmpty(req.body.tncFull))message.push('TnC Full is mandatory field')
  if(validator.isEmpty(req.body.tncBanner))message.push('TnC Banner is mandatory field')
  if(message.length>0){
    // =============== DISPLAY DATA ============ //

    Ads.findById(req.body.adsId, function(err,itemsAds){
      var adsAgentIDList = []
      var dtExpiryCustom = itemsAds.dtExpiry.toISOString()

      var year = dtExpiryCustom.substring(0,4)
      var month = dtExpiryCustom.substring(5,7)
      var day = dtExpiryCustom.substring(8,10)

      dtExpiryCustom = month+'/'+day+'/'+year;

      Agent.find({}).sort({"_id":"asc"}).exec(function(err,agentList){
        if(err)throw err
        AdsAgent.find({},'-_id agentId promoCode').where('voucherId').equals(req.body.adsId).sort({"agentId":"asc"}).exec(function(err,adsAgentList){
          for(var i=0;i<adsAgentList.length;i++){
            adsAgentIDList.push(adsAgentList[i].agentId)
            tempAdsAgentPromoCodeList.push(adsAgentList[i].promoCode)
          }

          for(var i=0;i<agentList.length;i++){
            if(adsAgentIDList.indexOf(agentList[i]._id.toString()) > -1){
              adsAgentPromoCodeList.push(tempAdsAgentPromoCodeList[flag])
              flag+=1
            }
            else{
              adsAgentPromoCodeList.push(agentList[i].nickName)
            }
            for(var j=0;j<adsAgentIDList.length;j++){
              if(adsAgentIDList[j]==(agentList[i]._id)){
                agentList[i].isTicked=true
              }
            }
          }
          console.log('masuk sini 4');
          res.render('adsDetail',{
            adsAgentPromoCodeList : adsAgentPromoCodeList,
            agentList : agentList,
            dtExpiryCustom : req.body.dtExpiry,
            message : message,
            ads: itemsAds,
            user : req.user
          })
        })
      })
    })
  }
  else{
    //pass first validations
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(req.body.dtExpiry))message.push('Date Expiry format is not correct')
    else{
      var year = req.body.dtExpiry.substring(6,10)
      var month = req.body.dtExpiry.substring(0,2)
      var day = req.body.dtExpiry.substring(3,5)
      if(!DateValidator.validate(year,month,day))message.push('Date Expiry format is not correct')
    }
    if(!validator.isURL(req.body.imageUrl))message.push('Banner URL must be in URL format')
    if(!validator.isURL(req.body.destinationUrl))message.push('Destination URL must be in URL format')
    if(!validator.contains(req.body.destinationUrl,'http'))message.push('Destination URL must be in URL format')
    if(message.length>0){
      // =============== DISPLAY DATA ============ //

      Ads.findById(req.body.adsId, function(err,itemsAds){
        var adsAgentIDList = []
        var dtExpiryCustom = itemsAds.dtExpiry.toISOString()

        var year = dtExpiryCustom.substring(0,4)
        var month = dtExpiryCustom.substring(5,7)
        var day = dtExpiryCustom.substring(8,10)

        dtExpiryCustom = month+'/'+day+'/'+year;

        Agent.find({}).sort({"_id":"asc"}).exec(function(err,agentList){
          if(err)throw err
          AdsAgent.find({},'-_id agentId promoCode').where('voucherId').equals(req.body.adsId).sort({"agentId":"asc"}).exec(function(err,adsAgentList){
            for(var i=0;i<adsAgentList.length;i++){
              adsAgentIDList.push(adsAgentList[i].agentId)
              tempAdsAgentPromoCodeList.push(adsAgentList[i].promoCode)
            }
            for(var i=0;i<agentList.length;i++){
              if(adsAgentIDList.indexOf(agentList[i]._id.toString()) > -1){
                adsAgentPromoCodeList.push(tempAdsAgentPromoCodeList[flag])
                flag+=1
              }
              else{
                adsAgentPromoCodeList.push(agentList[i].nickName)
              }
              for(var j=0;j<adsAgentIDList.length;j++){
                if(adsAgentIDList[j]==(agentList[i]._id)){
                  agentList[i].isTicked=true
                }
              }
            }
            console.log('masuk sini 5');
            res.render('adsDetail',{
              adsAgentPromoCodeList : adsAgentPromoCodeList,
              agentList : agentList,
              dtExpiryCustom : req.body.dtExpiry,
              message : message,
              ads: itemsAds,
              user : req.user
            })
          })
        })
      })
    }//if(message.length>0){
    else{
      // pass all validation
      var promoCodeArray = req.body.promoCode
      var flag = 0
      console.log('ARI ADIPRANA', promoCodeArray);
      var tomorrow = new Date(req.body.dtExpiry)
      Ads.findOneAndUpdate({_id:req.body.adsId},
        {$set:
          {
            vendor:req.body.vendor,
            imageUrl:req.body.imageUrl,
            dtExpiry:tomorrow.setDate(tomorrow.getDate()+1),
            destinationUrl:req.body.destinationUrl,
            isMarketing:req.body.isMarketing,
            tncFull:req.body.tncFull,
            tncBanner:req.body.tncBanner
          }}, function(err,items){
                  if(err)throw err
                  AdsAgent.update(
                    {voucherId: req.body.adsId},
                    {$set: {
                      vendor:req.body.vendor,
                      imageUrl:req.body.imageUrl,
                      dtExpiry:tomorrow.setDate(tomorrow.getDate()+1)
                    }},{multi: true},
                    function(err,adsAgent){
                      if(err)throw err

                      //update subscribers
                      Subscriber.update({adsId:req.body.adsId},
                        {$set:
                          {
                            vendor:req.body.vendor
                          }
                        },{multi: true}, function(err,items){
                            if(err)throw err
                          }
                      )



                      // =============== DISPLAY DATA ============ //
                      Ads.findById(req.body.adsId, function(err,itemsAds){
                        var adsAgentIDList = []
                        var dtExpiryCustom = itemsAds.dtExpiry.toISOString()

                        var year = dtExpiryCustom.substring(0,4)
                        var month = dtExpiryCustom.substring(5,7)
                        var day = dtExpiryCustom.substring(8,10)

                        dtExpiryCustom = month+'/'+day+'/'+year;
                        //----------------- UPDATE LISTING ------------------//
                              if(req.body.agentChecked == null){
                                AdsAgent.find({}).where('voucherId').equals(req.body.adsId).remove().exec();
                                Agent.find({}).sort({"_id":"asc"}).exec(function(err,agentList){
                                  if(err)throw err
                                  AdsAgent.find({},'-_id agentId promoCode').where('voucherId').equals(req.body.adsId).sort({"agentId":"asc"}).exec(function(err,adsAgentList){
                                    for(var i=0;i<adsAgentList.length;i++){
                                      adsAgentIDList.push(adsAgentList[i].agentId)
                                      tempAdsAgentPromoCodeList.push(adsAgentList[i].promoCode)
                                    }
                                    for(var i=0;i<agentList.length;i++){
                                      if(adsAgentIDList.indexOf(agentList[i]._id.toString()) > -1){
                                        adsAgentPromoCodeList.push(tempAdsAgentPromoCodeList[flag])
                                        flag+=1
                                      }
                                      else{
                                        adsAgentPromoCodeList.push(agentList[i].nickName)
                                      }
                                      for(var j=0;j<adsAgentIDList.length;j++){
                                        if(adsAgentIDList[j]==(agentList[i]._id)){
                                          agentList[i].isTicked=true
                                        }
                                      }
                                    }
                                    console.log('masuk sini 1');
                                    res.render('adsDetail',{
                                      adsAgentPromoCodeList : adsAgentPromoCodeList,
                                      agentList : agentList,
                                      dtExpiryCustom : dtExpiryCustom,
                                      message : '',
                                      ads: itemsAds,
                                      user : req.user
                                    })
                                  })
                                })
                              }
                              else {
                              var preAgentListArray = []
                              var agentIds = req.body.agentChecked
                              // IF ARRAY
                              if(agentIds.constructor === Array){
                                for(var i=0;i<req.body.preAgentList.length;i++){
                                  var b = req.body.preAgentList[i].toString()
                                            .replace("_id","\"_id\"")
                                            .replace("fullName","\"fullName\"")
                                            .replace("nickName","\"nickName\"")
                                            .replace("isTicked","\"isTicked\"")
                                            .replace("__v","\"__v\"")
                                            .replace("\'","\"").replace("\'","\"").replace("\'","\"").replace("\'","\"")
                                  var c = b.substr(0, 9) + "\"" + b.substr(9);
                                  var d = c.substr(0, 34) + "\"" + c.substr(34);
                                  var a = JSON.parse(d)
                                  preAgentListArray.push(a)
                                }
                                      for(var k=0;k<preAgentListArray.length;k++){
                                        var deleted=0
                                        for(var j=0;j<agentIds.length;j++){
                                          var postAgentId,postVoucerId
                                          parse = agentIds[j].split("-")
                                          if(parse[0]==preAgentListArray[k]._id&&preAgentListArray[k].isTicked){
                                            console.log('flag',flag);
                                            AdsAgent.findOneAndUpdate({agentId:parse[0],voucherId:req.body.adsId},
                                              {$set:
                                                {
                                                  promoCode: promoCodeArray[flag],
                                                  vendor:req.body.vendor,
                                                  imageUrl:req.body.imageUrl,
                                                  dtExpiry:tomorrow.setDate(tomorrow.getDate()+1)
                                                }}, function(err,adsAgentItem){
                                                  if(err)throw err
                                                  console.log('need update',parse[0]);
                                                  console.log('items',adsAgentItem);
                                                })

                                          }
                                          else if(parse[0]==preAgentListArray[k]._id&&!preAgentListArray[k].isTicked){
                                            //need insert
                                            adsAgentItem = new AdsAgent({
                                              agentId:parse[0],
                                              voucherId:req.body.adsId,
                                              promoCode:promoCodeArray[flag],
                                              counter:0,
                                              vendor:req.body.vendor,
                                              imageUrl:req.body.imageUrl,
                                              dtExpiry:tomorrow.setDate(tomorrow.getDate()+1)
                                            })
                                            adsAgentItem.save(function(err,adsAgent){
                                              console.log('insert',adsAgent);
                                            })
                                            console.log('need insert',parse[0]);
                                          }
                                          else{
                                              deleted+=1;
                                          }
                                          if(deleted==agentIds.length){
                                            //need delete
                                            console.log(parse[0],req.body.adsId);
                                            AdsAgent.find({'agentId':preAgentListArray[k]._id,'voucherId':req.body.adsId}).remove().exec()
                                            console.log('need delete',preAgentListArray[k]._id);
                                          }
                                        }
                                        //penting buat update promo code
                                        flag+=1
                                      }
                                      flag=0
                                    Agent.find({}).sort({"_id":"asc"}).exec(function(err,agentList){
                                      if(err)throw err
                                      AdsAgent.find({},'-_id agentId promoCode').where('voucherId').equals(req.body.adsId).sort({"agentId":"asc"}).exec(function(err,adsAgentList){
                                        for(var i=0;i<adsAgentList.length;i++){
                                          adsAgentIDList.push(adsAgentList[i].agentId)
                                          tempAdsAgentPromoCodeList.push(adsAgentList[i].promoCode)
                                        }

                                        for(var i=0;i<agentList.length;i++){
                                          if(adsAgentIDList.indexOf(agentList[i]._id.toString()) > -1){
                                            console.log(tempAdsAgentPromoCodeList[flag]);
                                            adsAgentPromoCodeList.push(tempAdsAgentPromoCodeList[flag])
                                            flag+=1
                                          }
                                          else{
                                            adsAgentPromoCodeList.push(agentList[i].nickName)
                                          }
                                          for(var j=0;j<adsAgentIDList.length;j++){
                                            if(adsAgentIDList[j]==(agentList[i]._id)){
                                              agentList[i].isTicked=true
                                            }
                                          }
                                        }
                                        console.log('masuk sini 2');
                                        res.render('adsDetail',{
                                          adsAgentPromoCodeList : adsAgentPromoCodeList,
                                          agentList : agentList,
                                          dtExpiryCustom : dtExpiryCustom,
                                          message : '',
                                          ads: itemsAds,
                                          user : req.user
                                        })
                                      })
                                    })
                              }
                              // IF ONLY TICKED 1 ITEM
                              else{
                                //if only ticked 1 item of 1 item
                                if(req.body.preAgentList.constructor === Array){
                                        for(var i=0;i<req.body.preAgentList.length;i++){
                                          parse = agentIds.split("-")
                                          var b = req.body.preAgentList[i].toString()
                                                    .replace("_id","\"_id\"")
                                                    .replace("fullName","\"fullName\"")
                                                    .replace("nickName","\"nickName\"")
                                                    .replace("isTicked","\"isTicked\"")
                                                    .replace("__v","\"__v\"")
                                                    .replace("\'","\"").replace("\'","\"").replace("\'","\"").replace("\'","\"")
                                          var c = b.substr(0, 9) + "\"" + b.substr(9);
                                          var d = c.substr(0, 34) + "\"" + c.substr(34);
                                          var a = JSON.parse(d)
                                          console.log('JSON.parse',a);
                                          if(a._id!=parse[0]){
                                            AdsAgent.find({'agentId':a._id,'voucherId':req.body.adsId}).remove().exec()
                                          }else if(a._id==parse[0]&&a.isTicked){
                                            console.log('update');
                                            AdsAgent.findOneAndUpdate({agentId:parse[0],voucherId:req.body.adsId},
                                              {$set:
                                                {
                                                  promoCode:promoCodeArray[i],
                                                  vendor:req.body.vendor,
                                                  imageUrl:req.body.imageUrl,
                                                  dtExpiry:tomorrow.setDate(tomorrow.getDate()+1)
                                                }}, function(err,items){
                                                  console.log('items update',items);
                                                })
                                          }else if(a._id==parse[0]&&!a.isTicked){
                                            console.log('insert');
                                            parse = agentIds.split("-")
                                            adsAgentItem = new AdsAgent({
                                              agentId:parse[0],
                                              voucherId:req.body.adsId,
                                              promoCode:parse[1],
                                              counter:0,
                                              vendor:req.body.vendor,
                                              imageUrl:req.body.imageUrl,
                                              dtExpiry:tomorrow.setDate(tomorrow.getDate()+1)
                                            })
                                            adsAgentItem.save(function(err,adsAgent){})
                                          }
                                        }
                                  }
                                  else{
                                        parse = agentIds.split("-")
                                        var b = req.body.preAgentList.toString()
                                                  .replace("_id","\"_id\"")
                                                  .replace("fullName","\"fullName\"")
                                                  .replace("nickName","\"nickName\"")
                                                  .replace("isTicked","\"isTicked\"")
                                                  .replace("__v","\"__v\"")
                                                  .replace("\'","\"").replace("\'","\"").replace("\'","\"").replace("\'","\"")
                                        var c = b.substr(0, 9) + "\"" + b.substr(9);
                                        var d = c.substr(0, 34) + "\"" + c.substr(34);
                                        console.log(d);
                                        var a = JSON.parse(d)
                                        if(a._id!=parse[0]){
                                          AdsAgent.find({'agentId':a._id,'voucherId':req.body.adsId}).remove().exec()
                                        }else if(a._id==parse[0]&&a.isTicked){
                                          AdsAgent.findOneAndUpdate({agentId:parse[0],voucherId:req.body.adsId},
                                            {$set:
                                              {
                                                promoCode:promoCodeArray[i],
                                                vendor:req.body.vendor,
                                                imageUrl:req.body.imageUrl,
                                                dtExpiry:tomorrow.setDate(tomorrow.getDate()+1)
                                              }}, function(err,items){
                                                console.log('insert', items);
                                              })
                                        }else if(a._id==parse[0]&&!a.isTicked){
                                          console.log('insert');
                                          parse = agentIds.split("-")
                                          adsAgentItem = new AdsAgent({
                                            agentId:parse[0],
                                            voucherId:req.body.adsId,
                                            promoCode:parse[1],
                                            counter:0,
                                            vendor:req.body.vendor,
                                            imageUrl:req.body.imageUrl,
                                            dtExpiry:tomorrow.setDate(tomorrow.getDate()+1)
                                          })
                                          adsAgentItem.save(function(err,adsAgent){})
                                        }
                                  }
                                  // ======
                                  Agent.find({}).sort({"_id":"asc"}).exec(function(err,agentList){
                                    if(err)throw err
                                    AdsAgent.find({},'-_id agentId promoCode').where('voucherId').equals(req.body.adsId).sort({"agentId":"asc"}).exec(function(err,adsAgentList){
                                      for(var i=0;i<adsAgentList.length;i++){
                                        adsAgentIDList.push(adsAgentList[i].agentId)
                                        tempAdsAgentPromoCodeList.push(adsAgentList[i].promoCode)
                                      }
                                      for(var i=0;i<agentList.length;i++){
                                        if(adsAgentIDList.indexOf(agentList[i]._id.toString()) > -1){
                                          adsAgentPromoCodeList.push(tempAdsAgentPromoCodeList[flag])
                                          flag+=1
                                        }
                                        else{
                                          adsAgentPromoCodeList.push(agentList[i].nickName)
                                        }
                                        for(var j=0;j<adsAgentIDList.length;j++){
                                          if(adsAgentIDList[j]==(agentList[i]._id)){
                                            agentList[i].isTicked=true
                                          }
                                        }
                                      }
                                      console.log('masuk sini 3');
                                      res.render('adsDetail',{
                                        adsAgentPromoCodeList : adsAgentPromoCodeList,
                                        agentList : agentList,
                                        dtExpiryCustom : dtExpiryCustom,
                                        message : '',
                                        ads: itemsAds,
                                        user : req.user
                                      })
                                    })
                                  })
                              }
                            }
                      })
                    }
                  )
      })
    }
  }
}

function detailads(req,res,next){
  Ads.findById(req.params.id, function(err,items){
    var adsAgentIDList = []
    var adsAgentPromoCodeList = []
    var tempAdsAgentPromoCodeList = []
    var flag = 0
    var dtExpiryCustom = items.dtExpiry.toISOString()

    var year = dtExpiryCustom.substring(0,4)
    var month = dtExpiryCustom.substring(5,7)
    var day = dtExpiryCustom.substring(8,10)

    dtExpiryCustom = month+'/'+day+'/'+year;

    Agent.find({}).sort({"_id":"asc"}).exec(function(err,agentList){
      if(err)throw err
      AdsAgent.find({},'-_id agentId promoCode').where('voucherId').equals(req.params.id).sort({"agentId":"asc"}).exec(function(err,adsAgentList){
        for(var i=0;i<adsAgentList.length;i++){
          adsAgentIDList.push(adsAgentList[i].agentId)
          tempAdsAgentPromoCodeList.push(adsAgentList[i].promoCode)
        }
        for(var i=0;i<agentList.length;i++){
          if(adsAgentIDList.indexOf(agentList[i]._id.toString()) > -1){
            adsAgentPromoCodeList.push(tempAdsAgentPromoCodeList[flag])
            flag+=1
          }
          else{
            adsAgentPromoCodeList.push(agentList[i].nickName)
          }
          for(var j=0;j<adsAgentIDList.length;j++){
            if(adsAgentIDList[j]==(agentList[i]._id)){
              agentList[i].isTicked=true
            }
          }
        }
        console.log('masuk sini 6');
        res.render('adsDetail',{
          adsAgentPromoCodeList: adsAgentPromoCodeList,
          agentList : agentList,
          dtExpiryCustom : dtExpiryCustom,
          message : '',
          ads: items,
          user : req.user
        })
      })
    })
  })
}

function deleteOne(req,res,next){
      AdsAgent.find({}).where('voucherId').equals(req.params.id).remove().exec(function(err,resultAdsAgent){
        if(err)throw err
        Ads.findByIdAndRemove(req.params.id, function(err,items){
            if(err)throw err
              res.redirect('/admin/ads')
        })

    })
}

function getAllDetail(req,res,next){
  Agent.find({}).sort({"nickName":"asc"}).exec(function(err,result){
    res.render('adsAdd',
    {
      message: '',
      user : req.user,
      agent : result
    });
  });

}

function getAll(req,res,next){
    var dates
    var monthNames = [
       "January", "February", "March",
       "April", "May", "June", "July",
       "August", "September", "October",
       "November", "December"
    ];
    var dateCustom = [];
    Ads.find({}).sort({"dtExpiry":"asc"}).exec(function(err,result){
      for(var i=0;i<result.length;i++){
        dateCustom.push(moment(result[i].dtExpiry,moment.ISO_8601).subtract(1, 'day').format("DD MMMM YYYY"))

      }
      res.render('ads', {
          user : req.user,
          ads: result,
          dateCustom:dateCustom
      });
    });
}

function search(req,res,next){
    Ads.find({
      ads:req.params.key
    },(err,result) => {
          res.json(result)
    })
}


function insert(req,res,next){
    var message = []
    if(validator.isEmpty(req.body.vendor))message.push('Vendor is mandatory field')
    if(validator.isEmpty(req.body.imageUrl))message.push('Banner URL is mandatory field')
    if(validator.isEmpty(req.body.dtExpiry))message.push('Expired Date is mandatory field')
    if(validator.isEmpty(req.body.destinationUrl))message.push('Destination URL is mandatory field')
    if(validator.isEmpty(req.body.tncFull))message.push('TnC Full is mandatory field')
    if(validator.isEmpty(req.body.tncBanner))message.push('TnC Banner is mandatory field')
    if(message.length>0){
      Agent.find({}).sort({"nickName":"asc"}).exec(function(err,result){
        res.render('adsAdd',
        {
          message : message,
          user : req.user,
          agent : result
        });
      });
    }

    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(req.body.dtExpiry))message.push('Date Expiry format is not correct')
    else{
      var year = req.body.dtExpiry.substring(6,10)
      var month = req.body.dtExpiry.substring(0,2)
      var day = req.body.dtExpiry.substring(3,5)
      if(!DateValidator.validate(year,month,day))message.push('Date Expiry format is not correct')
    }
    if(!validator.isURL(req.body.imageUrl))message.push('Banner URL must be in URL format')
    if(!validator.isURL(req.body.destinationUrl))message.push('Destination URL must be in URL format')
    if(!validator.contains(req.body.destinationUrl,'http'))message.push('Destination URL must be in URL format')
    var inputDate = req.body.dtExpiry
    var nowDate = moment(Date.now()).format("MM/DD/YYYY")
    if(inputDate<nowDate) message.push('Expiry Date must be greater than today')
    if(message.length>0){
      Agent.find({}).sort({"nickName":"asc"}).exec(function(err,result){
        res.render('adsAdd',
        {
          message : message,
          user : req.user,
          agent : result
        });
      });
    }
    else{
      var tomorrow = new Date(req.body.dtExpiry)
      var items = new Ads({
        vendor:req.body.vendor,
        imageUrl:req.body.imageUrl,
        destinationUrl:req.body.destinationUrl,
        isMarketing:req.body.isMarketing,
        tncFull:req.body.tncFull,
        tncBanner:req.body.tncBanner,
        dtExpiry:tomorrow.setDate(tomorrow.getDate()+1),
        dtCreated: Date.now()
      })
      items.save(function(err,ads){
        if(err) throw err
        var adsAgentItem,parse

        if(req.body.agentChecked == null){
          res.redirect('/admin/ads')
        }
        else {
          var agentIds = req.body.agentChecked
          if(agentIds.constructor === Array){
            for(var i=0;i<agentIds.length;i++){
              parse = agentIds[i].split("-")
              adsAgentItem = new AdsAgent({
                agentId:parse[0],
                voucherId:ads.id,
                promoCode:parse[1],
                counter:0,
                vendor:ads.vendor,
                imageUrl:ads.imageUrl,
                dtExpiry:ads.dtExpiry
              })
              adsAgentItem.save(function(err,adsAgent){
                if(err) throw err
              })
            }
              res.redirect('/admin/ads')
          }
          else{
            parse = agentIds.split("-")
            adsAgentItem = new AdsAgent({
              agentId:parse[0],
              voucherId:ads.id,
              promoCode:parse[1],
              counter:0,
              vendor:ads.vendor,
              imageUrl:ads.imageUrl,
              dtExpiry:ads.dtExpiry
            })
            adsAgentItem.save(function(err,adsAgent){
              if(err) throw err
              res.redirect('/admin/ads')
            })
          }
        }
      })
    }
}


function update(req,res,next){
  Ads.findOne({
    _id:req.params.id
  },(err,items) => {
      items.ads = req.body.ads
      items.freq = req.body.freq
      items.dtCreated = new Date()

      items.save((err)=> {
        if(err) throw err
        res.json(items)
      })
  })
}



function deleteAll(req,res,next){
    Ads.find({},(err,result) => {
          res.json(result)
    })
}
