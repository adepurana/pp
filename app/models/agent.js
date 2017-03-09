var mongoose = require('mongoose');

var agentSchema = mongoose.Schema({
    fullName     : String,
    nickName     : String,
    isTicked     : {type: Boolean, default:false}

});

module.exports = mongoose.model('Agent', agentSchema);
