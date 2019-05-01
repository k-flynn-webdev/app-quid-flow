<template>

	<div ref="parent">
		
		<c-button-top 
			v-bind:display=showTopButton>		
		</c-button-top>

		<c-panel>
			<div ref="cHistory" slot="header">
				Transactions
			</div>

			<table slot="no-margin" style="margin:0 !important;padding:0 !important;">
				
				<thead class="head">
					<tr class="row">
						<th class="text text-blur colour-text-dark col-amount">Amount</th>
						<th class="text text-blur colour-text-dark col-type">Type</th>
						<th class="text text-blur colour-text-dark col-note">Note</th>
						<th class="text text-blur colour-text-dark col-date">Date</th>
					</tr>
				</thead>

				<tbody>

					<c-transaction 
						v-for="item in transaction_data" :key="item.id" 
							v-bind:input="item" 
							v-bind:day_int="day_int"
							v-bind:is_bulk="bulk_requested"
					></c-transaction>

				</tbody>

			</table>
				
			<c-button 
				slot="footer" 
				v-bind:onClick=fetch
				v-bind:class="{ 
					'is-loading' : fetch_waiting,
					'is-success' : fetch_success, 
					'is-error' : fetch_error }">
						More
			</c-button>	

		</c-panel>

	</div>

</template>

<script>
	
	import Panel from './c_panel.vue';
	import Button from './c_button.vue';
	import ButtonTop from './c_button_top.vue';
	import Transaction from './c_transaction.vue';

	export default {
		name: 'cHistory',
		data () {
			return {
				session_local : this.session,
				scrolled : 0,
				attempts : 0,
				max_attempts : 4,
				date_span : 20,
				showTopButton : false,
				bulk_request : false,
				fetch_waiting : false,
				fetch_success : false,
				fetch_error : false,				
			}
		},
		props: {
			session : Object,
		},
		computed: {
			day_int : function(){
				return this.session_local.day_int;
			},
			start : function(){
				return this.session_local.start;
			},
			end : function(){
				return this.session_local.end;
			},			
			transaction_data : function(){
				return this.session_local.items;
			},
			bulk_requested : function(){
				return this.bulk_request;
			},
		},
		methods: {
			fetch : function(){
				this.bulk_request = true;
				if( !this.fetch_waiting ){
					this.get_more();
				}
			},
			retry_fetch : function(){
				let self = this;
				if( this.fetch_waiting && this.attempts < this.max_attempts ){
					setTimeout( function(){ 
						console.log('trying again');
						self.attempts +=1;
						self.get_more();
					}, 2000);
				} else {
					this.reset_fetch(); // force an abort?
				}
			},
			reset_fetch : function( func ){
				if( this.fetch_waiting ){
					let self = this;
					setTimeout( function(){
						self.fetch_waiting = false;
						self.fetch_success = false;
						self.fetch_error = false;
						self.attempts = 0;
					},1000);
				}
				this.reset_bulk();				
			},
			reset_bulk : function(){
				let self = this;
				setTimeout( function(){
					self.bulk_request = false;
				},25);
			},
			get_more : function(){
				this.fetch_waiting = true;
				let newest = this.$quid_bg.get_date_from_today( this.start - 1);
				let oldest = this.$quid_bg.get_date_from_today( this.end );
				
				let requestObj = {};
				requestObj.method = 'post';
				requestObj.url = '/api/transaction/' + oldest + '/' + newest;

				let self = this;
				this.$request.request_url( requestObj, function(error, result){
					if( error ){
						console.log('error');
						console.log(error);
						self.fetch_error = true;
						// rety silently in a moment?
						self.retry_fetch();
						return;
					}

					self.reset_fetch();
					self.fetch_success = true;
					self.$quid_bg.add_to_end( result.data );

					self.$quid_bg.set_start( self.start + self.date_span );
					self.$quid_bg.set_end( self.start + (self.date_span*2) );

					self.$root.$emit('itemsFetched');
				});
			},
			getScroll: function() {
				let self = this;
				window.requestAnimationFrame( function(){
					// let windowScroll = window.scrollY;
					// let windowScroll = document.scrollTop;
					let windowScroll = window.pageYOffset | window.scrollY;
					// console.log( windowScroll );
					let difference = Math.abs( windowScroll - self.scrolled);
					if ( difference > 10 ){ // throttling output changes ..
						self.scrolled = windowScroll;
						self.$quid_bg.update_scroll(windowScroll);
						self.checkTop();	
					}
				});
			},
			checkTop : function(){
				// let topPos = this.$el.getBoundingClientRect().top;
				// let topPos = this.$refs.cHistory.getBoundingClientRect().top;
				if( this.scrolled >= 600 ){
					// console.log( 'rect pos' );
					// console.log( this.$el.getBoundingClientRect() );
				// if( topPos > 50 ){		
					this.showTopButton = true;
				} else {
					this.showTopButton = false;
				}
			},		
		},
		mounted(){
			if( !this.session_local.init ){
				this.fetch();				
			}
		},
		created(){
			window.addEventListener('scroll', this.getScroll);
		},		
		beforeDestroy(){
			window.removeEventListener('scroll', this.getScroll);
			this.scrolled = 0;
			this.$quid_bg.update_scroll(0);
			this.checkTop();
		},
		components: {
			'c-transaction' : Transaction, 
			'c-button' : Button,
			'c-button-top' : ButtonTop,
			'c-panel' : Panel,
		},
}
	
</script>

<style>	
.head {
	background-color: hsl(177,20%,93%);
}
th {
	opacity: 0.5;
}

table {
	margin:0;
	padding:0;
	width: calc(100% + 1px);
	table-layout: fixed;
	border-collapse: collapse;
}
td {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.col-amount {
	padding-left: var( --margin-screen-large );
	width: 22%;
}
.col-type {
	width: 27%;
}
.col-note {
}
.col-date {
	padding-right: var( --margin-screen-large );
	width: 27%;
}


@media only screen and (max-width: 400px) {
	.col-amount {
		width: 25%;
		padding-left: var( --margin-screen-med );
	}
	.col-type{
		width: 27%;
	}	
	.col-date {
		width: 27%;
		padding-right: var( --margin-screen-med );
	}
}

@media only screen and (max-width: 320px) {
	.col-amount {
		width: 25%;
		padding-left: var( --margin-screen-small );
	}
	.col-type{
		width: 27%;
	}	
	.col-date {
		width: 27%;
		padding-right: var( --margin-screen-small );
	}
}


</style>

