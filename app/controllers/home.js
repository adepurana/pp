module.exports = {
  home: home,
  advert: advert
}

function home(req,res,next){
      res.render(`klana.ejs`)
}

function advert(req,res,next){
      res.render(`advert.ejs`)
}
