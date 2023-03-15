<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BorderRadioBtn from '@/components/BorderRadioBtn.vue'
import Border from '@/components/Border.vue'
import RadioBtnRow from '@/components/RadioBtnRow.vue'
import RadioBtn from '@/components/RadioBtn.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import RadioImageBtn from '@/components/RadioImageBtn.vue'
import Accordion from '@/components/Accordion.vue'
// import { Loader } from '@googlemaps/js-api-loader'
import variable from '@/assets/variable.json'
import api from '@/services'
import { nullableTypeAnnotation } from '@babel/types'
import IndexDB from '@/IndexedDB'
import { Buffer } from 'buffer'

const store = useStore()
const router = useRouter()

const props = defineProps({
  isNew: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: [Object, null],
    default: {
      date: new Date().toISOString().substring(0, 10),
      zone: null,
      coordinates: {
        latitude: null,
        longitude: null
      },
      kilometers: null,
      nearby: {
        stationBefore: null,
        stationAfter: null
      },
      railType: null,
      areaCondition: null,
      defectSituation: {
        railPositionDefect: null,
        railAreaDefect: null,
      },
      defectPattern: null,
      surfaceDefect: null,
      railCondition: null,
      trackGeometryCondition: null,
      // defectTrackGeometry: null,
      ballastCondition: null,
      sleeperCondition: null,
      trackFoundationCondition: null,
      uploadImage: null,
      severity: null,
      isAnalyzeDamage: null,
      hasMaintenanceRecord: null,
      lastMaintenanceDate: null,
      yearlyMaintenanceTimes: null,
      maintenanceMethod: null,
      note: null,
      signature: null
      // createdAt: null,
      // createdBy: null
    }
  },
  validate: {
    type: Object,
    default: {}
  }
})
const railSurvey = props.modelValue
const emit = defineEmits(['update:modelValue'])

const v$ = props.validate

const signaturePad = ref(null)
const ta = ref(null)
const isShowBtnUpload = ref(false)
const uploadStatus = ref(null)

const isActiveGeneral = ref(true)
const isActiveRail = ref(true)
const isActiveTrack = ref(true)
const isActiveMA = ref(true)

const general = ref(null)

onMounted(() => {
  signaturePad.value.signatureData = railSurvey.signature
})

const undo = () => {
  signaturePad.value.undoSignature()
}
const save = () => {
  const { isEmpty, data } = signaturePad.value.saveSignature()
  console.log(isEmpty)
  console.log(data)
}
const clear = () => {
  signaturePad.value.clearSignature()
}

const validateSignature = () => {
  const { isEmpty, data } = signaturePad.value.saveSignature()
  console.log(isEmpty)
  return !isEmpty
}

// METHOD //
const convertImage = async () => {
  console.log('convert')
  const { isEmpty, data } = signaturePad.value.saveSignature()
  // const b4 = Buffer.from(data, 'base64')
  // console.log(data);
  // let blob = new Blob(["<html>…</html>"], {type: 'text/html'});
  // const blob = await fetch(data).then(resp => resp.blob());
  // const blob1 = await base64Response.blob();
  if (!isEmpty) {
    const asd = Buffer.from(data)
    const asd2 = await fetch(data).then(res => res.blob())
    // const asd = Buffer.from(data)
    // console.log(asd2)
    // const buff = Buffer.from(data).toString('base64')
    api.post('/api/rail-survey', { blob: data}, null).then((res) => {
      res.json().then((json) => {
        console.log(json);
      })
    })
  }
}

