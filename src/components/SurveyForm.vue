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
import UploadFiles from '@/components/UploadFiles.vue'
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
let railSurvey = props.modelValue
const emit = defineEmits(['update:modelValue', 'onSubmit'])

const v$ = props.validate

const signaturePad = ref(null)
const ta = ref(null)
const isShowRailUploadBtn = ref(false)
const isShowTrackUploadBtn = ref(false)
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
  const { isEmpty, data } = signaturePad.value.saveSignature()
  if (isEmpty) {
    handleEmit({ name: 'signature', value: null })
  }
}
// const save = () => {
//   const { isEmpty, data } = signaturePad.value.saveSignature()
//   console.log(isEmpty)
//   console.log(data)
// }
const clear = () => {
  signaturePad.value.clearSignature()
  handleEmit({ name: 'signature', value: null })
}

// const validateSignature = () => {
//   const { isEmpty, data } = signaturePad.value.saveSignature()
//   console.log(isEmpty)
//   return !isEmpty
// }

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

const handleUploadImage = (target) => {
  uploadStatus.value = null
  const arr = target.name.split('\.')
  const id = eval(target.id)
  const files = id.files
  let images = eval(`railSurvey.${target.name}`)
  // let images = []
  Array.from(files).forEach((file, index) => {
    if (['image/jpeg', 'image/pjpeg', 'image/png', 'image/apng'].includes(file.type)) {
      // console.log(file)
      images.push({
        originalname: file.name,
        originalPath: URL.createObjectURL(file),
        mimetype: file.type,
        destination: null,
        filename: null,
        size: file.size
      })
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file)
      img.alt = file.name
      if (arr[0] === 'railDamageSurvey' && arr[1] === 'uploadImages') {
        document.querySelector('#railDamagePreview').append(img);
        isShowRailUploadBtn.value = true
      } else if (arr[0] === 'trackDamageSurvey' && arr[1] === 'uploadImages') {
        document.querySelector('#trackDamagePreview').append(img);
        isShowTrackUploadBtn.value = true
      }
    }
  })
  handleEmit({ name: target.name, value: images })
}

const uploadImages = (images) => {
  console.log(images)
  // imagesPath.split('\.')
  // const images = eval(`{imagesPath}`)
  let formData = new FormData()
  // railSurvey[]
}

const handleUploadImages = (id) => {
  const eId = eval(id)
  const files = eId.files
  console.log(files)
  let formData = new FormData()
  Array.from(files).forEach((file, index) => {
    formData.append('file', file)
  })
  // api.uploadFils('/api/uploads', formData, null).then((resp) => {
  //   uploadStatus.value = 'pending'
  //   if (resp.status === 201) {
  //     resp.json().then((json) => {
  //       console.log(json)
  //     })
  //     uploadStatus.value = 'success'
  //   }
  // }).catch((err) => {
  //   uploadStatus.value = 'error'
  // })
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
  console.log(isEmpty)
  if (!isEmpty) {
    // console.log(data);
    handleEmit({ name: 'signature', value: `${data}` })
  }
}

const handleFilterLocation = (value) => {
  if (value === 'situation') {
    if (railSurvey.railDamageSurvey.location.length > 0 ) {
      emit('update:modelValue', Object.assign(railSurvey, { railDamageSurvey: Object.assign(railSurvey.railDamageSurvey, { location: railSurvey.railDamageSurvey.location.filter(rd => !compDisablesLocation.value.includes(rd)) }) }))
      // emit('update:modelValue', Object.assign(railSurvey.railDamageSurvey, { location: railSurvey.railDamageSurvey.location.filter(rd => !compDisablesLocation.value.includes(rd)) }))
    }
  }
}

const handleFilterdefectPattern = () => {
  if (railSurvey.railDamageSurvey.defectPattern.length > 0 ) {
    emit('update:modelValue', Object.assign(railSurvey, { railDamageSurvey: Object.assign(railSurvey.railDamageSurvey, { defectPattern: railSurvey.railDamageSurvey.defectPattern.filter(rd => !compDisablesDefectPattern.value.includes(rd)) }) }))
  }
}

