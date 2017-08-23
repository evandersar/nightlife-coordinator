'use strict';

function PollsHandler(db) {
	var polls = db.collection('polls');

	this.addPoll = function(req, res) {
		var poll = req.body;
		//console.log("bod", bod);
		//res.json(bod);

		polls.insert(poll, function(err, data) {
			if (err) throw err;
			// console.log(JSON.stringify(poll));

			res.writeHead(200, { 'Content-Type': 'text/json' });
			res.end(JSON.stringify({ id: poll['_id'] }));
		});
	};

	this.getPolls = function(req, res) {

		polls.find({}, { title: 1 }).toArray(function(err, data) {
			if (err) throw err;
			//console.log("getPolls => ", data);

			res.writeHead(200, { 'Content-Type': 'text/json' });
			res.end(JSON.stringify(data));
		});
	};

	this.getPollById = function(req, res) {

		var pollId = req.params.id;
		//console.log("pollId => ", pollId);

		polls.find({ _id: require('mongodb').ObjectID(pollId) }).toArray(function(err, data) {
			if (err) throw err;
			//console.log("getPollById => ", data[0]);

			res.writeHead(200, { 'Content-Type': 'text/json' });
			res.end(JSON.stringify(data[0]));
		});
	};

	this.updatePollById = function(req, res) {

		var pollId = req.params.id;
		var optionValue = req.body.option;

		var voterID = req.body.voter;
		var voterIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		console.log("voterID => ", voterID);
		console.log("voterIP => ", voterIP);

		polls.find({ _id: require('mongodb').ObjectID(pollId), "options.value": optionValue }).toArray(function(err, data) {
			if (err) throw err;
			console.log("updatePollById => ", data[0]);

			//if option exist in poll.options
			if (data[0]) {
				//check to determine that user voted for current poll or not
				if ((voterID || voterIP) && data[0].voters[0]) {
					for (let item of data[0].voters) {
						if (item.id == voterID || item.ip == voterIP) {
							res.json({ errMsg: 'You can only vote once a poll (user account or IP)' });
						}
					}
				}
				else {
					polls.findAndModify({
							_id: require('mongodb').ObjectID(pollId),
							"options.value": optionValue
						}, [], {
							$inc: { 'options.$.votes': 1 },
							$push: { voters: { id: voterID, ip: voterIP } }
						}, { new: true },
						function(err, doc) {
							if (err) throw err;
							//console.log("updated Poll => ", doc);

							res.writeHead(200, { 'Content-Type': 'text/json' });
							res.end(JSON.stringify(doc.value));
						}
					);
				}
			}
			//if dont exist create new option
			else {
				var option = { value: optionValue, votes: 1 };
				polls.findAndModify({ _id: require('mongodb').ObjectID(pollId) }, [], {
						$push: { options: option },
						$push: { voters: { id: voterID, ip: voterIP } }
					}, { new: true },
					function(err, doc) {
						if (err) throw err;
						//console.log("Poll with new option => ", doc.value);

						res.writeHead(200, { 'Content-Type': 'text/json' });
						res.end(JSON.stringify(doc.value));
					}
				);
			}
		});

	};

	this.deletePollById = function(req, res) {

		var pollId = req.params.id;
		//console.log("pollId => ", pollId);

		polls.remove({ _id: require('mongodb').ObjectID(pollId) },
			function(err, result) {
				if (err) throw err;
				//console.log("deletePollById => ", result);

				res.writeHead(200, { 'Content-Type': 'text/json' });
				res.end(JSON.stringify({ _id: pollId }));
			}
		);
	};

	this.getMyPolls = function(req, res) {
		var facebookId = req.body.userId;
		//console.log("facebookId => ", facebookId);

		polls.find({ author: facebookId }, { title: 1 }).toArray(function(err, data) {
			if (err) throw err;
			//console.log("getMyPolls => ", data);

			res.writeHead(200, { 'Content-Type': 'text/json' });
			res.end(JSON.stringify(data));
		});
	};

}

module.exports = PollsHandler;
