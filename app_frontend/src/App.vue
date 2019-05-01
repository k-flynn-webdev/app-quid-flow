<template>
	<div id="app">
		<notification v-bind:session="this.$message.session"></notification> 
		<keep-alive> 
			<nav-bar v-bind:session="this.$auth.session" ></nav-bar> 
		</keep-alive> 
		<router-view/>
	</div>
</template>

<script>
	import Navbar from './components/c_navbar.vue';
	import Notification from './components/c_notification.vue';

	// adding global style ..
	// require('./assets/style/base.css');
	require('@/assets/style/default.css');
	require('@/assets/style/colour.css');
	require('@/assets/style/text.css');

	export default {
		name: 'App', 
		created(){
			// console.log( 'starting app secure init' );
			// console.log( this.$request.get_SecureKey() );
			// console.log( this.$auth.session.token );
			this.$request.set_SecureKey( this.$auth.session.token );
			// console.log('after:')
			// console.log( this.$request.get_SecureKey() );
		},
		components: {
			'nav-bar' : Navbar,
			'notification' : Notification,
		},
	}

</script>

<style>
</style>
