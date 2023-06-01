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
  items: {
    type: Array,
    default: []
  },
  type: {
    type: String,
    default: 'text',
    validator (value) {
      // The value must match one of these strings
      return ['text', 'number'].includes(value)
    }
  },
  placeholder: {
    type: String,
    default: null
  },
  modelValue: {
    type: [Number, String],
    default: null
  }
})
const emit = defineEmits(['update:modelValue'])
const isActive = ref(false)
const weight = ref(null)
const handleSelect = (value) => {
  isActive.value = false
  emit('update:modelValue', value)
}
const handleEmit = (value) => {
  let emitValue = value
  if (props.type === 'number') {
    emitValue = parseInt(value)
  }
  emit('update:modelValue', emitValue)
}
const compWeight = computed(() => {
  if (weight.value && weight.value.trim() != '') {
    const filter = props.items.filter(item => item.key.includes(weight.value))
    if (filter.length > 0) {
      return filter
    }
  }
  return props.items
})
</script>
<template>
  <div>
    <div class="relative">
      <input :disabled="isPreview" @input="handleEmit($event.target.value)" :value="modelValue" :type="type" :class="error ? '_input_error': '_input'" :placeholder="placeholder">
      <button :disabled="isPreview" @click="isActive = !isActive" :class="`absolute ${type === 'number' ? 'right-8' : 'right-3'} bottom-2.5 text-sm text-gray-500`">
        <svg class="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor"
          viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div v-show="isActive" id="dropdown" class="absolute z-10 bg-white border shadow w-full dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
          <li v-for="(item, index) in items" :key="index">
            <a @click="handleSelect(item.value)" class="block px-4 py-0 hover:bg-blue-500 hover:text-white dark:hover:bg-gray-600 dark:hover:text-white">{{ item.key }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>