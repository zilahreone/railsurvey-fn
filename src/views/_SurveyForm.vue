<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import BorderRadioBtn from '@/components/BorderRadioBtn.vue'
import Border from '@/components/Border.vue'
import RadioBtnRow from '@/components/RadioBtnRow.vue'
import RadioBtn from '@/components/RadioBtn.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import RadioImageBtn from '@/components/RadioImageBtn.vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, requiredIf, minValue, maxValue, requiredUnless } from '@vuelidate/validators'
// import { Loader } from '@googlemaps/js-api-loader'
import variable from '@/variable.json'
import api from '@/services'
import { nullableTypeAnnotation } from '@babel/types'
import { useRouter } from 'vue-router'
// import IndexDB from '@/IndexedDB'
import Keycloak from 'keycloak-js'
import kcJSON from '@/keycloak.json'
import { Buffer } from 'buffer'

const store = useStore()
const router = useRouter()
const keycloak = new Keycloak(kcJSON)

// const loader = new Loader({
//   apiKey: 'AIzaSyBksdb-qLu2FZavr1UPnrUpXhvO-VUeSLA',
//   version: 'weekly',
//   libraries: ['places']
// })
const signaturePad = ref(null)
const maps = ref([])
const ta = ref(null)
const is = ref(false)
const isShowBtnUpload = ref(false)
const uploadStatus = ref(null)

