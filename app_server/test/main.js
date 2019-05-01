//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

let app = require('../app.js');

chai.use(chaiHttp);

// specific


describe('Home page', () => {

	before(function (done) {
		setTimeout(function(){
			done();
		}, 1000);
	});

	it('it should GET a page with data', (done) => {
		chai.request(app)
		.get('/')
		.end((err, res) => {
			res.should.have.status(200);
			res.text.length.should.be.above(100);
			done();
		});
	});
});




// //Our parent block
// describe('Users', () => {
//     beforeEach((done) => { //Before each test we empty the database
//         m_user.remove({}, (err) => { 
//            done();           
//         });        
//     });
// /*
//   * Test the /GET route
//   */
//   describe('/CREATE user', () => {
//       it('it should CREATE a user', (done) => {
//         chai.request(app)
//             .post('/api/account/create')
//             .end((err, res) => {
//                   res.should.have.status(200);
//                   res.body.should.be.a('array');
//                   res.body.length.should.be.eql(0);
//               done();
//             });
//       });
//   });

// });