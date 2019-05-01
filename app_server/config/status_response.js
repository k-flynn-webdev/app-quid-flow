
module.exports = {
	success : { ok : 200, created : 201, accepted : 202, done : 204 },
	client : { bad : 400, unauthorized : 401, forbidden : 403, not_found : 404, input_error : 422 },
	server : { bad : 500, unavailable : 503, timeout : 504, unauthorized : 511 }
}


// 204 doesnt send response message
// 401 doesnt send response message
