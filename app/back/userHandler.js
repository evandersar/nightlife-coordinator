'use strict';

var request = require('request');
var jwt = require('jwt-simple');
var moment = require('moment');

function UserHandler() {

	var User = require('./models/user');

	/*
	 |--------------------------------------------------------------------------
	 | Generate JSON Web Token
	 |--------------------------------------------------------------------------
	 */
	function createJWT(user) {
		var payload = {
			sub: user._id,
			name: user.displayName,
			iat: moment().unix(),
			exp: moment().add(14, 'days').unix()
		};
		return jwt.encode(payload, process.env.TOKEN_SECRET);
	}

	/*
	 |--------------------------------------------------------------------------
	 | Login with Facebook
	 |--------------------------------------------------------------------------
	 */
	this.login = function(req, res) {
		var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
		var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
		var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
		var params = {
			code: req.body.code,
			client_id: req.body.clientId,
			client_secret: process.env.App_secret,
			redirect_uri: req.body.redirectUri
		};

		// Step 1. Exchange authorization code for access token.
		request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
			if (err) throw err;
			if (response.statusCode !== 200) {
				return res.status(500).send({ message: accessToken.error.message });
			}

			// Step 2. Retrieve profile information about the current user.
			request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
				if (err) throw err;
				if (response.statusCode !== 200) {
					return res.status(500).send({ message: profile.error.message });
				}
				if (req.header('Authorization')) {

					User.findOne({ facebook: profile.id }, function(err, existingUser) {
						if (err) throw err;
						if (existingUser) {
							return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
						}
						var token = req.header('Authorization').split(' ')[1];
						var payload = jwt.decode(token, process.env.TOKEN_SECRET);


						User.findById(payload.sub, function(err, user) {
							if (err) throw err;
							if (!user) {
								return res.status(400).send({ message: 'User not found' });
							}

							user.facebook = profile.id;
							user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
							user.displayName = user.displayName || profile.name;
							user.email = profile.email;

							user.save(function() {
								var token = createJWT(user);
								res.send({ token: token });
							});

						});

					});


				}
				else {
					// Step 3. Create a new user account or return an existing one.

					User.findOne({ facebook: profile.id }, function(err, existingUser) {
						if (err) throw err;
						if (existingUser) {
							var token = createJWT(existingUser);
							return res.send({ token: token });
						}

						var user = new User();
						user.facebook = profile.id;
						user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
						user.displayName = profile.name;
						user.email = profile.email;
						
						user.save(function() {
							var token = createJWT(user);
							res.send({ token: token });
						});
						
					});

				}
			});
		});

	};

}

module.exports = UserHandler;
