'use strict';

var express = require('express');
var mongo = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var routes = require('./app/routes/index.js');

var app = express();
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});
mongoose.Promise = global.Promise;

mongo.connect(process.env.MONGO_URI, function(err, db) {

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
