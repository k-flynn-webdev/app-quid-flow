
const m_user = require('../models/user.model.js');
const m_transaction = require('../models/transaction.model.js');
const status = require('../config/status_response.js');
const helpers = require('./helpers.js');
const inputValidate = require('./input_validate.js');


function save( model, onExit ){
	model.save( function(error, result){
		if( error ){
			return onExit({ message : error.message });		
		}
		return onExit(null, model);
	});		
}

function safeData( model ){

	// // year check?!?!
	let yearsDiff = 0;
	let todaysYear = new Date().getFullYear();
	let modelsYear = new Date( model.date ).getFullYear();
	if( todaysYear !== modelsYear ){
		yearsDiff = todaysYear - modelsYear;
	}

	let todayInt = helpers.date_to_Int( new Date() );
	let dateInt = helpers.date_to_Int( model.date );
	let dateDay = todayInt - dateInt;

	let thisMonthInt = new Date().getMonth();
	let itemMonthInt = new Date( model.date ).getMonth();

	let dateMonth = (thisMonthInt - itemMonthInt);

	dateDay += ( 365 * yearsDiff );
	dateMonth += ( 12 * yearsDiff );

	let safeExport = { 
		id : model._id, 
		owner : model.owner, 
		date : model.date, 
		date_day : dateDay,
		date_month : dateMonth,
		amount : model.amount, 
		type : model.type, 
		note : model.note, 
		sign : model.sign,
	};

	return safeExport;
}
exports.safeData = safeData;

// TODO could export with a day and month integar for speedier client side?


// { status: 201,
//   message: 'success new item created.',
//   data: 
//    { _id: '5c0ff3cfd0f4a618b3756327',
//      owner: '5c0ff3ced0f4a618b3756325',
//      date: '2018-12-11T17:28:45.756Z',
//      note: 'testing a note111.',
//      amount: 999.99,
//      type: '++',
//      sign: 1,
//      __v: 0 } }


function create( token, input, next){
	let inputVar = input;
	inputVar.token = token;	
	tranInput( inputVar, createType, next );
}
exports.create = create;


function update( token, input, next){
	let inputVar = input;
	inputVar.itemID = input._id;
	inputVar.token = token;
	tranInput( inputVar, updateType, next );
}
exports.update = update;

function remove( token, input, next){
	let inputVar = input;
	inputVar.token = token;		

	if( helpers.existsValid( input._id ) ){
		if( input._id === undefined || input._id.length < 20  ){
			return next({ 
				status : status.client.input_error, 
				message : 'ID appears broken.' 
			});
		}	
		inputVar.itemID = helpers.escape( input._id );
	}

	m_transaction.findByIdAndRemove({ _id: inputVar.itemID } , function(error , itemFound){
		if( error ){
			return next({ message : error.message });		
		}

		if( helpers.existsValid( itemFound ) === false ){
			return next({ 
				status : status.client.not_found, 
				message : 'item not found.' 
			});
		}

		m_user.findOne({ _id: itemFound.owner } , function(error , userFound){
			if( error ){
				return next({ message : error.message });		
			}

			if( helpers.existsValid( userFound ) === false ){
				return next({ 
					status : status.client.not_found, 
					message : 'user not found.' 
				});
			}

			helpers.array_removeOne( userFound.transactions, itemFound._id );
			save( userFound, function( error, result){
				
				if( error ){
					return next({ message : error.message });
				}

				return next(null, itemFound);			

			});
		});
	});
}
exports.remove = remove;

function getRange( token, start, end, routeOut ){

	let hasStart = false;
	let hasEnd = false;
	let inputLocal = {};

	let returnItem = {};
	let transactions = [];

	inputLocal._id = helpers.escape( token._id );

	if( helpers.existsValid( start )){
		inputValidate.isDate( start, function(error, temp){
			if( error ){ 
				return routeOut( error );				
			}
			inputLocal.start = temp;
			hasStart = true;
		});
	}

	if( helpers.existsValid( end )){
		inputValidate.isDate( end, function(error, temp){
			if( error ){ 
				return routeOut( error );				
			}
			inputLocal.end = temp;
			hasEnd = true;
		});
	}

	if( hasStart && hasEnd ){

		let dayLength = Math.abs( helpers.date_to_Int( inputLocal.start ) - helpers.date_to_Int( inputLocal.end ) );
		let searchParams = {};
		searchParams['owner'] = inputLocal._id;
		searchParams['date'] = { $gte : inputLocal.start , $lt : inputLocal.end };

		m_transaction.find(searchParams).sort([['date', -1]]).exec(function(error, result ) {

			if( error ){
				return routeOut({ message : error.message });
			}

			if( helpers.existsValid( result ) === false || result.length === 0 ){
				return routeOut({ 
					status : status.client.not_found, 
					message : 'no items found.' 
				});
			}			
			for (let i=0;i<result.length;i++) {
				transactions.push( safeData( result[i] ));
			}

			returnItem.items = transactions;

			return routeOut( null, returnItem );	

		});

	} else {

		return routeOut({ 
			status : status.client.input_error, 
			message : 'transaction missing a start and end date.'
		});			
	}
}
exports.getRange = getRange;



