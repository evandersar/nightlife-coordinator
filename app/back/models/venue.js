// load the things we need
var mongoose = require('mongoose');

// define the schema for our venue model
var venueSchema = mongoose.Schema({
    
    venue_id: String,
    name: String,
    city: String,
    rating: Number,
    description: String,
    img: String,
    going: Number,
    visitors: [String]
});

// create the model for venues and expose it to our app
module.exports = mongoose.model('Venue', venueSchema);
