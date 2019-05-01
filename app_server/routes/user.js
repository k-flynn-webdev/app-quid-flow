const user = require('../controllers/user.js');
const m_transaction = require('../models/transaction.model.js');
const token = require('../controllers/token.js');
const path = require('path');
const status = require('../config/status_response.js');
const config = require('../config/config.js');
var logger = require( '../log/log.js' );

// user paths 
module.exports = function( App ) {

	App.post('/api/account/create', function(request, response){

		user.create( request.body, function(error, newUser){

			if( error ){
				logger.add( error );
				let eStatus = error.status || status.server.bad;
				return response.status(eStatus).json({ 
					status : eStatus,
					message : error.message || error, 
				});
			}

			return response.status(status.success.created).json({
				status : status.success.created,
				message : 'success new user created.',
				data : user.safeData( newUser ),
				token : token.create( newUser ),
			});	
		});
	});

	App.put('/api/account', token.check, function(request, response){

		user.update( request.decoded, request.body, function(error, newUser){

			if( error ){
				logger.add( error );
				let eStatus = error.status || status.server.bad;
				return response.status(eStatus).json({ 
					status : eStatus, 
					message : error.message || error, 
				});
			}

			// remove old token so it cant be used again
			token.remove( request.decoded, response, function(error, result){

				if( error ){
					logger.add( error );
					let eStatus = error.status || status.server.bad;
					return response.status(eStatus).json({ 
						status : eStatus, 
						message : error.message || error, 
					});
				}

				return response.status(status.success.accepted).json({
					status : status.success.accepted,
					message : 'success user updated.',
					data : user.safeData( newUser ),
					token : token.create( newUser )
				});
			});
		});
	});

	App.delete('/api/account', token.check, function(request, response){
	
		user.remove( request.decoded, request.body, function(error, user){

			if( error ){
				logger.add( error );
				let eStatus = error.status || status.server.bad;
				return response.status(eStatus).json({ 
					status : eStatus, 
					message : error.message || error, 
				});
			}

			let userTransactions = user.transactions;
			for( let count=0; count< userTransactions.length;count++){
				m_transaction.findByIdAndRemove({ _id: userTransactions[count] } , function(error , itemFound){
				});
			}

			// remove old token so it cant be used again
			token.remove( request.decoded, response, function(error, result){
				
				if( error ){
					logger.add( error );
					let eStatus = error.status || status.server.bad;
					return response.status(eStatus).json({ 
						status : eStatus, 
						message : error.message || error, 
					});
				}	

				return response.status(status.success.ok).json({
					status : status.success.ok,
					message : 'user successfully deleted, bye.',
				});	
			});
		});
	});

	App.post('/api/account/login', function(request, response){

		user.login( request.body, function(error, newUser){

			if( newUser === undefined || newUser === null || error){
				if(error){ 
					logger.add( error ); 
				}
		
				let eStatus = error.status || status.server.bad;
				return response.status(eStatus).json({ 
					status : eStatus, 
					message : error.message || error, 
				});
			}

			newToken = token.create( newUser );
			return response.status(status.success.ok).json({
				status : status.success.ok, 
				message : 'success user logged in.',
				token : newToken
			});

		});

	});

	App.post('/api/account/logout', token.check, function(request, response){

		user.logout( request.decoded, function(error, user){

			if( error ){
				logger.add( error );
				let eStatus = error.status || status.server.bad;
				return response.status(eStatus).json({ 
					status : eStatus, 
					message : error.message || error, 
				});
			}

			// remove old token so it cant be used again
			token.remove( request.decoded, response, function(error, result){
				
				if( error ){
					logger.add( error );
					let eStatus = error.status || status.server.bad;
					return response.status(eStatus).json({ 
						status : eStatus, 
						message : error.message || error, 
					});
				}	

				return response.status(status.success.ok).json({
					status : status.success.ok,
					message : 'user successfully logged out, bye.',
				});	
			});
		});
	});




}


