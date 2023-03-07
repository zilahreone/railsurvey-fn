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
  <ul class="grid grid-flow-col gap-2">
    <li v-for="(item, index) in items" :key="index">
      <div>
        <input :checked="props.modelValue === item.value" @input="emit('update:modelValue', item.value)" type="radio" :id="`${name}-${index}`" :name="name" class="hidden peer" required>
        <label :for="`${name}-${index}`" class="flex justify-center items-center flex-col gap-2 p-1 w-full text-gray-500 bg-white rounded-lg border border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
          <img v-if="item[imagePath]" class="object-contain h-36 w-48" :src="require(`@/assets/${item[imagePath]}`)" alt="img">
          <label class="_label-sm">{{ item[imageLabel] }}</label>
        </label>
      </div>
      <!-- <div class="flex items-stretch"> -->
        <!-- <div v-else>
          <input @input="emit('update:modelValue', item[imageLabel])" type="radio" :id="`${name}-${index}`" :name="name" :value="item[imageLabel]" class="hidden peer" required>
          <label :for="`${name}-${index}`" class="flex gap-2 p-1 w-full text-gray-500 bg-white rounded-lg border border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
            <div class="flex items-center flex-col">
              <img class="object-contain h-36 w-48" :src="require(`@/assets/${item[imagePath]}`)" alt="img">
              <label class="_label-sm">{{ item[imageLabel] }}</label>
            </div>
          </label>
        </div> -->
      <!-- </div> -->
    </li>
  </ul>
</template>