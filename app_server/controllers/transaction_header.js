
const m_user = require('../models/user.model.js');
const m_transaction = require('../models/transaction.model.js');
const status = require('../config/status_response.js');
const helpers = require('./helpers.js');
const inputValidate = require('./input_validate.js');


let min = 10000;
let max = 99999;
let maxHeaderMonths = 4;

let month_days = [31,28,30,30,31,29,31,31,28,31,30,31];

function newID(){
	let hash = Math.floor(min + (max - min) * Math.random());
	return hash
}
exports.newID = newID;

function create_Header(){
	let header = [];
	for( let count=0;count<maxHeaderMonths;count++){
		header.push({  
			daily : 0, 
			in : 0, 
			out : 0, 
			count : 0, 
			total : 0,
			days : 0, 
		});	
	}	
	return header;
}


function getHeader( input, routeOut){

	let newHeader = create_Header();
	let thisMonthInt = new Date().getMonth();

	for (let i=0;i<input.length;i++) {
		let value = input[i].amount * input[i].sign;

		if( input[i].date_month >= maxHeaderMonths ){
			console.log('early exit');
			console.log(input[i]);
			continue; // error fix if things go out of bound?
		}

		let month = newHeader[ input[i].date_month ];

		// early break fix ..
		if( month === undefined ){
			console.log('missing month exit');
			console.log(input[i]);			
			continue;
		}

		if( value > 0 ){
			month.in += input[i].amount
		}
		if( value < 0 ){
			month.out += input[i].amount
		}
		month.count +=1;
	}

	for( let count=0;count<maxHeaderMonths;count++){
		newHeader[count].in = helpers.math_roundToDigit( newHeader[count].in );
		newHeader[count].out = helpers.math_roundToDigit( newHeader[count].out );
		newHeader[count].total = helpers.math_roundToDigit( newHeader[count].in - newHeader[count].out );
		newHeader[count].days = month_days[ helpers.array_indexWrap( thisMonthInt - count, month_days ) ];
		newHeader[count].daily = helpers.math_roundToDigit( newHeader[count].total / newHeader[count].days );
	}	

	return routeOut(null, { 
		header : newHeader, 
		graph : 'graph', 
		header_hash : newID() 
	});

}
exports.getHeader = getHeader;




// function header_reset( input ){
// 	for (let count=0;count< input.months.length;count++){
// 		input.months[ count ].total = 0;
// 		input.months[ count ].in = 0;
// 		input.months[ count ].out = 0;
// 		input.months[ count ].count = 0;
// 		input.months[ count ].daily = 0;
// 		input.months[ count ].min = 0;
// 		input.months[ count ].max = 0;
// 	}
// }



// function rangeHeader( input, length ){
// 	let month = { total : 0, in : 0, out : 0, count : 0, daily : 0, min: 0, max: 0 };
// 	let totals = [];



// 	for (let i=0;i<input.length;i++) {
// 		let value = input[i].amount * input[i].sign;

// 		if( value > 0 ){
// 			month.in += input[i].amount
// 		}
// 		if( value < 0 ){
// 			month.out += input[i].amount
// 		}
// 		totals.push( value );
// 	}

// 	month.in = helpers.math_roundToDigit( month.in );
// 	month.out = helpers.math_roundToDigit( month.out );	
// 	month.total = helpers.math_roundToDigit( month.in - month.out );

	// month.count = totals.length;
	// month.min = helpers.math_roundToDigit( arrayMin(totals) );
	// month.max = helpers.math_roundToDigit( arrayMax(totals) );
	// month.daily = helpers.math_roundToDigit( month.total / length );

// 	return month;
// }



// // id: '5c12e283deb2e98e3314dbd8',
// //      owner: '5c12e281deb2e98e3314dbd7',
// //      date: '2018-12-13T22:51:45.070Z',
// //      date_day: 0,
// //      date_month: 0,
// //      amount: 617.45,
// //      type: '--',
// //      note: 'testing a note.',
// //      sign: -1 } }

// function arrayMin(array) {
// 	return array.reduce(function(a, b) {
// 		return Math.min(a, b);
// 	});
// }
// function arrayMax(array) {
// 	return array.reduce(function(a, b) {
// 		return Math.max(a, b);
// 	});
// }

// function month_in_out( item, month ){
// 	if( item.sign > 0 ){
// 		month.in += item.amount
// 	}
// 	if( item.sign < 0 ){
// 		month.out += item.amount
// 	}
// }
// function month_min( item, month ){
// 	let value = item.amount * item.sign;
// 	if( value < month.min ){
// 		month.min = value;
// 	}
// }
// function month_max( item, month ){
// 	let value = item.amount * item.sign;
// 	if( value > month.max ){
// 		month.max = value;
// 	}
// }
// function month_count( month ){
// 	month.count +=1;
// }

// function month_total( month ){
// 	month.total = month.in - month.out;
// }
// function month_daily( month ){
// 	month.daily = month.total / 30;
// }


// function header_render( input ){

// 	for (let count=0;count<input.length;count++){

// 		let item = input[count];
// 		let month = header.months[item.date_month];
// 		if( item.date_month > 3 ){
// 			break; // dont need more than 3 months for header ..
// 		}

// 		month_in_out( item, month );
// 		month_min( item, month );
// 		month_max( item, month );
// 		month_count( month );
// 	}

// 	for (let count=0;count<header.months.length;count++){
// 		let month = header.months[count];
// 		month_total( month );	
// 		month_daily( month );
// 	}
// }



