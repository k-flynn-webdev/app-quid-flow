


// function update_LocalSession( start, end, newData ){
// 	if( newData.length > 0){
// 		// date checking 
// 		if( start < session.days_start ){
// 		    session.days_start = start;
// 		}
// 		if( end > session.days_end ){
// 		    session.days_end = end;
//             for (let count=0;count<newData.length;count++){
//                 session.items.push( newData[count] );
//             } 
// 		}   
// 	}
// 	// console.log( session );
// 	// objs.sort(compare);
// }



// function header_reset(){
// 	for (let count=0;count<session.header.months.length;count++){
// 		session.header.months[ count ].in = 0;
// 		session.header.months[ count ].out = 0;
// 		session.header.months[ count ].total = 0;
// 		session.header.months[ count ].count = 0;
//         session.header.months[ count ].daily = 0;
//         session.header.months[ count ].min = 0;
//         session.header.months[ count ].max = 0;
        
//         // reset days for graph 
//         session.header.months[ count ].days = [0];
//         let dayAmount = 30 + (30*count);
//         for (let days=0;days<dayAmount;days++){
//             session.header.months[ count ].days.push(0);
//         }
		
// 	}
// }

// function header_update( session ){

// 	function headInput( input, output ){
// 		if( input.sign > 0 ){
// 			output.in += input.amount
//             output.days[ input.dateInt ] += input.amount;
// 		}
// 		if( input.sign < 0 ){
// 			output.out += input.amount
//             output.days[ input.dateInt ] -= input.amount;
// 		}
// 		output.count +=1;
// 	}

//     function headMinMax( input ){

//         input.days[0] = 0;
//         for (let count=1;count<input.days.length;count++){
//             input.days[count] = input.days[count - 1] - input.days[count];
//         }

//         for (let count=0;count<input.days.length;count++){
//             if( input.days[count] < input.min ){
//                 input.min = input.days[count];
//             }
//             if( input.days[count] > input.max ){
//                 input.max = input.days[count];
//             }
//         }
//     }

// 	for (let count=0;count<session.items.length;count++){
		
// 		if( session.items[count].dateInt <= 30 ){
// 			headInput( session.items[count], session.header.months[0] );
// 		}
// 		if( session.items[count].dateInt <= 60 ){
// 			headInput( session.items[count], session.header.months[1] );
// 		}
// 		if( session.items[count].dateInt <= 90 ){
// 			headInput( session.items[count], session.header.months[2] );
// 		} else {
// 			break;
// 		}				
// 	}

// 	for (let count=0;count<session.header.months.length;count++){
// 		session.header.months[ count ].total = limit_digit( session.header.months[ count ].in - session.header.months[ count ].out );
// 		session.header.months[ count ].in = limit_digit( session.header.months[ count ].in );
// 		session.header.months[ count ].out = limit_digit( session.header.months[ count ].out );
//         session.header.months[ count ].daily = limit_digit( session.header.months[ count ].total / (30 + (30*count)) );
        
//         headMinMax(  session.header.months[ count ] );

//         session.header.months[ count ].min = limit_digit( session.header.months[ count ].min );
// 		session.header.months[ count ].max = limit_digit( session.header.months[ count ].max );

// 	}
// // }

// function fetch_Session( start, end, next ){
// 	console.log('Server Request: ' + 'start: ' + start.toString() + ' - ' + 'end: ' + end.toString() );
//     // fakeFetch( start, end, function( fakeResponse ){
// 	// Fetch( start, end, function( fakeResponse ){


// 	// 	if( validate_Response( fakeResponse )){
// 	// 		update_LocalSession( start, end, fakeResponse.data );
// 	// 		header_reset( session );
// 	// 		header_update( session );
// 	// 		return next( null, fakeResponse );
// 	// 	} else {
// 	// 		return next( fakeResponse );
// 	// 	}

// 	// });
// }


// let session = {
// 	items : [],
// 	days_start : 0,
// 	days_end : 0,
// 	header : {
// 		view : 0,
// 		months : [ 
// 				{ total : 0, in : 0, out : 0, count : 0, daily : 0, min: 0, max: 0, days : [] }, 
// 				{ total : 0, in : 0, out : 0, count : 0, daily : 0, min: 0, max: 0, days : [] }, 
// 				{ total : 0, in : 0, out : 0, count : 0, daily : 0, min: 0, max: 0, days : [] },  
// 			]
// 	}
// }


// function header_ChangeView( input ){
// 	if( input !== session.header.view ){
// 		session.header.view = input;
// 	}
// }


// function set_Session( input ){
// 	session.data = input.data;
// 	// cache this locally somehow? TODO future
// }
// function get_Session( input ){
	// direct call out?
	// if no input just get default 30 days for this account ..
	// session.data = input.data;
	// cache this locally somehow? TODO future
// }



// function set_FakeSession(){
// 	console.log('fake quidflow session.')
// 	// set_Session( example_Response_From_Server );
// 	// cache this locally somehow? TODO future
// }

// const quidflow = { fetch_Session, header_ChangeView, session };

// export default {
// 	install: function(Vue) {
// 		Vue.prototype.$quid = quidflow;
// 	}
// }


// setTimeout( set_FakeSession, 3000 );

// on first start need to run session 
// function init(){
// 	console.log('init quidflow helpers.');
	
	// let token = get_File( token );
	// now in the bg check with api server if file is valid?
	// if so auto login? force for now ..
	// let isLoggedIn = false;
	// if( token.raw.length > 10 ){
		// isLoggedIn = true;
	// } 
	// set_Session( token, isLoggedIn );
	// set_FakeSession( token, isLoggedIn );
// }
// on first login need to run checkState

// function fakeLogin(){
// 	session.isLoggedIn = true;
// }

// setTimeout( fakeLogin, 5000 );

// ===
// Private helpers
// ===

// function tokenFakeSuccess(){
// 	set_File( token_Example_Decoded_Json );
// 	set_Session( token, true );
// }
// setTimeout(tokenFakeSuccess,5000);

// let session {
// 	_isLoggedIn : false,
// 	get isLoggedIn(){
// 		return this._isLoggedIn;
// 	},
// 	set isLoggedIn( value ){
// 		this._isLoggedIn = value;
// 		if( value === false){ delete_State(); }
// 	},

// 	_token : '',
// 	_header : '',
// 	_payload : '',

// 	get token(){
// 		return this._token;
// 	},
// 	set token( value ){
// 		this._token = value.raw;
// 		this.header = value.header;
// 		this.payload = value.payload;
// 		set_State( value );
// 	},

// 	get header(){
// 		return this._header;
// 	},
// 	get payload(){
// 		return this._payload;
// 	}

// }


// function get_File() {
// 	let file = window.localStorage.getItem(localKey);
// 	if( file === null ){
// 		return { raw : '', header : '', payload : '' };
// 	}
// 	return JSON.parse( file );; 
// }
// function set_File(value) {
// 	window.localStorage.setItem(localKey, JSON.stringify(value))
// }
// function delete_File() {
// 	window.localStorage.removeItem(localKey)
// }



// init();
