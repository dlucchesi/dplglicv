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

  let dt = new Date()
  let entry = 0

  let formData: FormData | null = null;

  export let data: PageData;

  let y: string[] = [];
  let x: number[] = [];

  // limit 3 

  let weights = data.weightData
  let graph = weights?.map((w: { year: number; month: number; day: number; weight: number }) => {
    return {x: `${w.year}-${w.month}-${w.day}`, 
           y: w.weight};
  });
  
</script>


<div class="container mx-auto">
  <h1>Weight Control Center</h1>
  
  <form use:enhance
    class="w-full max-w-2xl mx-auto items-center"
    method="POST"
    action="?/insertWeight">
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
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
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
          value
        </label>
        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
            bind:value={entry}
            name="weight" 
            type="text" placeholder="0.0" pattern="[0-9]+([,\.][0-9]+)?" required>
      </div>
    </div>
  
  <!-- <div class="flex flex-wrap -mx-3 mb-2">
    <div class="w-full px-3 mb-6 md:mb-0">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
        Observation
      </label>
      <textarea class="block w-full text-sm bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
          id="message" rows="4" placeholder="Obs..."></textarea>
    </div>
  </div> -->

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