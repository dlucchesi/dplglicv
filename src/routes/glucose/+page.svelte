<script lang="ts">
  import { enhance } from '$app/forms';
	import {
    type DateValue,
    DateFormatter,
    getLocalTimeZone,
  } from "@internationalized/date"
  import type { PageData } from './$types';
	import AreaChart from '$lib/components/AreaChart.svelte';

  const df = new DateFormatter("pt-BR", {
    dateStyle: "short",
  });

  let dt = ""
  let time = ""
  let entry: number
  let obs = '';

  let formData: FormData | null = null;

  export let data: PageData;

  let glucs = data.glucData || [];
  
  // filter out today entries 
  // consider local timezone
  const today = new Date();
  glucs = glucs.filter((g) => {
    const entryDate = g.date;
    // TODO: handle timezones properly
    const ret = entryDate.getDay() == today.getDay() + 2 &&
      entryDate.getMonth() == today.getMonth() + 1 &&
      entryDate.getFullYear() == today.getFullYear();
    return ret
  });
  let graph = glucs.map((g: {time: string; glucose: number }) => {
    return { x: `${g.time}`, y: g.glucose };
  });
  
</script>


<div class="container mx-auto">
  <h1>Glucose Control Center</h1>
  
  <form use:enhance
    class="w-full max-w-2xl mx-auto items-center"
    method="POST"
    action="?/insertGluc">
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="date">
          Date
        </label>
        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
            bind:value={dt}
            name="date" 
            type="date" 
            required>
        <p class="text-red-500 text-xs italic">Please fill out this field.</p>
      </div>
      <div class="w-full md:w-1/2 px-3">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="time">
          Time
        </label>
        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
            bind:value={time}
            name="time" 
            type="text" 
            placeholder="23:59" 
            pattern="^([01]\d|2[0-3]):([0-5]\d)$" 
            required>
        <p class="text-red-500 text-xs italic">Please fill out this field.</p>

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

</div>