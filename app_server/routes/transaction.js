const user = require('../controllers/user.js');
const helpers = require('../controllers/helpers.js');

const transaction = require('../controllers/transaction.js');
const transactionImport = require('../controllers/transaction_import.js');
const transactionHeader = require('../controllers/transaction_header.js');

const token = require('../controllers/token.js');
const path = require('path');
const status = require('../config/status_response.js');
const config = require('../config/config.js');
var logger = require( '../log/log.js' );




// transaction paths 
module.exports = function( App ) {

	App.post('/api/transaction/create', token.check, function(request, response){

		transaction.create( request.decoded, request.body, function(error, newTransaction){

			if( error ){
				logger.add( error );
				let eStatus = error.status || status.server.bad;
				return response.status(eStatus).json({ 
					status : eStatus, 
					message : error.message || error , 
				});
			}

			if( newTransaction === null ){
				logger.add( 'error' );
				let eStatus = status.server.bad;
				return response.status(eStatus).json({ 
					status : eStatus, 
					message : 'no item created.', 
				});
			}

			return response.status(status.success.created).json({
				status : status.success.created,
				message : 'success new item created.',
				data : {
					items : [transaction.safeData( newTransaction )],
				},		
			});	
		});
	});

	App.put('/api/transaction/:_id', token.check, function(request, response){
		
		request.body._id = request.params._id;

		transaction.update( request.decoded, request.body, function(error, newTransaction){

			if( error ){
				logger.add( error );
				let eStatus = error.status || status.server.bad;
				return response.status(eStatus).json({ 
					status : eStatus, 
					message : error.message || error, 
				});
			}

			if( newTransaction === null ){
				logger.add( 'error' );
				let eStatus = status.server.bad;
				return response.status(eStatus).json({ 
					status : eStatus, 
					message : 'no item updated.', 
				});
			}

			return response.status(status.success.ok).json({
				status : status.success.ok,
				message : 'success item updated.',
				data : {
					items : [transaction.safeData( newTransaction )],
				},			
			});	
		});
	});

	App.delete('/api/transaction/:_id', token.check, function(request, response){
		
		request.body._id = request.params._id;

		transaction.remove( request.decoded, request.body, function(error, newTransaction){

			if( error ){
				logger.add( error );
				let eStatus = error.status || status.server.bad;
				return response.status(eStatus).json({ 
					status : eStatus, 
					message : error.message || error, 
				});
			}
			
			if( newTransaction === null ){
				logger.add( 'error' );
				let eStatus = status.server.bad;
				return response.status(eStatus).json({ 
					status : eStatus, 
					message : 'no item found.', 
				});
			}			

			return response.status(status.success.ok).json({
				status : status.success.ok,
				message : 'success item deleted.',
				data : {
					items : [transaction.safeData( newTransaction )],
				},
			});	
		});
	});

	App.post('/api/transaction/:_date_start/:_date_end', token.check, function(request, response){

		transaction.getRange( request.decoded, request.params._date_start, request.params._date_end, function( error, result){
		
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
				message : 'success items.',
				data : result,
			});

		});	
	});

	App.post('/api/transaction/header', token.check, function(request, response){

		let newest = helpers.get_date_from_today( -1 );

		let today = new Date();
		today = new Date( today.setMonth( today.getMonth() - 2 ) ).setDate(1);
		let oldest = new Date( today ).toISOString().split('T')[0];

		transaction.getRange( request.decoded, oldest, newest, function( error, result){

			if( error ){
				logger.add( error );
				let eStatus = error.status || status.server.bad;
				return response.status(eStatus).json({ 
					status : eStatus, 
					message : error.message || error, 
				});
			}

			transactionHeader.getHeader( result.items, function( error, result){
			
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
					message : 'success header.',
					data : { 
						graph : result.graph,
						header : result.header,
					},
				});

			});
		});
	});

	App.post('/api/transaction/import', token.check, function(request, response){

		transactionImport.importJson( request.decoded, request, function(error, result){

			if( error ){
				logger.add( error );
				let eStatus = error.status || status.server.bad;
				return response.status(eStatus).json({ 
					status : eStatus, 
					message : error.message || error , 
				});
			}

			return response.status(result.status).json({
				status : result.status,
				message : result.message,		
			});	
		});	
	});

	// TODO export ability 
	App.get('/api/transaction/export', token.check, function(request, response){

		transaction.export( request.decoded, request.body, function(error, newTransaction){

			if( error ){
				logger.add( error );
				let eStatus = error.status || status.server.bad;
				return response.status(eStatus).json({ 
					status : eStatus, 
					message : error.message || error , 
				});
			}

			if( newTransaction === null ){
				logger.add( 'error' );
				let eStatus = status.server.bad;
				return response.status(eStatus).json({ 
					status : eStatus, 
					message : 'no item created.', 
				});
			}

			return response.status(status.success.created).json({
				status : status.success.created,
				message : 'success new item created.',
				data : {
					items : [transaction.safeData( newTransaction )],
				},		
			});	
		});
	});	

}


