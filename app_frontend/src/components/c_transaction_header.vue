
<template>

	<c-panel>
		<div slot="options" style="height:2rem;" >

			<div class="flex-row flex-row-end" style="height:100%;align-items:flex-end;">
				<p class="text text-blur" style="align-self:center;">Months:</p>
				<button 
					v-on:click=changeView(0)
					class="option text text-bold text-light"
					v-bind:class="{'is-active': head_view === 0 }">
					{{ this.getMonths(0) }}
				</button>
				<button 
					v-on:click=changeView(1)
					class="option text text-bold text-light"
					v-bind:class="{'is-active': head_view === 1 }">
					{{ this.getMonths(1) }}
				</button>
				<button 
					v-on:click=changeView(2)
					class="option text text-bold text-light"
					v-bind:class="{'is-active': head_view === 2 }">
					{{ this.getMonths(2) }}
				</button>				
			</div>

		</div>

		<div class="flex-row flex-row-between flex-align-end">
			
			<div class="content-left">
				<h1 
					id="daily"
					class="text-funky header text-left no-wrap "
					v-bind:class="{'text-small': head_daily_size }">
					{{ head_daily }}
				</h1>				
			</div>

			<div class="text-right content-right">

				<svg class="text-positive icon-in" height="100%" viewBox="0 0 12 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
					<path  d="M5.992,0l6,5.706l-1.988,1.847l-4.012,-4.09l-4.004,4.09l-1.988,-1.847l5.992,-5.706Z" />
				</svg>

				<p class="title text-small text-right text-positive text-bold no-wrap value-in">
					{{ head_in }}
				</p>

				<div class="value-mid">
					<svg class="text-negative icon-out" height="100%" viewBox="0 0 12 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
						<path d="M5.992,7.553l6,-5.707l-1.988,-1.846l-4.012,4.09l-4.004,-4.09l-1.988,1.846l5.992,5.707Z"/>
					</svg>

					<p class="title text-small text-right text-negative text-bold no-wrap value-out">
						-{{ head_out }}
					</p>
				</div>

			</div>
		</div>

		<div slot="footer">
			<p class="text text-left text-blur text-info-left">
				( £ per day )
			</p>
			<p class="text text-right text-blur text-info-right">
				( {{ head_count }} items )
			</p>

			<div style="height:1.66rem;"></div>


		</div>

	</c-panel>

</template>


