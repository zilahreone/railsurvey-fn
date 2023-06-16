<script setup>
import { ref, reactive, onMounted, computed, watch, onUnmounted } from 'vue'
const props = defineProps({
  isPreview: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: 'signaturePad',
    required: true
  },
  error: {
    type: Boolean,
    default: false
  },
  backgroundImage: {
    type: String,
    default: '',
    required: false
  },
  style: {
    type: Object,
    default: {},
    required: false
  },
  penColor: {
    type: String,
    default: 'black',
    required: false
  },
  width: {
    type: String,
    default: null,
    required: false
  },
  height: {
    type: String,
    default: null,
    required: false
  },
  modelValue: {
    type: String,
    default: null
  }
})
const emit = defineEmits(['update:modelValue', 'onEvent'])
const signaturePad = ref(props.id)
const activeButton = ref(true)

defineExpose({ activeButton })
onMounted(() => {
  loadSignature()
})
const loadSignature = () => {
  if (props.isPreview) {
    signaturePad.value.lockSignaturePad()
    if (props.modelValue) signaturePad.value?.fromDataURL(props.modelValue)
  } else {
    if (props.modelValue) signaturePad.value?.fromDataURL(props.modelValue)
  }
  // console.log();
  onEnd()
}
const undo = () => {
  signaturePad.value.undoSignature()
  const { isEmpty, data } = signaturePad.value.saveSignature()
  if (!isEmpty) emit('update:modelValue', data)
}
const clear = () => {
  signaturePad.value.clearSignature()
  emit('update:modelValue', null)
}
const onBegin = () => { emit('onEvent', true) }
const onEnd = () => {
  emit('onEvent', false)
  const { isEmpty, data } = signaturePad.value.saveSignature()
  if (!isEmpty) emit('update:modelValue', data)
}
const compCustomStyle = computed(() => {
  return {
    backgroundImage: `url(${require('@/assets/rail/rail_1.jpg')})`,
    backgroundRepeat: 'no-repeat'
  }
})

</script>
<template>
  <div :class="`w-fit flex flex-col items-center border p-0 ${error ? 'border-red-600' : 'border-gray-200'} gap-2`">
    <div class="flex">
      <button @click="undo" type="button" class="text-gray-900 hover:bg-gray-100 font-medium border-b border-x rounded-bl-md text-sm px-5 py-1">ย้อนกลับ</button>
      <button @click="clear" type="button" class="text-gray-900 hover:bg-gray-100 font-medium border-b border-r text-sm px-5 py-1">เคลียร์</button>
      <!-- <button @click="emit('onSubmit')" type="button" class="text-gray-900 hover:bg-gray-100 font-medium border-b border-r rounded-br-md text-sm px-5 py-1">Submit</button> -->
    </div>
    <div class="p-2" :class="`w-[${width}] h-[${height}]`">
      <VueSignaturePad :customStyle="style" :options="{ onBegin, onEnd, penColor: penColor, maxWidth: 1.5 }" ref="signaturePad" />
    </div>
    <slot></slot>
    <!-- <label class="pb-1 flex flex-col items-center text-sm font-medium text-gray-900 dark:text-white">ผู้สำรวจและบันทึกความเสียหาย</label> -->
  </div>
</template>