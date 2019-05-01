//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let app = require('../app.js');

// specific
let mongoose = require("mongoose");
let m_user = require('../models/user.model.js');
let m_token = require('../models/token.model.js');
let m_transaction = require('../models/transaction.model.js');
chai.use(chaiHttp);


let tokens = [];
let deniedTokens = [];

const user_credentials_Login = {
	name : '2testUser', 
	email : '2testEmail@Email.com', 
	password : '2testPassword',
}

let transactions = [];
let deniedTransactions = [];

const user_transaction_basic = {
	amount : 617.45, 
	type : '--', 
	note : 'testing a note.', 
	date : new Date(),
}
const user_transaction_positive = {
	amount : 459.99, 
	type : '++', 
	note : 'testing a note111.', 
	date : new Date(),
}


// { status: 201,
//   message: 'success new item created.',
//   data: [
//    { id: '5c12e283deb2e98e3314dbd8',
//      owner: '5c12e281deb2e98e3314dbd7',
//      date: '2018-12-13T22:51:45.070Z',
//      date_day: 0,
//      date_month: 0,
//      amount: 617.45,
//      type: '--',
//      note: 'testing a note.',
//      sign: -1 } ] }


// { status: 202,
//   message: 'success items.',
//   data: 
//    { header: 
//       { total: -1324.06,
//         in: 781.09,
//         out: 2105.15,
//         count: 6,
//         daily: -5.47,
//         min: -999.99,
//         max: 459.99 },
//      items: [ [Object], [Object], [Object], [Object], [Object], [Object] ] } }




