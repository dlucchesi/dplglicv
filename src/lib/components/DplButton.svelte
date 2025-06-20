<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  type Props = {
    href?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLButtonElement>

  let {children, ... restProps}: Props = $props()

</script>

<button {...restProps}
    class="myButtonBackground" >
  <div class="myButtonLayer" >
    {#if children}
      {@render children()}
    {:else}
      Button
    {/if}	
  </div>
</button>

<style>


</style>