var express = require('express');
var MealEntry = require('../models/meal_entry.js');
var User = require('../models/user');
var updateAvail = require('../updateAvail.js');

module.exports.controller = function(app) {
	
	/*
	* regular user level
	*/
	// add meal entry
	app.post('/api/meals/add', function(req, res) {
		var entry = new MealEntry(req.body);
		entry.userID = req.decoded._id; // set owner

		entry.save(
			function(err){
				if (err){
					return res.status(400).json({ 
				        success: false, 
				        message: 'Bad Request.' 
				    });
				}

				updateAvail.updateAvailability();
				return res.status(200).json({success: true, entry: entry});
			}
		);
	});

	// get the meal list
	app.get('/api/meals/getList', function(req, res) {
		MealEntry.find({userID: req.decoded._id}, function(err, entrylist) {
			if (err) throw err;

			if (entrylist.length == 0) {
				return res.status(201).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else {
				return res.status(200).json({success: true, entries: entrylist});
			}
		});
	});

	// get the meal information
	app.get('/api/meals/getInformationByID/:id', function(req, res) {
		if (!req.params.id)
		{
			return res.status(400).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		MealEntry.findOne({userID: req.decoded._id, _id: req.params.id}, function(err, entry) {
			if (err) throw err;

			if (!entry) {
				return res.status(201).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else if (entry) {
				return res.status(200).json({ success: true, entry: entry });
			}
		});
	});

	// update entry
	app.post('/api/meals/updateEntryByID/:id', function(req, res) {
		if (!req.params.id)
		{
			return res.status(400).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		var newEntry = req.body;
		MealEntry.findOne({userID: req.decoded._id, _id: req.params.id}, function(err, entry) {
			if (err) throw err;

			MealEntry.update(
				{_id: req.params.id},
				{$set: newEntry},
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

	// delete entry
	app.get('/api/meals/deleteEntryByID/:id', function(req, res) {
		if (!req.params.id)
		{
			return res.status(400).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		MealEntry.findOne({userID: req.decoded._id, _id: req.params.id}, function(err, entry) {
			if (err) throw err;
			
			if (entry)
			{
				entry.remove(function(err){
					updateAvail.updateAvailability();

					return res.status(200).json({success: true});
				});
			}else{
				return res.status(200).json({success: false});
			}
		});
	});

	/*
	* admin access level
	*/
	// get the list of meals by admin
	app.get('/api/meals/getFullList', function(req, res) {
		if (req.decoded.role > 1)
		{
			return res.status(400).json({ 
		        success: false, 
		        message: 'Bad request.' 
		    });
		}

		MealEntry.find({}, function(err, entrylist) {
			if (err) throw err;

			if (entrylist.length == 0) {
				return res.status(201).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else {
				return res.status(200).json({ success: true, entries: entrylist });
			}
		});
	});

	// delete entry by admin
	app.get('/api/meals/deleteEntryUnlimited/:id', function(req, res) {
		if (req.decoded.role > 1)
		{
			return res.status(400).json({ 
		        success: false, 
		        message: 'Bad request.' 
		    });
		}
		
		if (!req.params.id)
		{
			return res.status(400).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		MealEntry.findOne({_id: req.params.id}, function(err, entry) {
			if (err) throw err;
			
			if (entry)
			{
				entry.remove(function(err){
					updateAvail.updateAvailability();
				});
			}
			
			return res.status(200).json({success: true});
		});
	});

	// update entry by admin
	app.post('/api/meals/updateEntryUnlimited/:id', function(req, res) {
		if (req.decoded.role > 1)
		{
			return res.status(400).json({ 
		        success: false, 
		        message: 'Bad request.' 
		    });
		}

		if (!req.params.id)
		{
			return res.status(400).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		var newEntry = req.body;
		MealEntry.findOne({_id: req.params.id}, function(err, entry) {
			if (err) throw err;

			MealEntry.update(
				{_id: req.params.id},
				{$set: newEntry},
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

	// add meal entry by admin
	app.post('/api/meals/addUnlimited', function(req, res) {
		if (req.decoded.role > 1)
		{
			return res.status(400).json({ 
		        success: false, 
		        message: 'Bad request.' 
		    });
		}

		var entry = new MealEntry(req.body);

		entry.save(
			function(err){
				if (err){
					return res.status(400).json({ 
				        success: false, 
				        message: 'Bad Request.' 
				    });
				}

				updateAvail.updateAvailability();
				return res.status(200).json({success: true, entry: entry});
			}
		);
	});

	// get the meal information
	app.get('/api/meals/getInformationUnlimitedByID/:id', function(req, res) {
		if (req.decoded.role > 1)
		{
			return res.status(400).json({ 
		        success: false, 
		        message: 'Bad request.' 
		    });
		}

		if (!req.params.id)
		{
			return res.status(400).json({ 
		        success: false, 
		        message: 'Bad Request.' 
		    });
		}

		MealEntry.findOne({_id: req.params.id}, function(err, entry) {
			if (err) throw err;

			if (!entry) {
				return res.status(201).json({ 
			        success: false, 
			        message: 'Not found.' 
			    });
			} else if (entry) {
				return res.status(200).json({ success: true, entry: entry });
			}
		});
	});
}
