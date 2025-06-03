<script lang="ts">
  import CalendarIcon from "lucide-svelte/icons/calendar";
  import {
    type DateValue,
    DateFormatter,
    getLocalTimeZone,
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button";
  import { Calendar } from "$lib/components/ui/calendar";
  import * as Popover from "$lib/components/ui/popover";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

    type Props = {
      children?: Snippet;
      name?: string;
    } & HTMLAttributes<HTMLInputElement>;

  let {children, name, value, ...restProps}: Props & { value?: DateValue } = $props();

  const df = new DateFormatter("pt-BR", {
    dateStyle: "short",
  });

  let dt = df.format(new Date());
</script>
 
<Popover.Root openFocus>
 <Popover.Trigger asChild let:builder>
  <Button
   variant="outline"
   class={cn(
    "w-[280px] justify-start text-left font-normal bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500",
    !value && "text-muted-foreground"
   )}
   builders={[builder]}
  >
   <CalendarIcon class="mr-2 h-4 w-4" />
   {value ? df.format(value.toDate(getLocalTimeZone())) : dt}
  </Button>
 </Popover.Trigger>
 <Popover.Content class="w-auto p-0 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:text-yellow-500 cursor-pointer">
  <Calendar bind:value initialFocus />
 </Popover.Content>
</Popover.Root>