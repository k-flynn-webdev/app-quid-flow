<template>

	<c-panel>
		<div slot="header">
			Account Demo
		</div>

		<form class="form" action="/api/account/login" method ="POST" @submit.prevent="onSubmit">
				<c-account-input v-bind:Input=AccountInfo ></c-account-input>
				<c-button 
					v-bind:class="{ 'is-loading' : waiting,'is-success' : success, 'is-error' : error }" 
				></c-button>	
		</form>

		<div slot="footer">
			Dont have an account, why not 
			<router-link to="/register">register?</router-link>
		</div>
	</c-panel>

</template>

<script>
	
	import AccountInput from './c_account_input.vue';
	import Button from './c_button.vue';
	import Panel from './c_panel.vue';

	export default {
		name: 'LoginDemo',
		data(){
			return {
				waiting : false,
				success : false,
				error : false,
				AccountInfo : {
					Name : { show : false, isRequired : false, value : 'liveDemo' },
					Email : { show : true, isRequired : true, value : 'liveDemo@email.com' },
					Password : { show : true, isRequired : true, value : 'liveDemoPassword' },
				}
			}
		},		
		methods:{
			onSubmit : function( event ){
				let self = this;
				this.waiting = true;

				this.$request.request_url_form( event, function(error, result){

					if( error ){

						self.error = true;
						self.reset_button();

						self.$auth.user_fail( function(){
							self.$message.send({isType:'error',title:"error",message:error.message});
						});
						return;
					}

					self.success = true;
					self.reset_button();

					self.$auth.user_success( result.token ,function(){
						setTimeout( function(){
							self.$router.push('/');
							self.$request.set_SecureKey(result.token);
							// self.$message.send({isType:'success',title:"success",message:result.message});
						}, 1000 );
					});

				});
			},
			reset_button : function(){
				let self = this;
				setTimeout( function(){
					self.waiting = false;
					self.success = false;
					self.error = false;
				}, 2000 );
			},
		},
		components: {
			'c-account-input' : AccountInput, 
			'c-button' : Button,
			'c-panel' : Panel,
		},
}
</script>

<style>
</style>
