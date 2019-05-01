var port = process.env.PORT;
var ip = process.env.IP;

console.log('importing development config.');

module.exports = {
	string: { min_size : 6, max_size : 200 },
	file: { max_size : 10 * 20124 * 1024 },
	jsonSpaces: 2,	
	port: port,
	ip: ip,
	rate: { time : 10 * 60 * 1000, max: 1000 },
	db: process.env.DATABASEURL,
	token: { secret : process.env.TOKENSECRET , expiry : 60 * 60 * 24 * 7 }
}
