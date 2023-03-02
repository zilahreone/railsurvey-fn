<script setup>
const props = defineProps({
  name: {
    type: String,
    default: 'default-radio'
  },
  items: {
    type: Array,
    default: []
  },
  class: {
    type: String,
    default: null
  },
  modelValue: {
    type: [String, Boolean],
    default: null
  }
})
const emit = defineEmits(['update:modelValue'])
const tt = (val) => {
  console.log(val)
}
</script>
<template>
  <div v-for="(item ,index) in items" :key="index" :class="class">
    <div class="flex items-center max-w-fit">
      <input @input="emit('update:modelValue', item.value)" :id="`${item}-${index}`" type="radio" :name="name" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
      <label :for="`${item.value}-${index}`" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{ item.key }}</label>
    </div>
  </div>
</template>