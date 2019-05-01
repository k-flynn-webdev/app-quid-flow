<template>
	<nav id="navbar">

		<div 
			class="toggle hover-scale" 
			v-bind:class=burgerState 
			v-on:click=toggle>
				<span class="span-1"></span>
				<span class="span-2"></span>
				<span class="span-3"></span>
		</div>	

		<router-link to="/" class="bar-logo colour-text-light">
				
			<svg class="colour-navbar" height="100%" viewBox="0 0 30 60" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.4;">

				<path id="navbar_logo_bg" class="colour-navbar" d="M30,0.027l-30,-0.027l0,44.077l3.706,4.089l4.822,1.338l1.117,7.145l6.125,3.31l14.23,0.059l0,-59.991Z"/>

				<path id="navbar_logo" class="text-light" d="M15.77,59.959c-3.58,-0.233 -9.379,-1.663 -9.21,-9.738c-4.373,-0.662 -6.56,-3.061 -6.56,-7.196c0,-0.874 0.093,-1.815 0.278,-2.822l1.63,-9.145c1.193,-6.705 5.513,-10.058 12.961,-10.058c6.414,0 9.621,2.491 9.621,7.474c0,0.795 -0.079,1.657 -0.238,2.584l-1.63,9.145c-0.53,3.074 -1.624,5.44 -3.28,7.096c-1.657,1.657 -3.969,2.657 -6.938,3.002c-0.06,6.66 3.944,6.408 5.746,6.408l0,0.007l11.85,0.026l0,3.265l-11.85,-0.018l0,0.003c-0.367,0 -2.302,-0.016 -2.38,-0.033Zm-5.036,-15.662c1.326,0 2.386,-0.331 3.181,-0.993c0.795,-0.663 1.352,-1.882 1.67,-3.658l1.431,-8.031c0.079,-0.504 0.119,-0.954 0.119,-1.352c0,-2.067 -1.113,-3.101 -3.339,-3.101c-2.73,0.053 -4.347,1.538 -4.851,4.453l-1.391,8.031c-0.106,0.636 -0.159,1.299 -0.159,1.988c0,1.776 1.113,2.663 3.339,2.663Z" style="fill-rule:nonzero;"/>

			</svg>

		</router-link>

		<div class="bar-fill-right"></div>

		<div 
			v-on:click=click
			class="content" v-bind:class="{ 'is-active' : contentState }">
			
			<navbar-link 
				v-if="isLoggedIn" 
				v-bind:link="user_navbar()" >
			</navbar-link>	

			<navbar-link 
				v-for="link in links_current" 
				:key="link.id" 
				v-bind:link="link" >
			</navbar-link>	

		</div>

	</nav>		

</template>

<script>

	import NavbarLink from './c_navbarLink.vue';

	export default {
		data() {
			return {
				contentState : false,
				session_local : this.session,
				burgerState : 'bars',

				links_non_user : [
					 { title : "about", url : "/about", icon : "fab fa-uikit"},
					 { title : "login", url : "/login", icon : "fab fa-uikit"},
					 { title : "register", url : "/register", icon : "fab fa-uikit"},
				],
				links_user : [
					 { title : "logout", url : "/logout", icon : "fab fa-uikit"},
				],
				links_current : [],
			}		
		},
		props : {
			session : Object,
		},

		computed: {
			isLoggedIn : function(){

				if( this.session_local.active ){
					this.user_login();
				} else {
					this.user_logout();
				}	

				return this.session_local.active;
			},			
			username : function(){
				return this.user_name();
			},
		},


		methods:{
			toggle( event ){
				if( this.contentState ){
					this.close();
				} else {
					this.open();	
				}
			}, 
			open( event ){
				this.contentState = true;
				this.burgerState = 'cross';
				setTimeout( function(){
					document.addEventListener('click',this.close)
				}.bind( this ), 200);
			},
			close( event ){
				this.contentState = false;
				this.burgerState = 'bars';	
				document.removeEventListener('click',this.close);
			},
			click( event ){
				if( this.contentState ){
					this.close();
				}
			},

			user_name(){
				if( this.session_local.user !== undefined ){
					return this.session_local.user.name;
				}
				return "none";
			},
			user_login(){
				this.links_current = this.links_user;
			},
			user_logout(){
				this.links_current = this.links_non_user;
			},
			user_navbar(){
				return { username: this.username, title : "", url : "/account", icon : "fab fa-uikit" };
			}

		},	
		components: {
			'navbar-link' : NavbarLink 
		},
	}





