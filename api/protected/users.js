var express = require('express');
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var updateAvail = require('../updateAvail.js');
var MealEntry = require('../models/meal_entry.js');

// Generates hash using bCrypt
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports.controller = function(app) {
	
	/*
	* regular user level
	*/

	// getting own information
	app.get('/api/users/getUserInformation', function(req, res) {
		User.findOne({_id: req.decoded._id}, function(err, user) {
			if (err) throw err;

			if (!user) {
				return res.status(404).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else if (user) {
				delete user.password;

				return res.status(200).json({success: true, user: user});
			}
		});
	});

	// update own profile
	app.post('/api/users/updateProfile', function(req, res) {

		var userId = req.decoded._id;
		var newProfile = req.body;

		// clean up body parameters
		delete newProfile.password;
		delete newProfile.role;
		delete newProfile.status;

		User.findOne({_id: userId}, function(err, usr) {
			if (err) throw err;

			User.update(
				{_id: userId},
				{$set: newProfile},
				{upsert: false, runValidators: true},
				function(err){
					if (err){
						return res.status(400).json({ 
					        success: false, 
					        message: 'Bad Request.' 
					    });
					}

					updateAvail.updateAvailability();
					return res.status(200).json({ success: true });
				}
			);
		});
	});

	// delete profile
	app.post('/api/users/deleteProfile', function(req, res) {
		User.findOne({_id: req.decoded._id}, function(err, usr) {
			if (err) throw err;
			
			MealEntry.remove({userID: usr._id}, function(err){
				usr.remove(function(err){
					updateAvail.updateAvailability();

					return res.status(200).json({success: true});
				});
			});
		});
	});

	// update own password
	app.post('/api/users/updatePassword', function(req, res) {
		var userId = req.decoded._id;

		User.findOne({_id: userId}, function(err, usr) {
			if (err) throw err;

			usr.password = createHash(req.body.password);
			usr.save(function(err){
				if (err) throw err;

				return res.status(200).json({ success: true });
			});
		});
	});

	/*
	* admin / user manager role
	*/
	// get the list of users
	app.get('/api/users/getList', function(req, res) {
		if (req.decoded.role > 2)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Not authorized.' 
		    });
		}

		User.find({}, function(err, usrlst) {
			if (err) throw err;

			if (usrlst.length == 0) {
				return res.status(404).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else {
				return res.status(200).json({ success: true, users: usrlst });
			}
		});
	});

	// getting the user information
	app.get('/api/users/getUserInfoById/:id', function(req, res) {
		if (req.decoded.role > 2)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Not authorized.' 
		    });
		}

		if (!req.params.id)
		{
			return res.status(400).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		User.findOne({_id: req.params.id}, function(err, user) {
			if (err) throw err;

			if (!user) {
				return res.status(201).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else if (user) {				
				return res.status(200).json({ success: true, user: user });
			}
		});
	});

	// update the user information
	app.post('/api/users/updateProfileById/:id', function(req, res) {
		if (req.decoded.role > 2)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Not authorized.' 
		    });
		}

		if (!req.params.id)
		{
			return res.status(400).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		var newProfile = req.body;

		delete newProfile.password;
		var userId = req.params.id;

		User.findOne({_id: userId}, function(err, usr) {
			if (err) throw err;

			User.update(
				{_id: userId},
				{$set: newProfile},
				{upsert: false, runValidators: true},
				function(err){
					if (err){
						return res.status(400).json({ 
					        success: false, 
					        message: 'Bad Request.' 
					    });
					}

					updateAvail.updateAvailability();
					return res.status(200).json({ success: true });
				}
			);
		});
	});

	// delete user
	app.get('/api/users/deleteById/:id', function(req, res) {
		if (req.decoded.role > 2)
		{
			return res.status(401).json({ 
		        success: false, 
		        message: 'Not authorized.' 
				    });
		}
		
		if (!req.params.id)
		{
			return res.status(400).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		User.findOne({_id: req.params.id}, function(err, usr) {
			if (err) throw err;
			
			MealEntry.remove({userID: usr._id}, function(err){
				if (usr._id == req.decoded._id) // remove self
				{
					return res.status(401).json({ 
				        success: false, 
				        message: 'Not authorized.' 
				    });
				}
				usr.remove(function(err){
					updateAvail.updateAvailability();

					return res.status(200).json({success: true});
				});
			});
		});
	});
}
