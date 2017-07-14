'use strict';

var path = process.cwd();
//var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var PollsHandler = require(path + '/app/back/pollsHandler.js');

module.exports = function (app, db) {

	//var clickHandler = new ClickHandler(db);
	var pollsHandler = new PollsHandler(db);

	/*app.route('/api/clicks')
		.get(clickHandler.getClicks)
		.post(clickHandler.addClick)
		.delete(clickHandler.resetClicks);*/
		
	app.route('/api/polls')
		.post(pollsHandler.addPoll);
		/*.get(pollsHandler.getPolls)*/
		/*.delete(pollsHandler.removePoll);*/
		
		
	app.use(function(req, res) {
	    res.sendFile(path + '/public/index.html');
	});
		
};
