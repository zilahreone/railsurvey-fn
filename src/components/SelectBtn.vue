<script setup>
import { computed, ref } from 'vue';

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
  modelValue: {
    type: [String, Boolean, Array],
    default: null
  }
})
const emit = defineEmits(['update:modelValue'])
const inputFocus = ref(null)
const specify = ref(null)
const handleEmit = (val) => {
  let out = null
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
    }
  }
  emit('update:modelValue', out)
}
const isChecked = (val) => {
  // if (props.isSpecify) {
  //   return !props.items.map(item => item.value).includes(val)
  // }
  return props.modelValue?.includes(val)
}
const test = () => {
  console.log('test')
}
</script>
<template>
  <!-- <div v-for="(item ,index) in items" :key="index" class="flex items-center pl-2 border border-gray-200 rounded dark:border-gray-700">
    <input :id="`${name}-${item.value}-${type}-${index}`" :type="type" @input="handleEmit(item.value)" :checked="isChecked(item.value)" :name="name" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
    <label :for="`${name}-${item.value}-${type}-${index}`" class="w-full py-2 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
      {{ item.key }}
    </label>
  </div> -->
  <div v-for="(item ,index) in items" :key="index" :class="`flex items-center pl-2 border ${error ? 'border-red-600' : 'border-gray-200'} rounded dark:border-gray-700`">
    <input :id="`${name}-${item.value}-${type}-${index}`" :type="type" @input="handleEmit(item.value)" :checked="isChecked(item.value)" :name="name" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
    <!-- <label for="specify" class="ml-2 text-sm">ระบุ </label>
    <input name="" @input="" type="text" id="kmTelegraphPoles" class="my-2 mx-2" :class="error ? '_input_error' : '_input' " required> -->
    <label :for="`${name}-${item.value}-${type}-${index}`" :class="`flex flex-col gap-2 ${imageKey && item[imageKey] ? 'items-center' : ''}  w-full py-2 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300`">
      <img v-if="imageKey && item[imageKey]" class="" :src="require(`@/assets/${item[imageKey]}`)" alt="img">
      {{ item.key }}
    </label>
  </div>
  <div v-if="isSpecify" :class="`flex items-center pl-2 border ${error ? 'border-red-600' : 'border-gray-200'} rounded dark:border-gray-700`">
    <input :id="`${name}-${type}-input`" :type="type" @input="handleEmit()" :checked="modelValue && !items.map(item => item.value).includes(modelValue)" :name="name" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
    <!-- <label for="specify" class="ml-2 text-sm">ระบุ </label> -->
    <input @input="handleEmit($event.target.value)" @focus="handleEmit($event.target.value)" type="text" id="kmTelegraphPoles" placeholder="อื่นๆ โปรดระบุ" class="w-full my-2 mx-2" :class="'_input' " required>
    <!-- <label :for="`${name}-${type}-input`" :class="`flex flex-col gap-2 ${imageKey && item[imageKey] ? 'items-center' : ''}  w-full py-2 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300`">
    </label> -->
  </div>
  <!-- <div v-for="(item ,index) in items" :key="index" class="flex flex-col items-center gap-2 border border-gray-200 rounded dark:border-gray-700">
    <div class="flex items-center gap-2 w-fit">
      <input :id="`${name}-${item.value}-${type}-${index}`" :type="type" @input="handleEmit(item.value)" :checked="isChecked(item.value)" :name="name" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
      <img class="" :src="require(`@/assets/trackGeometry/Picture4.png`)" alt="img">
    </div>
    <div>
      <label :for="`${name}-${item.value}-${type}-${index}`" class="text-sm font-medium w-full text-gray-900 dark:text-gray-300">{{ item.key }}</label>
    </div>
  </div> -->
</template>