const railForm = {
  date: null,
  zone: null,
  coordinates: {
    lattitude: null,
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

const railSurvey = reactive(Object.assign({}, railForm, { date: new Date().toISOString().substring(0, 10) }))

const rules2 = computed(() => {
  const rule = {}
  Object.keys(railForm).forEach((key) => {
    if (!['uploadImage', 'note'].includes(key)) {
      switch (key) {
        case 'coordinates':
          rule[key] = {
            lattitude: { required },
            longitude: { required }
          }
          break
        case 'defectSituation':
          rule[key] = {
            railPositionDefect: { required },
            railAreaDefect: { required }
          }
          break
        case 'surfaceDefect':
          rule[key] = {
            defectPattern: requiredIf(() => railSurvey.defectPattern === 'surfaceDefect')
          }
          break
        case 'trackGeometryCondition':
          rule[key] = {
            track: (value) => value && value !== 'imperfect'
          }
          break
        case 'lastMaintenanceDate':
          rule[key] = {
            hasMaintenanceRecord: requiredIf(() => railSurvey.hasMaintenanceRecord)
          }
          break
        case 'yearlyMaintenanceTimes':
          rule[key] = {
            hasMaintenanceRecord: requiredIf(() => railSurvey.hasMaintenanceRecord)
          }
          break
        case 'maintenanceMethod':
          rule[key] = {
            hasMaintenanceRecord: requiredIf(() => railSurvey.hasMaintenanceRecord)
          }
          break
        default:
          rule[key] = { required }
          break
      }
    }
  })
  return rule
})

const v$ = useVuelidate(rules2, railSurvey, { $autoDirty: true })

onMounted(() => {
  navigator.geolocation.getCurrentPosition((position)=> {
    const p = position.coords;
    railSurvey.coordinates.lattitude = p.latitude
    railSurvey.coordinates.longitude = p.longitude
    // console.log(p.latitude, p.longitude);
  })
  // getAPI()
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
  // const { isEmpty, data } = signaturePad.value.saveSignature()
  // railSurvey.signature = data
  const isValid = await v$.value.$validate()
  console.log(isValid);
  if (isValid) {
    api.post(`/api/rail-survey`, railSurvey, store.state.token).then((resp) => {
      if (resp.status === 201) {
        console.log('create success ;)')
      } else {
      }
    }).catch(() => {
      navigator.serviceWorker.ready.then(registration => {
        // console.log(registration)
        registration.sync.register('some-unique-tag')
      }).catch(console.log())
    })
  }
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
const handleGetLocation = () => {
  navigator.geolocation.getCurrentPosition((position) => {
      const p = position.coords;
      // console.log(p.latitude, p.longitude);
      railSurvey.coordinates = `${p.latitude}, ${p.longitude}`
  })
}
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
  railSurvey.nearby.stationBefore = !zones[index - 1] ? value : zones[index - 1]
  railSurvey.nearby.stationAfter = !zones[index + 1] ? value : zones[index + 1]
}

const handleUploadImage = (event) => {
  uploadStatus.value = null
  const files = uploadImg.files
  Array.from(files).forEach((file, index) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file)
    img.alt = file.name
    document.querySelector('#preview').append(img);
  })
  isShowBtnUpload.value = true
}

const handleUploadImages = () => {
  const files = uploadImg.files
  let formData = new FormData()
  Array.from(files).forEach((file, index) => {
    formData.append('file', file)
  })
  api.uploadFiles('/api/uploads', formData, null).then((resp) => {
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

const onBegin = () => {
  // console.log('=== Begin ===');
}

const onEnd = () => {
  // console.log('=== End ===');
  const { isEmpty, data } = signaturePad.value.saveSignature()
  if (!isEmpty) {
    railSurvey.signature = data
  }

}

// COMPUTED //
const compMARec = computed(() => {
  return v$.value.maintenanceRecord.$error
    || v$.value.lastMaintenance?.$error
    || v$.value.manyTimeMaintenance?.$error
    || v$.value.maintenanceMethod?.$error
})

const compAraeDamage = computed(() => {
  return v$.value.damagedArea.GPSCoordinates.$error
    || v$.value.damagedArea.kmTelegraphPoles.$error
    || v$.value.damagedArea.nearby.$error
})

const compNearby = computed(() => {
  let nearby = []
  for (const key in railSurvey.nearby) {
    if (Object.hasOwnProperty.call(railSurvey.nearby, key)) {
      const element = railSurvey.nearby[key]
      nearby.push(variable.zone.filter(z => z.value === element).map(z => z.key))
    }
  }
  return nearby
})

const compDate = computed({
  get() {
    return railSurvey.date
  },
  set(newValue) {
    return railSurvey.date = newValue
  }
})

// watch(railSurvey.signature, (newUsername) => {
//    // Do something with the updated value.
//    console.log(newUsername)
//   //  const { isEmpty, data } = signaturePad.value.saveSignature()
// })

</script>
<template>
  <button @click="convertImage">convertImage</button>
  <div class="flex flex-col gap-4">
    <Border>
      <div class="flex md:flex-row flex-col gap-4">
        <div class="flex-1">
          <label class="_label-sm">วันที่สำรวจ</label>
          <input disabled v-model="railSurvey.date" type="date" id="date" :class="v$.date.$error ? '_input_error' : '_input'" required>
          <p v-if="v$.date.$error" class="text-sm text-red-600">{{ v$.date.$errors[0].$message }}</p>
        </div>
        <div class="flex-1">
          <label class="_label-sm">เขตการเดินรถ</label>
          <select v-model="railSurvey.zone" @change="handleSelectZone($event.target.value)" id="zone" :class="v$.zone.$error ? '_input_error' : '_input'">
            <option value="">กรุณาเลือกเขตการเดินรถ</option>
            <option v-for="(zone, index) in variable.zone" :value="zone.value" :key="index">{{ zone.key }}</option>
          </select>
          <p v-if="v$.zone.$error" class="text-sm text-red-600">{{ v$.zone.$errors[0].$message }}</p>
        </div>
      </div>
    </Border>
    <Border>
      <label class="block mb-2 text-lg font-semibold text-gray-900 dark:text-white">พื้นที่เกิดความเสียหาย</label>
      <div class="flex flex-col gap-4">
        <div class="flex md:flex-row flex-col gap-4">
          <div class="flex-1">
            <label class="_label-sm">พิกัด GPS</label>
            <div class="flex sm:flex-row flex-col gap-1">
              <input v-model="railSurvey.coordinates.lattitude" type="text" :class="v$.coordinates.$error ? '_input_error' : '_input' " required>
              <input v-model="railSurvey.coordinates.longitude" type="text" :class="v$.coordinates.$error ? '_input_error' : '_input' " required>
            </div>
            <p v-if="v$.coordinates.$error" class="text-sm text-red-600">{{ v$.coordinates.$errors[0].$message }}</p>
          </div>
          <div class="flex-1">
            <label class="_label-sm">หลักกิโลเมตร/เสาโทรเลข</label>
            <input v-model="railSurvey.kilometers" type="text" id="kmTelegraphPoles" :class="v$.kilometers.$error ? '_input_error' : '_input' " required>
            <p v-if="v$.kilometers.$error" class="text-sm text-red-600">{{ v$.kilometers.$errors[0].$message }}</p>
          </div>
        </div>
        <div class="flex flex-col">
          <label class="_label-sm">สถานีรถไฟใกล้เคียง</label>
          <div class="flex md:flex-row flex-col gap-4">
            <input v-if="railSurvey.zone" v-for="(value, index) in compNearby" :key="index" :value="value" disabled type="text" id="nearBy" class="_input">
            <input v-else v-for="(nb, index_) in compNearby" :key="index_" :value="null" disabled type="text" id="nearBy" :class="v$.zone.$error ? '_input_error' : '_input'">
          </div>
          <p v-if="v$.zone.$error" class="text-sm text-red-600">{{ v$.zone.$errors[0].$message }}</p>
        </div>
        <div class="flex flex-col">
          <label class="_label-lg">ชนิดของราง</label>
          <label class="_label-sm">มาตรฐานและเกรด</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select v-model="railSurvey.railType" id="countries" :class="v$.railType.$error ? '_input_error' : '_input'">
              <option disabled :value="null">กรุณาเลือกประเภทของเกจ</option>
              <option v-for="(g ,index) in variable.guageType" :key="index" :value="g.value">{{ g.key }}</option>
            </select>
          </div>
          <p v-if="v$.railType.$error" class="text-sm text-red-600">{{ v$.railType.$errors[0].$message }}</p>
        </div>
      </div>
    </Border>
    <Border :error="v$.areaCondition.$error">
      <label class="_label-lg">ลักษณะพื้นที่ที่เกิดความเสียหาย</label>
      <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
        <RadioBtn v-model="railSurvey.areaCondition" name="areaCondition" :items="variable.damageAreaPrperties"></RadioBtn>
      </div>
    </Border>
    <Border :error="v$.defectSituation.railPositionDefect.$error || v$.defectSituation.railAreaDefect.$error">
      <div class="flex flex-col gap-4">
        <div>
          <label class="_label-lg">ตำแหน่งความเสียหายบนราง</label>
          <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
            <RadioBtn v-model="railSurvey.defectSituation.railPositionDefect" name="railPositionDefect" :items="variable.positionDamage.topRail"></RadioBtn>
          </div>
        </div>
        <div>
          <label class="_label-lg">บริเวณความเสียหาย</label>
          <RadioImageBtn v-model="railSurvey.defectSituation.railAreaDefect" name="railAreaDefect" :items="variable.positionDamage.damageArea" imageLabel="title" imagePath="img"></RadioImageBtn>
        </div>
      </div>
    </Border>
    <Border :error="v$.defectPattern.$error">
      <label class="_label-lg">ลักณะความเสียหายที่เกิดขึ้น</label>
      <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
        <RadioBtn v-model="railSurvey.defectPattern" name="defectPattern" :items="variable.damageProperties"></RadioBtn>
      </div>
    </Border>
    <Border v-if="railSurvey.defectPattern?.includes('surfaceDefect')" :error="v$.surfaceDefect.$error">
      <label class="_label-lg">ให้ระบุลักษณะแผล โดยดูรูปต่อไปนี้ประกอบ</label>
      <RadioImageBtn v-model="railSurvey.surfaceDefect" name="surfaceDefect" :items="variable.scar" imageLabel="title" imagePath="img"></RadioImageBtn>
    </Border>
    <label class="_label-lg">สำรวจความเสียหายของทาง</label>
    <Border :error="v$.railCondition.$error">
      <label class="_label-lg">ความสมบูรณ์ของทาง</label>
      <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
        <RadioBtn v-model="railSurvey.railCondition" name="railCondition" :items="variable.railCondition"></RadioBtn>
      </div>
    </Border>
    <Border :error="v$.trackGeometryCondition.$error">
      <div class="flex flex-col gap-4">
        <div>
          <label class="_label-lg">Track Geometry</label>
          <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
            <RadioBtn v-model="railSurvey.trackGeometryCondition" name="trackGeometryCondition" :items="variable.integrity"></RadioBtn>
          </div>
        </div>
        <div v-if="railSurvey.trackGeometryCondition && railSurvey.trackGeometryCondition !== 'perfect'">
          <label class="_label-lg">รูปแบบ Track Geometry ที่ผิดปกติ</label>
          <RadioImageBtn v-model="railSurvey.trackGeometryCondition" name="defectTrackGeometry" :items="variable.trackGeometry" imageLabel="title" imagePath="img"></RadioImageBtn>
        </div>
      </div>
    </Border>
    <Border :error="v$.ballastCondition.$error">
      <label class="_label-lg">หินโรยทาง (Ballast)</label>
      <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
        <RadioBtn v-model="railSurvey.ballastCondition" name="ballastCondition" :items="variable.ballast"></RadioBtn>
      </div>
    </Border>
    <Border :error="v$.sleeperCondition.$error">
      <label class="_label-lg">หมอนรองทาง (Sleeper)</label>
      <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
        <RadioBtn v-model="railSurvey.sleeperCondition" name="sleeperCondition" :items="variable.sleeper"></RadioBtn>
      </div>
    </Border>
    <Border :error="v$.trackFoundationCondition.$error">
      <label class="_label-lg">คันทาง</label>
      <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
        <RadioBtn v-model="railSurvey.trackFoundationCondition" name="trackFoundationCondition" :items="variable.integrity"></RadioBtn>
      </div>
    </Border>
    <label class="_label-lg">การประเมินความเสียหาย</label>
    <Border>
      <label class="_label-lg">เพิ่มรูปภาพ (บริเวณสำรวจความเสียหาย)</label>
      <div class="flex flex-col gap-2">
        <input @change="handleUploadImage($event)" name="img" accept="image/x-png,image/gif,image/jpeg" id="uploadImg" type="file" multiple=""
          class="block w-full text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        >
        <div id="preview" class="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-1 items-center"></div>
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
    </Border>
    <Border :error="v$.severity.$error">
      <label class="_label-lg">ความรุนแรงของความเสียหาย</label>
      <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
        <RadioBtn v-model="railSurvey.severity" name="severity" :items="variable.damagesLevel"></RadioBtn>
      </div>
    </Border>
    <Border :error="v$.isAnalyzeDamage.$error">
      <label class="_label-lg">ควรส่งห้องปฏิบัติการเพื่อทำการวิเคราะห์สาเหตุของความเสียหาย</label>
      <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
        <RadioBtn v-model="railSurvey.isAnalyzeDamage" name="positionDamage" :items="variable.analyse"></RadioBtn>
      </div>
    </Border>
    <label class="_label-lg">ประวัติการซ่อมบำรุง</label>
    <Border :error="v$.hasMaintenanceRecord.$error
      || v$.lastMaintenanceDate.$error
      || v$.yearlyMaintenanceTimes.$error
      || v$.maintenanceMethod.$error"
    >
      <label class="_label-lg">ประวัติการซ่อมบำรุง</label>
      <div class="flex flex-col gap-4">
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.hasMaintenanceRecord" name="hasMaintenanceRecord" :items="variable.maintenanceRecord"></RadioBtn>
        </div>
        <div v-if="railSurvey.hasMaintenanceRecord" class="flex flex-col gap-4">
          <div class="flex md:flex-row flex-col gap-4">
            <div class="flex-1">
              <label class="_label-sm">การซ่อมบำรุงครั้งล่าสุด</label>
              <input v-model="railSurvey.lastMaintenanceDate" type="date" id="email" :class="v$.lastMaintenanceDate.$error ? '_input_error' : '_input' " required>
              <p v-if="v$.lastMaintenanceDate.$error" class="text-sm text-red-600">{{ v$.lastMaintenanceDate.$errors[0].$message }}</p>
            </div>
            <div class="flex-1">
              <label class="_label-sm">ความถี่ในการซ่อมบำรุงในรอบปี</label>
              <input v-model="railSurvey.yearlyMaintenanceTimes" type="number" :min="0" :max="365" id="password" :class="v$.yearlyMaintenanceTimes.$error ? '_input_error' : '_input' " required>
              <p v-if="v$.yearlyMaintenanceTimes.$error" class="text-sm text-red-600">{{ v$.yearlyMaintenanceTimes.$errors[0].$message }}</p>
            </div>
          </div>
          <div>
            <label class="_label-lg">วิธีซ่อมบำรุง</label>
            <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
              <RadioBtn v-model="railSurvey.maintenanceMethod" name="ma" :items="variable.maintenanceMethod"></RadioBtn>
            </div>
          </div>
        </div>
      </div>
    </Border>
    <Border>
      <label class="_label-lg">ความคิดเห็นของผู้สำรวจความเสียหาย</label>
      <textarea v-model="railSurvey.note" rows="4" class="_input" placeholder=""></textarea>
    </Border>
    <div class="flex justify-center">
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
    <div class="flex justify-end mt-8">
      <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" @click="handleSubmit()">Submit</button>
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