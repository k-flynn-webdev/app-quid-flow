
<template>

	<div>

		<c-popup 
			v-if=show_import 
			v-bind:onClick=closeModal>
			 
			<div slot="header">
				Import
			</div>

			<p class="text"> Add json items to this account.</p>
			<br>

			<form 
				class="form" 
				action="/api/transaction/import" 
				enctype="multipart/form-data" 
				method ="POST" 
				@submit.prevent="onImport">

				<div class="field">

					<div class="flex-row flex-row-between">
						<p class="text label">File:</p>
						<input 
							class="button1 text input-file text-light1" 
							type="file" 
							name="jsonUpload" 
							placeholder="File" 
							required=true >
					</div>

				</div>

				<div class="flex-row flex-row-between">
					<c-button 
						type="button"
						v-bind:onClick=closeModal>
						Close
					</c-button>					
					<c-button 
						v-bind:class="{ 'is-loading' : import_waiting,
						'is-success' : import_success }"
						type="submit"
						v-bind:onClick=onImport>
						Send
					</c-button>					
				</div>	

			</form>	

		 </c-popup>


		<c-panel>

			<div slot="header">
				Options
			</div>

			<div class="flex-row flex-row-between">

				<p class="label">Transactions:</p>

				<c-button
					class="colour-yellow" 
					type="button"
					v-bind:onClick=showModal>
					Import
				</c-button>
				<c-button
					class="colour-yellow" 
					type="button"
					v-bind:onClick=onExport>
					Export
				</c-button>

			</div>		
			
		</c-panel>

	</div>

</template>

<script>

	import Button from './c_button.vue';
	import Panel from './c_panel.vue';
	import PopUp from './c_popup.vue';

	export default {
		name: 'cAccountOptions',
		data(){
			return {
				show_import : false,
				import_waiting : false,				
				import_success : false,				
			}
		},
		methods:{
			closeModal(){
				this.show_import = false;
				this.import_waiting = false;
			},			
			showModal(){
				this.show_import = true;
			},
			onImport( event ){

				if( event === undefined ){
					return;
				}

				let self = this;
				self.import_waiting = true;

				this.$request.request_url_form( event, function(error, result){

					self.reset_button();
					self.closeModal();

					if( error ){
						self.$message.send({isType:'error',title:"error",message:error.message});	
						return;
					}

					self.import_success = true;

					setTimeout( function(){
						self.$message.send({isType:'',title:"Result",message:result.message});
					}, 1000 );

					// todo this should be a conform by user before proceeding ... future!
					
				});					
			},
			onExport(){
				// todo
				// let object = {};
				// object.url = '/api/transaction/export';
				// object.method = 'POST';
				// object.body = '';
				// this.onSubmit( object );
			},	
			reset_button : function(){
				let self = this;
				setTimeout( function(){
					self.import_waiting = false;
					self.import_success = false;
				}, 1000 );
			},								
		},
		components: {
			'c-button' : Button,
			'c-panel' : Panel,
			'c-popup' : PopUp,
		},			
}
</script>

<style scoped >

	.input-file{
		height: 1.5rem;
		line-height: 1rem;
		font-size: 0.9rem;
	}
	
</style>