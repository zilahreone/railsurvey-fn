<script setup>
import { ref, reactive, onMounted, computed, watch, nextTick, onUnmounted } from 'vue'
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
import variable from '@/variable.json'
import api from '@/services'
import { nullableTypeAnnotation } from '@babel/types'
// import IndexDB from '@/IndexedDB'
import { Buffer } from 'buffer'
import Dropdown from './Dropdown.vue'
import InputIcon from './InputIcon.vue'

const store = useStore()
const router = useRouter()

const props = defineProps({

  isPreview: {
    type: Boolean,
    default: false
  },
  created: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: [Object, null],
    default: {}
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
const getWH = ref(null)
const signaturePadRail_1 = ref(null)
const signaturePadRail_2 = ref(null)
const signaturePadRail_3 = ref(null)
const ta = ref(null)
const isShowRailUploadBtn = ref(false)
const isShowTrackUploadBtn = ref(false)
const uploadStatus = ref(null)

const isActiveGeneral = ref(true)
const isActiveRail = ref(true)
const isActiveTrack = ref(true)
const isActiveMA = ref(true)

const general = ref(null)

const width = ref(null)
const height = ref(null)
onMounted(() => {
  // window.addEventListener("resize", onResize)
  // onResize()
  // resizeImage()
  // fetch('rail_3.jpg')
  //   .then(raw => raw.blob())
  //   .then(blob => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(blob)
  //     reader.onloadend = () => {
  //       signaturePadRail_3.value.fromDataURL(reader.result)
  //     }
  //   })
  // signaturePad.value.fromDataURL(railSurvey.signature)
  // signaturePad.value.signatureData = railSurvey.signature
  // const { isEmpty, data } = signaturePad.value.saveSignature()
  if (props.isPreview) {
    signaturePad.value.lockSignaturePad()
    if (railSurvey.signature) signaturePad.value.fromDataURL(railSurvey.signature)
  } else {
    if (railSurvey.signature) signaturePad.value.fromDataURL(railSurvey.signature)
  }
})
onUnmounted(() => {
    // window.removeEventListener('resize', onResize)
})

// METHOD
const onResize = () => {
  // signaturePadRail_3.value.getContext("2d").scale(ratio, ratio)
  width.value = getWH.value.clientWidth + 'px'
  height.value = getWH.value.clientHeight + 'px'
  // let box = document.querySelector('#rail_3')
  // let width = box.offsetWidth;
  // let height = box.offsetHeight;
  // width.value = width
  // height.value = height
  // create an off-screen canvas
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  // var img = document.createElement('img')
  var img = new Image()
  // img.src = 'rail_3.jpg'
  // console.log(img);
  // img.onload = function() {
  //   console.log('on;o9da');
  //   // set its dimension to target size
  //   canvas.width = getWH.value.clientWidth;
  //   canvas.height = getWH.value.clientHeight;
  //   ctx.drawImage(img, 0, 0, getWH.value.clientWidth, getWH.value.clientHeight)
  //   console.log(canvas.toDataURL('image/jpeg', 0.5));
  // }
  // img.src = reader.result

  fetch('rail_3.jpg')
    .then(raw => raw.blob())
    .then(blob => {
      const reader = new FileReader();
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        img.src = reader.result
        // console.log(reader.result);
        signaturePadRail_3.value.fromDataURL(resizeImage(img, getWH.value.clientWidth, getWH.value.clientHeight))
        // console.log(reader);
        // signaturePadRail_3.value.fromDataURL(reader.result)
        // console.log(reader.result);
      }
    })


  // draw source image into the off-screen canvas:

  // encode image to data-uri with base64 version of compressed image
  // return canvas.toDataURL()
  // console.log(canvas.toDataURL());
  // signaturePadRail_3.value.fromDataURL(canvas.toDataURL())
}

const resizeImage = (img, width, height) => {
  // create an off-screen canvas
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d');

  // set its dimension to target size
  canvas.width = width;
  canvas.height = height;

  // draw source image into the off-screen canvas:
  ctx.drawImage(img, 0, 0, width, height);

  // encode image to data-uri with base64 version of compressed image
  console.log(canvas.toDataURL());
  return canvas.toDataURL();
}

const undo = () => {
  signaturePad.value.undoSignature()
  const { isEmpty, data } = signaturePad.value.saveSignature()
  if (isEmpty) {
    handleEmit({ name: 'signature', value: null })
  }
}
const clear = () => {
  signaturePad.value.clearSignature()
  handleEmit({ name: 'signature', value: null })
}
const getAPI = () => {
  api.get(`/`, null).then((resp) => {
    resp.json().then((json) => {
      ta.value = json
    })
  })
}

const handleGetLatLong = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const p = position.coords;
    handleEmit({ name: 'generalSurvey.coordinates.latitude', value: p.latitude })
    handleEmit({ name: 'generalSurvey.coordinates.longitude', value: p.longitude })
  }, (err) => {
    console.error(err);
  }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 })
}

