'use strict';

var path = process.cwd();
var PollsHandler = require(path + '/app/back/pollsHandler.js');
var UserHandler = require(path + '/app/back/userHandler.js');

module.exports = function(app) {

	var pollsHandler = new PollsHandler();
	var userHandler = new UserHandler();

	app.route('/api/polls')
		.get(pollsHandler.getPolls);

	app.route('/api/polls/:id')
		.put(pollsHandler.updatePollById);

	app.route('/auth/facebook')
		.post(userHandler.login);

	app.use(function(req, res) {
		res.sendFile(path + '/public/index.html');
	});

};
