const token = require('../controllers/token.js');
const path = require('path');
const status = require('../config/status_response.js');
const { check, validationResult } = require('express-validator/check');
var logger = require( '../log/log.js' );

// generic paths 
module.exports = function( App ) {

	// App.get('/', function(request, response){
	// 	// console.log('Cookies: ', request.cookies); for future use ..
	// 	response.status(status.success.ok).sendFile( path.join(__dirname, '..', 'public', 'index.html' ));	
	// });


	App.get('/hidden', token.check, function(request, response ){
		response.status(status.success.accepted).json({ 
			status : status.success.accepted, 
			message : 'success your token worked.' , 
			token : request.decoded  
		});
	});


	App.get('/*', function(request, response){
		response.status(status.success.ok).sendFile( path.join(__dirname, '..', 'public', 'index.html' ));
	});



}


