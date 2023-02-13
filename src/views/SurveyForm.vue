<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import BorderRadioBtn from '@/components/BorderRadioBtn.vue'
import Border from '@/components/Border.vue'
import RadioBtnRow from '@/components/RadioBtnRow.vue'
import RadioBtn from '@/components/RadioBtn.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import RadioImageBtn from '@/components/RadioImageBtn.vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, requiredIf, minValue, maxValue } from '@vuelidate/validators'
import { Loader } from '@googlemaps/js-api-loader'
import variable from '@/assets/variable.json'
import api from '@/services'
import { nullableTypeAnnotation } from '@babel/types'
import { useRouter } from 'vue-router'
import IndexDB from '@/IndexedDB'
import Keycloak from 'keycloak-js'
import kcJSON from '@/keycloak.json'

const router = useRouter()
const keycloak = new Keycloak(kcJSON)

const loader = new Loader({
  apiKey: 'AIzaSyBksdb-qLu2FZavr1UPnrUpXhvO-VUeSLA',
  version: 'weekly',
  libraries: ['places']
})

const maps = ref([])
const ta = ref(null)
const is = ref(false)

onMounted(() => {
  navigator.geolocation.getCurrentPosition((position)=> {
    const p = position.coords;
    console.log(p.latitude, p.longitude);
  })
  // getAPI()
})

const store = useStore()
const signaturePad = ref(null)

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

const railSurvey = reactive({
  date: new Date().toISOString().substring(0, 10),
  zone: null,
  coordinates: null,
  kilometers: null,
  nearby: [],
  typeOfRail: null,
  situation: null,
  locationOfFailure: null,
  typeOfFailure: null,
  trackGeometryFaults: null,
  surfaceDefect: null,
  typeOfFailureArea: null,
  railCondition: null,
  trackGeometry: null,
  ballast: null,
  sleeper: null,
  trackFoundation: null,
  maintenanceRecord: null,
  maintenanceLastDate: null,
  maintenancePreiod: null,
  maintenanceMethod: null,
  uploadImage: null,
  severityOfDamage: null,
  isAnalyzeDamage: null,
  comment: null,
  signature: null
})

const rules = {
  date: { required  },
  zone: { required  },
  coordinates: { required },
  kilometers: { required },
  typeOfRail: { required  },
  situation: { required  },
  locationOfFailure: { required  },
  typeOfFailure: { required  },
  surfaceDefect: {
    requiredIfFailArea: requiredIf(() => {
      return railSurvey.typeOfFailure.includes('Surface Defect')
    })
  },
  typeOfFailureArea: { required },
  railScar: { required  },
  natureAreaDamage: { required  },
  railCondition: { required  },
  trackGeometry: { required  },
  trackGeometryFaults: {
    requiredIfTrackFault: requiredIf(() => {
      return railSurvey.railCondition.includes('ไม่')
    })
  },
  ballast: { required  },
  sleeper: { required  },
  trackFoundation: { required  },
  severityOfDamage: { required  },
  maintenanceRecord: { required },
  maintenanceLastDate: {
    requiredIfRec: requiredIf(() => {
      return railSurvey.maintenanceRecord === 'เคย'
    })
  },
  maintenancePreiod: {
    requiredIfRec: requiredIf(() => {
      return railSurvey.maintenanceRecord === 'เคย'
    }),
    minValue: minValue(0), maxValue: maxValue(365)
  },
  maintenanceMethod: {
    requiredIfRec: requiredIf(() => {
      return railSurvey.maintenanceRecord === 'เคย'
    })
  },
  isAnalyzeDamage: { required },
  signature: { required }
}

const v$ = useVuelidate(rules, railSurvey, { $autoDirty: true })