</script>

<style>

	.colour-navbar {
		color: var( --colour-nav );
		fill: var( --colour-nav );
	}

	#navbar {
		margin: 0;
		padding: 0;
		position: fixed;
		z-index: 5;
		left: 0;
		top: 0;
		width: calc(100% + 1rem);
		min-height: 2rem;
		background-color: var( --colour-nav );
	}

/*	.navbar-bar {
		position: relative;
		height: 3.5rem;
		width: 100%;
	}*/

	.content {
		display: none;
		overflow-y: auto;
		min-height: 50vh;
		max-height: 90vh;
	}
	.content.is-active {
		display: flex;
		flex-direction: column;
	}
	/*.navbar.is-active {
		bottom: 25%;
	}*/

	#navbar .bar-logo {
		margin: 0;
		padding: 0;
		position: absolute;
		z-index: 1;
		left: 0;
		bottom: -1.3rem; 
		height: 5rem;
		transform-origin: bottom left;
	}
	#navbar .bar-fill-right {
		margin: 0;
		padding: 0;
		position: absolute;
		z-index: -1;
		left: 2.5rem;
		bottom: -1.3rem; 
		height: 1.5rem;
		width: 100%;
		background-color: var( --colour-nav );
		border-bottom: solid 4px var( --colour-text-light );
	}	

	#navbar .content .bar-logo {
		bottom: -1rem; 
	}
	#navbar .content .bar-fill-right {
		bottom: -1rem; 
	}



/*

	.navbar .bar-main {
		margin: 0;
		padding: 0;
		position: absolute;
		z-index: 1;
		bottom: 0;
		left: 0;
		right: 0;
		top: 0;
	}

	.navbar .bar-logo {
		margin: 0;
		padding: 0;
		position: absolute;
		z-index: -1;
		left: 0;
		bottom: 0; 
		height: 5rem;
		transform-origin: bottom left;
	}
	.navbar .bar-fill-side {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		position: absolute;
		z-index: 2;
		left: 2.45rem;
		right: 0;
		bottom: 0; 
		height: 5rem;
		background-color: var( --colour-nav );
		border-bottom: solid 4px var( --colour-text-light );
	}	
	.navbar .bar-fill-top {
		margin: 0;
		padding: 2rem;
		position: absolute;
		z-index: 0;
		left: 0;
		right: 0;
		bottom: 4.9rem; 
		height: 100%;
		background-color: var( --colour-nav );
	}*/



	.toggle {
		transition: 0.2s;
		position: fixed;
		z-index: 10;
		top: 0.3rem;
		right: 0.3rem;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 0.5rem;		
		background-color: var( --colour-text-dark );
	}
	.toggle:hover {
		transform: scale(1.1);
	}

	#navbar .toggle span {
		position: absolute;
		left: 10%;
		right: 10%;
		height: .2rem;
		display: block;
		background-color: var( --colour-text-light );
	}
	#navbar .toggle .span-1 {
		top: 15%;	
	}
	#navbar .toggle .span-2 {
		top: 45%;	
	}
	#navbar .toggle .span-3 {
		top: 75%;	
	}

	.bars .span-1 {
		animation: anim_cross_to_flat_1 0.2s forwards;
	}
	.bars .span-2 {
		animation: anim_cross_to_flat_2 0.2s forwards;
	}
	.bars .span-3 {
		animation: anim_cross_to_flat_2 0.2s forwards;
	}

	.cross .span-1 {
		animation: anim_flat_to_cross_1 .2s forwards;
	}
	.cross .span-2 {
		animation: anim_flat_to_cross_2 .2s forwards;
	}
	.cross .span-3 {
		animation: anim_flat_to_cross_2 .2s forwards;
	}




