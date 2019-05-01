
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const m_token = require('../models/token.model.js');
const status = require('../config/status_response.js');
var logger = require( '../log/log.js' );


let tokenBlackList = [];

function create( input ){
	let payload =  { _id : input._id, name : input.name, email : input.email, login: input.login, active : input.active };
	const JWTToken = jwt.sign( payload, config.token.secret, { expiresIn : config.token.expiry } );
	return JWTToken;
}
exports.create = create;
 

function getTokenInPage(request){
	let token = request.raw || request.body.token || request.query.token || request.headers['access-token'] || request.headers['Authorization'] || request.headers['authorization'];

	if( token ){
		var bearer = 'Bearer'; 
		var hasBearer = token.indexOf( bearer );

		if( hasBearer !== -1){ // is present
			let temp = token.split(bearer);
			token = temp[1].trim();
		}		
		return token;
	} else {
		return false;
	}
}


function check( request, response, next ){


	let token = getTokenInPage( request );

	if( token ){

		if ( tokenBlackList_Check( token ) ){

			jwt.verify( token, config.token.secret, function(error, decoded ){

				if(error){

					if( error.name === 'TokenExpiredError' ){
						return response.status(status.client.unauthorized).json({ 
							status : status.client.unauthorized, 
							message : 'token expired, please re-login.'
						});
					}

					return response.status(status.client.unauthorized).json({ 
						status : status.client.unauthorized, 
						message : 'token invalid.'
					});
				}

				request.decoded = decoded;
				request.decoded.raw = token;
				next(); // success 

			});
		} else {

			return response.status(status.client.unauthorized).json({ 
				status : status.client.unauthorized, 
				message : 'token denied.' 
			});
		}
	} else {

		return response.status(status.client.unauthorized).json({ 
			status : status.client.unauthorized, 
			message : 'token missing.' 
		});
	}
}
exports.check = check;


function update( input, payload ){
	// const JWTToken = jwt.sign( { _id : input._id, email : input.email }, config.token.secret, { expiresIn : config.token.expiry } );
	// return JWTToken;
}
exports.update = update;


function remove( request, response, next ){

	let token = getTokenInPage( request );

	if( token ){

		userID = jwt.decode(token)._id;

		// duplication check ..
		m_token.findOne({ token_string: token } , function(error , tokenFound){
			
			if( error ){
				return next( { message : error.message } );
			}
			if( tokenFound !== null ){
				return next(null, { message : 'token revoked.' , _id : userID });
			}

			newToken = new m_token( { token_string : token });
			newToken.save( function(error, result){
				if( error ){
					return next( { message : error.message } );
				}
				tokenBlackList_Update();
				return next(null, { message : 'token revoked.' , _id : userID });
			});
		});

	} else {
		return next( { message : 'no token recieved.' } );
	}
	// token added to a blacklist on server, 
	// list checked daily ..? TODO for now its when someone logs out.
	// removed on natural expiry
}
exports.remove = remove;

// TODO this will be accessable from a route for auto triggering by admin?  
function tokenBlackList_Update(){
	tokenBlackList_RemoveExpired( function(){
		tokenBlackList = tokenBlackList_ReadToMemory();
	});	
}
exports.tokenBlackList_Update = tokenBlackList_Update;

function tokenBlackList_Check( tokenString ){
	for (let count=0;count<tokenBlackList.length;count++){
		if( tokenString === tokenBlackList[count] ){
			return false; // token is not allowed!
		}
	}
	return true;
}


function tokenBlackList_ReadToMemory(){
	// console.log('populating denied tokens to memory.');
	let tokenArray = [];
	m_token.find( function(error, allTokens ){
		if( error ){
			logger.add( 'error reading into tokenblacklist.' );
			console.log('error reading into tokenblacklist.');
		}
		for (let count=0;count<allTokens.length;count++){
			tokenArray.push( allTokens[count].token_string );
		}
	});
	return tokenArray;
}

function tokenBlackList_RemoveExpired( next ){
	m_token.find( function(error, allTokens ){
		if( error ){
			console.log('error cleaning tokenblacklist.');
			logger.add( error.message );
			next();
		}

		let expiredTokens = [];

		for (let count=0;count<allTokens.length;count++){
			let token = allTokens[count];
			jwt.verify( token.token_string, config.token.secret, function(error, decoded ){
				if( error ){ // probably expired?!
					expiredTokens.push( token._id );
				}
			});
		}

		m_token.remove({ _id: { $in: expiredTokens } }, function(error, result ) {
			if(error){
				console.log( error.message );
				logger.add( error.message );
			}	
			if( expiredTokens.length ){
				logger.add( 'tokens on blacklist expired:' );
				console.log('tokens on blacklist expired:');
				for (let count=0;count<result.length;count++){
					logger.add( result[count].token_string );
					console.log(result[count].token_string);
				}
			}
			
			next();
		});
	});
}


// init here on server load/restart ..
tokenBlackList_Update();


