const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
let morganType = ':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms';

function init( app ) {
	if( process.env.NODE_ENV === 'test' ){
		return;
	}			
	app.use( morgan( morganType , { stream: accessLogStream }));
	app.use( morgan( morganType ));
}
exports.init = init;

function add( itemToLog ){
	if( process.env.NODE_ENV === 'test' ){
		return;
	}
	if( itemToLog.message !== undefined ){
		itemToLog = itemToLog.message;
	}
	accessLogStream.write( itemToLog + '\n' );
	
}
exports.add = add;
