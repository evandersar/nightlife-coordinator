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
		//console.log("voterID => ", voterID);
		//console.log("voterIP => ", voterIP);

		//return poll, but if it only have optionValue in its options
		polls.find({ _id: require('mongodb').ObjectID(pollId), "options.value": optionValue }).toArray(function(err, poll) {
			if (err) throw err;
			//console.log("poll => ", poll);

			//if option exist in poll.options and dont have any voters, vote
			if (poll[0] && !poll[0].voters[0]) {
				polls.findAndModify({
						_id: require('mongodb').ObjectID(pollId),
						"options.value": optionValue
					}, [], {
						$inc: { 'options.$.votes': 1 },
						$push: { voters: { id: voterID, ip: voterIP } }
					}, { new: true },
					function(err, doc) {
						if (err) throw err;
						//console.log("updated Poll any => ", doc);

						res.writeHead(200, { 'Content-Type': 'text/json' });
						res.end(JSON.stringify(doc.value));
					}
				);
			}
			//if option exist in poll.options and have at least one voter
			else if (poll[0] && poll[0].voters[0]) {
				//check to determine that user voted for current poll or not
				for (let item of poll[0].voters) {
					//if voted send message
					if (item.id == voterID || item.ip == voterIP) {
						return res.json({ errMsg: 'You can only vote once a poll (user account or IP)' });
					}
				}
				//if dont voted, vote
				polls.findAndModify({
						_id: require('mongodb').ObjectID(pollId),
						"options.value": optionValue
					}, [], {
						$inc: { 'options.$.votes': 1 },
						$push: { voters: { id: voterID, ip: voterIP } }
					}, { new: true },
					function(err, doc) {
						if (err) throw err;
						//console.log("updated Poll one => ", doc);

						res.writeHead(200, { 'Content-Type': 'text/json' });
						res.end(JSON.stringify(doc.value));
					}
				);
			}
			//if option dont exist, create new option
			else {
				//but only if user dont have voted for this poll
				polls.find({ _id: require('mongodb').ObjectID(pollId) }).toArray(function(err, poll) {
					if (err) throw err;
					//console.log("poll option dont exist => ", poll);

					//check to determine that user voted for current poll or not
					for (let item of poll[0].voters) {
						//if voted send message
						if (item.id == voterID || item.ip == voterIP) {
							return res.json({ errMsg: 'You can only vote once a poll (user account or IP)' });
						}
					}
					//if dont voted, create new option and vote
					var option = { value: optionValue, votes: 1 };
					polls.findAndModify({ _id: require('mongodb').ObjectID(pollId) }, [], {
							$push: { options: option, voters: { id: voterID, ip: voterIP } }
						}, { new: true },
						function(err, doc) {
							if (err) throw err;
							//console.log("Poll with new option => ", doc.value);

							res.writeHead(200, { 'Content-Type': 'text/json' });
							res.end(JSON.stringify(doc.value));
						}
					);
				});
			}
		});


		//return poll by id (second variant of realization)
		/*polls.find({ _id: require('mongodb').ObjectID(pollId) }).toArray(function(err, poll) {
			if (err) throw err;
			console.log("poll => ", poll);
			//check if poll have voters
			if (poll[0].voters[0]) {
				for (let item of poll[0].voters) {
					//user voted for this poll, dont update poll
					if (item.id == voterID || item.ip == voterIP) {
						return res.json({ errMsg: 'You can only vote once a poll (user account or IP)' });
					}
				}
				polls.find({ _id: require('mongodb').ObjectID(pollId), "options.value": optionValue }).toArray(function(err, poll) {
					if (err) throw err;
					console.log("poll => ", poll);
					//if poll option exist in poll.options
					if (poll[0]) {
						polls.findAndModify({
								_id: require('mongodb').ObjectID(pollId),
								"options.value": optionValue
							}, [], {
								$inc: { 'options.$.votes': 1 },
								$push: { voters: { id: voterID, ip: voterIP } }
							}, { new: true },
							function(err, doc) {
								if (err) throw err;
								console.log("updated Poll => ", doc);

								res.writeHead(200, { 'Content-Type': 'text/json' });
								res.end(JSON.stringify(doc.value));
							}
						);
					}
					//poll option dont exist in poll.options
					else {
						var option = { value: optionValue, votes: 1 };
						polls.findAndModify({ _id: require('mongodb').ObjectID(pollId) }, [], {
								$push: { options: option, voters: { id: voterID, ip: voterIP } }
							}, { new: true },
							function(err, doc) {
								if (err) throw err;
								console.log("Poll with new option => ", doc.value);

								res.writeHead(200, { 'Content-Type': 'text/json' });
								res.end(JSON.stringify(doc.value));
							}
						);
					}
				});
			}
			//if poll dont have any voters
			else {
				polls.find({ _id: require('mongodb').ObjectID(pollId), "options.value": optionValue }).toArray(function(err, poll) {
					if (err) throw err;
					console.log("poll => ", poll);
					//if poll option exist in poll.options
					if (poll[0]) {
						polls.findAndModify({
								_id: require('mongodb').ObjectID(pollId),
								"options.value": optionValue
							}, [], {
								$inc: { 'options.$.votes': 1 },
								$push: { voters: { id: voterID, ip: voterIP } }
							}, { new: true },
							function(err, doc) {
								if (err) throw err;
								console.log("updated Poll => ", doc);

								res.writeHead(200, { 'Content-Type': 'text/json' });
								res.end(JSON.stringify(doc.value));
							}
						);
					}
					//poll option dont exist in poll.options
					else {
						var option = { value: optionValue, votes: 1 };
						polls.findAndModify({ _id: require('mongodb').ObjectID(pollId) }, [], {
								$push: { options: option, voters: { id: voterID, ip: voterIP } }
							}, { new: true },
							function(err, doc) {
								if (err) throw err;
								console.log("Poll with new option => ", doc.value);

								res.writeHead(200, { 'Content-Type': 'text/json' });
								res.end(JSON.stringify(doc.value));
							}
						);
					}
				});
			}
		});*/

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
