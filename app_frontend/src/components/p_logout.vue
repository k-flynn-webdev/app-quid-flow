<template>

	<c-panel>
		<div slot="header">
			Account Logout
		</div>

		<form class="form" action="/api/account/logout" method ="POST" @submit.prevent="onSubmit">
			<c-button 
				v-bind:class="{ 'is-loading' : waiting,'is-success' : success, 'is-error' : error }">
				Logout 
			</c-button>	
		</form>

		<div slot="footer"></div>
		
	</c-panel>

</template>

<script>

	import Button from './c_button.vue';
	import Panel from './c_panel.vue';

	export default {
		name: 'Logout',
		data(){
			return {
				waiting : false,
				success : false,
				error : false,
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

						self.$auth.logout_fail( function(){
							self.$message.send({isType:'error',title:"error",message:error.message});
						});
						return;
					}

					self.success = true;
					self.reset_button();					

					self.$auth.logout_success( function(){
						self.$request.set_SecureKey('');
						self.$message.send({isType:'success',title:"success",message:result.message});						
						
						setTimeout( function(){
							self.$router.push('/');
						}, 1000 ) });
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
			'c-button' : Button,
			'c-panel' : Panel,
		},			
	}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>