
const m_user = require('../models/user.model.js');
const m_transaction = require('../models/transaction.model.js');
const status = require('../config/status_response.js');
const helpers = require('./helpers.js');
const transaction = require('./transaction.js');
const inputValidate = require('./input_validate.js');


function save( model, onExit ){
	model.save( function(error, result){
		if( error ){
			return onExit({ message : error.message });		
		}
		return onExit(null, model);
	});		
}



function tranInput( owner, input, next ){

	let inputLocal = {};
	inputLocal.owner = owner;

	if( !helpers.existsValid( input.amount ) ){
		return next('item missing amount.');	
	}

	if( !helpers.existsValid( input.type ) ){
		input.type = '';
	}

	if( !helpers.existsValid( input.note ) ){
		input.note = '';
	}

	if( !helpers.existsValid( input.date ) ){
		input.date = new Date();
	}	

	inputValidate.isNumber( input.amount, function(error, temp){
		if( error ){ 
			return next(error);				
		}
		inputLocal.amount = helpers.math_roundToDigit( temp );
	});

	inputValidate.isDate( input.date, function(error, temp){
		if( error ){ 
			return next(error);				
		}
		inputLocal.date = temp;
	});

	inputValidate.isTextBlock( input.note, function(error, temp){
		if( error ){ 
			return next(error);				
		}
		inputLocal.note = temp;
	});

	inputValidate.isTextBlock( input.type, function(error, temp){
		if( error ){ 
			return next(error);				
		}
		inputLocal.type = helpers.shorten( temp, 30, '..' );;
	});

	return next(null, inputLocal);				
}

function jsonInputCreate( id, input, outError, outSuccess){
	for (let count=0; count<input.length;count++){
		 tranInput( id, input[count], function(error, result){
		 	if( error ){
		 		outError.push( error );
		 	} else {
		 		outSuccess.push( result );
		 	}			 	
		 });
	}	
}


function importJson( token, request, routeOut ){

	let owner = '';

	if( helpers.existsValid( token ) ){
		if( token._id === undefined  || token._id.length < 20 ){
			return routeOut({ 
				status : status.client.input_error, 
				message : 'token appears broken.' 
			});
		}	
		owner = helpers.escape( token._id );
	}


	if( helpers.existsValid( request.files.jsonUpload ) ){

		if( request.files.jsonUpload.mimetype !== 'application/json' ){
			return routeOut({ 
				status : status.client.input_error, 
				message : 'file is not of json type.' 
			});
		}

		let jsonUpload = request.files.jsonUpload.data; 
		let jsonObject = '{}';

		try {
			jsonObject = JSON.parse(jsonUpload.toString('ascii'));
		} catch(error) {
			return routeOut({ 
				status : status.server.bad, 
				message : error.message, 
			});			
		}

		let errors = [];
		let tempInput = [];

		if( helpers.existsValid( jsonObject.transactions )){
			jsonInputCreate(owner, jsonObject.transactions, errors, tempInput );
		} else {
			jsonInputCreate(owner, jsonObject, errors, tempInput );
		}

		if( tempInput.length < 1){
			return routeOut({ 
				status : status.client.input_error, 
				message : 'no items found.' + '\nerrors found:' + errors.length,
			});			
		}

		let transactions = [];
		errors = []; // reset array

		for (let count=0; count<tempInput.length;count++){
			 transactions.push( createType( tempInput[count] ));
 		}

		if( transactions.length < 1){
			return routeOut({ 
				status : status.client.input_error, 
				message : 'no items created.' 
			});			
		}

		// add all to user 
		updateUser( owner, transactions, function(error, result){
			if( error ){
				return routeOut({ 
					status : status.client.input_error, 
					message : error.message, 
				});					
			}

			let messageObj = {};
	 		messageObj.status = status.success.created;
	 		messageObj.message = '';

	 		if(errors.length > 0 && transactions.length === 0){
	 			messageObj.status = status.client.input_error;
	 		}
	 		if( transactions.length > 0){
	 			messageObj.message += 'Created ' + transactions.length + ' items.'
	 		}
	 		if( errors.length > 0){
	 			messageObj.message += '\n.'
	 			messageObj.message += 'There was ' + errors.length + ' errors during creation.'
	 		}

			return routeOut(null,messageObj);	

		});

	} else {
		return routeOut({ 
			status : status.client.input_error, 
			message : 'no file found.' 
		});
	}
}
exports.importJson = importJson;





function updateUser( userID, transactions, routeOut ){
	m_user.findOne({ _id: userID } , function(error, userFound){

		if( error ){
			return routeOut({ message : error.message });
		}
		if( helpers.existsValid( userFound ) === false ){
			return routeOut({ 
				status : status.client.not_found, 
				message : 'owner not found.' 
			});
		}

		for(let count=0;count<transactions.length;count++){
			userFound.transactions.push( transactions[count]._id );
		}

		userFound.save( function(error, result){
			if( error ){
				return routeOut({ message : error.message });
			}			
			return routeOut(null,result);	
		});

	});
}


function createType( localInput ){
	
	let new_item = new m_transaction();
	
	new_item.owner = localInput.owner;
	new_item.amount = localInput.amount;
	new_item.date = localInput.date;
	new_item.note = localInput.note;
	new_item.type = localInput.type;
	new_item.save();

	return new_item;
}











