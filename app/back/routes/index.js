'use strict';

var path = process.cwd();
var VenueHandler = require(path + '/app/back/venueHandler.js');
var UserHandler = require(path + '/app/back/userHandler.js');

module.exports = function(app) {

	var venueHandler = new VenueHandler();
	var userHandler = new UserHandler();

	app.route('/api/venue')
		.post(venueHandler.getVenues);

	app.route('/api/venue/:id')
		.put(venueHandler.updateVenue);

	app.route('/auth/facebook')
		.post(userHandler.login);

	app.use(function(req, res) {
		res.sendFile(path + '/public/index.html');
	});

};
