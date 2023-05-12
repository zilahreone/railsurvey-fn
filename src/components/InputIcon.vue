<script setup>
import { computed, ref } from 'vue'
const props = defineProps({
  error: {
    type: Boolean,
    default: false
  },
  isPreview: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: null
  },
  modelValue: {
    type: [String, Number],
    default: null
  }
})
const emit = defineEmits(['update:modelValue', 'onClick'])
const isActive = ref(false)
const weight = ref(null)
// const handleSelect = (value) => {
//   isActive.value = false
//   emit('update:modelValue', value)
// }
// const handleEmit = (value) => {
//   let emitValue = value
//   if (props.type === 'number') {
//     emitValue = parseInt(value)
//   }
//   emit('update:modelValue', emitValue)
// }
</script>
<template>
  <div>
    <div class="relative">
      <input :disabled="isPreview" :value="modelValue" @input="emit('update:modelValue', ($event.target.value))" type="text" :class="error ? '_input_error' : '_input'" :placeholder="placeholder">
      <button :disabled="isPreview" @click="emit('onClick')" class="absolute right-3 bottom-2.5 text-sm text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      </button>
  </div>
</div></template>