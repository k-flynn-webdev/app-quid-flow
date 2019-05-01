var port = process.env.PORT;
var ip = process.env.IP;

console.log('importing test config.');

module.exports = {
	string: { min_size : 6, max_size : 200 },
	file: { max_size : 10 * 20124 * 1024 },
	jsonSpaces: 2,	
	port: port,
	ip: ip,
	rate: { time : 10 * 60 * 1000, max: 1000 },
	db: 'mongodb://127.0.0.1/app_test',
	token: { secret : process.env.TOKENSECRET , expiry : 60 * 60 * 24 * 7 }
}
