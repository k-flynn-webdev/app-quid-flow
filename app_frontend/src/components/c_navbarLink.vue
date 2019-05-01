<template>
	<!-- <div class="navbar-holder"> -->
		<router-link class="title text-light is-link" v-bind:to=link.url>
			<!-- <div class="link"> -->
				<span class="is-name" > {{ link.username }} </span>
				<span class="is-title" > {{ link.title }} </span>
				<i v-bind:class=link.icon ></i>				
			<!-- </div> -->
		</router-link>
	<!-- </div> -->

</template>

<script>
	export default {
		name: 'NavbarLink',
		props: 	{ 
					link : { username : String, title : String, icon : String , url : String }
				}
	}
</script>

<style>



.is-link {
	/*height: 3rem;*/
	margin: 0.75rem 1rem;
	display: block;
	text-align: center;
	/*background-color: blue;*/
}

.is-link:first-of-type {
	margin-top: 4rem;
}
.is-link:last-of-type {
	margin-bottom: 4rem;
}

/*	.navbar-holder{
		width: 100%;
		height: 3.5rem;
		position: relative;
	}*/

	/*.navbar-link {
		position: absolute;
		text-decoration: none;
		left: 0;
		right: 0;
		top: 0;
		bottom:0;
		margin:0;
		text-align: right;		
		border-bottom: var( --accent-line-h ) solid var( --colour-accent );
		background-color: var( --colour-base-nav );
		transition-duration: var( --transition-time );
	}*/
/*	.navbar-link:hover {
		border-bottom: calc( var( --accent-line-h ) * 1.5) solid var( --colour-accent-hover );
	}*/


/*	.link{
		font-size: 1.66rem;
		position: relative;
		top: 50%;
		transform: translateY(-50%);
		margin-right: 2rem;
		transition-duration: var( --transition-time );
	}*/
/*
	.navbar-link:hover .link{
		font-size: 1.75rem;
	}*/

/*	.navbar-link span.isName {
		position: absolute;
		left: 1rem;
	}
	.navbar-link span {
		text-transform: uppercase;
	}
	.navbar-link i {
		margin-left: 1rem;
	}*/

</style>