const handleSubmit = async () => {
  // const isValid = await v$.value.$validate()
  // if (isValid) {
  //   if (props.isNew) {
  //     api.post(`/api/rail-survey`, railSurvey, store.state.token).then((resp) => {
  //       if (resp.status === 201) {
  //         console.log('create success ;)')
  //       } else {
  //       }
  //     }).catch(() => {
  //       navigator.serviceWorker.ready.then(registration => {
  //         // console.log(registration)
  //         registration.sync.register('some-unique-tag')
  //       }).catch(console.log())
  //     })
  //   } else {
  //     api.put(`/api/rail-survey`, railSurvey, store.state.token).then((resp) => {
  //       if (resp.status === 201) {
  //         console.log('update success ;)')
  //       } else {
  //       }
  //     }).catch(() => {
  //       navigator.serviceWorker.ready.then(registration => {
  //         // console.log(registration)
  //         registration.sync.register('some-unique-tag')
  //       }).catch(console.log())
  //     })
  //   }
  // }
  // const { isEmpty, data } = signaturePad.value.saveSignature()
  // railSurvey.signature = data
  // IndexDB.insertData('railway-survey', 1, { fname: 'wissarut', lname: 'sangjong' })
  // router.push('/survey-list')
  // console.log(isValid);
  // api.post(`/`, railSurvey, store.state.token).then((resp) => {
  //   if (resp.status === 201) {
  //     console.log('create success ;)')
  //   } else {
  //   }
  // }).catch(() => {
  //   navigator.serviceWorker.ready.then(registration => {
  //     // console.log(registration)
  //     registration.sync.register('some-unique-tag')
  //   }).catch(console.log())
  // })
  // // IndexDB.createDB('test-db', 1, 'book', { id: 'js', name: 'Harry Porter' })
  // router.push('/survey-list')
}
// const handleGetLocation = () => {
//   navigator.geolocation.getCurrentPosition((position) => {
//       const p = position.coords;
//       // console.log(p.latitude, p.longitude);
//       railSurvey.coordinates = `${p.latitude}, ${p.longitude}`
//   })
// }
const getAPI = () => {
  api.get(`/`, null).then((resp) => {
    resp.json().then((json) => {
      ta.value = json
    })
  })
}

const handleSelectZone = (value) => {
  const zones = variable.zone.map((z) => z.value)
  const index = zones.indexOf(value)
  return {
    stationBefore: !zones[index - 1] ? value : zones[index - 1],
    stationAfter: !zones[index + 1] ? value : zones[index + 1]
  }
}

const handleUploadImage = (event) => {
  uploadStatus.value = null
  const id = eval(event.target.id)
  const files = id.files
  console.log(id.name)
  Array.from(files).forEach((file, index) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file)
    img.alt = file.name
    if (id.name === 'railImg') {
      document.querySelector('#railDamagePreview').append(img);
    } else if (id.name === 'trackImg') {
      document.querySelector('#trackPreview').append(img);
    }
  })
  isShowBtnUpload.value = true
}

const handleUploadImages = () => {
  const files = uploadImg.files
  let formData = new FormData()
  Array.from(files).forEach((file, index) => {
    formData.append('file', file)
  })
  api.uploadFils('/api/uploads', formData, null).then((resp) => {
    uploadStatus.value = 'pending'
    if (resp.status === 201) {
      resp.json().then((json) => {
        console.log(json)
      })
      uploadStatus.value = 'success'
    }
  }).catch((err) => {
    uploadStatus.value = 'error'
  })
}

const scrollToError = () => {
  window.scrollTo(0, general.value.offsetTop)
}

defineExpose({
  scrollToError
})

const onBegin = () => {
  // console.log('=== Begin ===');
}

const onEnd = () => {
  // console.log('=== End ===');
  const { isEmpty, data } = signaturePad.value.saveSignature()
  if (!isEmpty) {
    // railSurvey.signature = data
    handleEmit({ name: 'signature', value: data })
  }
}

const handleEmit = (target) => {
  const arr = target.name.split('\.')
  if (arr[0] === 'coordinates') {
    let coord = JSON.parse(JSON.stringify(railSurvey[arr[0]]))
    coord[arr[1]] = parseFloat(target.value)
    emit('update:modelValue', Object.assign(railSurvey, { [arr[0]]: coord }))
  // } else if (arr[0] === 'zone') {
    // emit('update:modelValue', Object.assign(railSurvey, { [target.name]: target.value, nearby: handleSelectZone(target.value) }))
  } else if (arr[0] === 'nearby') {
    let nearby = JSON.parse(JSON.stringify(railSurvey[arr[0]]))
    nearby[arr[1]] = target.value
    emit('update:modelValue', Object.assign(railSurvey, { [arr[0]]: nearby }))
  } else if (arr[0] === 'yearlyMaintenanceTimes') {
    emit('update:modelValue', Object.assign(railSurvey, { [target.name]: parseInt(target.value) }))
  } else {
    emit('update:modelValue', Object.assign(railSurvey, { [target.name]: target.value }))
  }
}

