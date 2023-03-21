<script setup>
import { computed, ref, onMounted } from 'vue';

const props = defineProps({
  name: {
    type: String,
    default: 'default-radio'
  },
  items: {
    type: Array,
    default: []
  },
  imageKey: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: null
  },
  error: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'radio',
    validator (value) {
      // The value must match one of these strings
      return ['radio', 'checkbox'].includes(value)
    }
  },
  isSpecify: {
    type: Boolean,
    default: false
  },
  disables: {
    type: Array,
    default: []
  },
  modelValue: {
    type: [String, Boolean, Array],
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])
const handleEmit = (val) => {
  let out = null
  // if (props.isSpecify) {
  //   out = !!val
  // }
  if (props.type === 'radio') {
    out = val
  } else if (props.type === 'checkbox') {
    if (Array.isArray(props.modelValue)) {
      out = [...props.modelValue]
      const index = out.indexOf(val)
      if (index < 0) {
        out.push(val)
      } else {
        out.splice(index, 1)
      }
      // out.filter(o => !props.disables.includes(o))
    }
  }
  emit('update:modelValue', out)
}
const isChecked = (val) => {
  if (typeof val == 'boolean') {
    return props.modelValue === val
  }
  return props.modelValue?.includes(val)
}
</script>
<template>
  <div v-for="(item ,index) in items" :key="index" :class="[{'bg-gray-100': disables.includes(item.value)}, `flex items-center pl-2 border ${error ? 'border-red-600' : 'border-gray-200'} rounded dark:border-gray-700`]">
    <input :id="`${name}-${item.value}-${type}-${index}`" :type="type" :disabled="disables.includes(item.value)" @input="handleEmit(item.value)" :checked="isChecked(item.value)" :name="name" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
    <label :for="`${name}-${item.value}-${type}-${index}`" :class="`flex flex-col gap-2 ${imageKey && item[imageKey] ? 'items-center' : ''}  w-full py-2 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300`">
      <img v-if="imageKey && item[imageKey]" class="" :src="require(`@/assets/${item[imageKey]}`)" alt="img">
      {{ item.key }}
    </label>
  </div>
  <div v-if="isSpecify" :class="`flex items-center pl-2 border ${error ? 'border-red-600' : 'border-gray-200'} rounded dark:border-gray-700`">
    <input :id="`${name}-${type}-input`" :type="type" :name="name" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
    <input @input="handleEmit($event.target.value)" @focus="handleEmit($event.target.value)" type="text" id="kmTelegraphPoles" placeholder="อื่นๆ โปรดระบุ" class="w-full my-2 mx-2" :class="'_input' " required>
  </div>
</template>