<template>

	<div class="account-input">
		<div v-if=NameShow class="field">
			<p class="text label">Name:</p>
			<input class="text" type="string" name="name" placeholder="Name" v-bind:value=Input.Name.value v-bind:required=Input.Name.isRequired >
		</div>
		<div v-if=EmailShow class="field">
			<p class="text label">Email:</p>
			<input class="text" type="email" name="email" placeholder="Email" v-bind:value=Input.Email.value v-bind:required=Input.Email.isRequired >
		</div>	
		<div v-if=PasswordShow class="field">
			<p class="text label">Password:</p>
			<input class="text" type="password" name="password" placeholder="Password" v-bind:value=Input.Password.value v-bind:required=Input.Password.isRequired >
		</div>			
	</div>

</template>

<script>
	export default {
		name: 'AccountInput',
		props: { 
			Input : {
				Name : Object,
				Email : Object,
				Password : Object,
			}
		},
		computed: {
			NameShow : function(){
				if( this.Input.Name !== undefined && this.Input.Name.show ){
					return true;
				}
				return false;
			},	
			EmailShow : function(){
				if( this.Input.Email !== undefined && this.Input.Email.show ){
					return true;
				}
				return false;
			},			
			PasswordShow : function(){
				if( this.Input.Password !== undefined && this.Input.Password.show ){
					return true;
				}
				return false;
			}							
		},		
	}	
</script>

<style>

	.account-input{
		margin-bottom: 1rem;
	}

</style>

