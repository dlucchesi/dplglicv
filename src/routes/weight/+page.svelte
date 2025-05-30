<script>
	import DplDataPicker from "@/lib/components/dplDataPicker.svelte";

</script>


<div class="container mx-auto">
  <h1>Weight Control Center</h1>
  
  <form class="w-full max-w-2xl mx-auto items-center">
  <div class="flex flex-wrap -mx-3 mb-6">
    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
        Date
      </label>
      <DplDataPicker />
      <p class="text-red-500 text-xs italic">Please fill out this field.</p>
    </div>
    <div class="w-full md:w-1/2 px-3">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
        value
      </label>
      <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
          id="grid-last-name" 
          type="text" placeholder="0.0" pattern="[0-9]+([,\.][0-9]+)?" required>
    </div>
  </div>
  
  <div class="flex flex-wrap -mx-3 mb-2">
    <div class="w-full px-3 mb-6 md:mb-0">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
        Observation
      </label>
      <textarea class="block w-full text-sm bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
          id="message" rows="4" placeholder="Obs..."></textarea>
    </div>
    
  </div>
</form>
</div>