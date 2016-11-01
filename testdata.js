var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');
var async = require('async');
var User = require('./api/models/user.js');
var changeCase = require("change-case");
var dbConfig = require('./db');

// Generates hash using bCrypt
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

mongoose.connect(dbConfig.url, function (err, db) {

	// admin
	var newUser = new User({email: "tom.paul@yahoo.com", password: createHash("apple"), 
							username: "tom.paul", firstname: "Tom", lastname: "Paul",
							expected_calories_day: 70, role: 1, status: true});

	newUser.save(function(err) {
		if (err) return done(err);
		console.log("Admin created!");
	});

	// user manager
	newUser = new User({email: "jerry.kowal@yahoo.com", password: createHash("apple"), 
							username: "jerry.kowal", firstname: "Jerry", lastname: "Kowalewski",
							expected_calories_day: 95, role: 2, status: true}); 

	newUser.save(function(err) {
		if (err) return done(err);
		console.log("User manager created!");
	});

	// regular users
	newUser = new User({email: "young.yu@gmail.com", password: createHash("apple"), 
							username: "young.yu", firstname: "Young", lastname: "Yu",
							expected_calories_day: 45, role: 3, status: true}); 
	
	newUser.save(function(err) {
		if (err) return done(err);
		console.log("Regular user created!");
	});

	newUser = new User({email: "ramon.shin@gmail.com", password: createHash("apple"), 
							username: "ramon.shin", firstname: "Ramon", lastname: "Shin",
							expected_calories_day: 55, role: 3, status: true}); 

	newUser.save(function(err) {
		if (err) return done(err);
		console.log("Regular user created!");
	});
});