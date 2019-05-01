<template>

	<svg class="svg-graph" v-bind:style="{ 'height': getHeight }" width="100%" v-bind:viewbox="head_viewBox" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;" >

		<circle
			v-for="(item, i) in head_items"
			v-bind:cx="getX(i)"
			v-bind:cy="getY(i)"
			r="1.5"
			v-bind:style="{ 'fill': getColour(i) }"
		/>	

		<rect class="anim1 blip" x="50%"  y="-50%" width="2%" height="10rem">
			<animate attributeType="XML" attributeName="x" from="120%" to="-20%"
        dur="7s" repeatCount="indefinite"/>
   		 </rect>

	</svg>	

</template>

<script>

	export default {
		name: 'cTransactionHeaderGraph',
		props: {
			session : Object,
		},
		data() {
			return {
				session_local : this.session,
			}
		},
		computed : {
			head_view : function(){
				return this.session_local.header.view;
			},	
			getHeight : function(){
				// if( this.session_local.header.months[ this.head_view ].max === 0 ){
				// 	return '0.1rem';
				// }
				return '2rem';
			},			

			head_viewBox : function(){
				let daysNo = this.session_local.header.months[ this.head_view ].days.length;
				let daysMin = this.session_local.header.months[ this.head_view ].min;
				let daysMax = this.session_local.header.months[ this.head_view ].max;

				return  ('"' + 0 + ' ' + daysMax + ' ' + daysNo + ' ' + daysMin + '"');
			},				
			head_items : function(){
				// let graphs = [];
				// for (let count=0;count<90;count++){
				// 	graphs.push(0);
				// }
				return this.session_local.header.months[ this.head_view ].days;
			},								
		},
		methods: {	
			getNormal : function( min, max, value){
				return (value - min) / ( max - min );
			},
			getLinear : function( min, max, normal){
				let mini = Math.min(min,max);
				let maxi = Math.max(min,max);
				// return ((maxi - mini) * normal) + mini;
				return ((max - min) * normal) + min;
			},
			getX : function( input){
				let days = 30 + ( 30 * this.session_local.header.view );
				let barWidth = 100.0 / days;
				let value = (input * barWidth).toString() + '%';
				return value;
			},	
			getY : function( input){
				let value = this.session_local.header.months[ this.head_view ].days[ input ];
				let min = this.session_local.header.months[ this.head_view ].min;
				let max = this.session_local.header.months[ this.head_view ].max;

				let result = ( 1 - this.getNormal(min,max,value) );

				if( value + min + max === 0){
					return '100%';
				}

				return (result * 100).toString() + '%' ;
			},	
			getColour : function( input ){
				let value = this.session_local.header.months[ this.head_view ].days[ input ];
				let min = this.session_local.header.months[ this.head_view ].min;
				let max = this.session_local.header.months[ this.head_view ].max;
				let normalized = this.getNormal(min,max,value);

				let c_top = [110.0,179.0,77.0];
				let c_bottom = [179.0,78.0,77.0];

				if( value < 0.1){
					return 'rgb(' + c_bottom[0] + ',' + c_bottom[1] + ',' + c_bottom[2] + ')' ;
				} 

				let newColour = [
					this.getLinear(c_bottom[0],c_top[0],normalized),
					this.getLinear(c_bottom[1],c_top[1],normalized),
					this.getLinear(c_bottom[2],c_top[2],normalized) 
				];

				return 'rgb(' + newColour[0] + ',' + newColour[1] + ',' + newColour[2] + ')' ;

			},
		},
		mounted(){

			// console.log( this.getLinear(100,200,.9) );
			// this.$refs.modal.parentNode.removeChild( this.$refs.modal );
			// document.body.appendChild( this.$refs.modal );
		},
		beforeDestroy(){
			// document.body.removeChild( this.$refs.modal );	
			// this.$refs.parent.appendChild( this.$refs.modal );
		},
		components: {
			// 'c-button' : Button,
			// 'c-transaction-cat' : TransactionCat,			
		},		
	}

</script>

<style scoped >

circle { fill: rgb(0,0,0); }

.anim{
	transition: 3s;
}
.blip{
	fill: var( --colour-primary );
}
.svg-graph{
	transition: .2s;
	overflow: visible;
	margin-top: 0.25rem;
	padding: 0 !important;
}

.bar {
	border: 1px black solid;
	box-sizing: border-box;
	margin: 0 !important;
	padding: 0 !important;
	background-color: white;
}

</style>
