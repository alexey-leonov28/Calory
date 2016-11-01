var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    email: String,
    password: String,

    username: String,
    firstname: String,
    lastname: String,

    // Number of calories per day
    expected_calories_day: Number, 

    // admin(1), user manager(2), regular user(3)
    role: Number, 
    status: Boolean
});
