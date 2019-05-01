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
let tokenDenied = [];
const user_credentials_Login = {
	name : 'testUser', 
	email : 'testEmail@Email.com', 
	password : 'testPassword',
}


describe('Users', () => {

	before(function (done) {
		setTimeout(function(){
			done();
		}, 1000);
	});

	// user cleanup 
	m_user.remove({}, (err) => {});
	// token cleanup 
	m_token.remove({}, (err) => {});
	// token cleanup 
	m_transaction.remove({}, (err) => {});

// CREATION SECTION //

	it('It should CREATE a user and return a token + id as a response.', (done) => {
		chai.request(app)
		.post('/api/account/create')
		.type('form')
		.send(user_credentials_Login)
		.end((err, res) => {
			res.should.have.status(201);
			res.body.token.length.should.be.above(50);
			tokens.push( res.body.token );
			done();
		});			
	});

	it('It should not CREATE a user with same details.', (done) => {
		chai.request(app)
		.post('/api/account/create')
		.type('form')
		.send(user_credentials_Login)
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});

	it('It should not CREATE a user and with no (input).', (done) => {
		chai.request(app)
		.post('/api/account/create')
		.type('form')
		.send({})
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});	

// NAME //

	it('It should not CREATE a user with sanitized long (name)', (done) => {
		chai.request(app)
		.post('/api/account/create')
		.type('form')
		.send({	
				name : 'soAme@<script>.log("runMe!");</script>testHe<re',
				email : 'pre_' + user_credentials_Login.email,
				password : 'pre_' + user_credentials_Login.password,
			})			
		.end((err, res) => {
			res.body.message.should.eql('Name too long, try something shorter (60).');
			res.should.have.status(422);
			done();
		});			
	});

	it('It should not CREATE a user with no(name)', (done) => {
		chai.request(app)
		.post('/api/account/create')
		.type('form')
		.send({	
				email : 'sdfs' + user_credentials_Login.email,
				password : 'sfsjuy' + user_credentials_Login.password,
			})			
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});	

	it('It should not CREATE a user with small(name)', (done) => {
		chai.request(app)
		.post('/api/account/create')
		.type('form')
		.send({	
				name : 't1',
				email : 'sdsdfs' + user_credentials_Login.email,
				password : 'sfsjaduy' + user_credentials_Login.password,
			})			
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});	

	it('It should not CREATE a user with large(name)', (done) => {
		chai.request(app)
		.post('/api/account/create')
		.type('form')
		.send({	
				name : 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch (llan-vire-pooll-guin-gill-go-ger-u-queern-drob-ooll-llandus-ilio-gogo-goch) (usually known as Llanfair-pwll or Llanfairpwllgwyngyll) is a Welsh word which translates roughly as "St Mary`s Church in the Hollow of the White Hazel near a Rapid Whirlpool and the Church of St. Tysilio near the Red Cave" . Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch (llan-vire-pooll-guin-gill-go-ger-u-queern-drob-ooll-llandus-ilio-gogo-goch) (usually known as Llanfair-pwll or Llanfairpwllgwyngyll) is a Welsh word which translates roughly as "St Mary`s Church in the Hollow of the White Hazel near a Rapid Whirlpool and the Church of St. Tysilio near the Red Cave"',
				email : 'pre11_' + user_credentials_Login.email,
				password : 'pr2e2_' + user_credentials_Login.password,
			})			
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});	



//  // EMAIL //

	it('It should not CREATE a user with no(email)', (done) => {
		chai.request(app)
		.post('/api/account/create')
		.type('form')
		.send({	
				name : user_credentials_Login.name,
				password : user_credentials_Login.password,
			})			
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});

	it('It should not CREATE a user with small(email)', (done) => {
		chai.request(app)
		.post('/api/account/create')
		.type('form')
		.send({	
				name : user_credentials_Login.name,
				email : '2@1.c',
				password : user_credentials_Login.password,
			})			
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});


	it('It should not CREATE a user with large(email)', (done) => {
		chai.request(app)
		.post('/api/account/create')
		.type('form')
		.send({	
				name : user_credentials_Login.name,
				email : 'neadsdffgdvhdfbdfbsfgsdadaferfssfsvsdfwEamil@emaisfdfdfsfdcfsfqwewdfsdfsqwefhdffls.cogdvhdfbdfbsfgsdadaferfssfm',
				password : user_credentials_Login.password,
			})			
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});

	it('It should CREATE a user with sanitized(email)', (done) => {
		chai.request(app)
		.post('/api/account/create')
		.type('form')
		.send({	
				name : user_credentials_Login.name,
				email : 'thisEmailISFunny<script>console.log("runMe!");</script>test@email.com',
				password : user_credentials_Login.password,
			})			
		.end((err, res) => {
			res.should.have.status(201);
			res.body.token.length.should.be.above(50);			
			tokens.push( res.body.token );
			done();
		});			
	});


	it('It should not CREATE a user with bad incomplete(email)', (done) => {
		chai.request(app)
		.post('/api/account/create')
		.type('form')
		.send({	
				name : user_credentials_Login.name,
				email : 'test@test',				
				password : user_credentials_Login.password,
			})			
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});

// // PASSWORD //

	it('It should not CREATE a user with no(password)', (done) => {
		chai.request(app)
		.post('/api/account/create')
		.type('form')
		.send({	
				name : 's6sa' + user_credentials_Login.name,
				email : 'sf1se' + user_credentials_Login.email,
			})			
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});

	it('It should not CREATE a user with small(password)', (done) => {
		chai.request(app)
		.post('/api/account/create')
		.type('form')
		.send({	
				name : 's6sa' + user_credentials_Login.name,
				email : 'sf1se' + user_credentials_Login.email,
				password : '123',			
			})			
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});

	it('It should CREATE a user with long(password)', (done) => {
		chai.request(app)
		.post('/api/account/create')
		.type('form')
		.send({	
				name : 's6sa' + user_credentials_Login.name,
				email : 'sf1se' + user_credentials_Login.email,
				password : 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogochllan-vire-pooll-guin-gill-go-ger-u-queern-drob-ooll-llandus-ilio-gogo-gochusually known as Llanfair-pwll or Llanfairpwllgwyngyll is a Welsh word which translates roughly as "St Mary`s Church in the Hollow of the White Hazel near a Rapid Whirlpool and the Church of St. Tysilio near the Red Cave" . Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch (llan-vire-pooll-guin-gill-go-ger-u-queern-drob-ooll-llandus-ilio-gogo-goch) (usually known as Llanfair-pwll or Llanfairpwllgwyngyll) is a Welsh word which translates roughly as "St Mary`s Church in the Hollow of the White Hazel near a Rapid Whirlpool and the Church of St. Tysilio near the Red Cave"',
			})			
		.end((err, res) => {
			res.should.have.status(201);
			res.body.token.length.should.be.above(50);			
			tokens.push( res.body.token );
			done();
		});			
	});

	it('It should CREATE a user with sanitized input(password)', (done) => {
		chai.request(app)
		.post('/api/account/create')
		.type('form')
		.send({	
				name : 'tets1863' + user_credentials_Login.name,
				email : 'tets1863' + user_credentials_Login.email,
				password : user_credentials_Login.password + '<script>console.log("runMe!");</script>',
			})			
		.end((err, res) => {
			res.should.have.status(201);
			tokens.push( res.body.token );
			done();
		});			
	});

// // UPDATE //

	it('It should UPDATE a user with new(name/email/pass)', (done) => {
		let tokenLocal =  tokens.pop();
		chai.request(app)
		.put('/api/account')
		.set('Authorization', 'Bearer ' + tokenLocal)
		.type('form')
		.send({	
				name : 'newName',
				email : 'newEmail@email.com',
				password : 'newPassword',
			})			
		.end((err, res) => {
			res.should.have.status(202);
			tokenDenied.push( tokenLocal );
			done();
		});			
	});

	it('It should not UPDATE a user with a no(input)', (done) => {
		chai.request(app)
		.put('/api/account')
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({})			
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});

	it('It should UPDATE a user with a only new(name)', (done) => {
		let tokenLocal =  tokens.pop();
		chai.request(app)
		.put('/api/account')
		.set('Authorization', 'Bearer ' + tokenLocal)
		.type('form')
		.send({	
				name : 'newName111',
			})			
		.end((err, res) => {
			res.should.have.status(202);
			res.body.data.name.should.eql('newName111');
			tokenDenied.push( tokenLocal );
			tokens.push( res.body.token );
			done();
		});			
	});

	it('It should not UPDATE a user with a only new short(name)', (done) => {
		chai.request(app)
		.put('/api/account')
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({	
			name : 'b',
			})			
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});

	it('It should not UPDATE a user with a only new long(name)', (done) => {
		chai.request(app)
		.put('/api/account')
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({	
				name : 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogochllan-vire-pooll-guin-gill-go-ger-u-queern-drob-ooll-llandus-ilio-gogo-gochusually known as Llanfair-pwll or Llanfairpwllgwyngyll is a Welsh word which translates roughly as "St Mary`s Church in the Hollow of the White Hazel near a Rapid Whirlpool and the Church of St. Tysilio near the Red Cave" . Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch (llan-vire-pooll-guin-gill-go-ger-u-queern-drob-ooll-llandus-ilio-gogo-goch) (usually known as Llanfair-pwll or Llanfairpwllgwyngyll) is a Welsh word which translates roughly as "St Mary`s Church in the Hollow of the White Hazel near a Rapid Whirlpool and the Church of St. Tysilio near the Red Cave"',
			})			
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});

	it('It should UPDATE a user with a only new(email)', (done) => {
		let tokenLocal =  tokens.pop();
		chai.request(app)
		.put('/api/account')
		.set('Authorization', 'Bearer ' + tokenLocal)
		.type('form')
		.send({	
				email : 'newerEmailThanBEfore@EmailsYo.com',
			})			
		.end((err, res) => {
			res.should.have.status(202);
			res.body.data.email.should.eql('neweremailthanbefore@emailsyo.com');
			tokenDenied.push( tokenLocal );
			tokens.push( res.body.token );
			done();
		});			
	});

	it('It should not UPDATE a user with a small(email)', (done) => {
		chai.request(app)
		.put('/api/account')
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({	
				email : '1@1.co',
			})			
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});

	it('It should not UPDATE a user with a long(email)', (done) => {
		chai.request(app)
		.put('/api/account')
		.set('Authorization', 'Bearer ' + tokens[0])
		.type('form')
		.send({	
				email : 'dsfsdflksmflskfoshfiuagudgfywqgdopjwepofjhuqiwgdiuenwjpofjiuehgUFGBHEW1@KJBSFKUHYSFGDUYWGDIUWGIFYGDUYBSDCJNSIUHDYFGWEBF1.co',
			})			
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});			
	});


