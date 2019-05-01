



// const token_Example_Response_From_Server = {status: 202, message: "success user logged in.", token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y…EzNX0.EvrI6zeEwcmunonqt1ocPw-dzyoY-ZCUOqsLoPC1FDU"}
// const token_Example_Decoded_Json = {
// 	header: {alg: "HS256", typ: "JWT"},
// 	payload: { _id: "5be373da78e9043d890a46a4", name: "newName", email: "newsmalleremail@email.com"},
// 	raw: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmUzNzNkYTc4ZTkwNDNkODkwYTQ2YTQiLCJuYW1lIjoibmV3TmFtZSIsImVtYWlsIjoibmV3c21hbGxlcmVtYWlsQGVtYWlsLmNvbSIsImxvZ2luIjoiMjAxOC0xMS0xMlQxNzoxMToxMS44NThaIiwiYWN0aXZlIjp0cnVlLCJpYXQiOjE1NDIwNDI2NzEsImV4cCI6MTU0MjY0NzQ3MX0.aoi1NsPna1jvGc4rnRhV23Aoqx4E2L5VR4pWSVup6NE",
// }

function jwt_Decode(t) {
	if(t === false ){
		return false;
	}
	let token = {};
	let splitTemp = [];
	splitTemp = t.split('.');
	token.raw = t;
	// token.header = JSON.parse( window.atob(splitTemp[0]) );
	token.payload = JSON.parse( window.atob(splitTemp[1]) );
	return (token)
}

function validate_Token(){
 // ?? 
}

function set_Session(loggedIn, token ){
	session.active = loggedIn;
	if(token === false ){
		session.user = {};
		session.token = '';
		return;
	}
	session.user = token.payload;
	session.token = token.raw;
}

function tokenSuccess( input ){
	token_set( input );
	set_Session( true, jwt_Decode( input ) );	
}
function tokenFail(){
	// let token = session;
	// set_File( token );
	// set_Session( { raw : token.raw, header : token.header, payload : token.payload }, false );
}
function tokenRemove(){
	token_delete();
	set_Session( false, false );
}





function user_success( token, next ){
	// console.log('login success');	
	// console.log(token);	
	tokenSuccess( token );
	return next();
}
function user_fail( next ){
	// console.log('login failed');	
	tokenFail();
	return next();
}
function logout_success( next ){
	// console.log('logout success');
	tokenFail();
	tokenRemove();
	return next();
}
function logout_fail( next ){
	// console.log('logout failed');
	tokenFail();
	tokenRemove();
	return next();
}



let session = { active : false, user : {}, token : '' };

const auth = { session, user_success, user_fail, logout_success, logout_fail };


export default {
	install: function(Vue) {
		Vue.prototype.$auth = auth;
	}
}


// on first start need to run session 
function init(){
	let isLoggedIn = false;
	let token = jwt_Decode( token_get());

	if( token !== false ){
		isLoggedIn = true;
	} 
	set_Session( isLoggedIn, token );
}


function token_get() {
	let item = window.localStorage.getItem('tokenString');
	if( item === null ){
		return false;
	}
	return item;
}
function token_set(value) {
	window.localStorage.setItem('tokenString', value)
}
function token_delete() {
	window.localStorage.removeItem('tokenString')
}


function fakeInit(){
	token_set('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmUzNzNkYTc4ZTkwNDNkODkwYTQ2YTQiLCJuYW1lIjoibmV3TmFtZSIsImVtYWlsIjoibmV3c21hbGxlcmVtYWlsQGVtYWlsLmNvbSIsImxvZ2luIjoiMjAxOC0xMi0xNFQxNToxNDowMS4yNzBaIiwiYWN0aXZlIjp0cnVlLCJpYXQiOjE1NDQ4MDA0NDEsImV4cCI6MTU0NTQwNTI0MX0.bObGNqSRKNFbwJWj4DbOEmJZ_tXtsT1n-27azK4jjo8')
}
// fakeInit();

init();

