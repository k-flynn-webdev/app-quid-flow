// ===================== INCLUDES ================= //

// ===================== MODELS =================== //

// ===================== ADDITIONAL  ============== //
const sanitizer = require('sanitizer');

function sanitize( input ){
	return sanitizer.sanitize(input);
}
exports.sanitize = sanitize;

function escape( input ){
	return sanitizer.escape(input);
}
exports.escape = escape;

function shorten( input, to, replace = ''){
	if(input.length > to - replace.length){
		return input = input.substring(0,(to-replace.length)) + replace;
	}
	return input;
}
exports.shorten = shorten;


var JSON_encode = function( input ){ var tempString = encodeURIComponent( JSON.stringify( input ) ); return tempString; }
exports.JSON_encode = JSON_encode;

var JSON_decode = function( input ){ var tempObject = JSON.parse( decodeURIComponent( input ) ); return tempObject; }
exports.JSON_decode = JSON_decode;


function existsValidator(value) {
	if( value === undefined ){ return false; } else { return true; }
}
function existsValidatorCheckNull(value) {
	if( value == null ){ return false; } else { return true; }
}
function existsValid( input ){
	if ( existsValidator( input ) && existsValidatorCheckNull( input ) ){
		return true;
	}
	return false;
}
exports.existsValid = existsValid;



function isNumber(input){
	let tempNum = input;
	if( tempNum === '' ){ tempNum = 1;}
	if( tempNum === null ){ tempNum = 1;}
	if( tempNum === undefined ){ tempNum = 1;}
	return tempNum;
}
module.exports.isNumber = isNumber;

function isOddEven(input){
	if( input % 2 == 0){ return true; } 
	else { return false; }
}
module.exports.isOddEven = isOddEven;

function isArray(input){
	if( toString.call( input ) === '[object Array]' ){ return true;	} 
	else { return false; }	
}
module.exports.isArray = isArray;

function inverseLerp( input, min, max ){
	return ( (input - min) * 100) / (max - min);
}


function array_indexWrap( index, array){

	let arrayLength = array.length;
	let tempIndex = index;
	let remainder = (tempIndex % arrayLength);
	if( remainder < 0){
		tempIndex = arrayLength - Math.abs(remainder);
	}

	return tempIndex;
}
module.exports.array_indexWrap = array_indexWrap;


function array_removeAll(arrObj, item){
	for (let i = arrObj.length;i >=0;i--){
		if (arrObj[i] == item) {
			arrObj.splice(i, 1);
		}
	}
	return arrObj;
}
module.exports.array_removeAll = array_removeAll;


function array_removeOne(arrObj, item){
	for (let i = arrObj.length;i >=0;i--){
		if (arrObj[i] == item) {
			arrObj.splice(i, 1); break;
		}
	}
	return arrObj;	
}
module.exports.array_removeOne = array_removeOne;


function array_removeMulti(arrObj, items){
	for (let count=0;count<items.length;count++){
		arrObj = ArrayRemoveOne( arrObj, items[count] );
	}
	return arrObj;	
}
module.exports.array_removeMulti = array_removeMulti;



var math_lerp = function ( start , goal , amount ) { return ( 1 - amount ) * start + amount * goal; }
exports.math_lerp = math_lerp;

function math_roundToDigit( num, digit = 2 ) { 
	return +( Math.round( Number(num) + 'e+' + digit )  + 'e-' + digit ); 
}
exports.math_roundToDigit = math_roundToDigit;

var math_max = function( array ){
	var maxVar = 0;
	for( var count = 0; count < array.length; count++ ){ 
		if( Math.abs(array[count] > maxVar ) ){
			maxVar = array[count];
		}
	}
	return maxVar;
}
exports.math_max = math_max;

var math_avg = function( array ){
	var avgVar = 0;
	for( var count = 0; count < array.length; count++ ){ 
		avgVar += array[count];
	}
	return avgVar/array.length;
}
exports.math_avg = math_avg;


function get_date_from_today( daysInt ){
	let todaysDate = new Date();
	todaysDate.setDate(todaysDate.getDate() - daysInt);
	let dateFinal = new Date(todaysDate).toISOString().split('T')[0];
	return dateFinal;
}
exports.get_date_from_today = get_date_from_today;


var date_to_Int = function( date ){
	var yn = date.getFullYear();
	var mn = date.getMonth();
	var dn = date.getDate();
	var d1 = new Date(yn,0,1,12,0,0); // noon on Jan. 1
	var d2 = new Date(yn,mn,dn,12,0,0); // noon on input date
	var ddiff = Math.round((d2-d1)/864e5);
	return ddiff+1; 
}
exports.date_to_Int = date_to_Int;




