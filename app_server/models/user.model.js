const mongoose = require('mongoose');
const helpers = require('../controllers/helpers.js');

var user = mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	created: { type: Date, required: true, default : new Date() },
	login: { type: Date, required: true },	
	active: { type: Boolean, required: true },	
	transactions: { type: Array, required: true },	
})

module.exports = mongoose.model('User', user);



function preSaveFunc( object ){
	object.name = helpers.shorten( object.name, 100);
	object.email = helpers.shorten( object.email, 100);
	return object;
}
exports.preSaveFunc = preSaveFunc;

user.pre('save', function (next) {
	preSaveFunc(this);
	next();
});
user.pre('update', function (next) {
	preSaveFunc(this);	
	next();
});