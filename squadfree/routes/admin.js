var express = require("express");
var router = express.Router();
var url = require('url') ;
var session = require('express-session');
var cookieParser = require("cookie-parser");
var exphbs = require("express-handlebars");

var Admins = require('../models/admins');
var Contactus = require('../models/contactus');
var mongo = require("mongodb");
var mongoose = require("mongoose");

var app = express();
app.use(cookieParser());

// Equal to Condition
var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        foo: function () { return 'FOO!'; },
        bar: function () { return 'BAR!'; }
    }
});
hbs.handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

// Get Login Page
router.get("/", function(req, res){
	if (req.session && req.session.username){
		res.redirect('/admin/dashboard');
	}else{
		var Cookies = ParseCookie(req.headers.cookie);
		var hostname = req.headers.host;
		var base_url = ('http://' + hostname);
		res.render('admin/login',{ title: 'SQUADFREE | Login', base_url:base_url, layout:'adminlogin', Cookies:Cookies});
	}
	
});

// Get Register Page
router.get("/register", function(req, res){
	if (req.session && req.session.username){
		res.redirect('/admin/dashboard');
	}else{
		var hostname = req.headers.host;
		var base_url = ('http://' + hostname);
		res.render('admin/register',{ title: 'SQUADFREE | Register', base_url:base_url, layout:'adminlogin'});
	}
	
});

// Get Admin Dashboard 
router.get("/dashboard", function(req, res){
	if (req.session && req.session.username){
		var hostname = req.headers.host;
		var base_url = ('http://' + hostname);
		var admindata = {username: req.session.username, email: req.session.email};
		res.render('admin/dashboard',{ title: 'SQUADFREE | Dashboard', base_url:base_url, layout:'admindashboard', admindata:admindata});
	}else{
		res.redirect('/admin');
	}
	
});

// Logout Session
router.get("/logout", function(req, res){
	if (req.session && req.session.username){
		req.session.destroy();
		res.redirect('/admin');
	}else{
		res.redirect('/admin');
	}
});

// Contact US Details
router.get("/contactus", function(req, res){
	if (req.session && req.session.username){   
		Contactus.getContactUS(function(result){
			var hostname = req.headers.host;
			var base_url = ('http://' + hostname);
			var admindata = {username: req.session.username, email: req.session.email};
			res.render('admin/contactus',{
				title: 'SQUADFREE | Contact US',
				base_url: base_url,
				layout: 'admindashboard',
				admindata: admindata,
				ContactUS: result,
				MenuActive: "active"
			});
		});
	}else{
		res.redirect('/admin');
	}  
});

// View Contact US Message
router.get("/viewMessage/:ObjectID", function(req, res){
	if (req.session && req.session.username){
		var o_id = new mongo.ObjectID(req.params.ObjectID);
		Contactus.getMessage(o_id, function(result){
			var hostname = req.headers.host;
			var base_url = ('http://' + hostname);
			var admindata = {username: req.session.username, email: req.session.email};
			res.render('admin/viewmessage',{
				title: 'SQUADFREE | View Message',
				base_url: base_url,
				layout: 'admindashboard',
				admindata: admindata,
				Message: result,
				MenuActive: "active"
			});
		});
	}else{
		res.redirect('/admin');
	}
	
});

// Update Contact us Message
router.post("/viewMessage/:ObjectID", function(req, res){
	if (req.session && req.session.username){
		var o_id = new mongo.ObjectID(req.params.ObjectID);
		var updateField = {
			ObjectID: o_id,
			FormData: req.body
		};
		Contactus.postMessage(updateField, function(result){
			req.flash('success_msg', result.message);
			res.redirect("/admin/viewMessage/"+req.params.ObjectID);
		});
	}else{
		res.redirect('/admin');
	}
});

// Remove Message
router.get("/removeMessage/:ObjectID", function(req, res){
	if (req.session && req.session.username){   
		var o_id = new mongo.ObjectID(req.params.ObjectID);
		Contactus.removeMessage(o_id, function(result){
			req.flash('success_msg', result.message);
			res.redirect("/admin/contactus");
		});
	}else{
		res.redirect('/admin');
	}
});

// Post Login Data
router.post("/", function(req, res){
	var AdminUser = {
		username: req.body.username,
		password: req.body.password
	};
	Admins.getAdmins(AdminUser, function(result){
		if(result){
			req.session.username = result.username;
			req.session.email = result.email;
			// Create Cookie 
			if(req.body.remember){
				res.cookie('username',req.body.username, { maxAge: 900000, httpOnly: true });
				res.cookie('password',req.body.password, { maxAge: 900000, httpOnly: true });
			}
			res.redirect('/admin/dashboard');
		}else{
			var hostname = req.headers.host;
			var base_url = ('http://' + hostname);
			var result = {result: 'error', error_msg: 'Invalid email or password!'};
			res.render('admin/login',{
				title: 'SQUADFREE | Admin Login',
				base_url:base_url,
				layout:'adminlogin',
				result: result
			});
		}
	});
});

// Notification URL
router.get("/notification", function(req, res){
	Admins.getNotification(function(result){
		res.end(JSON.stringify(result));
	});
	
});

function ParseCookie(rc){
	var list = {};

	rc && rc.split(';').forEach(function( cookie ) {
		var parts = cookie.split('=');
		list[parts.shift().trim()] = decodeURI(parts.join('='));
	});
	return list;
}

module.exports = router;