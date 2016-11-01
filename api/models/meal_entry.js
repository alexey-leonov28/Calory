var mongoose = require('mongoose');

module.exports = mongoose.model('MealEntry',{
    userID: String, // User._id

    date: String,
    time: String,

    description: String,
    num_of_calories: Number,

    status: Boolean
});
