
const status = require('../config/status_response.js');
const helpers = require('./helpers.js');
const config = require('../config/config.js');


let nameSize = 60;
let emailSize = 100;
let textSize = 150;

function isNumber( input, next){
	local = helpers.escape( input );
	local = Number( local );
	if( isNaN(local) ){
		return next({ 
			status : status.client.input_error, 
			message : 'Expected a number.' 
		});
	}
	return next(null, local);
}
exports.isNumber = isNumber;

function isDate( input, next){
	local = helpers.escape( input );
	local = new Date( local );
	if( local == 'Invalid Date' || isNaN(local.valueOf()) ){
		return next({ 
			status : status.client.input_error, 
			message : 'Expected a date.' 
		});
	}
	return next(null, local);
}
exports.isDate = isDate;

function isTextBlock( input, next){
	local = helpers.shorten( input, textSize, '..' );
	local = helpers.escape( local );
	local = helpers.sanitize( local );
	return next(null, local);
}
exports.isTextBlock = isTextBlock;

function isName( input, next){
	let local = helpers.escape( input );
	if( local.length <= 2 ){ 
		return next({ 
			status : status.client.input_error, 
			message : 'Name too short, try something longer (' + 2 + ').' 
		});
	}
	if( local.length > nameSize ){ 
		return next({ 
			status : status.client.input_error, 
			message : 'Name too long, try something shorter (' + nameSize.toString() + ').' 
		});
	}	
	return next(null, local);
}
exports.isName = isName;

function isEmail( input, next){
	let local = helpers.escape( input ).toLowerCase();
	if( local.length <= 6){ 
		return next({ 
			status : status.client.input_error, 
			message : 'Email appears too short.' 
		});
	}
	if( local.indexOf('@') === -1 ){
		return next({ 
			status : status.client.input_error, 
			message : 'Email not valid, missing @.' 
		});
	}
	if( local.indexOf('.') === -1 ){
		return next({ 
			status : status.client.input_error, 
			message : 'Email not valid.' 
		});
	}
	if( local.length > emailSize ){ 
		return next({ 
			status : status.client.input_error, 
			message : 'Email is very long, try something shorter (' + emailSize.toString() + ').' 
		});
	}
	return next(null, local);	
}
exports.isEmail = isEmail;

function isPassword( input, next){
	let local = input;
	if( local.length < 5 ){ 
		return next({ 
			status : status.client.input_error, 
			message : 'Password too short, try something longer (' + config.string.min_size.toString() + ').' 
		});
	}
	local = helpers.shorten( local, config.string.max_size );
	local = helpers.sanitize( local );
	local = helpers.escape( local );
	return next(null, local);
}
exports.isPassword = isPassword;



