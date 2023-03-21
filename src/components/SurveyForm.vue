<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BorderRadioBtn from '@/components/BorderRadioBtn.vue'
import Border from '@/components/Border.vue'
import RadioBtnRow from '@/components/RadioBtnRow.vue'
import RadioBtn from '@/components/RadioBtn.vue'
import CheckboxBtn from '@/components/CheckboxBtn.vue'
import SelectBtn from '@/components/SelectBtn.vue'
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
      // date: new Date().toISOString().substring(0, 10),
      // zone: null,
      // coordinates: {
      //   latitude: null,
      //   longitude: null
      // },
      // kilometers: null,
      // nearby: {
      //   stationBefore: null,
      //   stationAfter: null
      // },
      // railType: null,
      // areaCondition: [],
      // defectSituation: {
      //   railAreaDefect: [],
      //   railPositionDefect: [],
      // },
      // defectPattern: null,
      // surfaceDefect: null,
      // railCondition: null,
      // trackGeometryCondition: null,
      // // defectTrackGeometry: null,
      // ballastCondition: [],
      // sleeperCondition: [],
      // trackFoundationCondition: null,
      // uploadImage: null,
      // severity: null,
      // isAnalyzeDamage: null,
      // hasMaintenanceRecord: null,
      // lastMaintenanceDate: null,
      // yearlyMaintenanceTimes: null,
      // maintenanceMethod: [],
      // note: null,
      // signature: null
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
  // signaturePad.value.signatureData = railSurvey.signature
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
  console.log(target.name);
  console.log(target.value);
  console.log(parseFloat(target.value));
  const arr = target.name.split('\.')
  console.log(arr);
  if (arr[0] === 'generalSurvey') {
    if (arr[1] === 'zone') {
      emit('update:modelValue', Object.assign(railSurvey[arr[0]], { [arr[1]]: target.value, nearby: handleSelectZone(target.value) }))
    } else if (arr[1] === 'coordinates') {
      emit('update:modelValue', Object.assign(railSurvey[arr[0]][arr[1]], { [arr[2]]: parseFloat(target.value)}))
    } else {
      emit('update:modelValue', Object.assign(railSurvey[arr[0]], { [arr[1]]: target.value }))
    }
  }
  else if (arr[0] === 'railDamageSurvey') {
  }
  else if (arr[0] === 'trackDamageSurvey') {}
  else if (arr[0] === 'maintenanceRate') {}
  // if (arr[0] === 'coordinates') {
  //   let coord = JSON.parse(JSON.stringify(railSurvey[arr[0]]))
  //   coord[arr[1]] = parseFloat(target.value)
  //   emit('update:modelValue', Object.assign(railSurvey, { [arr[0]]: coord }))
  // } else if (arr[0] === 'zone') {
  //   emit('update:modelValue', Object.assign(railSurvey, { [target.name]: target.value, nearby: handleSelectZone(target.value) }))
  // } else if (arr[0] === 'nearby') {
  //   let nearby = JSON.parse(JSON.stringify(railSurvey[arr[0]]))
  //   nearby[arr[1]] = target.value
  //   emit('update:modelValue', Object.assign(railSurvey, { [arr[0]]: nearby }))
  // } else if (arr[0] === 'yearlyMaintenanceTimes') {
  //   emit('update:modelValue', Object.assign(railSurvey, { [target.name]: parseInt(target.value) }))
  // } else {
  //   emit('update:modelValue', Object.assign(railSurvey, { [target.name]: target.value }))
  // }
}

