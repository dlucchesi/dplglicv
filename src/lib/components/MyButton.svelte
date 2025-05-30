<script lang="ts">
	import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  type Props = {
    href?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLAnchorElement>

  let {children, ... restProps}: Props = $props()

</script>

<a {...restProps}
    class="bg-green-700 flex-1/2 background-gray-900 text-white px-3 py-2  text-sm font-medium hover:bg-gray-700 rounded-xl">
  {#if children}
    {@render children()}
  {:else}
    Button
  {/if}	
</a>