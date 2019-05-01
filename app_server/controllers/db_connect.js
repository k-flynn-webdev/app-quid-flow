const mongoose = require('mongoose');

connect = function( config ){
	console.log('initilizing: db.');

	var console_error=[]; var db;
	db = mongoose.connect( config.db , function( error ){
		if ( error ){ console.error( 'Error: db connecting error._' + error ); console_error.push(error); }
	});
	mongoose.connection.on( 'error' , function( error ){
		if ( error ){ console.error( 'Error: db connection error._' + error ); console_error.push(error); }
	});
	mongoose.connection.on( 'disconnected' , function(){
		console.log( 'Error: db disconnected/closed: ' + config.db + '._');
	});
	mongoose.connection.on( 'connected' , function(){
		if( process.env.NODE_ENV !== 'test' ){
			console.log( 'Success: db connected: ' + config.db );
		}
		return db;
	});

}

module.exports.connect = connect;


function find( modelType, query ){

}
module.exports.find = find;

function save( model ){

}
module.exports.save = save;