// COMPUTED //
const compDisablesLocation = computed(() => {
  const filteredArray = railSurvey.railDamageSurvey.situation.filter(rd => ['weldingJoint','fishPlate','railroadCrossing','turnOut'].includes(rd))
  if (filteredArray.length > 0) {
    return ['gaugeSide','surfaceRailHead']
  }
  return []
})
const compDisablesDefectPattern = computed(() => {
  const location = railSurvey.railDamageSurvey.location.filter((location, index) => ['railHead', 'railWeb', 'railFoot', 'fullSection'].includes(location))
  const location2 = railSurvey.railDamageSurvey.location.filter((location, index) => ['gaugeSide','surfaceRailHead'].includes(location))
  if (location.length > 0 && location2.length === 0) {
    return ['surfaceDefect', 'crushedHead', 'headChecking', 'spalling', 'sideWear', 'shelling', 'burnedRail', 'other']
  } else if (location.length === 0 && location2.length > 0) {
    return ['fracture', 'rupture', 'wear', 'bend', 'corrosion']
  }
  return []
})
const compDefectPattern = computed(() => {
  const location = railSurvey.railDamageSurvey.location.filter((location, index) => ['railHead', 'railWeb', 'railFoot', 'fullSection'].includes(location))
  const location2 = railSurvey.railDamageSurvey.location.filter((location, index) => ['gaugeSide','surfaceRailHead'].includes(location))
  console.log(location.length > 0 && location2 === 0);
  if (location.length > 0 && location2.length === 0) {
    return variable.defectPattern.filter(defect => ['fracture', 'rupture', 'wear', 'bend', 'corrosion'].includes(defect.value))
  } else if (location.length === 0 && location2.length > 0) {
    return variable.defectPattern.filter(defect => ['surfaceDefect', 'crushedHead', 'headChecking', 'spalling', 'sideWear', 'shelling', 'burnedRail', 'other'].includes(defect.value))
  } else {
    return variable.defectPattern
  }
})
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-2">
            <div>
              <label class="_label-sm">วันที่สำรวจ</label>
              <input disabled :value="railSurvey.generalSurvey.date" type="datetime-local" :max="railSurvey.generalSurvey.date" id="date" :class="'_input'" required>
              <!-- <p v-if="v$.generalSurvey.date.$error" class="text-sm text-red-600">{{ v$.generalSurvey.date.$errors[0].$message }}</p> -->
            </div>
            <div>
              <label class="_label-sm">เขตการเดินรถ</label>
              <select name="generalSurvey.zone" :value="railSurvey.generalSurvey.zone" @change="handleEmit($event.target)" id="zone" :class="v$.generalSurvey.zone.$error ? '_input_error' : '_input'">
                <option disabled value="">กรุณาเลือกเขตการเดินรถ</option>
                <option v-for="(zone, index) in variable.zone" :value="zone.value" :key="index">{{ zone.key }}</option>
              </select>
              <p v-if="v$.generalSurvey.zone.$error" class="text-sm text-red-600">{{ v$.generalSurvey.zone.$errors[0].$message }}</p>
            </div>
            <div>
              <label class="_label-sm">หลักกิโลเมตร/เสาโทรเลข</label>
              <input :value="railSurvey.generalSurvey.kilometers" name="generalSurvey.kilometers" @input="handleEmit($event.target)" type="text" id="kmTelegraphPoles" :class="v$.generalSurvey.kilometers.$error ? '_input_error' : '_input' " required>
              <p v-if="v$.generalSurvey.kilometers.$error" class="text-sm text-red-600">{{ v$.generalSurvey.kilometers.$errors[0].$message }}</p>
            </div>
            <div>
              <label class="_label-sm">มาตรฐานและเกรด</label>
              <select name="railType" :value="railSurvey.generalSurvey.railType" @change="handleEmit($event.target)" id="railType" :class="v$.generalSurvey.railType.$error ? '_input_error' : '_input'">
                <option disabled value="">กรุณาเลือกประเภทของเกจ</option>
                <option v-for="(g ,index) in variable.guageType" :key="index" :value="g.value">{{ g.key }}</option>
              </select>
              <p v-if="v$.generalSurvey.railType.$error" class="text-sm text-red-600">{{ v$.generalSurvey.railType.$errors[0].$message }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-4">
            <div>
              <label class="_label-sm">พิกัด GPS</label>
              <input :value="railSurvey.generalSurvey.coordinates.latitude" type="text" name="generalSurvey.coordinates.latitude" @input="handleEmit($event.target)" :class="v$.generalSurvey.coordinates.latitude.$error ? '_input_error' : '_input' " required>
              <p v-if="v$.generalSurvey.coordinates.latitude.$error" class="text-sm text-red-600">{{ v$.generalSurvey.coordinates.latitude.$errors[0].$message }}</p>
            </div>
            <div class="pt-7">
              <input :value="railSurvey.generalSurvey.coordinates.longitude" type="text" name="generalSurvey.coordinates.longitude" @input="handleEmit($event.target)" :class="v$.generalSurvey.coordinates.longitude.$error ? '_input_error' : '_input' " required>
              <p v-if="v$.generalSurvey.coordinates.longitude.$error" class="text-sm text-red-600">{{ v$.generalSurvey.coordinates.longitude.$errors[0].$message }}</p>
            </div>
            <div>
              <label class="_label-sm">สถานีรถไฟใกล้เคียง</label>
              <div class="flex md:flex-row flex-col gap-2">
                <div class="flex-1">
                  <select name="generalSurvey.nearby.stationBefore" :value="railSurvey.generalSurvey.nearby.stationBefore" @change="handleEmit($event.target)" id="stationBefore" :class="v$.generalSurvey.nearby.stationBefore.$error ? '_input_error' : '_input'">
                    <option disabled value="">กรุณาเลือกสถานีก่อนหน้า</option>
                    <option v-for="(zone, index) in variable.zone" :value="zone.value" :key="index">{{ zone.key }}</option>
                  </select>
                  <p v-if="v$.generalSurvey.nearby.stationBefore.$error" class="text-sm text-red-600">{{ v$.generalSurvey.nearby.stationBefore.$errors[0].$message }}</p>
                </div>
                <div class="flex-1">
                  <select name="nearby.stationAfter" :value="railSurvey.generalSurvey.nearby.stationAfter" @change="handleEmit($event.target)" id="stationAfter" :class="v$.generalSurvey.nearby.stationAfter.$error ? '_input_error' : '_input'">
                    <option disabled value="">กรุณาเลือกสถานีถัดไป</option>
                    <option v-for="(zone, index) in variable.zone" :value="zone.value" :key="index">{{ zone.key }}</option>
                  </select>
                  <p v-if="v$.generalSurvey.nearby.stationAfter.$error" class="text-sm text-red-600">{{ v$.generalSurvey.nearby.stationAfter.$errors[0].$message }}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label class="_label-sm">ลักษณะพื้นที่ที่เกิดความเสียหาย (Type of failure area)</label>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2">
              <SelectBtn type="checkbox" :error="v$.generalSurvey.areaCondition.$error" v-model="railSurvey.generalSurvey.areaCondition" name="areaCondition" :items="variable.damageAreaPrperties"></SelectBtn>
            </div>
            <p v-if="v$.generalSurvey.areaCondition.$error" class="text-sm text-red-600">{{ v$.generalSurvey.areaCondition.$errors[0].$message }}</p>
          </div>
        </div>
      </template>
    </Accordion>
    <!-- activeName === 'railDamage' -->
    <Accordion v-model="isActiveRail">
      <template #header>การสำรวจความเสียหายของราง</template>
      <template #body>
        <div class="flex flex-col gap-4">
          <div>
            <label class="_label-lg">เพิ่มรูปภาพ (บริเวณสำรวจความเสียหาย)</label>
            <div class="flex flex-col gap-2">
              <input @change="handleUploadImage($event)" name="railImg" accept="image/x-png,image/gif,image/jpeg" id="railUploadImg" type="file" multiple=""
                class="block w-full text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              >
              <div id="railDamagePreview" class="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 items-center"></div>
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
          <div>
            <label class="_label-lg">ความเสียหายของราง (Situation)</label>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              <SelectBtn type="checkbox" :error="v$.railDamageSurvey.situation.$error" v-model="railSurvey.railDamageSurvey.situation" name="situation" :items="variable.situation"></SelectBtn>
            </div>
            <!-- <div class="flex flex-col gap-4">
              <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                <SelectBtn type="checkbox" :error="v$.railDamageSurvey.situation.$error" v-model="railSurvey.railDamageSurvey.situation" name="situation" :items="variable.situation.filter((sit, index) => index < 4 )"></SelectBtn>
              </div>
              <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                <SelectBtn type="checkbox" :error="v$.railDamageSurvey.situation.$error" v-model="railSurvey.railDamageSurvey.situation" name="situation" :items="variable.situation.filter((sit, index) => index >= 4)"></SelectBtn>
              </div>
            </div> -->
            <p v-if="v$.railDamageSurvey.situation.$error" class="text-sm text-red-600">{{ v$.railDamageSurvey.situation.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">ตำแหน่งที่เกิดความเสียหายของราง (Location)</label>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              <SelectBtn type="checkbox" :disables="compDisablesLocation" :error="v$.railDamageSurvey.location.$error" v-model="railSurvey.railDamageSurvey.location" name="location" :items="variable.location"></SelectBtn>
            </div>
            <p v-if="v$.railDamageSurvey.location.$error" class="text-sm text-red-600">{{ v$.railDamageSurvey.location.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">ลักณะความเสียหายที่เกิดขึ้น (Pattern, nature) </label>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              <SelectBtn type="checkbox" :disables="compDisablesDefectPattern" :error="v$.railDamageSurvey.defectPattern.$error" v-model="railSurvey.railDamageSurvey.defectPattern" name="defectPattern" :items="variable.defectPattern"></SelectBtn>
            </div>
            <!-- <div class="flex flex-col gap-4">
              <div class="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                <SelectBtn type="checkbox" :disables="compDisablesDefectPattern" :error="v$.railDamageSurvey.defectPattern.$error" v-model="railSurvey.railDamageSurvey.defectPattern" name="defectPattern" :items="variable.defectPattern.filter(defect => !compDisablesDefectPattern.includes(defect.value))"></SelectBtn>
              </div>
              <div class="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                <SelectBtn type="checkbox" :disables="compDisablesDefectPattern" :error="v$.railDamageSurvey.defectPattern.$error" v-model="railSurvey.railDamageSurvey.defectPattern" name="defectPattern" :items="variable.defectPattern.filter(defect => compDisablesDefectPattern.includes(defect.value))"></SelectBtn>
              </div>
            </div> -->
          </div>
        </div>
      </template>
    </Accordion>
    <!-- activeName === 'trackDamage' -->
    <Accordion v-model="isActiveTrack">
      <template #header>สำรวจความเสียหายของทาง</template>
      <template #body>
        <div class="flex flex-col gap-4">
          <div>
            <label class="_label-lg">เพิ่มรูปภาพ (บริเวณสำรวจความเสียหาย)</label>
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
          <div>
            <label class="_label-lg">Track Geometry</label>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
              <SelectBtn type="radio" :error="v$.trackDamageSurvey.trackGeometryCondition.$error" :class="''" v-model="railSurvey.trackDamageSurvey.trackGeometryCondition" name="trackGeometryCondition" :items="variable.integrity"></SelectBtn>
            </div>
            <p v-if="v$.trackDamageSurvey.trackGeometryCondition.$error" class="text-sm text-red-600">{{ v$.trackDamageSurvey.trackGeometryCondition.$errors[0].$message }}</p>
          </div>
          <div v-if="!!railSurvey.trackDamageSurvey.trackGeometryCondition && railSurvey.trackDamageSurvey.trackGeometryCondition !== 'perfect'">
            <label class="_label-lg">รูปแบบ Track Geometry ที่ผิดปกติ</label>
            <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              <SelectBtn type="checkbox" :error="v$.trackDamageSurvey.trackGeometryCondition.$error" image-key="img" :class="''" v-model="railSurvey.trackDamageSurvey.trackGeometryCondition" name="trackGeometryCondition" :items="variable.trackGeometry"></SelectBtn>
            </div>
          </div>
          <div>
            <label class="_label-lg">หินโรยทาง (Ballast)</label>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
              <SelectBtn type="radio" :error="v$.trackDamageSurvey.ballastCondition.$error" :class="''" v-model="railSurvey.trackDamageSurvey.ballastCondition" name="ballastCondition" :items="variable.integrity"></SelectBtn>
            </div>
            <p v-if="v$.trackDamageSurvey.ballastCondition.$error" class="text-sm text-red-600">{{ v$.trackDamageSurvey.ballastCondition.$errors[0].$message }}</p>
          </div>
          <div v-if="railSurvey.trackDamageSurvey.ballastCondition && railSurvey.trackDamageSurvey.ballastCondition !== 'perfect'">
            <label class="_label-lg">รูปแบบ Ballast ที่ผิดปกติ</label>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
              <SelectBtn type="checkbox" :error="v$.trackDamageSurvey.ballastCondition.$error" :class="''" v-model="railSurvey.trackDamageSurvey.ballastCondition" name="ballastCondition" :items="variable.ballast"></SelectBtn>
            </div>
            <p v-if="v$.trackDamageSurvey.ballastCondition.$error" class="text-sm text-red-600">{{ v$.trackDamageSurvey.ballastCondition.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">หมอนรองทาง (Sleeper)</label>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
              <SelectBtn type="radio" :error="v$.trackDamageSurvey.sleeperCondition.$error" :class="''" v-model="railSurvey.trackDamageSurvey.sleeperCondition" name="sleeperCondition" :items="variable.integrity"></SelectBtn>
            </div>
            <p v-if="v$.trackDamageSurvey.sleeperCondition.$error" class="text-sm text-red-600">{{ v$.trackDamageSurvey.sleeperCondition.$errors[0].$message }}</p>
          </div>
          <div v-if="railSurvey.trackDamageSurvey.sleeperCondition && railSurvey.trackDamageSurvey.sleeperCondition !== 'perfect'">
            <label class="_label-lg">รูปแบบ Sleeper ที่ผิดปกติ</label>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
              <SelectBtn type="checkbox" :error="v$.trackDamageSurvey.sleeperCondition.$error" :class="''" v-model="railSurvey.trackDamageSurvey.sleeperCondition" name="sleeperCondition" :items="variable.sleeper"></SelectBtn>
            </div>
            <p v-if="v$.trackDamageSurvey.sleeperCondition.$error" class="text-sm text-red-600">{{ v$.trackDamageSurvey.sleeperCondition.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">คันทาง</label>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
              <SelectBtn type="radio" is-specify :error="v$.trackDamageSurvey.trackFoundationCondition.$error" :class="''" v-model="railSurvey.trackDamageSurvey.trackFoundationCondition" name="trackFoundationCondition" :items="[variable.integrity[0]]"></SelectBtn>
            </div>
            <p v-if="v$.trackDamageSurvey.trackFoundationCondition.$error" class="text-sm text-red-600">{{ v$.trackDamageSurvey.trackFoundationCondition.$errors[0].$message }}</p>
          </div>
        </div>
      </template>
    </Accordion>
    <!-- activeName === 'maintenance' -->
    <Accordion v-model="isActiveMA">
      <template #header>การประเมินความเสียหายและการซ่อมบำรุง</template>
      <template #body>
        <div class="flex flex-col gap-4">
          <div>
            <label class="_label-lg">ความรุนแรงของความเสียหาย</label>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
              <SelectBtn type="radio" :error="v$.maintenanceRate.severity.$error" :class="''" v-model="railSurvey.maintenanceRate.severity" name="severity" :items="variable.damagesLevel"></SelectBtn>
            </div>
            <p v-if="v$.maintenanceRate.severity.$error" class="text-sm text-red-600">{{ v$.maintenanceRate.severity.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">ควรส่งห้องปฏิบัติการเพื่อทำการวิเคราะห์สาเหตุของความเสียหาย</label>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              <SelectBtn type="radio" :error="v$.maintenanceRate.isAnalyzeDamage.$error" :class="''" v-model="railSurvey.maintenanceRate.isAnalyzeDamage" name="isAnalyzeDamage" :items="variable.analyse"></SelectBtn>
            </div>
            <p v-if="v$.maintenanceRate.isAnalyzeDamage.$error" class="text-sm text-red-600">{{ v$.maintenanceRate.isAnalyzeDamage.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">ประวัติการซ่อมบำรุง</label>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              <SelectBtn type="radio" :error="v$.maintenanceRate.maintenanceRecord.hasMaintenanceRecord.$error" :class="''"
                v-model="railSurvey.maintenanceRate.maintenanceRecord.hasMaintenanceRecord" name="hasMaintenanceRecord" :items="variable.maintenanceRecord"
              >
              </SelectBtn>
            </div>
            <p v-if="v$.maintenanceRate.maintenanceRecord.hasMaintenanceRecord.$error" class="text-sm text-red-600">{{ v$.maintenanceRate.maintenanceRecord.hasMaintenanceRecord.$errors[0].$message }}</p>
          </div>
          <div v-if="railSurvey.maintenanceRate.maintenanceRecord.hasMaintenanceRecord" class="grid md:grid-cols-2 gap-x-2 gap-y-4">
            <div>
              <label class="_label-sm">การซ่อมบำรุงครั้งล่าสุด</label>
              <select name="maintenanceRate.maintenanceRecord.lastMaintenanceTimes" :value="railSurvey.maintenanceRate.maintenanceRecord.lastMaintenanceTimes" @change="handleEmit($event.target)" id="lastMaintenanceTimes" :class="v$.maintenanceRate.maintenanceRecord.lastMaintenanceTimes.$error ? '_input_error' : '_input'">
                <option disabled value="">กรุณาเลือกครั้งในการซ่อมบำรุง</option>
                <option v-for="(lm, index) in variable.lastMaintenance" :value="lm.value" :key="index">{{ lm.key }}</option>
              </select>
              <p v-if="v$.maintenanceRate.maintenanceRecord.lastMaintenanceTimes.$error" class="text-sm text-red-600">{{ v$.maintenanceRate.maintenanceRecord.lastMaintenanceTimes.$errors[0].$message }}</p>
            </div>
            <div>
              <label class="_label-sm">ความถี่ในการซ่อมบำรุงในรอบปี</label>
              <select name="maintenanceRate.maintenanceRecord.yearlyMaintenanceTimes" :value="railSurvey.maintenanceRate.maintenanceRecord.yearlyMaintenanceTimes" @change="handleEmit($event.target)" id="yearlyMaintenanceTimes" :class="v$.maintenanceRate.maintenanceRecord.yearlyMaintenanceTimes.$error ? '_input_error' : '_input'">
                <option disabled value="">กรุณาเลือกครั้งในการซ่อมบำรุง</option>
                <option v-for="(mt, index) in variable.maintenanceTime" :value="mt.value" :key="index">{{ mt.key }}</option>
              </select>
              <p v-if="v$.maintenanceRate.maintenanceRecord.yearlyMaintenanceTimes.$error" class="text-sm text-red-600">{{ v$.maintenanceRate.maintenanceRecord.yearlyMaintenanceTimes.$errors[0].$message }}</p>
            </div>
          </div>
          <div>
            <label class="_label-lg">คำแนะนำวิธีการซ่อมบำรุง</label>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              <SelectBtn type="checkbox" :error="v$.maintenanceRate.maintenanceMethod.$error" :class="''" v-model="railSurvey.maintenanceRate.maintenanceMethod" name="maintenanceMethod" :items="variable.maintenanceMethod"></SelectBtn>
            </div>
            <p v-if="v$.maintenanceRate.maintenanceMethod.$error" class="text-sm text-red-600">{{ v$.maintenanceRate.maintenanceMethod.$errors[0].$message }}</p>
          </div>
        </div>
      </template>
    </Accordion>
    <div class="mt-4 flex justify-center">
      <div class="border border-solid p-0" :class="v$.signature.$error ? 'border-red-600' : 'border-gray-200' ">
        <div class="flex justify-center">
          <button @click="undo" type="button" class="text-gray-900 hover:bg-gray-100 font-medium border-b border-x rounded-bl-md text-sm px-5 py-1">Undo</button>
          <button @click="clear" type="button" class="text-gray-900 hover:bg-gray-100 font-medium border-b border-r text-sm px-5 py-1">Clear</button>
          <button @click="emit('submit')" type="button" class="text-gray-900 hover:bg-gray-100 font-medium border-b border-r rounded-br-md text-sm px-5 py-1">Submit</button>
        </div>
        <VueSignaturePad width="400px" height="120px" :options="{ onBegin, onEnd }" ref="signaturePad" />
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