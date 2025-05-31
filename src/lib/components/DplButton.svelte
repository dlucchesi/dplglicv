<script lang="ts">
	import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  type Props = {
    href?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLButtonElement>

  let {children, ... restProps}: Props = $props()

  let TypeOk = "bg-green-600 hover:bg-green-600 text-green-900 hover:text-white"
  let TypeWarn = "bg-green-600 hover:bg-green-600 text-green-900 hover:text-white"

</script>

<button {...restProps}
    class=" cursor-pointer flex-1/2  px-3 py-2  text-sm font-mediu rounded-xl bg-green-600 hover:bg-green-600 text-green-900 hover:text-white">
  {#if children}
    {@render children()}
  {:else}
    Button
  {/if}	
</button>