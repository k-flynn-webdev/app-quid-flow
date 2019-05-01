<template>

	<select class="input text select" name="type" value=selected>

		<option 
			v-for="item in categories"
			:selected="item == selected" >
			{{ item }}
		</option>

	</select>

</template>

<script>

	// TODO in future we will pull this from server and local options file?

	export default {
		name: 'cTransactionCat',
		props : {
			selected : String,
		},
		data() {
			return {
				categories : [
					"--",
					"-- shop",
					"-- travel",
					"-- item",
					"-- take-away",
					"-- bar-food-drink",
					"-- bank",
					"-- work",
					"-- work-item",
					"++ bank",
					"++ work"
				],
			}
		},		
	}

</script>

<style>
</style>
