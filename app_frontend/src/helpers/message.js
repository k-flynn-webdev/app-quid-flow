
let messageBase = {
	title : "",
	message : "",
	isType : "",
	id : 0,
	progress : -1,
	finished : false,
}

let messageCurrent = 0;
let session = { hasMessages : false, messageCount: 0, messages: [] };

function getID(){
	return messageCurrent + 1;
}

function updateProgress( message ){
	message.progress +=16;
	if( message.progress > 100 ){
		message.progress = 100;
		message.finished = true;
	}
	if( message.progress <= 99 ){
		setTimeout( updateProgress, 150, message );
	}	
}

function send( input ){
	let messageToSend = JSON.parse(JSON.stringify(messageBase)); // creates new object
	messageToSend.id = getID();
	messageCurrent = messageToSend.id;

	if( input.isType !== undefined || input.isType !== null ){
		let isType = input.isType.toLowerCase();
		messageToSend.isType = 'is-' + isType;
	}

	if( messageToSend.isType === 'is-success' ){
		messageToSend.progress = 0;
		setTimeout( updateProgress, 250, messageToSend );
	}

	messageToSend.title = input.title;
	messageToSend.message = input.message;
	session.messages.push( messageToSend );
	check();
}

function remove( message ){
	for (let count=0;count<session.messages.length;count++){
		if( session.messages[count].id === message.id ){
			session.messages.splice(count,1); // returns first element.
			break;
		}
	}
	check();
}

function clear(){
	session.hasMessages = false;
	session.messageCount = 0;
	session.messages = [];
}

function check(){
	session.messageCount = session.messages.length;
	if( session.messages.length > 0 ){
		session.hasMessages = true;
	} else {
		session.hasMessages = false;
	}
}

const messageObj = { send, remove, clear, session }


export default {
	install: function(Vue) {
		Vue.prototype.$message = messageObj;
	}		
}

