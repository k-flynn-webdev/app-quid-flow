<template>

	<transition v-bind:name=anim_name>

		<tr class="row" v-bind:class="{'is-positive': input.sign + 1, 'is-highlight' : checkHighlight }" v-on:click=onClick >

				<td class="col-amount text text-med">  
					{{ input.amount }}
				</td>
				<td class="col-type text text-med"> 
					{{ input.type }}   
				</td>
				<td class="col-note text text-med"> 
					{{ input.note }}   
				</td>
				<td class="col-date text text-med"> 
					{{ date }}   
				</td>
		</tr>

	</transition>

</template>

<script>

	export default {
		name: 'cTransaction',
		props: {
			input : Object,
			day_int : Number,
			is_bulk : Boolean,
		},
		data(){
			return{
				position : 0,
			}
		},
		computed: {
			anim_name : function(){
				if( this.is_bulk ){
					return 'row-bulk';
				}
				return 'row-single';	
			},
			checkHighlight : function(){
				if( this.day_int === this.input.date_day ){
					return true;
				}
				return false;
			},
			date : function(){
				let newDate = new Date( this.input.date );
				let month = (newDate.getMonth()+ 1);
				if( month < 10){
					month = '0' + month.toString();
				}

				return newDate.getDate() + '-' + month + '-' + newDate.getFullYear();
			},
		},
		methods: {		
			updateElements : function(){
				this.$quid_bg.update_elements_pos( this.input.date_day, this.$el.getBoundingClientRect().top || this.$el.getBoundingClientRect().y );
			},
			onClick : function(){
				this.$root.$emit('itemClicked', this.input );
			},			
		},
		mounted(){
			this.$root.$on('updateElements', this.updateElements );
		}
	}

</script>

<style scoped>
	
	.row-bulk-enter-active, .row-bulk-leave-active{
		transition: opacity 1s;
	}
	.row-bulk-enter, .row-bulk-leave-to{
		opacity: 0;
	}

	.row-single-enter{
		opacity: 0;
		transform: translateX(10rem);
		background-color: transparent;
	}	
	.row-single-enter-active {
		opacity: 0.5;
		background-color: var( --colour-text-positive );
	}
	.row-single-leave{
		opacity: 0.5;
		background-color: var( --colour-text-negative );		
	}	
	.row-single-leave-active {
		opacity: 0;
		transform: translateX(10rem);
		background-color: var( --colour-text-negative );	
	}


	.row {
		height: 2rem;
		border-bottom: solid 2px hsla(1,1%,50%,0.33);
		transition: 1s;
	}

	.row .text{
		color: var( --colour-text-negative );
	}
	.row.is-positive .text{
		color: var( --colour-text-positive );
	}

	.row.is-highlight .text{
		color: var( --colour-text-dark );
	}

	.row.is-highlight {
		background-color: var( --colour-error );
	}	
	.row.is-highlight.is-positive {
		background-color: var( --colour-success );
	}



	.body .col-amount::before{
		content: "£ -";
	}	
	.body .is-positive .col-amount::before{
		content: "£";
	}	
	.body .col-amount{
		text-align: left;
		text-overflow: clip;
	}
	.body .col-type{
		padding-left: 0.5rem;
		text-align: left;
	}	
	.body .col-note{
		text-align: left;
		opacity: 0.6;
	}
	.body .col-date{
		text-align: right;
		font-size: 0.8rem !important;
	}


</style>
