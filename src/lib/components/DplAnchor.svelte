<script lang="ts">
	import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  type Props = {
    href?: string;
    addClass?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLAnchorElement>

  let {children, addClass, ... restProps}: Props = $props()

</script>

<a {...restProps}
    class="bg-green-700 flex-1/2 background-gray-900 text-white px-3 py-2  text-sm font-medium hover:bg-gray-700 rounded-xl {addClass ? addClass : ''}">
  {#if children}
    {@render children()}
  {:else}
    Button
  {/if}	
</a>