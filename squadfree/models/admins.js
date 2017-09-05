var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/squadfree');

var db = mongoose.connection;

// Use Schema
var AdminSchema = mongoose.Schema({
	username: {
		type: String
	},
	email: {
		type: String
	},
	password: {
		type: String
	}
});

module.exports.getAdmins = function (AdminUser, callback){
	db.collection("admins").findOne({username: AdminUser.username, password: AdminUser.password}, function(err, result) {
		if (err) throw err;
		return callback(result);
	});	
}

module.exports.getNotification = function(callback){
	db.collection("contactus").find({status: 0}).toArray(function(err, result) {
		if (err) throw err;
		return callback(result);
	});	
}