describe('Transactions', () => {

	before(function (done) {
		setTimeout(function(){
			done();
		}, 1000);
	});

// CREATION //

	chai.request(app)
	.post('/api/account/create')
	.type('form')
	.send(user_credentials_Login)
	.end((err, res) => {
		res.should.have.status(201);
		res.body.token.length.should.be.above(50);
		tokens.push( res.body.token );
	});

	it('It should CREATE a negative type transaction and return json object.', (done) => {
		chai.request(app)
		.post('/api/transaction/create')
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send(user_transaction_basic)
		.end((err, res) => {
			res.should.have.status(201);
			res.body.data.items[0].amount.should.be.eql(617.45);
			res.body.data.items[0].type.should.be.eql('--');
			res.body.data.items[0].sign.should.be.eql(-1);
			transactions.push( res.body.data.items[0] );
			done();
		});			
	});

	it('It should CREATE a positive type transaction and return json object.', (done) => {
		chai.request(app)
		.post('/api/transaction/create')
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send(user_transaction_positive)
		.end((err, res) => {
			res.should.have.status(201);
			res.body.data.items[0].amount.should.be.eql(459.99);
			res.body.data.items[0].type.should.be.eql('++');
			res.body.data.items[0].sign.should.be.eql(1);
			transactions.push( res.body.data.items[0] );
			done();
		});			
	});

	it('It should not CREATE a transaction with bad(amount).', (done) => {
		chai.request(app)
		.post('/api/transaction/create')
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({
			amount : '231.99.65', 
			type : '--', 
			note : 'testing a note22.', 
			date : new Date(),
		})
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});

	it('It should not CREATE a transaction with bad(amount).', (done) => {
		chai.request(app)
		.post('/api/transaction/create')
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({
			amount : '131.9e!', 
			type : '--', 
			note : 'testing a note3.', 
			date : new Date(),
		})
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});

	it('It should CREATE a transaction with large(amount) capped at 999.99', (done) => {
		chai.request(app)
		.post('/api/transaction/create')
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({
			amount : 1000001, 
			type : '--', 
			note : 'test'
		})
		.end((err, res) => {
			res.should.have.status(201);
			res.body.data.items[0].amount.should.be.eql(999999.99);
			transactions.push( res.body.data.items[0] );
			done();
		});			
	});

	it('It should CREATE a transaction with negative(amount) fixed', (done) => {
		let newDate = new Date();
		newDate.setMonth(newDate.getMonth() - 10 );

		chai.request(app)
		.post('/api/transaction/create')
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({
			amount : -752.73, 
			type : '--', 
			note : 'testing negative',
			date : newDate,
		})
		.end((err, res) => {
			res.should.have.status(201);
			res.body.data.items[0].amount.should.be.eql(752.73);
			transactions.push( res.body.data.items[0] );
			done();
		});			
	});

	it('It should CREATE a transaction even with bad(type) that defaults --.', (done) => {
		let newDate = new Date();
		newDate.setMonth(newDate.getMonth() - 2);

		chai.request(app)
		.post('/api/transaction/create')
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({
			amount : 167.99, 
			type : '+', 
			note : 'testing a note33.', 
			date : newDate,
		})
		.end((err, res) => {
			res.should.have.status(201);
			res.body.data.items[0].type.should.be.eql('--');
			res.body.data.items[0].sign.should.be.eql(-1);
			transactions.push( res.body.data.items[0] );
			done();
		});			
	});

	it('It should CREATE a transaction with no(type).', (done) => {
		let newDate = new Date();
		newDate.setMonth(newDate.getMonth() + 2);

		chai.request(app)
		.post('/api/transaction/create')
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({
			amount : 561.12, 
			note : 'testing a note44.', 
			date : newDate,
		})
		.end((err, res) => {
			res.should.have.status(201);
			done();
		});			
	});

	it('It should CREATE a transaction with only(amount).', (done) => {
		chai.request(app)
		.post('/api/transaction/create')
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({
			amount : 123.67, 
		})
		.end((err, res) => {
			res.should.have.status(201);
			done();
		});			
	});

	it('It should CREATE a transaction with large(type) shortened.', (done) => {
		let newDate = new Date();
		newDate.setMonth(newDate.getMonth() + 7);

		chai.request(app)
		.post('/api/transaction/create')
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({
			amount : 561.12, 
			type : '-- Really long type possibly implemented in the future heresfsdfsdfgsgsdgvsdvregsdfsdfsfsdfsffsfsdfsdf so yeah! This would never fit on a mobile..', 
			note : 'testing a note12.', 
			date : newDate,
		})
		.end((err, res) => {
			res.should.have.status(201);
			res.body.data.items[0].type.length.should.be.below(31);
			transactions.push( res.body.data.items[0] );
			done();
		});			
	});

	it('It should CREATE a transaction with no(note).', (done) => {
		let newDate = new Date();
		newDate.setMonth(newDate.getMonth() - 5);

		chai.request(app)
		.post('/api/transaction/create')
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({
			amount : 561.12, 
			type : '++', 
			date : newDate,
		})
		.end((err, res) => {
			res.should.have.status(201);
			transactions.push( res.body.data.items[0] );
			done();
		});			
	});	

	it('It should CREATE a transaction with no(date).', (done) => {
		chai.request(app)
		.post('/api/transaction/create')
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({
			amount : 321.1, 
			type : '++', 
		})
		.end((err, res) => {
			res.should.have.status(201);
			transactions.push( res.body.data.items[0] );
			done();
		});			
	});

	it('It should CREATE a transaction with large(note) shortened.', (done) => {
		let newDate = new Date();
		newDate.setMonth(newDate.getMonth() - 1.5);

		chai.request(app)
		.post('/api/transaction/create')
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({
			date : newDate,
			amount : 813.5, 
			type : '--', 
			note : 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch (llan-vire-pooll-guin-gill-go-ger-u-queern-drob-ooll-llandus-ilio-gogo-goch) (usually known as Llanfair-pwll or Llanfairpwllgwyngyll) is a Welsh word which translates roughly as "St Mary`s Church in the Hollow of the White Hazel near a Rapid Whirlpool and the Church of St. Tysilio near the Red Cave" . Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch (llan-vire-pooll-guin-gill-go-ger-u-queern-drob-ooll-llandus-ilio-gogo-goch) (usually known as Llanfair-pwll or Llanfairpwllgwyngyll) is a Welsh word which translates roughly as "St Mary`s Church in the Hollow of the White Hazel near a Rapid Whirlpool and the Church of St. Tysilio near the Red Cave"'
		})
		.end((err, res) => {
			res.should.have.status(201);
			res.body.data.items[0].note.length.should.be.below(151);
			transactions.push( res.body.data.items[0] );
			done();
		});			
	});

// UPDATE //

	it('It should UPDATE a transaction with new(amount).', (done) => {
		chai.request(app)
		.put('/api/transaction/' + transactions[0].id )
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({
			amount : 111.11, 
		})
		.end((err, res) => {
			res.should.have.status(200);
			res.body.data.items[0].amount.should.eql(111.11);
			transactions.push( res.body.data.items[0] );
			done();
		});			
	});

	it('It should not UPDATE a transaction with no(input).', (done) => {
		chai.request(app)
		.put('/api/transaction/' + transactions[0].id )
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({})
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});

	it('It should UPDATE a transaction with new(type).', (done) => {
		chai.request(app)
		.put('/api/transaction/' + transactions[0].id )
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({
			type : '++ new thing yo', 
		})
		.end((err, res) => {
			res.should.have.status(200);
			res.body.data.items[0].type.should.eql('++ new thing yo');
			transactions.push( res.body.data.items[0] );
			done();
		});			
	});

	it('It should UPDATE a transaction with new(note).', (done) => {
		chai.request(app)
		.put('/api/transaction/' + transactions[0].id )
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({
			note : 'updated', 
		})
		.end((err, res) => {
			res.should.have.status(200);
			res.body.data.items[0].note.should.eql('updated');
			transactions.push( res.body.data.items[0] );
			done();
		});			
	});	

	it('It should UPDATE a transaction with removed(note).', (done) => {
		chai.request(app)
		.put('/api/transaction/' + transactions[0].id )
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({
			note : '', 
		})
		.end((err, res) => {
			res.should.have.status(200);
			res.body.data.items[0].note.should.eql('');
			transactions.push( res.body.data.items[0] );
			done();
		});			
	});		

	it('It should UPDATE a transaction with older(date).', (done) => {

		let monthOld = new Date();
		monthOld.setMonth(monthOld.getMonth() - 1);

		chai.request(app)
		.put('/api/transaction/' + transactions[0].id )
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({
			date : monthOld, 
		})
		.end((err, res) => {
			res.should.have.status(200);
			transactions.push( res.body.data.items[0] );
			done();
		});			
	});

	it('It should UPDATE a transaction with future(date).', (done) => {

		let monthNew = new Date();
		monthNew.setMonth(monthNew.getMonth() + 10);

		chai.request(app)
		.put('/api/transaction/' + transactions[0].id )
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({
			date : monthNew, 
		})
		.end((err, res) => {
			res.should.have.status(200);
			transactions.push( res.body.data.items[0] );
			done();
		});			
	});

	it('It should not UPDATE a transaction with empty(date).', (done) => {
		chai.request(app)
		.put('/api/transaction/' + transactions[0].id )
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({
			date : '', 
		})
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});

// DELETEION //

	it('It should not DELETE a transaction with bad(ID).', (done) => {
		deniedTransactions.push( transactions.pop() );
		chai.request(app)
		.delete('/api/transaction/' + 'sadadwa2ed' )
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({})
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});	

	it('It should DELETE a transaction correct(ID).', (done) => {
		deniedTransactions.push( transactions.pop() );
		chai.request(app)
		.delete('/api/transaction/' + deniedTransactions[0].id )
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({})
		.end((err, res) => {
			res.should.have.status(200);
			done();
		});			
	});	

	it('It should not DELETE a dead transaction(ID).', (done) => {
		deniedTransactions.push( transactions.pop() );
		chai.request(app)
		.delete('/api/transaction/' + deniedTransactions[0].id )
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({})
		.end((err, res) => {
			res.should.have.status(404);
			done();
		});			
	});	

 // GET RANGE //

	it('It should get a range(Array) of items.', (done) => {

		let start = new Date();
		start.setMonth(start.getMonth() - 20);
		let end = new Date();
		end.setMonth(end.getMonth() + 20);

		let startISO = new Date(start).toISOString().split('T')[0];
		let endISO = new Date(end).toISOString().split('T')[0];
		let address = '/api/transaction/' +  startISO + '/' + endISO;

		chai.request(app)
		.post( address )
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({})
		.end((err, res) => {
			res.should.have.status(202);
			res.body.data.items.length.should.eql(10);
			done();
		});			
	});	

	it('It should get a range(Array) of items.', (done) => {

		let start = new Date();
		start.setMonth(start.getMonth() - 2);
		let end = new Date();
		end.setMonth(end.getMonth() + 2);

		let startISO = new Date(start).toISOString().split('T')[0];
		let endISO = new Date(end).toISOString().split('T')[0];
		let address = '/api/transaction/' +  startISO + '/' + endISO;

		chai.request(app)
		.post( address )
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({})
		.end((err, res) => {
			res.should.have.status(202);
			res.body.data.items.length.should.eql(6);
			done();
		});			
	});		

	it('It should NOT get a range(Array) of items with bad(token).', (done) => {

		let start = new Date();
		start.setMonth(start.getMonth() - 2);
		let end = new Date();
		end.setMonth(end.getMonth() + 2);

		let startISO = new Date(start).toISOString().split('T')[0];
		let endISO = new Date(end).toISOString().split('T')[0];
		let address = '/api/transaction/' +  startISO + '/' + endISO;

		let tokenChanged = tokens[0].substr(0, 2) + 'Q' + tokens[0].substr(3);

		chai.request(app)
		.post( address )
		.set('Authorization', 'Bearer ' + tokenChanged)
		.type('form')
		.send({})
		.end((err, res) => {
			res.should.have.status(401);
			res.body.message.should.eql('token invalid.');
			done();
		});			
	});

})
