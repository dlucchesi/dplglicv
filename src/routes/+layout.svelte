<script lang="ts">
	import '../app.css';
	 import "../app.pcss";

	import Navbar from './Navbar.svelte';

	let { children } = $props();
</script>

<header>
	<Navbar />
</header>

{@render children()}