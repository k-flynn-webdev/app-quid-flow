
let data = { 
	items : [] , 
	init : false,
	start : 0, 
	end : 20,
	view : 0, 
	header : [],
	graph : [],
	scroll : 0,
	day_int : -1,
	day_max : 0,
	day_pos : [],
	day_totals : [],
}; 

function data_init(){
	data.items = [];
	data.init = false,
	data.start = 0;
	data.end = 20;
	data.view = 0;
	data.header = [];
	data.graph = [];
	data.scroll = 0;
	data.day_int = -1;
	data.day_max = 0;	
	data.day_pos = [];
	data.day_totals = [];

	// header work
	for( let count=0;count<3;count++){
		data.header.push({  
			daily : 0, 
			in : 0, 
			out : 0, 
			days : 0, 
			count : 0, 
		});	
	}
}

function check_init(){
	// ran on first request by app ..
	if(!data.init){
		data.init = true;
	}
}

function get_date_from_today( daysInt ){
	let todaysDate = new Date();
	todaysDate.setDate(todaysDate.getDate() - daysInt);
	let dateFinal = new Date(todaysDate).toISOString().split('T')[0];
	return dateFinal;
}

function set_start( input ){
	data.start = input;
}
function set_end( input ){
	data.end = input;
}

function add_pre( item ){
	if( accept( item ) ){
		data.items.unshift( item );
	}
}
function add_post( item ){
	if( accept( item ) ){
		data.items.push( item );
	}
}

function update_header( input ){
	if( input.header !== undefined ){
		data.header = input.header;
		data.graph = input.graph;
	}
	// force update of header bar
}

function item_update( input ){
	for (let count=0;count< data.items.length;count++){
		if( data.items[count].id === input.items[0].id ){ 
			data.items[count].amount = input.items[0].amount;	
			data.items[count].type = input.items[0].type;	
			data.items[count].note = input.items[0].note;	
			data.items[count].date = input.items[0].date;	
			data.items[count].sign = input.items[0].sign;
			update_day_totals();	
			return true;
		}
	}
	return false;
}
function item_delete( input ){
	check_init();
	
	for (let count=0;count< data.items.length;count++){
		if( data.items[count].id === input.items[0].id ){ 
			data.items.splice(count, 1);
			update_day_totals();
			return true;
		}
	}
	
	return false;
}

function accept( item ){
	// to safely add to array, no duplication ..
	for (let count=data.items.length-1;count>=0;count--){
		if( data.items[count].id === item.id ){
			return false;
		}
	}
	return true;
}


function add_to_start( input ){
	check_init();

	for (let count=0;count< input.items.length;count++){
		add_pre( input.items[count] );
	}
	update_day_totals();	
}

function add_to_end( input ){
	check_init();

	for (let count=0;count< input.items.length;count++){
		add_post( input.items[count] );
		if(input.items[count].date_day > data.day_max){
			data.day_max = input.items[count].date_day;
		}
	}
	update_day_totals();
}


function update_scroll( input ){
	data.scroll = input;
	if( input < 50 ){
		data.day_int = -1;
		return;
	}
	update_scroll_day();
}





function math_roundToDigit( num, digit = 2 ) { 
	return +( Math.round( Number(num) + 'e+' + digit )  + 'e-' + digit ); 
}

function update_day_totals(){
	// console.log('updating days array.');
	clear_elements_pos();
	data.day_totals = [];
	for( let count=0;count<=data.day_max;count++){
		data.day_totals.push(0);
	}	
	for( let count=0;count<data.items.length;count++){
		let value = data.items[count].amount * data.items[count].sign;
		data.day_totals[ data.items[count].date_day ] += value;
	}

	for( let count=0;count<data.day_totals.length;count++){
		data.day_totals[count] = math_roundToDigit(data.day_totals[count]);
	}
}

function clear_elements_pos(){
	data.day_pos = [];
	for( let count=0;count<=data.day_max;count++){
		data.day_pos.push(maxVar);
	}
}

let elements = [];
function update_elements_pos( day, height ){
	let elementHeight = height + data.scroll;

	if( elementHeight < data.day_pos[day] ){
		data.day_pos[day] = elementHeight;
	}
}

let maxVar = 999999;
let screenOffset = 120;

function update_scroll_day(){
	let distance = maxVar;
	let index = -1;

	if(data.scroll < 50){
		return;
	}

	for( let count=data.day_pos.length;count>=0;count--){
		let tempDist = data.scroll - data.day_pos[count] + screenOffset;
		if( tempDist > 0 && tempDist < distance){
			distance = tempDist;
			index = count;
		}
	}
	data.day_int = index;
}


function force_clear(){
	data_init();
}

function view_change( input ){
	if( input !== data.view ){
		data.view = input;
	}
}

const object = { 
	data, 
	add_to_start, 
	add_to_end, 
	get_date_from_today, 
	set_start, 
	set_end, 
	item_update,
	item_delete,
	force_clear,
	view_change,
	update_header,
	update_scroll,
	update_elements_pos,
};


export default {
	install: function(Vue) {
		Vue.prototype.$quid_bg = object;
	}
}


function init(){
	data_init();
}


init();
