<template>

	<c-popup
		v-if=show_message 
		v-bind:class="getClasses"
		v-bind:onClick=closeMessage>

		<p slot="header"> {{ current_message.title }} </p>
		<p slot="options" class="text text-small number "> {{ numberOfMessages }} </p>
		<p class="text">{{ current_message.message }}</p>

	 </c-popup>

</template>


<script>

	import PopUp from './c_popup.vue';

	export default {
		name: 'cNotification',
		props: { 
			session : Object,
		},
		data(){
			return {
				session_local : this.session,
				current_message : Object,
			}
		},
		computed : {
			show_message : function(){
				if( this.session_local.hasMessages ){
					this.showMessage();
				}
				return this.session_local.hasMessages;
			},
			numberOfMessages : function(){
				if( this.session_local.messageCount > 1){
					return this.session_local.messageCount.toString();
				}
				return '';
			},
			progressBar : function(){
				if( this.current_message.progress === 100 ){
					setTimeout( this.closeMessage, 300 );
				}
				return this.current_message.progress + "%";
			},
			getClasses : function(){
				let result = [];
				result.push( this.current_message.isType );
				return result;
			},					
		},
		methods: {
			showMessage( event ){
				this.current_message = this.session_local.messages[0];
			},
			closeMessage( event ){
				this.$message.remove( this.current_message );
			},			
		},
		components: {
			'c-popup' : PopUp,
		},			
	}

</script>


<style>


	
	.notification .number{
		margin: 0.75rem;
		position: absolute;
		right: 0;
		z-index: 1;
		font-size: 1.2rem;
		font-weight: 300;
	}

/*	.popup .is-finished{
		top: -100%;
	}*/
/*	.popup .is-success{
		background-color: var( --colour-success );
	}
	.popup .is-warning{
		background-color: var( --colour-warning );
	}	
	.popup .is-error{
		background-color: var( --colour-error );
	}*/

	/*.notification .is-success p{
		color: var( --colour-text-success );
	}	
	.notification .is-warning p{
		color: var( --colour-text-warning );
	}	
	.notification .is-error p{
		color: var( --colour-text-error );
	}
*/
	/*.is-success .is-loading {
		position: relative;
		z-index: 10;
		opacity: 0.75;
		background-color: var( --colour-text-success );
		height: calc( var( --accent-line-h ) * 3.5);
		left: 0;
		width:0;
		bottom: 0; 
		transition: 0.33s;		
	}*/

</style>
