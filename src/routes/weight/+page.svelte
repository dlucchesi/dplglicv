<script lang="ts">
  import { enhance } from '$app/forms';
  import DplButton from "@/lib/components/DplButton.svelte"
  import type { PageData } from './$types';
	import ChartTest from "@/lib/components/ChartTest.svelte"
	import {
    type DateValue,
    DateFormatter,
    getLocalTimeZone,
  } from "@internationalized/date"
	import { console } from 'inspector/promises';

  const df = new DateFormatter("pt-BR", {
    dateStyle: "short",
  });

  let dt = df.format(new Date());
  let entry = 0

  let formData: FormData | null = null;

  export let data: PageData;
  
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
            pattern="\d{4}//\d{2}//\d{4}"
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
        <DplButton
          type="submit">
          Save
        </DplButton>
      </div>
      <div class="flex justify-center w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <DplButton
          type="reset">
          Cancel
        </DplButton>
      </div>
    </div>   
  </form>

<!-- div com conteudo centralizado para receber o gráfico -->
  <div class="flex justify-center items-center">
    <ChartTest x="date" y="weight" chartData={data.csv} />
  </div>
  

</div>