@keyframes anim_flat_to_cross_1 {
	50% { top:45%; transform: rotate(0deg); }
	100% { top:45%; transform: rotate(45deg); }
}

@keyframes anim_flat_to_cross_2 {
	50% { top:45%; transform: rotate(0deg); }
	100% { top:45%; transform: rotate(135deg); }
}


@keyframes anim_cross_to_flat_1 {
	0% { top:45%; transform: rotate(45deg); }
	50% { top:45%; transform: rotate(0deg); }
	100% { transform: rotate(0deg); }
}

@keyframes anim_cross_to_flat_2 {
	0% { top:45%; transform: rotate(135deg); }
	50% { top:45%; transform: rotate(0deg); }
	100% { transform: rotate(0deg); }
}




@media only screen and (max-width: 400px) {
	
}

@media only screen and (max-width: 320px) {

}



	
/*
	.navbar .logo-main {
		margin: 0;
		padding: 0;
		position: absolute;
		z-index: -1;
		left: 0;
		bottom: 0; 
		height: 5rem;
		transform-origin: bottom left;
	}	

	.navbar-fill {
		position: absolute;
		z-index: 2;
		right: 0;
		top: 0;
		bottom: 0;
		left: 2.45rem;
		transition: var( --transition-time );
		background-color: var( --colour-nav );
	}
	.is-active .navbar-fill {
		left: 0;
	}


	.navbar-accent {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: .25rem;
		background-color: var( --colour-primary );
	}
	.navbar.is-active .navbar-accent {
		height: .15rem;
	}	

	.navbar .home {
		margin: 0;
		padding: 0;
		position: absolute;
		left: 0;
		bottom: 0; 
		height: 5rem;
	}

	.navbar .toggle {
		border: none;
		position: relative;
		z-index: 2;
		margin: 0.33rem;
		margin-left: auto;
		margin-right:1rem;
		width: 2.66rem;
		height: 2.66rem;
		border-radius: var( --border-radius-button );
	}

	.navbar .toggle span {
		position: absolute;
		left: 10%;
		right: 10%;
		height: .2rem;
		display: block;
		background-color: var( --colour-primary );
	}

	.navbar .toggle .span-1 {
		top: 15%;	
	}
	.navbar .toggle .span-2 {
		top: 45%;	
	}
	.navbar .toggle .span-3 {
		top: 75%;	
	}	

	.bars .span-1 {
		animation: anim_cross_to_flat_1 0.2s forwards;
	}
	.bars .span-2 {
		animation: anim_cross_to_flat_2 0.2s forwards;
	}
	.bars .span-3 {
		animation: anim_cross_to_flat_2 0.2s forwards;
	}

	.cross .span-1 {
		animation: anim_flat_to_cross_1 .2s forwards;
	}
	.cross .span-2 {
		animation: anim_flat_to_cross_2 .2s forwards;
	}
	.cross .span-3 {
		animation: anim_flat_to_cross_2 .2s forwards;
	}



@keyframes anim_flat_to_cross_1 {
	50% { top:45%; transform: rotate(0deg); }
	100% { top:45%; transform: rotate(45deg); }
}

@keyframes anim_flat_to_cross_2 {
	50% { top:45%; transform: rotate(0deg); }
	100% { top:45%; transform: rotate(135deg); }
}


@keyframes anim_cross_to_flat_1 {
	0% { top:45%; transform: rotate(45deg); }
	50% { top:45%; transform: rotate(0deg); }
	100% { transform: rotate(0deg); }
}

@keyframes anim_cross_to_flat_2 {
	0% { top:45%; transform: rotate(135deg); }
	50% { top:45%; transform: rotate(0deg); }
	100% { transform: rotate(0deg); }
}


.navbar .toggle-content{
	display: none;
	width: 100%;
	height: 100%;
	position: relative;
}

.navbar.is-active .toggle-content{
	display: block !important;
}
*/



</style>
