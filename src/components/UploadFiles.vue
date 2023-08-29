<script setup>
import { ref, computed } from 'vue';
import api from '@/services'

const props = defineProps({
  isPreview: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Array,
    default: []
  },
  id: {
    type: String,
    default: '',
    required: true
  },
  count: {
    type: Number,
    default: 3
  },
  errors: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['update:modelValue', 'onUploadImages'])

const showUploadBtn = ref(false)
const disableUploadBtn = ref(false)
const uploadStatus = ref(null)
const files = ref(null)

// METHOD
const handleUploadImages = (event) => {
  const files = eval(event.target.id).files
  let images = [...props.modelValue]
  // console.log(files);
  // let images = []
  // let list = new DataTransfer();
  Array.from(files).forEach((file, index) => {
    const fileName = `${Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')}.${file.name.split('\.').pop()}`
    if (['image/jpeg', 'image/pjpeg', 'image/png', 'image/apng'].includes(file.type)) {
      if (images.filter(image =>
      image.originalname === file.name
      && image.size === file.size
      && image.mimetype === file.type).length === 0) {
        // console.log(file)
        const file_ = new File([file], fileName, { type: file.type })
        // list.items.add(file_)
        images.push({
          originalname: file.name,
          originalPath: URL.createObjectURL(file),
          mimetype: file.type,
          destination: null,
          filename: fileName,
          size: file.size,
          file: file_
        })
      } else {
        document.getElementById(props.id).value = ''
      }
    }
  })
  // let myFileList = list.files;
  // console.log(myFileList);

  // if (files.length <= props.count) {
  // }
  emit('update:modelValue', images)
  uploadStatus.value = null
  showUploadBtn.value = true
}
const handleRemoveImage = (index) => {
  let images = [...props.modelValue]
  images.splice(index, 1)
  emit('update:modelValue', images)
  // document.getElementById(props.id).value = ''
  if (images.length === 0) showUploadBtn.value = false
}
// COMPUTED
const compCSSUploadBtn = computed(() => {
  // console.log(props.error.filter(err => Object.keys(err).filter(obj => err[obj].length > 0)).length > 0)
  if (props.errors.$error) {
    return '_button-disable'
  } else {
    if (uploadStatus.value === 'success') {
      return '_button-success'
    } else if (uploadStatus.value === 'error') {
      return '_button-error'
    } else if (uploadStatus.value === 'offline') {
      return '_button-warning'
    } else {
      return '_button'
    }
  }
})
// const compUploadStatus = computed(() => {
//   return uploadStatus.value === 'pending' ? 'Uploading'
//   : uploadStatus.value === 'success' ? 'Done'
//   : uploadStatus.value === 'error' ? 'Upload Fail'
//   : uploadStatus.value === 'offline' ? 'Upload Queue'
//   : 'Upload'
// })
</script>
<template>
  <div class="flex flex-col gap-2">
    <div>
      <label class="_label-lg">
        <slot name="header"></slot>
      </label>
      <input v-if="!isPreview" :disabled="isPreview" @change="handleUploadImages($event)" title="เลือกรูปภาพ" :name="id" accept="image/x-png,image/gif,image/jpeg" :id="id" type="file" multiple=""
        class="block w-full text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
      >
    </div>
    <!-- <div>
      <div class="flex flex-col bg-gray-50 border border-gray-300 rounded-lg">
        <div class="flex items-center text-white">
          <label class="bg-gray-dark" :for="id">เลือกรูปภาพ</label>
          <input style="visibility:hidden;" :disabled="isPreview" @change="handleUploadImages($event)" title="เลือกรูปภาพ" :name="id" accept="image/x-png,image/gif,image/jpeg" :id="id" type="file" multiple="">
        </div>
      </div>
    </div>
    <div class="inline-flex justify-items-center border border-gray-300 rounded-lg cursor-pointer bg-gray-50">
      <label :for="id" class="justify-items-center justify-center bg-gray-dark rounded-lg text-white">เลือกรูปภาพ</label>
      <input style="visibility:hidden;" :disabled="isPreview" @change="handleUploadImages($event)" title="เลือกรูปภาพ" :name="id" accept="image/x-png,image/gif,image/jpeg" :id="id" type="file" multiple="">
    </div> -->
    <slot name="default">
      <div class="flex flex-col gap-1">
        <div class="flex flex-wrap gap-1">
          <div v-for="(image, index) in modelValue" :key="index" class="flex flex-col gap-1">
            <div>
              <img :src="image.originalPath" :alt="image.originalname" class="object-contain h-56">
              <button v-if="!isPreview && !uploadStatus" @click="handleRemoveImage(index)" class="bg-red-500 hover:bg-red-600 w-full p-2 text-white text-sm">Remove</button>
              <p v-if="errors.$error && errors.$errors.filter(err => err.$validator === '$each').length > 0" class="text-sm text-red-600">{{ errors.$errors[0].$message[index].join('')}}</p>
            </div>
          </div>
        </div>
        <p v-if="errors.$error && errors.$errors.filter(err => err.$validator !== '$each').length > 0" class="text-sm text-red-600">{{ errors.$errors.filter(err => err.$validator !== '$each')[0].$message}}</p>
      </div>
      <!-- <div v-if="showUploadBtn" class="flex flex-col gap-1">
        <div>
          <button :disabled="['pending', 'success', 'offline'].includes(uploadStatus)" type="button"
          @click="uploadImages()"
          :class="['text-center items-center mr-2', compCSSUploadBtn]"
          >
            <svg v-if="uploadStatus === 'pending'" aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
            </svg>
            <svg v-if="uploadStatus === 'error'" class="inline w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg v-if="uploadStatus === 'success'"  class="inline w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {{ compUploadStatus }}
          </button>
        </div>
        <p v-if="modelValue.filter(image => !image.isUploaded).length > 0" class="text-sm text-red-600">Please Upload Images</p>
      </div> -->
    </slot>
  </div>
</template>