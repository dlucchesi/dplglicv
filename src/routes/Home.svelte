<script>
	import MyButton from "$lib/components/MyButton.svelte";

</script>
<div class="container mx-auto">
  <h1>Welcome DPL Glic</h1>
  <p class="mb-4">This is a simple Svelte application to track your weight and glucose levels.</p>
  <p class="mb-4">Use the navigation bar to access different sections of the app.</p>
  <MyButton onclick="{() => {console.log('Clicado')}}" href="/"> Weight</MyButton>
</div>