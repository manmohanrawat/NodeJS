var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var expressValidator = require("express-validator");
var session = require("express-session");
var flash = require("connect-flash");
var exphbs = require("express-handlebars");
var autoIncrement = require("mongodb-autoincrement");

var routes = require("./routes/index");
var admin = require("./routes/admin");

// init app
var app = express();

// view Engine
app.set("views", path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'index'}));
app.set('view engine','handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

// Routes
app.use("/",routes);
app.use("/admin",admin);

// Set Port
app.set("port", (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('server started on port '+app.get('port'));
});
