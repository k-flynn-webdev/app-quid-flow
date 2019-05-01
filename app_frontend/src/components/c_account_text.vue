<template>

	<div class="account-text">
		<div v-if=NameShow class="field">
			<p class="text label">Name:</p>
			<p class="text account-text-item">
				{{ Input.Name.value }}
			</p>
		</div>
		<div v-if=EmailShow class="field">
			<p class="text label">Email:</p>
			<p class="text account-text-item">
				{{ Input.Email.value }}
			</p>
		</div>	
		<div v-if=PasswordShow class="field">
			<p class="text label">Password:</p>
			<p class="text account-text-item">
				{{ getPassword }}
			</p>
		</div>			
	</div>

</template>

<script>
	export default {
		name: 'AccountText',
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
			},	
			getPassword : function(){
				return 'hidden';
			}						
		},		
	}	
</script>

<style scoped >
	.field{
		overflow: hidden;
		text-align: left;
		display: flex;
		flex-direction: row;
		margin: 0.75rem 0;
		align-items: center;
	}
	.account-text{
		margin-bottom: 1rem;
	}
	.label{
		flex: 0;
		min-width: 5.5rem;
	}
	.account-text-item{
		background-color: var( --colour-input-pre );		
		width: 100%;
		padding: 0 0.5rem !important;
		flex: 1;
		height: var( --row-height-screen-large );
		line-height: 1.66rem;
	}
</style>

