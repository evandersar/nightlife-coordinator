'use strict';

var express = require('express');
var mongo = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var routes = require('./app/back/routes/index.js');

var app = express();
require('dotenv').config();

mongo.connect(process.env.MONGO_URI || 'mongodb://evan:evan@ds153853.mlab.com:53853/clementinejs', function(err, db) {

	if (err) {
		throw new Error('Database failed to connect!');
	}
	else {
		console.log('MongoDB successfully connected on port 27017.');
	}

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
	app.use('/public', express.static(process.cwd() + '/public'));
	app.use('/front', express.static(process.cwd() + '/app/front'));

	routes(app, db);

	var port = process.env.PORT || 8080;
	app.listen(port, function() {
		console.log('Node.js listening on port ' + port + '...');
		//console.log("process.env.APP_URL => ", process.env.APP_URL);
	});

});
