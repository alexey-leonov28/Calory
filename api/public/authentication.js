var express = require('express');
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

module.exports.controller = function(app) {

	var isValidPassword = function(user, password){
		if (!user.password || !password)
			return false;
		return bCrypt.compareSync(password, user.password);
    }

	app.post('/api/users/auth', function(req, res) {
		if (!req.body.email)
		{
			return res.status(400).json({ success: false, message: 'Authentication failed.' });
		}

		// find the user
		User.findOne({'email': req.body.email, status: true}, function(err, user) {
			if (err){
				return res.status(400).json({ success: false });
			}

			if (!user) {
				return res.status(204).json({ success: false, message: 'Authentication failed. User not found.' });
			} else if (user) {

				// check if password matches
				if (!isValidPassword(user, req.body.password)) {
					return res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
				} else {

					// if user is found and password is right
					// create a token
					var token = jwt.sign(user, app.get('superSecret'), {
						expiresInMinutes: 1000 
					});

					// return the information including token as JSON
					res.status(200).json({
						success: true,
						token: token,
						user: user
					});
				}
			}
		});
	});
}
