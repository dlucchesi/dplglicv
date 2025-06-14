<script lang="ts">
  import { enhance } from '$app/forms';
	import {
    type DateValue,
    DateFormatter,
    getLocalTimeZone,
  } from "@internationalized/date"
  import type { PageData } from './$types';
  import { Label, Input, Datepicker, Timepicker,Textarea } from "flowbite-svelte";

	import AreaChart from '$lib/components/AreaChart.svelte';
	import GlucTable from './GlucTable.svelte';
	import type { Glucose } from '$lib/model/glucose';

  const { data, form } = $props<{ data: PageData, form: HTMLFormElement }>();

  let dateFormatter = new DateFormatter('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  let currentDateTime: Date = new Date(); // Initialize currentDateTime with the current local time
  let currentTime: string = `${currentDateTime.getHours().toString().padStart(2, '0')}:${currentDateTime.getMinutes().toString().padStart(2, '0')}`; // format time in 24 hour format and 2 digits minutes


  // function load page data
  $effect(() => {
    if (data) {
      currentDateTime = new Date(); // Initialize currentDateTime with the current local time
      currentTime = `${currentDateTime.getHours().toString().padStart(2, '0')}:${currentDateTime.getMinutes().toString().padStart(2, '0')}`; // format time in 24 hour format and 2 digits minutes

      // console.log('Page data loaded:', data);
    }
  });
  
  let selectedDate = $state<Date | undefined>(currentDateTime);
  let selectedTime = $state<string | undefined>(currentTime);
  let entry = $state<number | undefined>(undefined);
  let obs = $state<string | undefined>(undefined);

  let formData: FormData | null = null;

  let glucs = $state(data.glucoseData)



  // filter out today entries 
  let entriesChart = [...glucs].filter((g) => {
    const entryDate = g.entryDate;
    const ret = entryDate.getDate() == currentDateTime.getDate() &&
      entryDate.getMonth() == currentDateTime.getMonth() &&
      entryDate.getFullYear() == currentDateTime.getFullYear();
    return ret
  }).sort((a: Glucose, b: Glucose) => {
    return a.entryDate.getTime() - b.entryDate.getTime();
  }).map((g: Glucose) => {
    return { date: g.entryDate, entry: g.entry };
  });
  
  let graph = entriesChart.map((g: {date: Date; entry: number }) => {
    return { x: `${dateFormatter.format(g.date)}`, y: g.entry };
  });

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    formData = new FormData(event.target as HTMLFormElement);
    
    const formDate = selectedDate
    const formTime = selectedTime
    const formEntry = entry
    const formObs = obs ? obs.toString() : "";
    

    let selectedTimestamp: Date | undefined = undefined;
    if (formDate && formTime && formEntry) {
      // selectedTimestamp based on formDate and formTime
      const date = new Date(formDate);
      const [hours, minutes] = formTime.split(':').map(Number);
      date.setHours(hours, minutes, 0, 0);
      selectedTimestamp = date;
      //"2025-06-09 06:15:00"
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
      fetch('/glucose', {
        method: 'POST',
        body: formData,
      })
      // if the request is successful, reload the page
      .then(response => {
        if (response.ok) {
          console.log('Glucose entry inserted successfully');
          // Reload the page to get the updated data
          window.location.reload();
        } else {
          console.error('Error inserting glucose entry:', response.statusText);
        }
      })
    }
  }

  
</script>


<div class="container mx-auto">
  <h1>Glucose Control Center</h1>
  
  <form 
    class="w-full max-w-2xl mx-auto items-center"
    onsubmit="{handleSubmit}">
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <Label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="date">
          Date
        </Label>
        <Datepicker class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
            bind:value={selectedDate}
            required />
        {#if selectedDate === undefined}
          <p class="text-red-500 text-xs italic">Please fill out this field.</p>
        {/if}
      </div>
      <div class="w-full md:w-1/2 px-3">
        <Label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="time">
          Time
        </Label>
        <Timepicker 
            bind:value={selectedTime}
            required />
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
        <Input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
            bind:value={entry}
            name="glucose" 
            type="text"
            placeholder="0.0" 
            required />
          {#if entry === undefined || entry === null || entry === 0}
            <p class="text-red-500 text-xs italic">Please fill out this field.</p>
          {/if}
      </div>
      <div class="w-full md:w-1/2 px-3">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
          Observation
        </label>
        <Textarea class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
          name="obs" 
          bind:value={obs}
          placeholder="Obs...">
        </Textarea>
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

    <div class="flex justify-center flex-wrap -mx-3 mb-6">
      {#if form?.success}
      <!-- this message is ephemeral; it exists because the page was rendered in
          response to a form submission. it will vanish if the user reloads -->
        <p class="text-green-500 text-xs">Success!</p>
      {:else if form?.error}
        <p class="text-red-500 text-xs">Error!</p>
      {/if}
    </div>
  </form>

  <div class="flex justify-center items-center">
    <AreaChart {graph} />
  </div>

  <div class="flex justify-center items-center">
    <GlucTable data={glucs} />
  </div>

</div>