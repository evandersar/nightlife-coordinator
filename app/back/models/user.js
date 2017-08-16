var mongoose = require('mongoose'),  
    Schema = mongoose.Schema;

var User = new Schema({  
    displayName: String,
    picture: String,
    facebook_id: String,
    facebook: { },
    createdAt: { type: Date, 'default': Date.now }
});

module.exports = mongoose.model('User', User);