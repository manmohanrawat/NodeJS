var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/squadfree');

var db = mongoose.connection;

module.exports.saveContactUs = function(newUser, callback){
	db.collection("contactus").insertOne(newUser, function(err, result) {
		if (err) throw err;
		var data = {
			result: "success",
			message: "Your message has been sent. Thank you!"
		};
		return callback(data);
  });
}

module.exports.getContactUS = function(callback){
	db.collection("contactus").find({}).sort({date:-1}).toArray( function(err, result) {
		if (err) throw err;
		return callback(result);
	});
}

module.exports.getMessage = function(messageObjectID, callback){
	/* db.collection("contactus").findOne({ '_id':messageObjectID }, function(err, result){
		if(err) throw err;
		return callback(result);
	}); */
	db.collection('contactus').findAndModify(
		{'_id':messageObjectID},
		[['_id','asc']],
		{$set: {status: 1}},
		function(err, result) {
		  if (err){
			  if(err) throw err.message;
			  //console.warn(err.message);
		  }else{
			  return callback(result.value);
		  }
  });
}

module.exports.postMessage = function(data, callback){
	db.collection("contactus").updateOne({ _id: data.ObjectID }, {$set: data.FormData }, function(err, result) {
		if (err) throw err;
		var data = {
			result: "success",
			message: "Message update successfully!"
		};
		return callback(data);
	});
}

module.exports.removeMessage = function(messageObjectID, callback){
	db.collection("contactus").deleteOne({ _id: messageObjectID }, function(err, result) {
		if (err) throw err;
		var data = {
			result: "success",
			message: "Message deleted successfully!"
		};
		return callback(data);
	});
}
