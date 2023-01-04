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
  },
  modelValue: {
    type: String,
    default: null
  }
})
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <ul class="grid gap-4 w-full md:grid-cols-4 sm:grid-cols-2">
    <li v-for="(item, index) in items" :key="index">
      <input @input="emit('update:modelValue', item[imageLabel])" type="radio" :id="`${name}-${index}`" :name="name" :value="item[imageLabel]" class="hidden peer" required>
      <label :for="`${name}-${index}`" class="flex flex-col justify-center items-center gap-2 p-1 w-full text-gray-500 bg-white rounded-lg border border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
        <div>
          <img class="object-contain" :src="require(`@/assets/${item[imagePath]}`)" alt="img">
        </div>
        <div>
          <div class="w-full">{{ item[imageLabel] }}</div>
        </div>
      </label>
    </li>
  </ul>
</template>