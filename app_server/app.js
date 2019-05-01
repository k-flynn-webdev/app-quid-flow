"use strict";


const express = require('express');

const rateLimit = require("express-rate-limit");
const expressValidator = require('express-validator')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const path = require('path');
const fileUpload = require('express-fileupload');

const filter = require('content-filter');

// process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const config = require('./config/config.js');


var app = express();

// // for CORS 
app.use(function(req, res, next) {

	res.header("Access-Control-Allow-Headers", "Origin, Authorization, Content-Type, Accept");

	if( process.env.NODE_ENV === 'development' ){
//		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Expose-Headers", "Authorization, X-Another-Custom-Header");	
	}

	next();
});


app.use( rateLimit({ windowMs: config.rate.time, max: config.rate.max, message: { status: 429, message: "Too many requests." } }) );
app.use( expressValidator() )
app.use( bodyParser.urlencoded( { extended: true } ));
app.use( bodyParser.json() );
app.use( cookieParser() )
app.use( methodOverride('_method'));
app.use( fileUpload({ limits: { filesize: config.file.max_size },}));
app.use( filter());

app.set( 'json spaces', config.jsonSpaces );

// use morgan to log requests to the console
require( './log/log.js' ).init( app );

// ===================== Declare static folders ================ //
app.use( express.static( path.join(__dirname, 'public') ));

// ===================== DB SETUP ===================== //
let db = require( './controllers/db_connect.js' ).connect( config );

// ===================== ROUTE SETUP ===================== //
require('./routes')(app);

// ===================== SERVER START ===================== //
app.listen( config.port , function(){
	console.log( 
		'app.started: '
		+ "(" + process.env.NODE_ENV + ")" + " version: 0.0.1 " + '. server started. Address: ' + config.ip + ":" + config.port + '.' + '\n');
});

module.exports = app; // for testing