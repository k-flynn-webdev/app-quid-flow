<template>

	<div class="panel center-auto-h width-90 shadow">
		<header v-bind:class="{ 'no-split' : no_split }">
			<p class="title text-uppercase text-blur"> 
				<slot name="header" ></slot>
			</p>	
			<slot name="options"></slot>
		</header>

		<main>	
			<slot></slot>
		</main>		

		<slot name="no-margin" class="main"></slot>

		<footer>
			<p class="text"> 
				<slot name="footer"></slot>
			</p>	
		</footer>
	</div>

</template>

<script>

	require('@/assets/style/panel.css');

	export default {
		name: 'cPanel',
		props: {
			no_split : Boolean,
		},
		// computed : {
		// 	hasSplit : function(){
		// 		if( this.split === undefined ){
		// 			return false;
		// 		}
		// 		return this.split;
		// 	},
		// },
	}

</script>

<style>
</style>

