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
    type: Array,
    default: []
  }
})
const emit = defineEmits(['update:modelValue'])
const handleEmit = (val) => {
  let values = [...props.modelValue]
  const index = values.indexOf(val)
  console.log(values, val, index);
  if (index < 0) {
    values.push(val)
  } else {
    values.splice(index, 1)
  }
  emit('update:modelValue', values)
}
const isChecked = (val) => {
  return props.modelValue.includes(val)
}
</script>
<template>
  <div class="py-4 px-4">
    <ul class="grid w-full gap-4 md:grid-cols-6">
      <li v-for="(item ,index) in items" :key="index">
        <input @input="handleEmit(item.value)" type="checkbox" :checked="isChecked(item.value)" :id="`${name}-${index}`" class="hidden peer" required="">
        <label :for="`${name}-${index}`"
          class="inline-flex items-center text-sm justify-between w-full p-2 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
          {{ item.key }}
        </label>
      </li>
    </ul>
  </div>
</template>