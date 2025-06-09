<script lang="ts">
	import {
    type DateValue,
    DateFormatter,
    getLocalTimeZone,
  } from "@internationalized/date"
  import { Weight } from '$lib/model/weight';
  import type { PageData } from './$types';
	import AreaChart from '$lib/components/AreaChart.svelte';

  import { Label, Input, Datepicker, Timepicker, Textarea } from "flowbite-svelte";


  const countToShow: number = 10; // Default to 10 if not set

  let selectedDate: Date = $state(new Date())
  let entry: Number = $state(0)
  let obs: String = $state("")

  let formData: FormData | null = null;

  const { data } = $props<{ data: PageData }>();

  let weights = data.weightData
  let weightsToGraph = [...weights] 
  weightsToGraph = weightsToGraph.slice(weightsToGraph.length - countToShow, weightsToGraph.length);
  
  let graph = weightsToGraph?.map((w: Weight) => {
    // Convert the date to a string in the format YYYY-MM-DD
    const date = w.entryDate;
    return {
      x: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      // Convert the weight to a number
      y: w.entry
    };
  });

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    formData = new FormData(event.target as HTMLFormElement);
    
    const formDate = selectedDate
    const formEntry = entry
    const formObs = obs ? obs.toString() : "";
    

    let selectedTimestamp: Date | undefined = undefined;
    if (formDate && formEntry) {
      // selectedTimestamp based on formDate and formTime
      const date = new Date(formDate);
      selectedTimestamp = date;

      formData.set('entryDate',
        `${selectedTimestamp.getFullYear().toString().padStart(4, '0')}-` +
        `${(selectedTimestamp.getMonth() + 1).toString().padStart(2, '0')}-` +
        `${selectedTimestamp.getDate().toString().padStart(2, '0')} ` +
        `${selectedTimestamp.getHours().toString().padStart(2, '0')}:` +
        `${selectedTimestamp.getMinutes().toString().padStart(2, '0')}:00`
      );
      formData.set('entry', formEntry?.toString() || '');
      formData.set('observation', formObs as string);
      
      // Call the server to insert the new glucose entry
      fetch('/weight', {
        method: 'POST',
        body: formData,
      })
      // if the request is successful, reload the page
      .then(response => {
        if (response.ok) {
          console.log('Weight entry inserted successfully');
          // Reload the page to get the updated data
          window.location.reload();
        } else {
          console.error('Error inserting weight entry:', response.statusText);
        }
      })
    }
  }
  
</script>


<div class="container mx-auto">
  <h1>Weight Control Center</h1>
  
  <form
    class="w-full max-w-2xl mx-auto items-center"
    onsubmit="{handleSubmit}">
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
          Date
        </label>
        <Datepicker class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
            bind:value={selectedDate}
            required />
            {#if selectedDate === undefined}
              <p class="text-red-500 text-xs italic">Please fill out this field.</p>
            {/if}
      </div>
      <div class="w-full md:w-1/2 px-3">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
          value
        </label>
        <Input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
            bind:value={entry}
            type="text" placeholder="0.0" pattern="[0-9]+([,\.][0-9]+)?" required />
            {#if entry === undefined || entry === null || entry === 0}
              <p class="text-red-500 text-xs italic">Please fill out this field.</p>
            {/if}
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