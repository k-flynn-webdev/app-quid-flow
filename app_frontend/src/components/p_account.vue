<template>

	<div>

		<c-popup 
			v-if=show_delete 
			v-bind:onClick=closeDelete>
			 
			<div slot="header">
				Delete Account
			</div>

			<p class="text"> Are you sure you want to delete </p>
			<p class="text"> this account? </p>
			<br>

			<div class="flex-row flex-row-between">

				<c-button 
					v-bind:onClick=closeDelete 
					type="button">
					Close
				</c-button>
				<c-button 
					type="button"
					v-bind:onClick=onDelete 
					class="colour-negative-bg">
					Delete
				</c-button>

			</div>	

		 </c-popup>


		<c-panel>
			<div slot="header">
				Account
			</div>

			<form class="form" action="/api/account/?_method=PUT" method ="POST" @submit.prevent="onSubmit">
				<c-account-input v-if=isEditing v-bind:Input=AccountInfo ></c-account-input>
				<c-account-text v-else v-bind:Input=AccountInfo ></c-account-text>
				
				<div class="flex-row flex-row-between"
					v-bind:class="{ 'is-edit' : !isEditing }">

					<c-button 
						class="colour-yellow"
						v-bind:onClick=onEdit 
						type="button">
						{{ button_undo_label }}
					</c-button>
					<c-button 
						v-show=isEditing type="submit" 
						class="colour-positive-bg" 
						v-bind:class="{ 'is-loading' : waiting_update }">
						Update 
					</c-button>
					<c-button 
						v-show=isEditing type="button"
						v-bind:onClick=showDelete 
						class="colour-negative-bg" 
						v-bind:class="{ 'is-loading' : waiting_delete }">
						Delete
					</c-button>

				</div>		

			</form>
			
		</c-panel>

		<c-account-opts></c-account-opts>	

	</div>

</template>

<script>

	import AccountInput from './c_account_input.vue';
	import AccountText from './c_account_text.vue';
	import AccountOpts from './c_account_opts.vue';
	import Button from './c_button.vue';
	import Panel from './c_panel.vue';
	import PopUp from './c_popup.vue';

	export default {
		name: 'Account',
		data(){
			return {
				isEditing : false,
				button_undo_label : 'edit',
				waiting_update : false,
				waiting_delete : false,
				show_delete : false,
				AccountInfo : {
					Name : { show : true, isRequired : true, value : 'newName' },
					Email : { show : true, isRequired : true, value : 'newSmallerEmail@email.com' },
					Password : { show : true, isRequired : true, value : 'new5555' },
				}
			}
		},		
		methods:{
			onEdit : function(){
				this.isEditing = !this.isEditing;
				this.button_undo_label = this.isEditing ? 'undo' : 'edit';
			},
			showDelete : function(){
				this.show_delete = true;
			},
			closeDelete : function(){
				this.show_delete = false;
			},						
			onSubmit : function( event ){
				let self = this;
				this.waiting_update = true;

				this.$request.request_url_form( event, function(error, result){

					if( error ){

						self.reset_button();

						self.$auth.user_fail( function(){
							self.$message.send({isType:'error',title:"error",message:error.message});
						});
						return;
					}

					self.reset_button();

					self.$auth.user_success( result.token ,function(){
						setTimeout( function(){
							self.$router.push('/');
							self.$request.set_SecureKey(result.token);
							self.$message.send({isType:'success',title:"success",message:result.message});
						}, 1000 );
					});

				});
			},
			onDelete( event ){
				let self = this;
				let object = {};
				object.url = '/api/account/?_method=DELETE';
				object.method = 'POST';
				object.body = '';
				this.waiting_delete = true;

				this.$request.request_url( object, function(error, result){

					self.reset_button();
					self.closeDelete();
					
					if( error ){

						self.$message.send({isType:'error',title:"error",message:error.message});
						// rety some time? todo 
						return;
					}	

					self.$auth.logout_success( function(){
						self.$request.set_SecureKey('');
						self.$quid_bg.force_clear();
						self.$router.push('/');
						self.$message.send({isType:'success',title:"success",message:result.message});						
					});
				});			
			},						
			reset_button : function(){
				let self = this;
				setTimeout( function(){
					self.waiting_update = false;
					self.waiting_delete = false;
				}, 2000 );
			},
		},
		components: {
			'c-account-input' : AccountInput, 
			'c-account-text' : AccountText, 
			'c-account-opts' : AccountOpts, 
			'c-button' : Button,
			'c-panel' : Panel,
			'c-popup' : PopUp,
		},
}
</script>

<style scoped >

	.is-edit {
		justify-content: flex-start;
	}

</style>
