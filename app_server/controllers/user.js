
const bcrypt = require('bcrypt');
const m_user = require('../models/user.model.js');
const status = require('../config/status_response.js');
const helpers = require('./helpers.js');
const config = require('../config/config.js');
const inputValidate = require('./input_validate.js');

let maxSize = Math.round(config.string.max_size / 2);


function save( model, onExit ){
	model.save( function(error, result){
		if( error ){
			return onExit({ message : error.message });		
		}
		return onExit(null, result);
	});		
}


function safeData( model ){
	let userSafe = { 
		id : model._id, 
		name : model.name, 
		email : model.email,  
	};
	return userSafe;
}
exports.safeData = safeData;


function create( input, next){
	userInput( input, createType, next );
}
exports.create = create;


function update( token, input, next){
	let inputVar = input;
	inputVar.token = token;
	userInput( inputVar, updateType, next );
}
exports.update = update;


function remove( token, input, next){
	let inputVar = input;
	inputVar.token = token;	
	userInput( inputVar, removeType, next );
}
exports.remove = remove;


function login( input, next){
	userInput( input, loginType, next );
}
exports.login = login;

function logout( token, next ){

	if( helpers.existsValid( token._id ) ){
		if( token._id === undefined || token._id.length < 20 ){
			return routeOut({ 
				status : status.client.input_error, 
				message : 'token appears broken.' 
			});
		}		
		token._id = helpers.escape( token._id );
	}

	m_user.findOne({ _id: helpers.escape( token._id ) } , function(error , userFound){

		if( error ){
			return routeOut({ message : error.message });
		}
		
		if( helpers.existsValid( userFound ) === false ){
			return next({ message : 'error finding user, please login.' });
		}

		userFound.login = new Date();
		userFound.active = false;
		save( userFound, next);
	});
}
exports.logout = logout;



function checkName(input, routeOut, next){
	if( helpers.existsValid( input.name ) ){
		inputValidate.isName( input.name, function(error, name){
			if( error ){ 
				return routeOut( error );				
			}
			input.name = name;
			input.hasName = true;
			return next(null,input);
		});
	} else {
		return next(null,input);
	}			
}
function checkEmail(input, routeOut, next){
	if( helpers.existsValid( input.email ) ){
		inputValidate.isEmail( input.email, function(error, email){
			if( error ){ 
				return routeOut( error );				
			}
			input.email = email;
			input.hasEmail = true;
			return next(null,input);
		});
	} else {
		return next(null,input);
	}			
}
function checkPassword(input, routeOut, next){
	if( helpers.existsValid( input.password ) ){
		inputValidate.isPassword( input.password, function(error, password){
			if( error ){ 
				return routeOut( error );				
			}
			input.password = password;
			input.hasPassword = true;
			return next(null,input);
		});
	} else {
		return next(null,input);
	}			
}


function userInput( input, userType, routeOut){

	input.hasName = false;
	input.hasEmail = false;
	input.hasPassword = false;

	if( helpers.existsValid( input.token ) ){
		if( input.token._id === undefined || input.token._id.length < 20 ){
			return routeOut({ 
				status : status.client.input_error, 
				message : 'token appears broken.' 
			});
		}		
		input.token._id = helpers.escape( input.token._id );
	}

	checkName(input, routeOut, function(error, result){
		if( error ){ 
			return routeOut( error );				
		}
		checkEmail(result, routeOut, function(error, result){
			if( error ){ 
				return routeOut( error );				
			}
			checkPassword(result, routeOut, function(error, result){
				if( error ){ 
					return routeOut( error );				
				}
				userType(result,routeOut);
			});
		});
	});
}

function createType( input, routeOut ){
	
	if( input.hasName && input.hasEmail && input.hasPassword ){

		// duplication check ..
		m_user.findOne({ email: input.email } , function(error , userFound){

			if( error ){
				return routeOut({ message : error.message });
			}
			if( helpers.existsValid( userFound ) ){
				return routeOut({ 
					status : status.client.input_error, 
					message : 'email already in use.' 
				});
			}
			
			bcrypt.hash( input.password, 10, function(error, hash){	
				if( error ){
					return routeOut({ message : error.message });
				}
				const newUser = new m_user({
					name : input.name , 
					email : input.email , 
					password : hash ,
					login : new Date(),
					active : true,
					transactions : [],
				});
				save( newUser, routeOut);
			});	
		});

	} else {

		return routeOut({ 
			status : status.client.input_error, 
			message : 'missing a name, email or password.'
		});		
	}
}

function updateType( input, routeOut ){

	if( input.hasName || input.hasEmail || input.hasPassword ){

		m_user.findOne({ _id: input.token._id } , function(error , userFound){

			if( error ){
				return routeOut({ message : error.message });
			}

			if( helpers.existsValid( userFound ) === false ){
				return routeOut({ 
					status : status.client.not_found, 
					message : error.message 
				});
			}

			if( input.hasName ){
				userFound.name = input.name;
			}
			if( input.hasEmail ){
				userFound.email = input.email;
			}
			if( input.hasPassword ){

				bcrypt.hash( input.password, 10, function(error, hash){	
					if( error ){
						return routeOut({ message : error.message });
					}
					userFound.password = hash;
					save( userFound, routeOut );
				});

			} else {
				save( userFound, routeOut);
			}	
		});

	} else {

		return routeOut({ 
			status : status.client.input_error, 
			message : 'missing a name, email or password.'
		});		
	}
}

function removeType( input, routeOut ){

	if( helpers.existsValid( input.token ) ){

		m_user.findByIdAndRemove({ _id: input.token._id } , function(error , userFound){
			if( error ){
				return routeOut({ message : error.message });
			}

			return routeOut(null, userFound);
		});

	} else {
		return routeOut({ 
			status : status.client.input_error, 
			message : 'User currently not logged in.', 
		});		
	}
}


function loginType( input, routeOut ){

	if( input.hasEmail && input.hasPassword ){

		m_user.findOne({ email: input.email } , function(error , userFound){

			if( error ){
				return routeOut({ message : error.message });
			}

			if( helpers.existsValid( userFound ) === false ){
				return routeOut({ 
					status : status.client.not_found, 
					message : 'error finding user', 
				});
			}

			bcrypt.compare( input.password, userFound.password, function(error, result){	

				if( error ){
					return routeOut({ 
						status : status.client.input_error, 
						message : 'password or email mis-match.',
					});						
				}

				if( result ){
					userFound.login = new Date();
					userFound.active = true;
					save( userFound, routeOut);			
				} else {
					return routeOut({ 
						status : status.client.input_error, 
						message : 'password or email mis-match.',
					});					
				}

			});
		});		

	} else {

		return routeOut({ 
			status : status.client.input_error, 
			message : 'missing correct email and password to login.'
		});	
	}
}











