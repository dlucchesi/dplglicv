<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { AccordionItem, Accordion } from "flowbite-svelte";
import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, TableSearch } from "flowbite-svelte";
import { DateFormatter, getLocalTimeZone } from "@internationalized/date";
import { browser } from "$app/environment";
	import type { Glucose } from "$lib/model/glucose";

  if (browser) {
    const accordionElement = document.getElementById('gluc-table-accordion') as AccordionItem;
  }

  type Props = {
    data?: { entry: Glucose }[];
    editMode?: boolean;
    children?: Snippet;
  } & HTMLAttributes<HTMLTableElement>

  let {data, editMode, children, ... restProps}: Props = $props()

  // dateformat using local timezone
  const dfDate = new DateFormatter("pt-BR", {
    dateStyle: "short",
    timeZone: getLocalTimeZone(),
  });
  const dfTime = new DateFormatter("pt-BR", {
    timeStyle: "short",
    timeZone: getLocalTimeZone(),
  });




</script>


<div class="w-full max-w-3xl mx-auto items-center">
  <Accordion>
    {#snippet header()}Glucose Control Center{/snippet}
    <AccordionItem id="gluc-table-accordion">
      {#snippet header()}Data Table{/snippet}
    <div class="mb-2 text-gray-500 dark:text-gray-400 overflow-y-scroll max-h-[calc(100vh-200px)]">
      <Table class="w-full text-sm table-auto border-collapse" hoverable={true} tableData={data} {...restProps}>
        <TableHead class="sticky top-0">
          <TableHeadCell class="uppercase">date</TableHeadCell>
          <TableHeadCell class="uppercase">time</TableHeadCell>
          <TableHeadCell class="uppercase">value</TableHeadCell>
          <TableHeadCell class="uppercase">observation</TableHeadCell>
          <TableHeadCell>
            <span class="sr-only">Edit</span>
          </TableHeadCell>
        </TableHead>
        <TableBody>
          {#each data as item: Glucose}
            <TableBodyRow>
              <TableBodyCell>{dfDate.format(item.entryDate)}</TableBodyCell>
              <TableBodyCell>{dfTime.format(item.entryDate)}</TableBodyCell>
              <TableBodyCell class="align-middle">{item.entry}</TableBodyCell>
              <TableBodyCell>{item.obs}</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    </div>
  </AccordionItem>
  
  </Accordion>
</div>