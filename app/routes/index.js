'use strict';

var path = process.cwd();
var PollsHandler = require(path + '/app/back/pollsHandler.js');

module.exports = function (app, db) {

	var pollsHandler = new PollsHandler(db);
	
	app.route('/api/polls')
		.post(pollsHandler.addPoll)
		.get(pollsHandler.getPolls);
		
	app.route('/api/polls/:id')
		.get(pollsHandler.getPollById)
		.put(pollsHandler.updatePollById)
		.delete(pollsHandler.deletePollById);
		
	app.use(function(req, res) {
	    res.sendFile(path + '/public/index.html');
	});
		
};
