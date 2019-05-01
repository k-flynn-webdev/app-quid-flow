
<template>

	<button class="button fade-in" v-on:click=clicked>
		<p class="text text-light"> 
			<slot> 
			 	Submit 
			</slot> 
		</p> 
		<span class="loading" ></span>
		<span class="loading" ></span>
		<span class="loading" ></span>		
	</button>

</template>

<script>
	export default {
		name: 'cButton',
		props: {
			onClick : Function,
		},
		methods : {
			clicked : function(){
				if( this.onClick !== undefined ){
					this.onClick();
				}
			},
		},
	}
</script>

<style>
	
	div button:nth-child(1), div .button:nth-child(1){
		animation-delay: 0.1s;
	}
	div button:nth-child(2), div .button:nth-child(2){
		animation-delay: 0.2s;
	}
	div button:nth-child(3), div .button:nth-child(3){
		animation-delay: 0.3s;
	}
	div button:nth-child(4), div .button:nth-child(4){
		animation-delay: 0.4s;
	}

	.button{
		overflow: hidden;
		box-sizing: border-box;
		border-radius: 0.3rem; 
		padding: 0 0.66rem;
		background-color: var( --colour-button );
	}

	.button p {
		transition: 0.5s;
	}
	
	.button.is-loading{

	}

	.button.is-loading p{
		opacity: 0.1;
	}

	.button.is-loading.is-success p{
		opacity: 0.75;
	}
	.button.is-loading.is-error p{
		opacity: 0.75;
	}

	.button .loading{
		position: absolute;
		top: -0.8rem;
		left: -1rem;
		z-index: 0;
		display: inline;
		height: 3rem;
		width: 1rem;		
		background-color: white;
		opacity: 0;
		transition: 1s;
		transform: skew(20deg) translateX(-1rem);
	}

@keyframes is-loading-anim {
	0% { transform: skew(20deg) translateX(-.4rem); }
	100% { transform: skew(20deg) translateX(6.6rem);  }
}

	.button.is-loading .loading{
		opacity: 0.5;
		animation: is-loading-anim 1.5s ease infinite;	
	}

	.button.is-success .loading{
		opacity: 0.75;	
		animation: is-loading-anim 1.5s ease infinite;	
	}
	.button.is-error .loading{
		opacity: 0.75;	
		animation: is-loading-anim 1.5s ease infinite;	
	}

	.button .loading:nth-child(1){
		animation-delay: 0;
	}	
	.button .loading:nth-child(2){
		animation-delay: 0.4s;
	}
	.button .loading:nth-child(3){
		animation-delay: 0.75s;
	}

	.button.is-success{
		background-color: var( --colour-text-positive );
	}
	.button.is-error{
		background-color: var( --colour-text-negative );
	}

</style>
