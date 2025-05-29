<script lang="ts">
	import type { Snippet } from "svelte";

  type Props = {
    href?: string;
    children?: Snippet;
    label?: string;
  }
  let {label,children, href}: Props = $props()

</script>

<a href="{href}" class="bg-green-700 flex-1/2 background-gray-900 text-white px-3 py-2 rounded text-sm font-medium hover:bg-gray-700">
  {label ? label : 'Click Me'}
</a>