const handleSelectZone = (value) => {
  const stations = compStationItems.value.map((z) => z.value)
  // const zones = variable.zone.map((z) => z.value)
  const index = stations.indexOf(value)
  return {
    stationBefore: !stations[index - 1] ? value : stations[index - 1],
    stationAfter: !stations[index + 1] ? value : stations[index + 1]
  }
}

const scrollToError = () => {
  window.scrollTo(0, general.value.offsetTop)
}
defineExpose({
  scrollToError,
  test:() => 'test'
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
  if (['coordinates', 'nearby', 'maintenanceRecord', 'railType' , 'telegram'].includes(arr[1])) {
    let val = null
    if (['latitude', 'longitude', 'weight'].includes(arr[2])) {
      val = parseFloat(target.value)
    } else {
      val = target.value
    }
    emit('update:modelValue', Object.assign(railSurvey, { [arr[0]]: Object.assign(railSurvey[arr[0]], { [arr[1]]: Object.assign(railSurvey[arr[0]][arr[1]], { [arr[2]]: val }) }) }))
  } else if (['area', 'zone', 'comment'].includes(arr[1])) {
    emit('update:modelValue', Object.assign(railSurvey, { [arr[0]]: Object.assign(railSurvey[arr[0]], { [arr[1]]: target.value }) }))
  } else if (['station'].includes(arr[1])) {
    emit('update:modelValue', Object.assign(railSurvey, { [arr[0]]: Object.assign(railSurvey[arr[0]], { [arr[1]]: target.value, nearby: handleSelectZone(target.value) }) }))
  } else if (['kilometers'].includes(arr[1])) {
    emit('update:modelValue', Object.assign(railSurvey, { [arr[0]]: Object.assign(railSurvey[arr[0]], { [arr[1]]: parseFloat(target.value) }) }))
  }
}

// COMPUTED //
const compDisablesLocation = computed(() => {
  // const filteredArray = railSurvey.railDamageSurvey.situation.filter(rd => ['weldingJoint','fishPlate','railroadCrossing','turnOut'].includes(rd))
  if (props.isPreview) {
    return variable.location.map(dp => dp.value)
  } else {
    // if (filteredArray.length > 0) {
    //   return ['gaugeSide','surfaceRailHead']
    // }
    return []
  }
})
const compDisablesDefectPattern = computed(() => {
  // const location = railSurvey.railDamageSurvey.location.filter((location, index) => ['railHead', 'railWeb', 'railFoot', 'fullSection'].includes(location))
  // const location2 = railSurvey.railDamageSurvey.location.filter((location, index) => ['gaugeSide','surfaceRailHead'].includes(location))
  if (props.isPreview) {
    return variable.defectPattern.map(dp => dp.value)
  } else {
    // if (location.length > 0 && location2.length === 0) {
    //   return ['surfaceDefect', 'crushedHead', 'headChecking', 'spalling', 'sideWear', 'shelling', 'burnedRail', 'other']
    // } else if (location.length === 0 && location2.length > 0) {
    //   return ['fracture', 'rupture', 'wear', 'bend', 'corrosion']
    // }
  }
  return []
})
const compDisableAreaCondition = computed(() => {
  if (props.isPreview) return variable.damageAreaPrperties.map(dp => dp.value)
  return []
})
const compDisableSituation = computed(() => {
  if (props.isPreview) return variable.situation.map(sit => sit.value)
  return []
})
const compDisableLocation = computed(() => {
  if (props.isPreview) return variable.location.map(loc => loc.value)
  return []
})
const compDisablePerfect = computed(() => {
  if (props.isPreview) return variable.integrity.map(inte => inte.value)
  return []
})
const compDisabletrackGeometryCondition = computed(() => {
  if (props.isPreview) return variable.trackGeometry.map(tg => tg.value)
  return []
})
const compDisableBallast = computed(() => {
  if (props.isPreview) return variable.ballast.map(b => b.value)
  return []
})
const compDisableBallastCompaction = computed(() => {
  if (props.isPreview) return variable.ballastCompaction.map(bc => bc.value)
  return []
})
const compDisableSleeperType = computed(() => {
  if (props.isPreview) return variable.sleeperType.map(st => st.value)
  return []
})
const compDisableSleeperCondition = computed(() => {
  if (props.isPreview) return variable.sleeperCondition.map(sc => sc.value)
  return []
})
const compDisableSleeper = computed(() => {
  if (props.isPreview) return variable.sleeper.map(s => s.value)
  return []
})
const compDisableTrackFoundationCondition = computed(() => {
  if (props.isPreview) return [variable.integrity[0]].map(int => int.value)
  return []
})
const compDisableSeverity = computed(() => {
  if (props.isPreview) return variable.damagesLevel.map(dam => dam.value)
  return []
})
const compDisableAnalyse = computed(() => {
  if (props.isPreview) return variable.analyse.map(ana => ana.value)
  return []
})
const compDisableHasMaintenanceRecord = computed(() => {
  if (props.isPreview) return variable.maintenanceRecord.map(mr => mr.value)
  return []
})
const compDisableMaintenanceMethod = computed(() => {
  if (props.isPreview) return variable.maintenanceMethod.map(mm => mm.value)
  return []
})
const compZoneItems = computed(() => {
  const areaIndex = variable.areas.findIndex(area => area.value === railSurvey.generalSurvey.area)
  return areaIndex > -1 ? variable.areas[areaIndex].zones : []
})
const compStationItems = computed(() => {
  const zoneIndex = compZoneItems.value?.findIndex(zone => zone.value === railSurvey.generalSurvey.zone)
  return zoneIndex > -1 ? compZoneItems.value[zoneIndex].stations : []
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
              <select :disabled="isPreview" name="generalSurvey.area" :value="railSurvey.generalSurvey.area" @change="handleEmit($event.target)" id="area" :class="v$.generalSurvey.area.$error ? '_input_error' : '_input'">
                <option disabled value="">กรุณาเลือกเขตการเดินรถ</option>
                <option v-for="(area, index) in variable.areas" :value="area.value" :key="index">{{ area.key }}</option>
              </select>
              <p v-if="v$.generalSurvey.area.$error" class="text-sm text-red-600">{{ v$.generalSurvey.area.$errors[0].$message }}</p>
            </div>
            <div>
              <label class="_label-sm">แขวง</label>
              <select :disabled="isPreview" name="generalSurvey.zone" :value="railSurvey.generalSurvey.zone" @change="handleEmit($event.target)" id="zone" :class="v$.generalSurvey.zone.$error ? '_input_error' : '_input'">
                <option disabled value="">กรุณาเลือกแขวง</option>
                <option v-for="(zone, index) in compZoneItems" :value="zone.value" :key="index">{{ zone.key }}</option>
              </select>
              <p v-if="v$.generalSurvey.zone.$error" class="text-sm text-red-600">{{ v$.generalSurvey.zone.$errors[0].$message }}</p>
            </div>
            <div>
              <label class="_label-sm">สถานี</label>
              <select :disabled="isPreview" name="generalSurvey.station" :value="railSurvey.generalSurvey.station" @change="handleEmit($event.target)" id="station" :class="v$.generalSurvey.station.$error ? '_input_error' : '_input'">
                <option disabled value="">กรุณาเลือกสถานี</option>
                <option v-for="(station, index) in compStationItems" :value="station.value" :key="index">{{ station.key }}</option>
              </select>
              <p v-if="v$.generalSurvey.station.$error" class="text-sm text-red-600">{{ v$.generalSurvey.station.$errors[0].$message }}</p>
            </div>
          </div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-2">
            <div>
              <label class="_label-sm">สถานีรถไฟก่อนหน้า</label>
              <select :disabled="isPreview" name="generalSurvey.nearby.stationBefore" :value="railSurvey.generalSurvey.nearby.stationBefore" @change="handleEmit($event.target)" id="stationBefore" :class="v$.generalSurvey.nearby.stationBefore.$error ? '_input_error' : '_input'">
                <option disabled value="">กรุณาเลือกสถานีก่อนหน้า</option>
                <option v-for="(station, index) in compStationItems" :value="station.value" :key="index">{{ station.key }}</option>
              </select>
              <p v-if="v$.generalSurvey.nearby.stationBefore.$error" class="text-sm text-red-600">{{ v$.generalSurvey.nearby.stationBefore.$errors[0].$message }}</p>
            </div>
            <div>
              <label class="_label-sm">สถานีรถไฟถัดไป</label>
              <select :disabled="isPreview" name="generalSurvey.nearby.stationAfter" :value="railSurvey.generalSurvey.nearby.stationAfter" @change="handleEmit($event.target)" id="stationAfter" :class="v$.generalSurvey.nearby.stationAfter.$error ? '_input_error' : '_input'">
                <option disabled value="">กรุณาเลือกสถานีถัดไป</option>
                <option v-for="(station, index) in compStationItems" :value="station.value" :key="index">{{ station.key }}</option>
              </select>
              <p v-if="v$.generalSurvey.nearby.stationAfter.$error" class="text-sm text-red-600">{{ v$.generalSurvey.nearby.stationAfter.$errors[0].$message }}</p>
            </div>
            <div>
              <label class="_label-sm">พิกัด ละติจูด</label>
              <InputIcon :is-preview="isPreview" v-model="railSurvey.generalSurvey.coordinates.latitude" @on-click="handleGetLatLong()" :error="v$.generalSurvey.coordinates.latitude.$error"></InputIcon>
              <!-- <input :disabled="isPreview" :value="railSurvey.generalSurvey.coordinates.latitude" type="text" name="generalSurvey.coordinates.latitude" @input="handleEmit($event.target)" :class="v$.generalSurvey.coordinates.latitude.$error ? '_input_error' : '_input' " required> -->
              <p v-if="v$.generalSurvey.coordinates.latitude.$error" class="text-sm text-red-600">{{ v$.generalSurvey.coordinates.latitude.$errors[0].$message }}</p>
            </div>
            <div>
              <label class="_label-sm">พิกัด ลองติจูด</label>
              <InputIcon :is-preview="isPreview" v-model="railSurvey.generalSurvey.coordinates.longitude" @on-click="handleGetLatLong()" :error="v$.generalSurvey.coordinates.longitude.$error"></InputIcon>
              <!-- <input :disabled="isPreview" :value="railSurvey.generalSurvey.coordinates.longitude" type="text" name="generalSurvey.coordinates.longitude" @input="handleEmit($event.target)" :class="v$.generalSurvey.coordinates.longitude.$error ? '_input_error' : '_input' " required> -->
              <p v-if="v$.generalSurvey.coordinates.longitude.$error" class="text-sm text-red-600">{{ v$.generalSurvey.coordinates.longitude.$errors[0].$message }}</p>
            </div>
          </div>
          <div class="grid sm:grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-2">
            <div class="grid sm:grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <label class="_label-sm">เกรดของราง</label>
                <!-- <select :disabled="isPreview" name="generalSurvey.railType.type" :value="railSurvey.generalSurvey.railType.type" @change="handleEmit($event.target)" id="railType" :class="v$.generalSurvey.railType.type.$error ? '_input_error' : '_input'">
                  <option disabled value="">กรุณาเลือกประเภทของเกรด</option>
                  <option v-for="(g ,index) in variable.guageType" :key="index" :value="g.value">{{ g.key }}</option>
                </select> -->
                <Dropdown :is-preview="isPreview" :items="variable.guageType" :error="v$.generalSurvey.railType.type.$error" placeholder="กรุณาเลือกประเภทของเกรด" v-model="railSurvey.generalSurvey.railType.type"></Dropdown>
                <p v-if="v$.generalSurvey.railType.type.$error" class="text-sm text-red-600">{{ v$.generalSurvey.railType.type.$errors[0].$message }}</p>
              </div>
              <div>
                <label class="_label-sm">ขนาดของราง (ปอนด์/หลา)</label>
                <!-- <input :disabled="isPreview" :value="railSurvey.generalSurvey.railType.weight" type="text" name="generalSurvey.railType.weight" @input="handleEmit($event.target)" :class="v$.generalSurvey.railType.weight.$error ? '_input_error' : '_input' " placeholder="ปอนด์" required> -->
                <Dropdown :is-preview="isPreview" :items="variable.weight" type="number" :error="v$.generalSurvey.railType.weight.$error" placeholder="ปอนด์" v-model="railSurvey.generalSurvey.railType.weight"></Dropdown>
                <p v-if="v$.generalSurvey.railType.weight.$error" class="text-sm text-red-600">{{ v$.generalSurvey.railType.weight.$errors[0].$message }}</p>
              </div>
            </div>
            <div class="grid grid-cols-1">
              <label class="_label-sm">เสาโทรเลข</label>
              <div class="flex items-center gap-y-4 gap-x-2">
                <div class="w-full">
                  <input :disabled="isPreview" :value="railSurvey.generalSurvey.telegram.telegramBefore" name="generalSurvey.telegram.telegramBefore" @input="handleEmit($event.target)" type="text" id="telegramBefore" :class="v$.generalSurvey.telegram.telegramBefore.$error ? '_input_error' : '_input' " placeholder="00/00" required>
                  <p v-if="v$.generalSurvey.telegram.telegramBefore.$error" class="text-sm text-red-600">{{ v$.generalSurvey.telegram.telegramBefore.$errors[0].$message }}</p>
                </div>
                <label class="_label-sm mt-2">ระหว่าง</label>
                <div class="w-full">
                  <input :disabled="isPreview" :value="railSurvey.generalSurvey.telegram.telegramAfter" name="generalSurvey.telegram.telegramAfter" @input="handleEmit($event.target)" type="text" id="kmTelegraphPoles" :class="v$.generalSurvey.telegram.telegramAfter.$error ? '_input_error' : '_input' " placeholder="00/00" required>
                  <p v-if="v$.generalSurvey.telegram.telegramAfter.$error" class="text-sm text-red-600">{{ v$.generalSurvey.telegram.telegramAfter.$errors[0].$message }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="grid sm:grid-cols-2 gap-y-4 gap-x-2">
            <div>
            </div>
          </div>
          <div>
            <label class="_label-sm">ลักษณะพื้นที่ที่เกิดความเสียหาย (Type of failure area)</label>
            <div class="grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2">
              <SelectBtn :is-preview="isPreview" type="checkbox" is-specify :error="v$.generalSurvey.areaCondition.$error" v-model="railSurvey.generalSurvey.areaCondition" name="areaCondition" :items="variable.damageAreaPrperties" :disables="compDisableAreaCondition"></SelectBtn>
            </div>
            <p v-if="v$.generalSurvey.areaCondition.$error" class="text-sm text-red-600">{{ v$.generalSurvey.areaCondition.$errors[0].$message }}</p>
          </div>
        </div>
      </template>
    </Accordion>
    
    <!-- <label class="_label-sm">เสาโทรเลข</label> -->
    <!-- activeName === 'railDamage' -->
    <Accordion v-model="isActiveRail">
      <template #header>การสำรวจความเสียหายของราง</template>
      <template #body>
        <div class="flex flex-col gap-4">
          <div>
            <!-- {{ v$.railDamageSurvey.uploadImages }} -->
            <UploadFiles :is-preview="isPreview || created" v-model="railSurvey.railDamageSurvey.uploadImages" id="railDamageSurvey" :errors="v$.railDamageSurvey.uploadImages">
              <template #header>เพิ่มรูปภาพความเสียหายของราง (ไม่เกิน 3 รูป)</template>
            </UploadFiles>
          </div>
          <div>
            <label class="_label-lg">ความเสียหายของราง (Situation)</label>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              <SelectBtn :is-preview="isPreview" type="checkbox" is-specify :error="v$.railDamageSurvey.situation.$error" v-model="railSurvey.railDamageSurvey.situation" @onEvent="handleFilterLocation('situation')" name="situation" :items="variable.situation" :disables="compDisableSituation"></SelectBtn>
            </div>
            <p v-if="v$.railDamageSurvey.situation.$error" class="text-sm text-red-600">{{ v$.railDamageSurvey.situation.$errors[0].$message }}</p>
          </div>
          <!-- <div>
            <div class="grid sm:grid-cols-2 lg:grid-cols-2">
              <div class="flex flex-col justify-center gap-y-2">
                <img src="@/assets/rail/rail_1.jpg" :alt="''" class="object-contain">
                <img src="@/assets/rail/rail_2.jpg" :alt="''" class="object-contain h-32">
              </div>
              <div ref="getWH" :style="{
                backgroundImage: `url(${require('@/assets/rail/rail_3.jpg')})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center'
              }">
                <VueSignaturePad ref="signaturePadRail_3"/>
              </div>
            </div>
          </div> -->
          <div>
            <label class="_label-lg">ตำแหน่งที่เกิดความเสียหายของราง (Location)</label>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              <SelectBtn :is-preview="isPreview" type="checkbox" :error="v$.railDamageSurvey.location.$error" v-model="railSurvey.railDamageSurvey.location" @onEvent="handleFilterdefectPattern()" name="location" :items="variable.location" :disables="compDisablesLocation"></SelectBtn>
            </div>
            <p v-if="v$.railDamageSurvey.location.$error" class="text-sm text-red-600">{{ v$.railDamageSurvey.location.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">ลักณะความเสียหายที่เกิดขึ้น (Pattern, nature)</label>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              <SelectBtn :is-preview="isPreview" type="checkbox" :error="v$.railDamageSurvey.defectPattern.$error" v-model="railSurvey.railDamageSurvey.defectPattern" name="defectPattern" :items="variable.defectPattern" :disables="compDisablesDefectPattern"></SelectBtn>
            </div>
          </div>
          <div v-if="railSurvey.railDamageSurvey.defectPattern.includes('surfaceDefect')">
            <label class="_label-lg">รูปแบบ Surface Defect</label>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              <!-- <SelectBtn :is-preview="isPreview" type="checkbox" is-specify :error="v$.generalSurvey.areaCondition.$error" v-model="railSurvey.generalSurvey.areaCondition" name="areaCondition" :items="variable.damageAreaPrperties" :disables="compDisableAreaCondition"></SelectBtn> -->
              <SelectBtn :is-preview="isPreview" type="checkbox" is-specify :error="v$.railDamageSurvey.surfaceDefectPattern.$error" v-model="railSurvey.railDamageSurvey.surfaceDefectPattern" name="surfaceDefect" :items="variable.surfaceDefect"></SelectBtn>
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
            <UploadFiles :is-preview="isPreview || created" v-model="railSurvey.trackDamageSurvey.uploadImages" id="trackDamageSurvey" :errors="v$.trackDamageSurvey.uploadImages">
              <template #header>เพิ่มรูปภาพความเสียหายของทาง (ไม่เกิน 3 รูป)</template>
            </UploadFiles>
          </div>
          <div>
            <label class="_label-lg">Track Geometry</label>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2">
              <SelectBtn :is-preview="isPreview" type="radio" :error="v$.trackDamageSurvey.trackGeometryCondition.isPerfect.$error" v-model="railSurvey.trackDamageSurvey.trackGeometryCondition.isPerfect" name="trackGeometryCondition" :items="variable.integrity" :disables="compDisablePerfect"></SelectBtn>
            </div>
            <p v-if="v$.trackDamageSurvey.trackGeometryCondition.isPerfect.$error" class="text-sm text-red-600">{{ v$.trackDamageSurvey.trackGeometryCondition.isPerfect.$errors[0].$message }}</p>
          </div>
          <div v-if="railSurvey.trackDamageSurvey.trackGeometryCondition.isPerfect && railSurvey.trackDamageSurvey.trackGeometryCondition.isPerfect !== 'perfect'">
            <label class="_label-lg">รูปแบบ Track Geometry ที่ผิดปกติ</label>
            <div class="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              <SelectBtn :is-preview="isPreview" type="checkbox" :error="v$.trackDamageSurvey.trackGeometryCondition.condition.$error" image-key="img" v-model="railSurvey.trackDamageSurvey.trackGeometryCondition.condition" name="trackGeometryConditionFail" :items="variable.trackGeometry" :disables="compDisabletrackGeometryCondition"></SelectBtn>
            </div>
          </div>
          <div>
            <label class="_label-lg">หินโรยทาง (Ballast)</label>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2">
              <SelectBtn :is-preview="isPreview" type="radio" is-specify :error="v$.trackDamageSurvey.ballastCondition.isPerfect.$error" v-model="railSurvey.trackDamageSurvey.ballastCondition.isPerfect" name="ballastCondition" :items="variable.ballast" :disables="compDisablePerfect"></SelectBtn>
            </div>
            <p v-if="v$.trackDamageSurvey.ballastCondition.isPerfect.$error" class="text-sm text-red-600">{{ v$.trackDamageSurvey.ballastCondition.isPerfect.$errors[0].$message }}</p>
          </div>
          <div v-if="railSurvey.trackDamageSurvey.ballastCondition.isPerfect && railSurvey.trackDamageSurvey.ballastCondition.isPerfect !== 'perfect'">
            <label class="_label-lg">รูปแบบ Ballast ที่ผิดปกติ</label>
            <div class="grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              <SelectBtn :is-preview="isPreview" type="checkbox" :error="v$.trackDamageSurvey.ballastCondition.condition.$error" v-model="railSurvey.trackDamageSurvey.ballastCondition.condition" name="ballastConditionFail" :items="variable.ballastCondition" :disables="compDisableBallast"></SelectBtn>
            </div>
            <p v-if="v$.trackDamageSurvey.ballastCondition.condition.$error" class="text-sm text-red-600">{{ v$.trackDamageSurvey.ballastCondition.condition.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">หินโรยทาง: วาระการอัดหิน (Ballast)</label>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2">
              <SelectBtn :is-preview="isPreview" type="radio" :error="v$.trackDamageSurvey.ballastCompaction.$error" v-model="railSurvey.trackDamageSurvey.ballastCompaction" name="ballastCompaction" :items="variable.ballastCompaction" :disables="compDisableBallastCompaction"></SelectBtn>
            </div>
            <p v-if="v$.trackDamageSurvey.ballastCompaction.$error" class="text-sm text-red-600">{{ v$.trackDamageSurvey.ballastCompaction.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">หมอนรองทาง: ชนิดของหมอน (Sleeper)</label>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2">
              <SelectBtn :is-preview="isPreview" type="radio" :error="v$.trackDamageSurvey.sleeperType.$error" v-model="railSurvey.trackDamageSurvey.sleeperType" name="sleeperType" :items="variable.sleeperType" :disables="compDisableSleeperType"></SelectBtn>
            </div>
            <p v-if="v$.trackDamageSurvey.sleeperType.$error" class="text-sm text-red-600">{{ v$.trackDamageSurvey.sleeperType.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">หมอนรองทาง (Sleeper)</label>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2">
              <SelectBtn :is-preview="isPreview" type="radio" :error="v$.trackDamageSurvey.sleeperCondition.isPerfect.$error" v-model="railSurvey.trackDamageSurvey.sleeperCondition.isPerfect" name="sleeperCondition" :items="variable.sleeper" :disables="compDisableSleeper"></SelectBtn>
            </div>
            <p v-if="v$.trackDamageSurvey.sleeperCondition.isPerfect.$error" class="text-sm text-red-600">{{ v$.trackDamageSurvey.sleeperCondition.isPerfect.$errors[0].$message }}</p>
          </div>
          <div v-if="railSurvey.trackDamageSurvey.sleeperCondition.isPerfect && railSurvey.trackDamageSurvey.sleeperCondition.isPerfect === 'dilapidated'">
            <label class="_label-lg">รูปแบบ Sleeper ที่ผิดปกติ</label>
            <div class="grid sm:grid-cols-3 lg:grid-cols-4 gap-2">
              <SelectBtn :is-preview="isPreview" type="checkbox"  :error="v$.trackDamageSurvey.sleeperCondition.condition.$error" v-model="railSurvey.trackDamageSurvey.sleeperCondition.condition" name="sleeperConditionFail" :items="variable.sleeperCondition" :disables="compDisableSleeperCondition"></SelectBtn>
            </div>
            <p v-if="v$.trackDamageSurvey.sleeperCondition.condition.$error" class="text-sm text-red-600">{{ v$.trackDamageSurvey.sleeperCondition.condition.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">คันทาง</label>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2">
              <SelectBtn :is-preview="isPreview" type="radio" is-specify :error="v$.trackDamageSurvey.trackFoundationCondition.$error" v-model="railSurvey.trackDamageSurvey.trackFoundationCondition" name="trackFoundationCondition" :items="[variable.integrity[0]]" :disables="compDisableTrackFoundationCondition"></SelectBtn>
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
              <SelectBtn :is-preview="isPreview" type="radio" :error="v$.maintenanceRate.severity.$error" v-model="railSurvey.maintenanceRate.severity" name="severity" :items="variable.damagesLevel" :disables="compDisableSeverity"></SelectBtn>
            </div>
            <p v-if="v$.maintenanceRate.severity.$error" class="text-sm text-red-600">{{ v$.maintenanceRate.severity.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">ควรส่งห้องปฏิบัติการเพื่อทำการวิเคราะห์สาเหตุของความเสียหาย</label>
            <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2">
              <SelectBtn :is-preview="isPreview" type="radio" :error="v$.maintenanceRate.isAnalyzeDamage.$error" v-model="railSurvey.maintenanceRate.isAnalyzeDamage" name="isAnalyzeDamage" :items="variable.analyse" :disables="compDisableAnalyse"></SelectBtn>
            </div>
            <p v-if="v$.maintenanceRate.isAnalyzeDamage.$error" class="text-sm text-red-600">{{ v$.maintenanceRate.isAnalyzeDamage.$errors[0].$message }}</p>
          </div>
          <div>
            <label class="_label-lg">ประวัติการซ่อมบำรุง</label>
            <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              <SelectBtn :is-preview="isPreview" type="radio" :error="v$.maintenanceRate.maintenanceRecord.hasMaintenanceRecord.$error" :class="''"
                v-model="railSurvey.maintenanceRate.maintenanceRecord.hasMaintenanceRecord" name="hasMaintenanceRecord" :items="variable.maintenanceRecord" :disables="compDisableHasMaintenanceRecord"
              >
              </SelectBtn>
            </div>
            <p v-if="v$.maintenanceRate.maintenanceRecord.hasMaintenanceRecord.$error" class="text-sm text-red-600">{{ v$.maintenanceRate.maintenanceRecord.hasMaintenanceRecord.$errors[0].$message }}</p>
          </div>
          <div v-if="railSurvey.maintenanceRate.maintenanceRecord.hasMaintenanceRecord" class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <div>
              <label class="_label-sm">การซ่อมบำรุงครั้งล่าสุด</label>
              <select :disabled="isPreview" name="maintenanceRate.maintenanceRecord.lastMaintenanceTimes" :value="railSurvey.maintenanceRate.maintenanceRecord.lastMaintenanceTimes" @change="handleEmit($event.target)" id="lastMaintenanceTimes" :class="v$.maintenanceRate.maintenanceRecord.lastMaintenanceTimes.$error ? '_input_error' : '_input'">
                <option disabled value="">กรุณาเลือกครั้งในการซ่อมบำรุง</option>
                <option v-for="(lm, index) in variable.lastMaintenance" :value="lm.value" :key="index">{{ lm.key }}</option>
              </select>
              <p v-if="v$.maintenanceRate.maintenanceRecord.lastMaintenanceTimes.$error" class="text-sm text-red-600">{{ v$.maintenanceRate.maintenanceRecord.lastMaintenanceTimes.$errors[0].$message }}</p>
            </div>
            <div>
              <label class="_label-sm">ความถี่ในการซ่อมบำรุงในรอบปี</label>
              <select :disabled="isPreview" name="maintenanceRate.maintenanceRecord.yearlyMaintenanceTimes" :value="railSurvey.maintenanceRate.maintenanceRecord.yearlyMaintenanceTimes" @change="handleEmit($event.target)" id="yearlyMaintenanceTimes" :class="v$.maintenanceRate.maintenanceRecord.yearlyMaintenanceTimes.$error ? '_input_error' : '_input'">
                <option disabled value="">กรุณาเลือกครั้งในการซ่อมบำรุง</option>
                <option v-for="(mt, index) in variable.maintenanceTime" :value="mt.value" :key="index">{{ mt.key }}</option>
              </select>
              <p v-if="v$.maintenanceRate.maintenanceRecord.yearlyMaintenanceTimes.$error" class="text-sm text-red-600">{{ v$.maintenanceRate.maintenanceRecord.yearlyMaintenanceTimes.$errors[0].$message }}</p>
            </div>
          </div>
          <div>
            <label class="_label-lg">ข้อคิดเห็น/คำแนะนำ/หมายเหตุ</label>
            <textarea name="maintenanceRate.comment" :value="railSurvey.maintenanceRate.comment" @input="handleEmit($event.target)" :disabled="isPreview" id="comment" rows="4" class="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=""></textarea>
            <!-- <div class="grid sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-2">
              <SelectBtn :is-preview="isPreview" type="checkbox" :error="v$.maintenanceRate.maintenanceMethod.$error" v-model="railSurvey.maintenanceRate.maintenanceMethod" name="maintenanceMethod" :items="variable.maintenanceMethod" :disables="compDisableMaintenanceMethod"></SelectBtn>
            </div>
            <p v-if="v$.maintenanceRate.maintenanceMethod.$error" class="text-sm text-red-600">{{ v$.maintenanceRate.maintenanceMethod.$errors[0].$message }}</p> -->
          </div>
        </div>
      </template>
    </Accordion>
    <div class="mt-4 flex justify-center">
      <div class="border border-solid p-0" :class="v$.signature.$error ? 'border-red-600' : 'border-gray-200' ">
        <div v-if="!isPreview" class="flex justify-center">
          <button @click="undo" type="button" class="text-gray-900 hover:bg-gray-100 font-medium border-b border-x rounded-bl-md text-sm px-5 py-1">Undo</button>
          <button @click="clear" type="button" class="text-gray-900 hover:bg-gray-100 font-medium border-b border-r text-sm px-5 py-1">Clear</button>
          <button @click="emit('onSubmit')" type="button" class="text-gray-900 hover:bg-gray-100 font-medium border-b border-r rounded-br-md text-sm px-5 py-1">Submit</button>
        </div>
        <VueSignaturePad width="400px" height="120px" :options="{ onBegin, onEnd }" ref="signaturePad" />
        <!-- <img :src="railSurvey.signature" alt=""> -->
        <label class="pb-1 flex flex-col items-center text-sm font-medium text-gray-900 dark:text-white">ผู้สำรวจและบันทึกความเสียหาย</label>
      </div>
    </div>
    <!-- <pre>
      {{ v$.general }}
      {{ v$.trackDamageSurvey.$error }}
      {{ v$.railDamageSurvey.$error }}
      {{ v$.maintenanceRate.$errors }}
    </pre> -->
  </div>

</template>