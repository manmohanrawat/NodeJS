var express = require("express");
var router = express.Router();
var Contactus = require('../models/contactus');
var mongo = require("mongodb");
var mongoose = require("mongoose");
var url = require('url') ;
var autoIncrement = require("mongodb-autoincrement");

// Get Home Page
router.get("/", function(req, res){
	var hostname = req.headers.host; // hostname = 'localhost:8080'
	var base_url = ('http://' + hostname);
	res.render('index',{ title: 'SQUAD FREE', base_url:base_url});
});

// Get AJAX Data
router.post("/", function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var subject = req.body.subject;
	var message = req.body.message; 
	
	// Form validation
	req.checkBody("name","Name is required").notEmpty();
	req.checkBody("email","Email is required").notEmpty();
	req.checkBody("email","Email not valid").isEmail();
	req.checkBody("subject","Subject is required").notEmpty();
	
	var errors = req.validationErrors();
	if(errors){
		var result = {
			result:'error',
			errors: errors
		};	
	}else{
		var date = new Date().toISOString().
					replace(/T/, ' ').      // replace T with a space
					replace(/\..+/, '') ; 
		var newUser = {
			name: name,
			email: email,
			subject: subject,
			message: message,
			status: 0,
			date: date
		}; 
		Contactus.saveContactUs(newUser, function(user){
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.end(JSON.stringify(user));
		});
	} 
});

module.exports = router; 