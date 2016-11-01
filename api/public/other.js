var express = require('express');
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

// Generates hash using bCrypt
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports.controller = function(app) {

	// register user
	var register_user = function(res, req)
	{
		var usr = new User(req.body);
		usr.status = true;
		usr.password = createHash(req.body.password);
		console.log("+" + req.body.password + "+");
		usr.save(
			function(err, result){
				if (err) {
					return res.status(400).json({ success: false });
				}

				return res.status(200).json({success: true, result: result});
			}
		);
	}

	app.post('/api/users/register', function(req, res) {

		User.findOne({$or: [{email: req.body.email}, {username: req.body.username}]}, function(err, user) {
			if (err) {
				return res.status(400).json({ success: false });
			}

			if (user) {
				return res.status(400).json({ 
			        success: false, 
			        message: 'Duplicate username or email.' 
			    });
			} else {
				register_user(res, req);
			}
		});
	});
}