function tranInput( input, tranType, routeOut){

	let hasAmount = false;
	let hasDate = false;
	let hasNote = false;
	let hasType = false;
	let inputLocal = {};

	if( helpers.existsValid( input.token ) ){
		if( input.token._id === undefined  || input.token._id.length < 20 ){
			return routeOut({ 
				status : status.client.input_error, 
				message : 'token appears broken.' 
			});
		}	
		inputLocal.token = input.token;
		inputLocal.token._id = helpers.escape( inputLocal.token._id );
	}

	if( helpers.existsValid( input.itemID ) ){
		if( input.itemID === undefined || input.itemID.length < 20 ){
			return routeOut({ 
				status : status.client.input_error, 
				message : 'ID appears broken.' 
			});
		}	
		inputLocal.itemID = helpers.escape( input.itemID );
	}

	if( helpers.existsValid( input.amount ) ){
		inputValidate.isNumber( input.amount, function(error, temp){
			if( error ){ 
				return routeOut( error );				
			}
			inputLocal.amount = helpers.math_roundToDigit( temp );
			hasAmount = true;
		});
	}	

	if( helpers.existsValid( input.date ) ){
		inputValidate.isDate( input.date, function(error, temp){
			if( error ){ 
				return routeOut( error );				
			}
			inputLocal.date = temp;
			hasDate = true;
		});
	}

	if( helpers.existsValid( input.note ) ){
		inputValidate.isTextBlock( input.note, function(error, temp){
			if( error ){ 
				return routeOut( error );				
			}
			inputLocal.note = temp;
			hasNote = true;
		});
	}

	if( helpers.existsValid( input.type ) ){
		inputValidate.isTextBlock( input.type, function(error, temp){
			if( error ){ 
				return routeOut( error );				
			}
			inputLocal.type = helpers.shorten( temp, 30, '..' );;
			hasType = true;
		});
	}

	tranType(hasAmount,hasDate,hasNote,hasType,inputLocal,routeOut);
}

function createType( hasAmount,hasDate,hasNote,hasType,localInput,routeOut ){
	
	if( hasAmount ){

		if(hasType === false){
			localInput.type = '--';
			hasType = true;
		}

		if(hasDate === false){
			localInput.date = new Date();
			hasDate = true;
		}

		if(hasNote === false){
			localInput.note = '';
			hasNote = true;
		}

		let new_item = new m_transaction();
	
		new_item.owner = localInput.token._id;
		new_item.amount = localInput.amount;
		new_item.date = localInput.date;
		new_item.note = localInput.note;
		new_item.type = localInput.type;

		m_user.findOne({ _id: new_item.owner } , function(error, userFound){

			if( error ){
				return routeOut({ message : error.message });
			}
			if( helpers.existsValid( userFound ) === false ){
				return routeOut({ 
					status : status.client.not_found, 
					message : 'owner not found.' 
				});
			}
			
			userFound.transactions.push( new_item._id );
			save( userFound, function(error, userResult){
				if( error ){
					return routeOut({ message : error.message });
				}
				save( new_item, routeOut);
			});
		});

	} else {

		return routeOut({ 
			status : status.client.input_error, 
			message : 'transaction missing a amount and type.'
		});		
	}
}

function updateType( hasAmount,hasDate,hasNote,hasType,localInput,routeOut ){
	
	if( hasAmount || hasDate|| hasNote|| hasType ){

		m_transaction.findOne({ _id: localInput.itemID } , function(error, itemFound){

			if( error ){
				return routeOut({ message : error.message });
			}

			if( helpers.existsValid( itemFound ) === false ){
				return routeOut({ 
					status : status.client.not_found, 
					message : 'item not found.' 
				});
			}

			if( hasAmount ){
				itemFound.amount = localInput.amount;
			}
			if( hasDate ){
				itemFound.date = localInput.date;
			}
			if( hasNote ){
				itemFound.note = localInput.note;
			}
			if( hasType ){
				itemFound.type = localInput.type;
			}											

			save( itemFound, routeOut);

		});

	} else {

		return routeOut({ 
			status : status.client.input_error, 
			message : 'transaction missing elements.'
		});		
	}
}









