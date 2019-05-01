const mongoose = require('mongoose');
const helpers = require('../controllers/helpers.js');

var transaction = mongoose.Schema({
	owner : { type: mongoose.Schema.Types.ObjectId, required: true },
	amount : { type: Number, required: true },
	type : { type: String, required: true },
	sign : { type: Number, required: false },
	note : { type: String, required: false },
	date : { type: Date, required: true },
})

module.exports = mongoose.model('Transaction', transaction);



function preSaveFunc( object ){
	object.sign = 0;
	let typeSafe = false;

	if( object.type.indexOf('--') >= 0 ){
		object.sign = -1;
		typeSafe = true;
	} 
	if( object.type.indexOf('++') >= 0 ){
		object.sign = 1;
		typeSafe = true;
	} 

	// problem with type so overriding..
	if(!typeSafe){
		object.sign = -1;
		object.type = '--';
	}

	object.amount = Math.abs(object.amount);

	if(object.amount > 100000){
		object.amount = 999999.99;
	}
	
	return object;
}
exports.preSaveFunc = preSaveFunc;

transaction.pre('save', function (next) {
	preSaveFunc(this);
	next();
});
transaction.pre('update', function (next) {
	preSaveFunc(this);	
	next();
});