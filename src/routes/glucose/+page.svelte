<script lang="ts">
  import { enhance } from '$app/forms';
	import {
    type DateValue,
    DateFormatter,
    getLocalTimeZone,
  } from "@internationalized/date"
  import type { PageData } from './$types';
	import AreaChart from '$lib/components/AreaChart.svelte';
	import GlucTable from './GlucTable.svelte';

  const { data } = $props<{ data: PageData }>();

  let currentDateTime: Date = new Date(); // Initialize currentDateTime with the current local time
  let currentTime: string = `${currentDateTime.getHours().toString().padStart(2, '0')}:${currentDateTime.getMinutes().toString().padStart(2, '0')}`; // format time in 24 hour format and 2 digits minutes

  let selectedDate = $state<Date | undefined>(currentDateTime);
  let selectedTime = $state<Date | undefined>(currentTime);
  let entry = $state<number | undefined>(undefined);
  let obs = $state<String | undefined>(undefined);

  let formData: FormData | null = null;

  let glucs = $state(data.glucData)

  // filter out today entries 
  let entriesChart = [...glucs].filter((g) => {
    const entryDate = g.date;
    const ret = entryDate.getDate() == currentDateTime.getDate() &&
      entryDate.getMonth() == currentDateTime.getMonth() &&
      entryDate.getFullYear() == currentDateTime.getFullYear();
    return ret
  }).sort((a, b) => {
    return a.date.getTime() - b.date.getTime();
  });
  
  let graph = entriesChart.map((g: {time: string; glucose: number }) => {
    return { x: `${g.time}`, y: g.glucose };
  });

  
</script>


<div class="container mx-auto">
  <h1>Glucose Control Center</h1>
  
  <form use:enhance data-sveltekit-reload
    class="w-full max-w-2xl mx-auto items-center"
    method="POST"
    action="?/insertGluc">
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="date">
          Date
        </label>
        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
            bind:value={selectedDate}
            name="date" 
            type="date" 
            required>
        {#if selectedDate === undefined}
          <p class="text-red-500 text-xs italic">Please fill out this field.</p>
        {/if}
      </div>
      <div class="w-full md:w-1/2 px-3">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="time">
          Time
        </label>
        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
            bind:value={selectedTime}
            name="time" 
            type="text" 
            placeholder="23:59" 
            pattern="^([01]\d|2[0-3]):([0-5]\d)$" 
            required>
        {#if selectedTime === undefined}
          <p class="text-red-500 text-xs italic">Please fill out this field.</p>
        {/if}
      </div>
    </div>

    <div class="flex flex-wrap -mx-3 mb-2">
      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="entry">
          Entry
        </label>
        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
            bind:value={entry}
            name="glucose" 
            type="text"
            placeholder="0.0" 
            required>
        <p class="text-red-500 text-xs italic">Please fill out this field.</p>
      </div>
      <div class="w-full md:w-1/2 px-3">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
          Observation
        </label>
        <textarea class="block w-full text-sm bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
          name="obs" 
          rows="4" 
          bind:value={obs}
          placeholder="Obs...">
        </textarea>
      </div>
    </div>

    <div class="flex justify-center flex-wrap -mx-3 mb-6">
      <div class="flex justify-center w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          type="submit">
          Save
        </button>
      </div>
      <div class="flex justify-center w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          type="reset">
          Cancel
        </button>
      </div>
    </div>   
  </form>

  <div class="flex justify-center items-center">
    <AreaChart {graph} />
  </div>

  <div class="flex justify-center items-center">
    <GlucTable data={glucs} />
  </div>

</div>