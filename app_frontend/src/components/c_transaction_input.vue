<template>

	<c-panel v-bind:no_split="true">
		<div slot="header">
		</div>

		<form 
			class="form" 
			action="/api/transaction/create" 
			method ="POST" 
			@submit.prevent="onSubmit">

			<div class="field row-tight">
				<input 
					class="input-margin input-value1 text text-bold"
					ref="amount"  
					type="number" 
					step="0.01" 
					name="amount" 
					placeholder="£ Amount" 
					required=true>

				<c-transaction-cat class="input-cat1 text-bold"
					ref="cat"
					v-bind:selected=type >
				</c-transaction-cat>

			</div>

			<div class="field row-tight">
				<input 
					class="input-margin input-note1 text-bold text"
					ref="note"  
					type="string" 
					name="note" 
					placeholder="Note">

				<c-button 
					type="submit"
					v-bind:class="{ 
						'is-loading' : input_waiting,
						'is-success' : input_success, 
						'is-error' : input_error }">
						Add
				</c-button>	

			</div>

		</form>

	</c-panel>

</template>

<script>

	import Panel from './c_panel.vue';
	import Button from './c_button.vue';
	import TransactionCat from './c_transaction_cat.vue';

	export default {
		name: 'cTransactionInput',
		data() {
			return {
				type : "--",
				input_waiting : false,
				input_success : false,
				input_error : false,
			}
		},
		computed : {
			contentSign : function(){
				if( this.input.sign > 0 ){
					return true;
				}else{
					return false;
				}
			},
			contentState : function(){
				return this.input.display;
			},
		},
		methods: {
			reset : function(){
				this.$refs.amount.value = '';
				this.$refs.cat.$options.value = 0;
				this.$refs.note.value = '';
			},	
			onClick : function(){
				this.input.display = false;
			},	
			reset_button : function(){
				let self = this;
				setTimeout( function(){
					self.input_waiting = false;
					self.input_success = false;
					self.input_error = false;
				}, 1500 );
			},		
			onSubmit( event ){
				let self = this;
				this.input_waiting = true;

				this.$request.request_url_form( event, function(error, result){

					self.reset_button();

					if( error ){
						console.log( 'error' );
						console.log( error );

						self.input_error = true;

						// try to rety perhaps? TODO 
						self.$message.send({isType:'error',title:"error",message:error.message});
						return;
					}
						
					self.input_success = true;
					self.reset();
					
					setTimeout(function(){
						self.$quid_bg.add_to_start( result.data );
						self.$root.$emit('itemChanged');
					},750);

				// 	// force an update 
						// TODO add a animated tick
				// 	self.$message.send({isType:'success',title:"success",message:result.message});

				});
			}			
		},
		components: {
			'c-button' : Button,
			'c-panel' : Panel,
			'c-transaction-cat' : TransactionCat,			
		},		
	}

</script>

<style scoped >

	.input-margin {
		margin-right: 0.5rem;
	}	
	.row-tight {
		margin-top: 0.5rem !important;
		margin-bottom: 0.5rem !important;
	}

</style>
