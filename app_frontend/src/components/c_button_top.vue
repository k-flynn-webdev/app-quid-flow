<template>

	<div ref="parent">
		
		<div ref="button" >
			
			<transition name="anim">

				<button v-if="display" class="button button-top title text-dark hover-scale" v-on:click=goToTop >

					<svg width="100%" height="100%" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">

							<path class="colour-text-dark" d="M27.899,0c15.398,0 27.9,12.501 27.9,27.899c0,15.398 -12.502,27.9 -27.9,27.9c-15.398,0 -27.899,-12.502 -27.899,-27.9c0,-15.398 12.501,-27.899 27.899,-27.899Zm0.009,25.064l-12.076,11.484l4,3.716l8.076,-8.231l8.058,8.231l4.001,-3.716l-12.059,-11.484Zm0,-15.18l-12.076,11.484l4,3.717l8.076,-8.232l8.058,8.232l4.001,-3.717l-12.059,-11.484Z"/>

					</svg>

				</button>

			</transition>

		</div>
			
	</div>

</template>

<script>

	export default {
		name: 'ButtonTop',
		props: {
			display : Boolean,
		},
		methods : {
			goToTop : function(){
				window.scrollTo(0,0);
				this.$quid_bg.update_scroll(0);
			}
		},		
		mounted(){
			this.$refs.button.parentNode.removeChild( this.$refs.button );
			document.body.appendChild( this.$refs.button );
		},
		beforeDestroy(){
			document.body.removeChild( this.$refs.button );	
			this.$refs.parent.appendChild( this.$refs.button );
		},			
	}

</script>

<style scoped >


.anim-enter-active, .anim-leave-active {
  transition: opacity .5s;
}
.anim-enter, .anim-leave-to {
  opacity: 0;
}

.button{
	background-color: transparent !important;
}
.button:focus{
	outline: none !important;
}
.button-top {
	border-radius: 50%;
	position: fixed;
	z-index: 20;
	bottom: 1rem;
	right: 1rem;
	width: 4rem;
	height: 4rem;
	text-align: center;
	margin: 0;
	padding: 0;
	white-space: nowrap;
}

</style>
