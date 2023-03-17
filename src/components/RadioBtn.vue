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
  error: {
    type: Boolean,
    default: false
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
  <div class="py-4 px-4">
    <ul class="flex items-stretch gap-4">
      <li v-for="(item ,index) in items" :key="index" class="">
        <input :checked="props.modelValue === item.value" @input="emit('update:modelValue', item.value)" :id="`${index}-${item.value}-${name}`" :name="name" type="radio" class="hidden peer" required>
        <label :for="`${index}-${item.value}-${name}`"
          :class="`flex items-center justify-center p-2 text-sm bg-white border rounded-md border-${error ? 'red-600 text-red-600' : 'gray-200'} rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700`">
          {{ item.key }}
        </label>
      </li>
    </ul>
  </div>
  <!-- <div v-for="(item ,index) in items" :key="index" :class="class">
      <div class="flex items-center gap-2">
        <input :checked="props.modelValue === item.value" @input="emit('update:modelValue', item.value)" :id="`${item}-${index}`" type="radio" :name="name" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
        <label :for="`${item.value}-${index}`" class="text-sm font-medium text-gray-900 dark:text-gray-300">{{ item.key }}</label>
      </div>
    </div> -->
</template>