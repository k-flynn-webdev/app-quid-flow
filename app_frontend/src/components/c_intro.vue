<template>
	<div class="center-auto-h width-90">

		<div class="panel shadow-close colour-text-dark ">
			
			<div class="head header">
				<p class="title">What is Quidflow?</p>
			</div>

			<div class="split"></div>
			
			<div class="message text">

				<ul style="margin-right:1.5rem;">
					<li class="text">
						See your daily average and totals of the last 3 months.
					</li>						
					<li class="text">
						Easy to review and edit items.
					</li>
					<li class="text">
						A simple to read history.
					</li>
				</ul>

			</div>

			<button class="button-try">
				<p>Try it now</p>
			</button>

		</div>

		<br>

		<section style="text-align: center;">
			<div class="colour-text-light">
				<p class="title ">Easy</p>
				<p class="text is-small "> Adding, updating and deleting items is easy. </p>
			</div>
			<div class="colour-text-light">
				<p class="title ">Simple</p>
				<p class="text is-small ">  Designed to be as simple as possible, no large menus, only the essential features. Purely to  track my daily income and expenses. </p>
			</div>
			<div class="colour-text-light">
				<p class="title ">Quick</p>
				<p class="text is-small ">   Understanding information at a glance is the priority. Knowing just how much a day I'm spending as an average was key to better  finances. </p>
			</div>					
		</section>


	</div>
</template>

<script>

	import Button from './c_button.vue';

	export default {
		name: 'cIntro',
		methods:{
		},
		components: {
			'c-button' : Button,
		},			
	}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>