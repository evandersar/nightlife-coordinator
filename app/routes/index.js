'use strict';

var path = process.cwd();
var PollsHandler = require(path + '/app/back/pollsHandler.js');
var UserHandler = require(path + '/app/back/userHandler.js');

module.exports = function(app, db) {

	var pollsHandler = new PollsHandler(db);
	var userHandler = new UserHandler();

	app.route('/api/polls')
		.post(pollsHandler.addPoll)
		.get(pollsHandler.getPolls);

	app.route('/api/polls/:id')
		.get(pollsHandler.getPollById)
		.put(pollsHandler.updatePollById)
		.delete(pollsHandler.deletePollById);

	app.route('/auth/facebook')
		.post(userHandler.login);

	app.use(function(req, res) {
		res.sendFile(path + '/public/index.html');
	});

};
