var express = require('express');
var MealEntry = require('./models/meal_entry.js');
var User = require('./models/user');

module.exports.updateAvailability = function() {

	var updateEntryStatus = function(entry)
	{
		User.findOne({_id: entry.userID}, function(err, user) {
			if (err) throw err;

			if (user) {
				MealEntry.find({userID: entry.userID, date: entry.date}, function(err, entrylist) {
					if (err) throw err;

					var total_cals = 0, status;
					
					for (var i = 0; i < entrylist.length; i ++)
					{
						total_cals += entrylist[i].num_of_calories;
					}

					status = (total_cals < user.expected_calories_day);
					entry.status = status;
					
					entry.save();
				});
			}
		});
	}

	MealEntry.find({}, function(err, entrylist) {
		if (err) throw err;

		for (var i = 0; i < entrylist.length; i ++)
		{
			updateEntryStatus(entrylist[i]);
		}
	});
};