// LOGIN SECTION //

	it('It should Login a user', (done) => {
		chai.request(app)
		.post('/api/account/login')
		.type('form')
		.send(user_credentials_Login)
		.end((err, res) => {
			res.should.have.status(200);
			res.body.token.length.should.be.above(50);
			tokens.push( res.body.token );
			done();
		});
	});

	it('It should not Login a user wrong(email)', (done) => {
		chai.request(app)
		.post('/api/account/login')
		.type('form')
		.send({	
				name : user_credentials_Login.name,
				email : 'extra_' + user_credentials_Login.email,
				password : user_credentials_Login.password,
			})			
		.end((err, res) => {
			res.should.have.status(404);
			done();
		});
	});

	it('It should not Login a user wrong(password)', (done) => {
		chai.request(app)
		.post('/api/account/login')
		.type('form')
		.send({	
				name : user_credentials_Login.name,
				email : user_credentials_Login.email,
				password : 'extra_' + user_credentials_Login.password,
			})			
		.end((err, res) => {
			res.should.have.status(422);
			done();
		});
	});

// // DELETE SECTION //

	it('It should DELETE a user', (done) => {
		let tokenLocal = tokens.pop();
		chai.request(app)
		.delete('/api/account/')
		.set('Authorization', 'Bearer ' + tokenLocal)
		.type('form')
		.send({})
		.end((err, res) => {
			tokenDenied.push( tokenLocal );
			res.should.have.status(200);
			done();
		});
	});

	it('It should not DELETE a user with bad(token)', (done) => {
		let fakeToken = 'ejJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzExYTQ3Y2VmNzQxNzJiOGQzNTk3N2QiLCJuYW1lIjoidGVzdFVzZXIiLCJlbWFpbCI6InRlc3RFbWFpbEBFbWFpbC5jb20iLCJsb2dpbiI6IjIwMTgtMTItMTNUMDA6MTQ6NTIuNDYzWiIsImFjdGl2ZSI6dHJ1ZSwiaWF0IjoxNTQ0NjYwMDkyLCJleHAiOjE1NDUyNjQ4OTJ9.VTgtyEQdX6OqE6LEUHj9ak_YA3dWbRLxfc7OqIgN3R4';
		chai.request(app)
		.delete('/api/account/')
		.set('Authorization', 'Bearer ' + fakeToken)
		.type('form')
		.send({})
		.end((err, res) => {
			res.should.have.status(401);
			done();
		});
	});

	it('It should not DELETE a user with reallyOdd(token)', (done) => {
		let fakeToken = 'YwMDkyLCJleHAiOjE1NDUyNjQ4OTJ9.VTgtyEQdX6OqE6LEUHj9ak_YA3dWbRLxfc7OqIgN3R4';
		chai.request(app)
		.delete('/api/account/')
		.set('Authorization', 'Bearer ' + fakeToken)
		.type('form')
		.send({})
		.end((err, res) => {
			res.should.have.status(401);
			done();
		});
	});

	it('It should not DELETE a user with old/denied(token)', (done) => {
		let tokenLocal = tokenDenied.pop();
		chai.request(app)
		.delete('/api/account/')
		.set('Authorization', 'Bearer ' + tokenLocal)
		.type('form')
		.send({})
		.end((err, res) => {
			res.should.have.status(401);
			done();
		});
	});