<script>

	import Panel from './c_panel.vue';

	export default {
		name: 'cTransactionHeader',
		props: {
			session : Object,
		},
		data() {
			return {
				session_local : this.session,
				waiting : false,
				attempts : 0,
				max_attempts : 4,
				current_view : {
					daily : 0,
					in : 0,
				 	out : 0,
				 	count : 0,
				},
				update_time : 66,
				update_var : 0.521,
			}
		},
		computed : {
			head_view : function(){
				return this.session_local.view;
			},
			head_daily_size : function(){
				if( Math.abs( this.session_local.header[ this.head_view ].daily ) > 999 ){
					return true;
				}
				return false;
			},			
			head_daily : function(){
				let self = this;
				let current = this.current_view.daily;
				let goal = this.session_local.header[ this.head_view ].daily;					
				let delta = Math.abs(current - goal) * this.update_var;					
				if( current !== goal ){
					setTimeout(function(){
						self.current_view.daily = self.tween_num(current,goal,delta);
					}, this.update_time);
				}
				return this.current_view.daily;
			},
			head_in : function(){
				let self = this;
				let current = this.current_view.in;
				let goal = this.session_local.header[ this.head_view ].in;
				let delta = Math.abs(current - goal) * this.update_var;

				if( current !== goal ){
					setTimeout(function(){
						self.current_view.in = self.tween_num(current,goal,delta);
					}, this.update_time);
				}
				return this.current_view.in;
			},	
			head_out : function(){
				let self = this;
				let current = this.current_view.out;
				let goal = this.session_local.header[ this.head_view ].out;
				let delta = Math.abs(current - goal) * this.update_var;	

				if( current !== goal ){
					setTimeout(function(){
						self.current_view.out = self.tween_num(current,goal,delta);
					}, this.update_time);
				}
				return this.current_view.out;
			},		
			head_count : function(){
				let self = this;
				let current = this.current_view.count;
				let goal = this.session_local.header[ this.head_view ].count;
				let delta = 1;

				if( current !== goal ){
					setTimeout(function(){
						self.current_view.count = self.tween_num(current,goal,delta);
					}, this.update_time);
				}
				return this.current_view.count;
			},											
		},
		methods: {
			set_current_view_var : function( input ){
				function tween( start, goal, change){
					return start + change * (goal - start);
				}

				this.current_view.daily = this.round_var( tween( this.current_view.daily, this.session_local.header[ this.head_view ].daily , input));

				this.current_view.in = this.round_var( tween( this.current_view.in, this.session_local.header[ this.head_view ].in , input));

				this.current_view.out = this.round_var( tween( this.current_view.out, this.session_local.header[ this.head_view ].out , input));

				this.current_view.count = Math.round(tween( this.current_view.count, this.session_local.header[ this.head_view ].count , input));
			},
			round_var : function( input ){
				return Math.round(input * 100) / 100
			},
			tween_num : function( current, target , delta ){
				let tempVar = current;
				if (Math.abs(target - current) <= delta){
					return target;
				}
				tempVar = current + Math.sign(target - current) * delta;
				return this.round_var( tempVar );
			},
			getMonths : function( input ){
				let months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
				
				let thisMonth = new Date().getMonth();
				let monthIndex = thisMonth - input;
				let remainder = (monthIndex % months.length);
				if( remainder < 0){
					monthIndex = months.length - Math.abs(remainder);
				}

				return months[ monthIndex ];
			},
			fetch : function(){
				if( !this.waiting ){
					this.waiting = true;
					this.get_header();
				}
			},
			retry_fetch : function(){
				let self = this;
				if( this.waiting && this.attempts < this.max_attempts ){
					setTimeout( function(){ 
						console.log('trying header again');
						self.attempts +=1;
						self.get_header();
					}, 2000);
				} else {
					this.reset_fetch(); // force an abort?
				}
			},
			reset_fetch : function( func ){
				if( this.waiting ){
					this.waiting = false;
					this.attempts = 0;
				}
			},			
			changeView : function( input ){
				if( input === this.head_view ){
					return;
				}
				this.$quid_bg.view_change( input );
				this.set_current_view_var( 0.9 );
			},
			get_header : function(){	
				let requestObj = {};
				requestObj.method = 'post';
				requestObj.url = '/api/transaction/header' ;

				let self = this;
				this.$request.request_url( requestObj, function(error, result){
					if( error ){
						console.log('error');
						console.log(error);
						// rety silently in bg later?
						self.retry_fetch();
						return;
					}

					self.$quid_bg.update_header( result.data );
					self.reset_fetch();
				});
			},						
		},
		created(){
			this.set_current_view_var( 0.9 );
		},
		mounted(){
			this.$root.$on('itemChanged', this.fetch );			
			if( !this.session_local.init ){
				this.fetch();
			}			
		},
		components: {
			'c-panel' : Panel,
		},
	}

</script>


<style >

#daily {
	position: absolute;
	left: 0;
	margin-top: -0.5rem;
}
#daily.text-small {
	margin-top: 0.1rem;
} 
 
.option {
	margin: 0 0.4rem;
	padding: 0 0.4rem;
	text-transform: uppercase;
	height: 75%;
	min-width: 2rem;
	text-align: center;
	opacity: 0.5;
	transition: 0.33s;
	background-color: var( --colour-bg );
}
.option:hover {
	transform: translateY(-10%) scale(1.1);
}
.option:active {
	transform: translateY(-25%) scale(1.1);
}
.option.is-active {
	align-self: flex-start;
	opacity: 1;
	font-weight: 400;
}

.icon-in , .icon-out {
	position: absolute;
	height: 1rem;
	right: 0;
}
.icon-out {
	bottom: 1rem;
}

.value-in , .value-out {
	position: absolute;
	right: 1.75rem;
}
.value-out {
	bottom: 1rem;
}
.value-mid {
	height: 1rem;
	top: 100%;
	position: relative;
}

.text-info-left , .text-info-right {
	display: inline-block;
}
.text-info-left {
	position: absolute;
	left: 0;
	margin-left: 1rem;
}
.text-info-right {
	position: absolute;
	right: 0;
	margin-right: 1rem;
}

.content-left , .content-right {
	background-color: lightgrey;
	height: 4rem;
	position: relative;
}

</style>
