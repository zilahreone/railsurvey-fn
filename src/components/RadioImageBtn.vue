<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: []
  },
  imagePath: {
    type: String,
    default: null
  },
  imageLabel: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: null
  }
})
</script>
<template>
  <ul class="grid gap-4 w-full md:grid-cols-4">
    <li v-for="(item, index) in items" :key="index">
      <input type="radio" :id="`${name}-${index}`" :name="name" :value="item[imageLabel]" class="hidden peer" required>
      <label :for="`${name}-${index}`" class="flex flex-col justify-center items-center gap-2 p-1 w-full text-gray-500 bg-white rounded-lg border border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
        <div>
          <img class="object-contain" :src="require(`@/assets/${item[imagePath]}`)" alt="img">
        </div>
        <div>
          <div class="w-full">{{ item[imageLabel] }}</div>
        </div>
          <!-- <svg aria-hidden="true" class="ml-3 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg> -->
      </label>
    </li>
    <!-- <li>
        <input type="radio" id="hosting-big" name="hosting" value="hosting-big" class="hidden peer">
        <label for="hosting-big" class="inline-flex justify-between items-center p-5 w-full text-gray-500 bg-white rounded-lg border border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="block">
                <div class="w-full text-lg font-semibold">500-1000 MB</div>
                <div class="w-full">Good for large websites</div>
            </div>
            <svg aria-hidden="true" class="ml-3 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </label>
    </li> -->
  </ul>
</template>