const handleEmit = (target) => {
  const arr = target.name.split('\.')
  // console.log(arr);
  if (['signature'].includes(arr[0])) {
    emit('update:modelValue', Object.assign(railSurvey, { [arr[0]]: target.value }))
  }
  if (['coordinates', 'nearby', 'maintenanceRecord'].includes(arr[1])) {
    emit('update:modelValue', Object.assign(railSurvey, { [arr[0]]: Object.assign(railSurvey[arr[0]], { [arr[1]]: Object.assign(railSurvey[arr[0]][arr[1]], { [arr[2]]: arr[1] === 'coordinates' ? parseFloat(target.value) : target.value }) }) }))
  } else if (['zone'].includes(arr[1])) {
    emit('update:modelValue', Object.assign(railSurvey, { [arr[0]]: Object.assign(railSurvey[arr[0]], { [arr[1]]: target.value, nearby: handleSelectZone(target.value) }) }))
  } else if (['kilometers', 'railType', 'uploadImages'].includes(arr[1])) {
    emit('update:modelValue', Object.assign(railSurvey, { [arr[0]]: Object.assign(railSurvey[arr[0]], { [arr[1]]: target.value }) }))
  }
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
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-2">
            <div>
              <label class="_label-sm">วันที่สำรวจ</label>
              <input disabled :value="railSurvey.generalSurvey.date" type="datetime-local" id="date" :class="'_input'" required>
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
              <select name="generalSurvey.railType" :value="railSurvey.generalSurvey.railType" @change="handleEmit($event.target)" id="railType" :class="v$.generalSurvey.railType.$error ? '_input_error' : '_input'">
                <option disabled value="">กรุณาเลือกประเภทของเกจ</option>
                <option v-for="(g ,index) in variable.guageType" :key="index" :value="g.value">{{ g.key }}</option>
              </select>
              <p v-if="v$.generalSurvey.railType.$error" class="text-sm text-red-600">{{ v$.generalSurvey.railType.$errors[0].$message }}</p>
            </div>
          </div>
          <div class="grid sm:grid-cols-2 gap-x-2 gap-y-4">
            <div class="grid md:grid-cols-2 gap-x-2 gap-y-4">
              <div>
                <label class="_label-sm">พิกัด ละติจูด</label>
                <input :value="railSurvey.generalSurvey.coordinates.latitude" type="text" name="generalSurvey.coordinates.latitude" @input="handleEmit($event.target)" :class="v$.generalSurvey.coordinates.latitude.$error ? '_input_error' : '_input' " required>
                <p v-if="v$.generalSurvey.coordinates.latitude.$error" class="text-sm text-red-600">{{ v$.generalSurvey.coordinates.latitude.$errors[0].$message }}</p>
              </div>
              <div>
                <label class="_label-sm">พิกัด ลองติจูด</label>
                <input :value="railSurvey.generalSurvey.coordinates.longitude" type="text" name="generalSurvey.coordinates.longitude" @input="handleEmit($event.target)" :class="v$.generalSurvey.coordinates.longitude.$error ? '_input_error' : '_input' " required>
                <p v-if="v$.generalSurvey.coordinates.longitude.$error" class="text-sm text-red-600">{{ v$.generalSurvey.coordinates.longitude.$errors[0].$message }}</p>
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-x-2 gap-y-4">
              <div>
                <label class="_label-sm">สถานีรถไฟก่อนหน้า</label>
                <select name="generalSurvey.nearby.stationBefore" :value="railSurvey.generalSurvey.nearby.stationBefore" @change="handleEmit($event.target)" id="stationBefore" :class="v$.generalSurvey.nearby.stationBefore.$error ? '_input_error' : '_input'">
                  <option disabled value="">กรุณาเลือกสถานีก่อนหน้า</option>
                  <option v-for="(zone, index) in variable.zone" :value="zone.value" :key="index">{{ zone.key }}</option>
                </select>
                <p v-if="v$.generalSurvey.nearby.stationBefore.$error" class="text-sm text-red-600">{{ v$.generalSurvey.nearby.stationBefore.$errors[0].$message }}</p>
              </div>
              <div>
                <label class="_label-sm">สถานีรถไฟถัดไป</label>
                <select name="generalSurvey.nearby.stationAfter" :value="railSurvey.generalSurvey.nearby.stationAfter" @change="handleEmit($event.target)" id="stationAfter" :class="v$.generalSurvey.nearby.stationAfter.$error ? '_input_error' : '_input'">
                  <option disabled value="">กรุณาเลือกสถานีถัดไป</option>
                  <option v-for="(zone, index) in variable.zone" :value="zone.value" :key="index">{{ zone.key }}</option>
                </select>
                <p v-if="v$.generalSurvey.nearby.stationAfter.$error" class="text-sm text-red-600">{{ v$.generalSurvey.nearby.stationAfter.$errors[0].$message }}</p>
              </div>
            </div>
          </div>
          <div>
            <label class="_label-sm">ลักษณะพื้นที่ที่เกิดความเสียหาย (Type of failure area)</label>
            <div class="grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2">
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
            <!-- {{ v$.railDamageSurvey.uploadImages }} -->
            <UploadFiles v-model="railSurvey.railDamageSurvey.uploadImages" id="railDamageSurvey" :errors="v$.railDamageSurvey.uploadImages"></UploadFiles>
          </div>
          <div>
            <label class="_label-lg">ความเสียหายของราง (Situation)</label>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              <SelectBtn type="checkbox" :error="v$.railDamageSurvey.situation.$error" v-model="railSurvey.railDamageSurvey.situation" @onEvent="handleFilterLocation('situation')" name="situation" :items="variable.situation"></SelectBtn>
            </div>
            <p v-if="v$.railDamageSurvey.situation.$error" class="text-sm text-red-600">{{ v$.railDamageSurvey.situation.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">ตำแหน่งที่เกิดความเสียหายของราง (Location)</label>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              <SelectBtn type="checkbox" :disables="compDisablesLocation" :error="v$.railDamageSurvey.location.$error" v-model="railSurvey.railDamageSurvey.location" @onEvent="handleFilterdefectPattern()" name="location" :items="variable.location"></SelectBtn>
            </div>
            <p v-if="v$.railDamageSurvey.location.$error" class="text-sm text-red-600">{{ v$.railDamageSurvey.location.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">ลักณะความเสียหายที่เกิดขึ้น (Pattern, nature) </label>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              <SelectBtn type="checkbox" :disables="compDisablesDefectPattern" :error="v$.railDamageSurvey.defectPattern.$error" v-model="railSurvey.railDamageSurvey.defectPattern" name="defectPattern" :items="variable.defectPattern"></SelectBtn>
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
          <div>
            <UploadFiles v-model="railSurvey.trackDamageSurvey.uploadImages" id="trackDamageSurvey" :errors="v$.trackDamageSurvey.uploadImages"></UploadFiles>
          </div>
          <div>
            <label class="_label-lg">Track Geometry</label>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <SelectBtn type="radio" :error="v$.trackDamageSurvey.trackGeometryCondition.isPerfect.$error" v-model="railSurvey.trackDamageSurvey.trackGeometryCondition.isPerfect" name="trackGeometryCondition" :items="variable.integrity"></SelectBtn>
            </div>
            <p v-if="v$.trackDamageSurvey.trackGeometryCondition.isPerfect.$error" class="text-sm text-red-600">{{ v$.trackDamageSurvey.trackGeometryCondition.isPerfect.$errors[0].$message }}</p>
          </div>
          <div v-if="railSurvey.trackDamageSurvey.trackGeometryCondition.isPerfect && railSurvey.trackDamageSurvey.trackGeometryCondition.isPerfect !== 'perfect'">
            <label class="_label-lg">รูปแบบ Track Geometry ที่ผิดปกติ</label>
            <div class="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              <SelectBtn type="checkbox" :error="v$.trackDamageSurvey.trackGeometryCondition.condition.$error" image-key="img" v-model="railSurvey.trackDamageSurvey.trackGeometryCondition.condition" name="trackGeometryConditionFail" :items="variable.trackGeometry"></SelectBtn>
            </div>
          </div>
          <div>
            <label class="_label-lg">หินโรยทาง (Ballast)</label>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <SelectBtn type="radio" :error="v$.trackDamageSurvey.ballastCondition.isPerfect.$error" v-model="railSurvey.trackDamageSurvey.ballastCondition.isPerfect" name="ballastCondition" :items="variable.integrity"></SelectBtn>
            </div>
            <p v-if="v$.trackDamageSurvey.ballastCondition.isPerfect.$error" class="text-sm text-red-600">{{ v$.trackDamageSurvey.ballastCondition.isPerfect.$errors[0].$message }}</p>
          </div>
          <div v-if="railSurvey.trackDamageSurvey.ballastCondition.isPerfect && railSurvey.trackDamageSurvey.ballastCondition.isPerfect !== 'perfect'">
            <label class="_label-lg">รูปแบบ Ballast ที่ผิดปกติ</label>
            <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              <SelectBtn type="checkbox" :error="v$.trackDamageSurvey.ballastCondition.condition.$error" v-model="railSurvey.trackDamageSurvey.ballastCondition.condition" name="ballastConditionFail" :items="variable.ballast"></SelectBtn>
            </div>
            <p v-if="v$.trackDamageSurvey.ballastCondition.condition.$error" class="text-sm text-red-600">{{ v$.trackDamageSurvey.ballastCondition.condition.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">หมอนรองทาง (Sleeper)</label>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <SelectBtn type="radio" :error="v$.trackDamageSurvey.sleeperCondition.isPerfect.$error" v-model="railSurvey.trackDamageSurvey.sleeperCondition.isPerfect" name="sleeperCondition" :items="variable.integrity"></SelectBtn>
            </div>
            <p v-if="v$.trackDamageSurvey.sleeperCondition.isPerfect.$error" class="text-sm text-red-600">{{ v$.trackDamageSurvey.sleeperCondition.isPerfect.$errors[0].$message }}</p>
          </div>
          <div v-if="railSurvey.trackDamageSurvey.sleeperCondition.isPerfect && railSurvey.trackDamageSurvey.sleeperCondition.isPerfect !== 'perfect'">
            <label class="_label-lg">รูปแบบ Sleeper ที่ผิดปกติ</label>
            <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              <SelectBtn type="checkbox" :error="v$.trackDamageSurvey.sleeperCondition.condition.$error" v-model="railSurvey.trackDamageSurvey.sleeperCondition.condition" name="sleeperConditionFail" :items="variable.sleeper"></SelectBtn>
            </div>
            <p v-if="v$.trackDamageSurvey.sleeperCondition.condition.$error" class="text-sm text-red-600">{{ v$.trackDamageSurvey.sleeperCondition.condition.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">คันทาง</label>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <SelectBtn type="radio" is-specify :error="v$.trackDamageSurvey.trackFoundationCondition.$error" v-model="railSurvey.trackDamageSurvey.trackFoundationCondition" name="trackFoundationCondition" :items="[variable.integrity[0]]"></SelectBtn>
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
            <div class="grid sm:grid-cols-2 md:grid-cols-3 xl:md:grid-cols-4 gap-2">
              <SelectBtn type="radio" :error="v$.maintenanceRate.severity.$error" v-model="railSurvey.maintenanceRate.severity" name="severity" :items="variable.damagesLevel"></SelectBtn>
            </div>
            <p v-if="v$.maintenanceRate.severity.$error" class="text-sm text-red-600">{{ v$.maintenanceRate.severity.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">ควรส่งห้องปฏิบัติการเพื่อทำการวิเคราะห์สาเหตุของความเสียหาย</label>
            <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2">
              <SelectBtn type="radio" :error="v$.maintenanceRate.isAnalyzeDamage.$error" v-model="railSurvey.maintenanceRate.isAnalyzeDamage" name="isAnalyzeDamage" :items="variable.analyse"></SelectBtn>
            </div>
            <p v-if="v$.maintenanceRate.isAnalyzeDamage.$error" class="text-sm text-red-600">{{ v$.maintenanceRate.isAnalyzeDamage.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">ประวัติการซ่อมบำรุง</label>
            <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
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
            <div class="grid sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-2">
              <SelectBtn type="checkbox" :error="v$.maintenanceRate.maintenanceMethod.$error" v-model="railSurvey.maintenanceRate.maintenanceMethod" name="maintenanceMethod" :items="variable.maintenanceMethod"></SelectBtn>
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
          <button @click="emit('onSubmit')" type="button" class="text-gray-900 hover:bg-gray-100 font-medium border-b border-r rounded-br-md text-sm px-5 py-1">Submit</button>
        </div>
        <VueSignaturePad width="400px" height="120px" :options="{ onBegin, onEnd }" ref="signaturePad" />
        <label class="pb-1 flex flex-col items-center text-sm font-medium text-gray-900 dark:text-white">ผู้สำรวจและบันทึกความเสียหาย</label>
      </div>
    </div>
  </div>

</template>