// COMPUTED //
// const compNearby = computed(() => {
//   let nearby = []
//   Object.keys(railSurvey.nearby).forEach(key => {
//     nearby.push(variable.zone.filter(z => z.value === railSurvey.nearby[key]).map(z => z.key).join())
//   })
//   return nearby
// })
</script>
<template>
  <!-- <pre> {{ railSurvey }} </pre> -->
  <!-- <button @click="convertImage">convertImage</button> -->
  <div class="container">
    <!-- activeName === 'general' -->
    <Accordion v-model="isActiveGeneral" head ref="general">
      <template #header>ข้อมูลการสำรวจเบื้องต้น</template>
      <template #body>
        <div class="flex flex-col gap-4">
          <div class="flex md:flex-row flex-col gap-2">
            <div class="flex-1">
              <label class="_label-sm">วันที่สำรวจ</label>
              <input disabled :value="railSurvey.date" type="datetime-local" :max="railSurvey.date" id="date" :class="v$.date.$error ? '_input_error' : '_input'" required>
              <p v-if="v$.date.$error" class="text-sm text-red-600">{{ v$.date.$errors[0].$message }}</p>
            </div>
            <div class="flex-1">
              <label class="_label-sm">เขตการเดินรถ</label>
              <select name="zone" :value="railSurvey.zone" @change="handleEmit($event.target)" id="zone" :class="v$.zone.$error ? '_input_error' : '_input'">
                <option disabled value="">กรุณาเลือกเขตการเดินรถ</option>
                <option v-for="(zone, index) in variable.zone" :value="zone.value" :key="index">{{ zone.key }}</option>
              </select>
              <p v-if="v$.zone.$error" class="text-sm text-red-600">{{ v$.zone.$errors[0].$message }}</p>
            </div>
            <div class="flex-1">
              <label class="_label-sm">หลักกิโลเมตร/เสาโทรเลข</label>
              <input :value="railSurvey.kilometers" name="kilometers" @input="handleEmit($event.target)" type="text" id="kmTelegraphPoles" :class="v$.kilometers.$error ? '_input_error' : '_input' " required>
              <p v-if="v$.kilometers.$error" class="text-sm text-red-600">{{ v$.kilometers.$errors[0].$message }}</p>
            </div>
            <div class="flex-1">
              <label class="_label-sm">มาตรฐานและเกรด</label>
              <select name="railType" :value="railSurvey.railType" @change="handleEmit($event.target)" id="railType" :class="v$.railType.$error ? '_input_error' : '_input'">
                <option disabled :value="null">กรุณาเลือกประเภทของเกจ</option>
                <option v-for="(g ,index) in variable.guageType" :key="index" :value="g.value">{{ g.key }}</option>
              </select>
              <p v-if="v$.railType.$error" class="text-sm text-red-600">{{ v$.railType.$errors[0].$message }}</p>
            </div>
          </div>
          <div class="flex md:flex-row flex-col gap-2">
            <div class="flex-1">
              <label class="_label-sm">พิกัด GPS</label>
              <div class="flex md:flex-row flex-col gap-2">
                <div class="flex-1">
                  <input :value="railSurvey.coordinates.lattitude" type="text" name="coordinates.lattitude" @input="handleEmit($event.target)" :class="v$.coordinates.$error ? '_input_error' : '_input' " required>
                </div>
                <div class="flex-1">
                  <input :value="railSurvey.coordinates.longitude" type="text" name="coordinates.longitude" @input="handleEmit($event.target)" :class="v$.coordinates.$error ? '_input_error' : '_input' " required>
                </div>
              </div>
              <p v-if="v$.coordinates.$error" class="text-sm text-red-600">{{ v$.coordinates.$errors[0].$message }}</p>
            </div>
            <div class="flex-1">
              <label class="_label-sm">สถานีรถไฟใกล้เคียง</label>
              <div class="flex md:flex-row flex-col gap-2">
                <div class="flex-1">
                  <select name="nearby.stationBefore" :value="railSurvey.nearby.stationBefore" @change="handleEmit($event.target)" id="stationBefore" :class="v$.nearby.stationBefore.$error ? '_input_error' : '_input'">
                    <option disabled value="">กรุณาเลือกเขตการเดินรถ</option>
                    <option v-for="(zone, index) in variable.zone" :value="zone.value" :key="index">{{ zone.key }}</option>
                  </select>
                  <p v-if="v$.zone.$error" class="text-sm text-red-600">{{ v$.zone.$errors[0].$message }}</p>
                </div>
                <div class="flex-1">
                  <select name="nearby.stationAfter" :value="railSurvey.nearby.stationAfter" @change="handleEmit($event.target)" id="stationAfter" :class="v$.nearby.stationAfter.$error ? '_input_error' : '_input'">
                    <option disabled value="">กรุณาเลือกเขตการเดินรถ</option>
                    <option v-for="(zone, index) in variable.zone" :value="zone.value" :key="index">{{ zone.key }}</option>
                  </select>
                  <p v-if="v$.zone.$error" class="text-sm text-red-600">{{ v$.zone.$errors[0].$message }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex md:flex-row flex-col gap-2">
            <div class="flex-1">
              <label class="_label-sm">ลักษณะพื้นที่ที่เกิดความเสียหาย (Type of failure area)</label>
              <RadioBtn :error="v$.areaCondition.$error" :class="''" v-model="railSurvey.areaCondition" name="areaCondition" :items="variable.damageAreaPrperties"></RadioBtn>
              <p v-if="v$.areaCondition.$error" class="text-sm text-red-600">{{ v$.zone.$errors[0].$message }}</p>
            </div>
          </div>



        </div>
      </template>
    </Accordion>
    <!-- activeName === 'railDamage' -->
    <Accordion v-model="isActiveRail">
      <template #header>การสำรวจความเสียหายของราง</template>
      <template #body>
        <div class="flex flex-col gap-4">
          <div class="flex flex-wrap flex-row gap-2">
            <div class="grow">
              <label class="_label-md">เพิ่มรูปภาพ (บริเวณสำรวจความเสียหาย)</label>
              <div class="flex flex-col gap-2">
                <input @change="handleUploadImage($event)" name="railImg" accept="image/x-png,image/gif,image/jpeg" id="railUploadImg" type="file" multiple=""
                  class="block w-full text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                >
                <div id="railDamagePreview" class="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-1 items-center"></div>
                <div v-if="isShowBtnUpload">
                  <button :disabled="['pending', 'success'].includes(uploadStatus)" @click="handleUploadImages()" type="button"
                    :class="['text-center inline-flex items-center mr-2', uploadStatus === 'success' ? '_button-success' : uploadStatus === 'error' ? '_button-error' : '_button']"
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
                    {{ uploadStatus === 'pending' ? 'Uploading' : uploadStatus === 'success' ? 'Done' : uploadStatus === 'error' ? 'Upload Fail' : 'Upload' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap flex-row gap-2">
            <div class="flex-1">
              <label class="_label-lg">ความเสียหายของราง (Situation)</label>
              <div class="flex grow gap-8">
                <RadioBtn :error="v$.defectSituation.railAreaDefect.$error" v-model="railSurvey.defectSituation.railAreaDefect" name="railAreaDefect" :items="variable.situation"></RadioBtn>
              </div>
              <p v-if="v$.defectSituation.railAreaDefect.$error" class="text-sm text-red-600">{{ v$.defectSituation.railAreaDefect.$errors[0].$message }}</p>

            </div>
          </div>
          <div class="flex flex-wrap flex-row gap-2">
            <div class="flex-1">
              <label class="_label-lg">ตำแหน่งที่เกิดความเสียหายของราง (Location)</label>
              <div class="flex grow gap-8">
                <RadioBtn :error="v$.defectSituation.railPositionDefect.$error" v-model="railSurvey.defectSituation.railPositionDefect" name="railPositionDefect" :items="variable.location"></RadioBtn>
              </div>
              <p v-if="v$.defectSituation.railPositionDefect.$error" class="text-sm text-red-600">{{ v$.defectSituation.railPositionDefect.$errors[0].$message }}</p>

            </div>
          </div>
          <div class="flex flex-wrap flex-row gap-2">
            <div v-if="['railHead', 'railWeb', 'railFoot', 'fullSection'].includes(railSurvey.defectSituation.railPositionDefect)" class="flex-1">
              <label class="_label-lg">ลักณะความเสียหายที่เกิดขึ้น (Pattern, nature) </label>
              <div class="flex grow gap-8">
                <RadioBtn :error="v$.defectPattern.$error" v-model="railSurvey.defectPattern" name="defectPattern" :items="variable.damageProperties"></RadioBtn>
              </div>
              <p v-if="v$.defectPattern.$error" class="text-sm text-red-600">{{ v$.defectPattern.$errors[0].$message }}</p>

            </div>
            <div v-else class="flex-1">
              <label class="_label-lg">ลักณะความเสียหายที่เกิดขึ้น (Pattern, nature) </label>
              <div class="flex grow gap-8">
                <RadioImageBtn v-model="railSurvey.surfaceDefect" name="surfaceDefect" :items="variable.scar" imageLabel="title" imagePath="img"></RadioImageBtn>
              </div>
              <p v-if="v$.surfaceDefect.$error" class="text-sm text-red-600">{{ v$.surfaceDefect.$errors[0].$message }}</p>
            </div>
          </div>
        </div>
      </template>
    </Accordion>
    <!-- activeName === 'trackDamage' -->
    <Accordion v-model="isActiveTrack">
      <template #header>สำรวจความเสียหายของทาง</template>
      <template #body>
        <div class="flex flex-col gap-4">
          <div class="flex flex-wrap flex-row gap-2">
            <div class="grow">
              <label class="_label-md">เพิ่มรูปภาพ (บริเวณสำรวจความเสียหาย)</label>
              <div class="flex flex-col gap-2">
                <input @change="handleUploadImage($event)" name="trackImg" accept="image/x-png,image/gif,image/jpeg" id="trackUploadImg" type="file" multiple=""
                  class="block w-full text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                >
                <div id="trackPreview" class="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-1 items-center"></div>
                <div v-if="isShowBtnUpload">
                  <button :disabled="['pending', 'success'].includes(uploadStatus)" @click="handleUploadImages()" type="button"
                    :class="['text-center inline-flex items-center mr-2', uploadStatus === 'success' ? '_button-success' : uploadStatus === 'error' ? '_button-error' : '_button']"
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
                    {{ uploadStatus === 'pending' ? 'Uploading' : uploadStatus === 'success' ? 'Done' : uploadStatus === 'error' ? 'Upload Fail' : 'Upload' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap flex-row gap-2">
            <div class="grow">
              <label class="_label-lg">Track Geometry</label>
              <div class="flex grow gap-8">
                <RadioBtn :error="v$.trackGeometryCondition.$error" v-model="railSurvey.trackGeometryCondition" name="trackGeometryCondition" :items="variable.integrity"></RadioBtn>
              </div>
              <p v-if="v$.trackGeometryCondition.$error" class="text-sm text-red-600">{{ v$.trackGeometryCondition.$errors[0].$message }}</p>
            </div>
          </div>
          <div v-if="railSurvey.trackGeometryCondition && railSurvey.trackGeometryCondition !== 'perfect'" class="flex flex-wrap flex-row gap-2">
            <div class="grow">
              <label class="_label-lg">รูปแบบ Track Geometry ที่ผิดปกติ</label>
              <div class="flex grow gap-8">
                <RadioImageBtn v-model="railSurvey.trackGeometryCondition" name="defectTrackGeometry" :items="variable.trackGeometry" imageLabel="title" imagePath="img"></RadioImageBtn>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap flex-row gap-2">
            <div class="grow">
              <label class="_label-lg">หินโรยทาง (Ballast)</label>
              <div class="flex grow gap-8">
                <RadioBtn :error="v$.ballastCondition.$error" v-model="railSurvey.ballastCondition" name="ballastCondition" :items="variable.ballast"></RadioBtn>
              </div>
              <p v-if="v$.ballastCondition.$error" class="text-sm text-red-600">{{ v$.ballastCondition.$errors[0].$message }}</p>
            </div>
          </div>
          <div class="flex flex-wrap flex-row gap-2">
            <div class="grow">
              <label class="_label-lg">หมอนรองทาง (Sleeper)</label>
              <div class="flex grow gap-8">
                <RadioBtn :error="v$.sleeperCondition.$error" v-model="railSurvey.sleeperCondition" name="sleeperCondition" :items="variable.sleeper"></RadioBtn>
              </div>
              <p v-if="v$.sleeperCondition.$error" class="text-sm text-red-600">{{ v$.sleeperCondition.$errors[0].$message }}</p>
            </div>
          </div>
          <div class="flex flex-wrap flex-row gap-2">
            <div class="grow">
              <label class="_label-lg">คันทาง</label>
              <div class="flex grow gap-8">
                <RadioBtn :error="v$.trackFoundationCondition.$error" v-model="railSurvey.trackFoundationCondition" name="trackFoundationCondition" :items="variable.integrity"></RadioBtn>
              </div>
              <p v-if="v$.trackFoundationCondition.$error" class="text-sm text-red-600">{{ v$.trackFoundationCondition.$errors[0].$message }}</p>
            </div>
          </div>
        </div>
      </template>
    </Accordion>
    <!-- activeName === 'maintenance' -->
    <Accordion v-model="isActiveMA" :error="v$.hasMaintenanceRecord.$error
      || v$.severity.$error
      || v$.isAnalyzeDamage.$error
      || v$.lastMaintenanceDate.$error
      || v$.yearlyMaintenanceTimes.$error
      || v$.maintenanceMethod.$error">
      <template #header>การประเมินความเสียหายและการซ่อมบำรุง</template>
      <template #body>
        <div class="flex flex-col gap-4">
          <div class="flex flex-wrap flex-row gap-2">
            <div class="grow">
              <label class="_label-md">ความรุนแรงของความเสียหาย</label>
              <div class="flex grow gap-8">
                <RadioBtn :error="v$.severity.$error" v-model="railSurvey.severity" name="severity" :items="variable.damagesLevel"></RadioBtn>
              </div>
              <p v-if="v$.severity.$error" class="text-sm text-red-600">{{ v$.severity.$errors[0].$message }}</p>
            </div>
          </div>
          <div class="flex flex-wrap flex-row gap-2">
            <div class="grow">
              <label class="_label-lg">ควรส่งห้องปฏิบัติการเพื่อทำการวิเคราะห์สาเหตุของความเสียหาย</label>
              <div class="flex grow gap-8">
                <RadioBtn :error="v$.isAnalyzeDamage.$error" v-model="railSurvey.isAnalyzeDamage" name="positionDamage" :items="variable.analyse"></RadioBtn>
                <p v-if="v$.isAnalyzeDamage.$error" class="text-sm text-red-600">{{ v$.isAnalyzeDamage.$errors[0].$message }}</p>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap flex-row gap-2">
            <div class="flex flex-wrap flex-row gap-2">
              <div class="grow">
                <label class="_label-lg">ประวัติการซ่อมบำรุง</label>
                <div class="flex grow gap-10">
                  <RadioBtn :error="v$.hasMaintenanceRecord.$error" v-model="railSurvey.hasMaintenanceRecord" name="hasMaintenanceRecord" :items="variable.maintenanceRecord"></RadioBtn>
                </div>
                <p v-if="v$.hasMaintenanceRecord.$error" class="text-sm text-red-600">{{ v$.hasMaintenanceRecord.$errors[0].$message }}</p>
              </div>
            </div>
          </div>
          <div v-if="railSurvey.hasMaintenanceRecord" class="flex flex-wrap flex-row gap-2">
            <div class="grow">
              <label class="_label-sm">การซ่อมบำรุงครั้งล่าสุด</label>
              <input :value="railSurvey.lastMaintenanceDate" name="lastMaintenanceDate" @input="handleEmit($event.target)" type="date" id="email" :class="v$.lastMaintenanceDate.$error ? '_input_error' : '_input' " required>
              <p v-if="v$.lastMaintenanceDate.$error" class="text-sm text-red-600">{{ v$.lastMaintenanceDate.$errors[0].$message }}</p>
            </div>
            <div class="grow">
              <label class="_label-sm">ความถี่ในการซ่อมบำรุงในรอบปี</label>
              <select name="yearlyMaintenanceTimes" :value="railSurvey.yearlyMaintenanceTimes" @change="handleEmit($event.target)" id="yearlyMaintenanceTimes" :class="v$.yearlyMaintenanceTimes.$error ? '_input_error' : '_input'">
                <option disabled value="">กรุณาเลือกครั้งในการซ่อมบำรุง</option>
                <option v-for="(mt, index) in variable.maintenanceTime" :value="mt.value" :key="index">{{ mt.key }}</option>
              </select>
              <!-- <input :value="railSurvey.yearlyMaintenanceTimes" name="yearlyMaintenanceTimes" @input="handleEmit($event.target)" type="number" :min="0" :max="365" id="password" :class="v$.yearlyMaintenanceTimes.$error ? '_input_error' : '_input' " required> -->
              <p v-if="v$.yearlyMaintenanceTimes.$error" class="text-sm text-red-600">{{ v$.yearlyMaintenanceTimes.$errors[0].$message }}</p>
            </div>
          </div>
          <div class="flex flex-wrap flex-row gap-2">
            <div class="grow">
              <label class="_label-lg">คำแนะนำวิธีการซ่อมบำรุง</label>
              <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
                <RadioBtn :error="v$.maintenanceMethod.$error" v-model="railSurvey.maintenanceMethod" name="ma" :items="variable.maintenanceMethod"></RadioBtn>
              </div>
              <p v-if="v$.maintenanceMethod.$error" class="text-sm text-red-600">{{ v$.maintenanceMethod.$errors[0].$message }}</p>
            </div>
          </div>
          <div class="flex flex-wrap flex-row gap-2">
            <div class="grow">
              <label class="_label-lg">ความคิดเห็นของผู้สำรวจความเสียหาย</label>
              <textarea :value="railSurvey.note" name="note" @input="handleEmit($event.target)" rows="4" class="_input" placeholder=""></textarea>
            </div>
          </div>
        </div>
      </template>
    </Accordion>
    <div class="mt-4 flex justify-center">
      <div class="w-1/2 border border-solid p-0" :class="v$.signature.$error ? 'border-red-600' : 'border-gray-200' ">
        <div class="flex justify-center">
          <button @click="undo" type="button" class="text-gray-900 hover:bg-gray-100 font-medium border-b border-x rounded-bl-md text-sm px-5 py-1">Undo</button>
          <button @click="clear" type="button" class="text-gray-900 hover:bg-gray-100 font-medium border-b border-r rounded-br-md text-sm px-5 py-1">Clear</button>
        </div>
        <div class="h-28 p-1">
          <VueSignaturePad :options="{ onBegin, onEnd }" ref="signaturePad" />
        </div>
        <label class="pb-1 flex flex-col items-center text-sm font-medium text-gray-900 dark:text-white">ผู้สำรวจและบันทึกความเสียหาย</label>
      </div>
    </div>
  </div>

</template>
<style>
.image-column {
  display: block;
  height: 100%;
  background-size: cover;
}
</style>