<template>

	<div ref="parent">

		<c-popup 
			v-if=show_modal
			v-bind:onClick=closeModal>

			<div slot="header">
				Transaction
			</div>

			<form class="form" 
				v-bind:action="'/api/transaction/' + c_id + '?_method=PUT' " 
				method ="POST" 
				@submit.prevent="onSubmit">

				<div class="field big-input">
					<p class="label header text-bold" v-if=c_sign>£</p>
					<p class="label header text-bold" v-else>£ -</p>
					<input 
						class="input header1 text-bold big-input" 
						type="number" 
						step="0.01" 
						name="amount" 
						placeholder="Amount" 
						v-bind:value=c_amount>
				</div>

				<div class="field">
					<p class="label title">Type</p>
					<c-transaction-cat v-bind:selected=c_type ></c-transaction-cat>
				</div>

				<div class="field" >
					<p class="label title">Note:</p>
					<textarea 
						class="input title note-input" 
						type="string" 
						name="note" 
						placeholder="" 
						v-bind:value=c_note>
					</textarea>
				</div>

				<div class="field">
					<p class="label title">Date:</p>
					<input 
						class="input title tweak" 
						type="date" 
						name="date" 
						placeholder="Date" 
						v-bind:value=c_date >
				</div>

				<div class="flex-row flex-row-between">

					<c-button 
						type="submit"
						class="colour-positive-bg"
						v-bind:class="{ 
							'is-loading' : update_waiting,
							'is-success' : update_success }"> 				
						Update
					</c-button>
					<c-button 
						type="button"
						v-bind:onClick=onDelete 
						class="colour-negative-bg"
						v-bind:class="{ 
							'is-loading' : delete_waiting,
							'is-success' : delete_success }"> 
						Delete
					</c-button>

				</div>											

			</form>

	 </c-popup>

 </div>


	

							

						

</template>

<script>

	import PopUp from './c_popup.vue';
	import Button from './c_button.vue';
	import TransactionCat from './c_transaction_cat.vue';

	export default {
		name: 'cTransactionModal',
		data(){
			return {
				show_modal : false,
				input : {},
				update_waiting : false,
				update_success : false,
				delete_waiting : false,
				delete_success : false,	
				AccountInfo : {
					Name : { show : true, isRequired : true, value : 'newName' },
					Email : { show : true, isRequired : true, value : 'newSmallerEmail@email.com' },
					Password : { show : true, isRequired : true, value : 'new5555' },
				}							
			}
		},
		computed : {
			c_id : function(){
				return this.input.id;
			},
			c_amount : function(){
				return this.input.amount;
			},
			c_type : function(){
				return this.input.type;
			},
			c_note : function(){
				return this.input.note;	
			},
			c_date : function(){
				if( this.input.date === undefined ){
					return new Date();
				}
				return new Date( this.input.date ).toISOString().split('T')[0];
			},
			c_sign : function(){
				if( this.input.sign > 0 ){
					return true;
				}else{
					return false;
				}
			},
		},
		methods : {
			showModal : function( event ){
				this.input = event;
				this.show_modal = true;
			},
			closeModal : function(){
				this.show_modal = false;
				this.update_waiting = false;
				this.update_success = false;
				this.delete_waiting = false;
				this.delete_success = false;					
			},			
			onClick : function(){
				this.closeModal();
			},	
			onSubmit( event ){
				let self = this;
				self.update_waiting = true;

				this.$request.request_url_form( event, function(error, result){

					if( error ){
						self.$message.send({isType:'error',title:"error",message:error.message});
						// rety some time? todo 
						return;
					}

					self.update_success = true;
					// need to bg update in history??? todo
					self.$quid_bg.item_update( result.data );
					self.$root.$emit('itemChanged');						
					setTimeout( function(){
						self.closeModal();
					}, 500);					

				});
			},
			onDelete( event ){
				let self = this;
				let object = {};
				object.url = '/api/transaction/' + this.c_id + '?_method=DELETE';
				object.method = 'POST';
				object.body = '';
				self.delete_waiting = true;

				this.$request.request_url( object, function(error, result){

					if( error ){
						self.$message.send({isType:'error',title:"error",message:error.message});
						// rety some time? todo 
						return;
					}

					self.delete_success = true;
					setTimeout( function(){
						self.closeModal();
					}, 600);
					setTimeout( function(){
						self.$quid_bg.item_delete( result.data );
						self.$root.$emit('itemChanged');
					}, 1100);
				});
			},
		},
		created : function(){
			this.$root.$on('itemClicked', this.showModal );
			// gets the global event of a click ..
		},
		components: {
			'c-button' : Button,
			'c-popup' : PopUp,
			'c-transaction-cat' : TransactionCat,
		},		
	}

</script>

<style scoped>

.big-input {
	height: 3rem;
	padding: 0;
	margin: 0;
	border: 0 none;
	vertical-align: normal !important;
	line-height: 1rem;
	font-size: 1.75em !important;

}
.tweak {
	line-height: 1rem;	
	font-size: 1em !important;
}
.note-input {
	height: 4rem;
}

</style>