// LOGOUT SECTION //

	it('It should LOGOUT a user', (done) => {
		chai.request(app)
		.post('/api/account/logout')
		.set('Authorization', 'Bearer ' + tokens[1])
		.type('form')
		.send({})
		.end((err, res) => {
			res.should.have.status(200);
			done();
		});
	});		

	it('It should not LOGOUT a user with bad(token)', (done) => {
		let fakeToken = 'ejJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzExYTQ3Y2VmNzQxNzJiOGQzNTk3N2QiLCJuYW1lIjoidGVzdFVzZXIiLCJlbWFpbCI6InRlc3RFbWFpbEBFbWFpbC5jb20iLCJsb2dpbiI6IjIwMTgtMTItMTNUMDA6MTQ6NTIuNDYzWiIsImFjdGl2ZSI6dHJ1ZSwiaWF0IjoxNTQ0NjYwMDkyLCJleHAiOjE1NDUyNjQ4OTJ9.VTgtyEQdX6OqE6LEUHj9ak_YA3dWbRLxfc7OqIgN3R4';
		chai.request(app)
		.post('/api/account/logout')
		.set('Authorization', 'Bearer ' + fakeToken)
		.type('form')
		.send({})
		.end((err, res) => {
			res.should.have.status(401);
			done();
		});
	});

	it('It should not LOGOUT a user with denied(token)', (done) => {
		chai.request(app)
		.post('/api/account/logout')
		.set('Authorization', 'Bearer ' + tokenDenied.pop() )
		.type('form')
		.send({})
		.end((err, res) => {
			res.should.have.status(401);
			done();
		});
	});

})


