<template>

	<div ref="parent">
		
		<div ref="bar">

			<transition name="anim">	

				<div  v-if=display class="transaction-bar flex-row flex-row-between flex-align-center">

					<p 
						class="value title text-bold text-light anim-slow no-wrap"
						v-bind:class="{'is-positive': isPositive }"> 
							{{ total }} 
						</p>
					<p class="title text-bold text-dark no-wrap border-box">{{ date_render }}</p>

				</div>

			</transition>

		</div>	

	</div>

</template>

<script>

	export default {
		name: 'TransactionBar',
		props: {
			session : Object,
		},		
		data () {
			return {
				session_local : this.session,
			}
		},
		computed : {
			display : function(){
				if( this.session_local.scroll > 50 && this.session_local.day_int !== -1 ){
					return true;	
				}
				return false;
			},
			date_render : function(){
				if( this.session_local.day_int === 0){
					return 'today';
				}
				if( this.session_local.day_int === 1){
					return 'yesterday';
				}				
				return this.session_local.day_int + ' days old';
			},
			date : function(){				
				return this.session_local.day_int;
			},
			isPositive : function(){
				if( this.total > 0 ){
					return true;
				}
				return false;
			},
			total : function(){
				return this.session_local.day_totals[ this.date ];
			}
		},
		methods : {
			emit_call_to_update : function(){
				let self = this;
				setTimeout(function(){
					self.$root.$emit('updateElements');
				}, 1500);
			},
		},
		mounted(){	
			this.$root.$on('itemChanged', this.emit_call_to_update );	
			this.$root.$on('itemsFetched', this.emit_call_to_update );	

			this.$refs.bar.parentNode.removeChild( this.$refs.bar );
			document.body.appendChild( this.$refs.bar );	
		},
		beforeDestroy(){
			document.body.removeChild( this.$refs.bar );	
			this.$refs.parent.appendChild( this.$refs.bar );
		},			
	}

</script>

<style scoped>

.transaction-bar {
	position: fixed;
	pointer-events: none;
	z-index: 50;
	top: 0;
	height: 3rem;
	left: 2.5rem;
	width: calc(100% - (2.5rem + 3.5rem));
}

.anim-slow {
	transition: 1s;
}

.value:before {
	content: "£";
}

.days-cell {
	text-align: right;
}

.border-box {
	transform-origin: center right;
	transform: scale(0.75);
	border-radius: 0.4rem;
	padding: 0.2rem 0.66rem;
	background-color: var( --colour-text-light );
}

.is-positive{
	color: hsla(100,65%,85%,1);
}

.anim-enter-active, .anim-leave-active {
	transition: opacity .5s;
}
.anim-enter, .anim-leave-to {
	opacity: 0;
}

/*@media only screen and (max-width: 375px) {
	.value{
		font-size: 1.85rem !important;
	}
	.days{
		font-size: 1rem !important;
	}
}
*/

</style>