// METHOD //
const handleSubmit = async () => {
  const { isEmpty, data } = signaturePad.value.saveSignature()
  railSurvey.signature = data
  const isValid = await v$.value.$validate()
  if (isValid) {
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
  if (!!zones[zones.indexOf(value) - 1] && !!zones[zones.indexOf(value) + 1]) {
    railSurvey.nearby = [zones[zones.indexOf(value) - 1], zones[zones.indexOf(value) + 1]]
  } else {
    if (!zones[zones.indexOf(value) - 1]) {
      railSurvey.nearby = [value, zones[zones.indexOf(value) + 1]]
    }
    if (!zones[zones.indexOf(value) + 1]) {
      railSurvey.nearby = [zones[zones.indexOf(value) - 1], value]
    }
  }
}

const handleUploadImage = (event) => {
  var file = event.target.files[0]
  var reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    railSurvey.uploadImage = reader.result
    // console.log(reader.result)
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

const compDate = computed({
  get() {
    return railSurvey.date
  },
  set(newValue) {
    return railSurvey.date = newValue
  }
})

</script>
<template>
<!-- <button @click="store.state.logout">log out</button> -->
<!-- {{ store.state.profile }} -->
  <!-- {{ ta }} -->
  <!-- <pre>
    {{ v$.$errors }}
  </pre> -->
  <!-- 2023-01-07 -->
  <!-- {{ new Date().toISOString().substring(0, 10) }} -->
  <div class="container">
    <!-- {{ store.state }} -->
    <!-- <button @click="store.commit('increment')">+</button>
    <button @click="store.commit('toggleDarkMode')">Toggle</button>
    <DarkModeToggle></DarkModeToggle> -->
    <div class="flex flex-col gap-4">
      <!-- วันที่สำรวจ -->
      <Border>
        <div class="flex md:flex-row flex-col gap-4">
          <div class="flex-1">
            <label class="_label-sm">วันที่สำรวจ</label>
            <input v-model="railSurvey.date" type="date" id="date" :class="v$.date.$error ? '_input_error' : '_input'" required>
            <p v-if="v$.date.$error" class="text-sm text-red-600">{{ v$.date.$errors[0].$message }}</p>
          </div>
          <div class="flex-1">
            <label class="_label-sm">เขตการเดินรถ</label>
            <select @change="handleSelectZone($event.target.value)" v-model="railSurvey.zone" id="zone" :class="v$.zone.$error ? '_input_error' : '_input'">
              <option :value="null">กรุณาเลือกเขตการเดินรถ</option>
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
              <input v-model="railSurvey.coordinates" @click="handleGetLocation()" type="text" id="GPSCoordinates" :class="v$.coordinates.$error ? '_input_error' : '_input' " required>
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
              <input v-if="railSurvey.zone" v-for="(nb, index) in railSurvey.nearby" :key="index" :value="nb.value" disabled type="text" id="kmTelegraphPoles" class="_input">
              <input v-else v-for="(nb, index_) in 2" :key="index_" :value="null" disabled type="text" id="kmTelegraphPoles" :class="v$.zone.$error ? '_input_error' : '_input'">
              <!-- <select :value="railSurvey.nearby[0]" disabled id="nearby-1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option disabled :value="null">กรุณาเลือกสถานี</option>
                <option v-for="(trafAr, index) in trafficArae" :key="index">{{ trafAr }}</option>
              </select>
              <select :value="railSurvey.nearby[1]" disabled id="nearby-2" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option disabled :value="null">กรุณาเลือกสถานี</option>
                <option v-for="(trafAr, index) in trafficArae" :key="index">{{ trafAr }}</option>
              </select> -->
            </div>
            <p v-if="v$.zone.$error" class="text-sm text-red-600">{{ v$.zone.$errors[0].$message }}</p>
          </div>
          <div class="flex flex-col">
            <label class="_label-lg">ชนิดของราง</label>
            <label class="_label-sm">มาตรฐานและเกรด</label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select v-model="railSurvey.typeOfRail" id="countries" :class="v$.typeOfRail.$error ? '_input_error' : '_input'">
                <option disabled :value="null">กรุณาเลือกประเภทของเกจ</option>
                <option v-for="(g ,index) in variable.guageType" :key="index" :value="g.value">{{ g.key }}</option>
              </select>
            </div>
            <p v-if="v$.typeOfRail.$error" class="text-sm text-red-600">{{ v$.typeOfRail.$errors[0].$message }}</p>
          </div>
        </div>
      </Border>
      <Border :error="v$.situation.$error">
        <label class="_label-lg">ความเสียหายของราง</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.situation" name="positionDamage" :items="variable.situation"></RadioBtn>
        </div>
      </Border>
      <Border>
        <!-- <label class="_label-lg">ตำแหน่งที่เกิดความเสียหายของราง</label> -->
        <label class="_label-lg">ตำแหน่งความเสียหายบนราง</label>
        <RadioBtn v-model="railSurvey.typeOfFailure" name="topRailDamage" :items="variable.positionDamage.topRail"></RadioBtn>
        <label class="_label-lg">บริเวณความเสียหาย</label>
        <RadioImageBtn name="areaDamage" :items="variable.positionDamage.damageArea" imageLabel="title" imagePath="img"></RadioImageBtn>
        <!-- <RadioImageBtn name="positionDamage" :items="variable.positionDamage" imageLabel="title" imagePath="img"> -->
          <!-- <template #label="{ item }">
            <div v-if="Array.isArray(item)" class="flex flex-row md:flex-col">
              <div v-for="(label, index) in item" :key="index">
                <input type="radio" value="" name="rail" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label class="ml-4 text-sm font-medium text-gray-900 dark:text-gray-300">{{ label }}</label>
              </div>
            </div>
            <div v-else>{{ item }}</div>
          </template> 
        </RadioImageBtn>-->
      </Border>
      <Border :error="v$.typeOfFailure.$error">
        <label class="_label-lg">ลักษณะความเสียหาย</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.typeOfFailure" name="positionDamage" :items="variable.damageProperties"></RadioBtn>
        </div>
      </Border>
      <!-- {{  railSurvey.typeOfFailure && railSurvey.typeOfFailure.includes('Surface Defect') }} -->
      <Border v-if="railSurvey.typeOfFailure?.includes('surfaceDefect')" :error="v$.surfaceDefect.$error">
        <label class="_label-lg">ให้ระบุลักษณะแผล โดยดูรูปต่อไปนี้ประกอบ</label>
        <RadioImageBtn v-model="railSurvey.surfaceDefect" name="scar" :items="variable.scar" imageLabel="title" imagePath="img"></RadioImageBtn>
      </Border>
      <Border :error="v$.typeOfFailureArea.$error">
        <label class="_label-lg">ลักษณะพื้นที่ที่เกิดความเสียหาย</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.typeOfFailureArea" name="damageAraePrperties" :items="variable.damageAreaPrperties"></RadioBtn>
        </div>
      </Border>
      <Border :error="v$.railCondition.$error">
        <div class="flex flex-col gap-4">
          <div>
            <label class="_label-lg">ความสมบูรณ์ของทาง</label>
            <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
              <RadioBtn v-model="railSurvey.railCondition" name="pt" :items="variable.integrity"></RadioBtn>
            </div>
          </div>
        </div>
      </Border>
      <Border v-if="railSurvey.railCondition?.includes('ไม่')" :error="v$.trackGeometryFaults.$error">
        <label class="_label-lg">รูปแบบ Track Geometry ที่ผิดปกติ</label>
        <RadioImageBtn v-model="railSurvey.trackGeometryFaults" name="abtg" :items="variable.trackGeometry" imageLabel="title" imagePath="img"></RadioImageBtn>
      </Border>
      <Border :error="v$.ballast.$error">
        <label class="_label-lg">หินโรยทาง (Ballast)</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.ballast" name="ballast" :items="variable.ballast"></RadioBtn>
        </div>
      </Border>
      <Border :error="v$.sleeper.$error">
        <label class="_label-lg">หมอนรองทาง (Sleeper)</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.sleeper" name="sleeper" :items="variable.sleeper"></RadioBtn>
        </div>
      </Border>
      <Border :error="v$.trackFoundation.$error">
        <label class="_label-lg">คันทาง</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.trackFoundation" name="track" :items="variable.integrity"></RadioBtn>
        </div>
      </Border>
      <Border :error="compMARec">
        <label class="_label-lg">ประวัติการซ่อมบำรุง</label>
        <div class="flex flex-col gap-4">
          <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
            <RadioBtn v-model="railSurvey.maintenanceRecord" name="his" :items="variable.maintenanceRecord"></RadioBtn>
          </div>
          <div v-if="railSurvey.maintenanceRecord && railSurvey.maintenanceRecord?.includes('yes')" class="flex flex-col gap-4">
            <div class="flex md:flex-row flex-col gap-4">
              <div class="flex-1">
                <label class="_label-sm">การซ่อมบำรุงครั้งล่าสุด</label>
                <input v-model="railSurvey.maintenanceLastDate" type="date" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required>
                <p v-if="v$.maintenanceLastDate.$error" class="text-sm text-red-600">{{ v$.maintenanceLastDate.$errors[0].$message }}</p>
              </div>
              <div class="flex-1">
                <label class="_label-sm">ความถี่ในการซ่อมบำรุงในรอบปี</label>
                <input v-model="railSurvey.maintenancePreiod" type="number" :min="0" :max="365" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <p v-if="v$.maintenancePreiod.$error" class="text-sm text-red-600">{{ v$.maintenancePreiod.$errors[0].$message }}</p>
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
        <label class="_label-lg">เพิ่มรูปภาพ (บริเวณสำรวจความเสียหาย)</label>
        <input @change="handleUploadImage($event)" name="img" accept="image/x-png,image/gif,image/jpeg" class="block w-full text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="small_size" type="file">
      </Border>
      <Border :error="v$.severityOfDamage.$error">
        <label class="_label-lg">ความรุนแรงของความเสียหาย</label>
        <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.severityOfDamage" name="positionDamage" :items="variable.damagesLevel"></RadioBtn>
        </div>
      </Border>
      <Border :error="v$.isAnalyzeDamage.$error">
        <label class="_label-lg">ควรส่งห้องปฏิบัติการเพื่อทำการวิเคราะห์สาเหตุของความเสียหาย</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.isAnalyzeDamage" name="positionDamage" :items="variable.analyse"></RadioBtn>
        </div>
      </Border>
      <Border>
        <label class="_label-lg">ความคิดเห็นของผู้สำรวจความเสียหาย</label>
        <textarea v-model="railSurvey.comment" rows="4" class="_input" placeholder=""></textarea>
      </Border>
      <div class="flex justify-end">
        <div class="w-1/2 border border-solid p-0" :class="v$.signature.$error ? 'border-red-600' : 'border-gray-200' ">
          <div class="flex justify-center">
            <button @click="undo" type="button" class="text-gray-900 hover:bg-gray-100 font-medium border-b border-x rounded-bl-md text-sm px-5 py-1">Undo</button>
            <button @click="clear" type="button" class="text-gray-900 hover:bg-gray-100 font-medium border-b border-r rounded-br-md text-sm px-5 py-1">Clear</button>
          </div>
          <div class="h-28 p-1">
            <VueSignaturePad ref="signaturePad" />
          </div>
          <label class="pb-1 flex flex-col items-center text-sm font-medium text-gray-900 dark:text-white">ผู้สำรวจและบันทึกความเสียหาย</label>
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-8">
      <!-- <button class="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400" @click="save">Save</button> -->
      <!-- <button class="px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400" @click="handleSubmit()">Submit</button> -->
      <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" @click="handleSubmit()">Submit</button>
    </div>
  </div>
  <!-- <RadioBtnLayout v-model="railSurvey.severityOfDamage" name="testasd" :items="damagesLevel"></RadioBtnLayout> -->
</template>