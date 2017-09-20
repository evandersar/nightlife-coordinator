'use strict';

var express = require('express');
var mongoose = require('mongoose');
var morgan       = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./app/back/routes/index.js');

var app = express();
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useMongoClient: true }); // connect to our database
mongoose.Promise = global.Promise;

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/front', express.static(process.cwd() + '/app/front'));

routes(app);

var port = process.env.PORT || 8080;
app.listen(port, function() {
	console.log('Node.js listening on port ' + port + '...');
});
