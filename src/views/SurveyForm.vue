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
import { required, minValue, maxValue } from '@vuelidate/validators'
import { Loader } from '@googlemaps/js-api-loader'
import variable from '@/assets/variable.json'
import api from '@/services'

const loader = new Loader({
  apiKey: 'AIzaSyBksdb-qLu2FZavr1UPnrUpXhvO-VUeSLA',
  version: 'weekly',
  libraries: ['places']
})

const maps = ref([])
const ta = ref(null)

onMounted(() => {
  navigator.geolocation.getCurrentPosition((position)=> {
    const p = position.coords;
    console.log(p.latitude, p.longitude);
  })
  getAPI()
})

const store = useStore()
const damagesLevel = variable.damagesLevel
const damageProperties = variable.damageProperties
const damageAraePrperties = variable.damageAraePrperties
const integrity = variable.integrity
const ballast = variable.ballast
const sleeper = variable.sleeper
const analyse = variable.analyse
const positionDamage = variable.positionDamage
const scar = variable.scar
const trackGeometry = variable.trackGeometry
const guageType = variable.guageType
const trafficArae = variable.trafficArae
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
const railSurvey = reactive({
  date: new Date().toISOString().substring(0, 10),
  trafficArea: null,
  damagedArea: {
    GPSCoordinates: null,
    kmTelegraphPoles: null,
    nearby: [],
  },
  railType: null,
  damageSeverity: null,
  railDamagePoint: null,
  natureDamage: null,
  railScar: null,
  natureAreaDamage: null,
  integrityRail: null,
  trackGeometry: null,
  irregularTrackGeometryPattern: null,
  ballast: null,
  sleeper: null,
  track: null,
  maintenanceRecord: null,
  lastMaintenance: null,
  manyTimeMaintenance: null,
  maintenanceMethod: null,
  analyzeDamage: null,
  damageSurveyorOpinion: null,
  signature: null
})

const rules = {
  date: { required  },
  trafficArea: { required  },
  damagedArea: {
    GPSCoordinates: { required },
    kmTelegraphPoles: { required },
    nearby: { required }
  },
  damageSeverity: { required  },
  railDamagePoint: { required  },
  natureDamage: { required  },
  railScar: { required  },
  natureAreaDamage: { required  },
  integrityRail: { required  },
  trackGeometry: { required  },
  irregularTrackGeometryPattern: { required  },
  ballast: { required  },
  sleeper: { required  },
  track: { required  },
  maintenanceRecord: { required  },
  lastMaintenance: { required  },
  manyTimeMaintenance: { required, minValue: minValue(0), maxValue: maxValue(365)  },
  maintenanceMethod: { required  },
  analyzeDamage: { required }
}

const v$ = useVuelidate(rules, railSurvey, { $autoDirty: true })

// METHOD //
const handleSubmit = async () => {
  await v$.value.$validate()
}
const handleGetLocation = () => {
  navigator.geolocation.getCurrentPosition((position) => {
      const p = position.coords;
      // console.log(p.latitude, p.longitude);
      railSurvey.damagedArea.GPSCoordinates = `${p.latitude}, ${p.longitude}`
  })
}
const getAPI = () => {
  api.get(`/`, null).then((resp) => {
    resp.json().then((json) => {
      ta.value = json
    })
  })
}

// COMPUTED //
const compMARec = computed(() => {
  return v$.value.maintenanceRecord.$error
    // || v$.value.lastMaintenance.$error
    // || v$.value.manyTimeMaintenance.$error
    || v$.value.maintenanceMethod.$error
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
  <!-- {{ ta }} -->
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
            <select v-model="railSurvey.trafficArea" id="trafficArea" :class="v$.trafficArea.$error ? '_input_error' : '_input'">
              <option :value="null">กรุณาเลือกเขตการเดินรถ</option>
              <option v-for="(trafAr, index) in trafficArae" :key="index">{{ trafAr }}</option>
            </select>
            <p v-if="v$.trafficArea.$error" class="text-sm text-red-600">{{ v$.trafficArea.$errors[0].$message }}</p>
          </div>
        </div>
      </Border>
      <Border>
        <label class="block mb-2 text-lg font-semibold text-gray-900 dark:text-white">พื้นที่เกิดความเสียหาย</label>
        <div class="flex flex-col gap-4">
          <div class="flex md:flex-row flex-col gap-4">
            <div class="flex-1">
              <label class="_label-sm">พิกัด GPS</label>
              <input v-model="railSurvey.damagedArea.GPSCoordinates" @click="handleGetLocation()" type="text" id="GPSCoordinates" :class="v$.damagedArea.GPSCoordinates.$error ? '_input_error' : '_input' " required>
              <p v-if="v$.damagedArea.GPSCoordinates.$error" class="text-sm text-red-600">{{ v$.damagedArea.GPSCoordinates.$errors[0].$message }}</p>
            </div>
            <div class="flex-1">
              <label class="_label-sm">หลักกิโลเมตร/เสาโทรเลข</label>
              <input v-model="railSurvey.damagedArea.kmTelegraphPoles" type="text" id="kmTelegraphPoles" :class="v$.damagedArea.kmTelegraphPoles.$error ? '_input_error' : '_input' " required>
              <p v-if="v$.damagedArea.kmTelegraphPoles.$error" class="text-sm text-red-600">{{ v$.damagedArea.kmTelegraphPoles.$errors[0].$message }}</p>
            </div>
          </div>
          <div class="flex flex-col">
            <label class="_label-sm">สถานีรถไฟใกล้เคียง</label>
            <div class="flex md:flex-row flex-col gap-4">
              <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option disabled :value="null">กรุณาเลือกสถานี</option>
                <option v-for="(trafAr, index) in trafficArae" :key="index">{{ trafAr }}</option>
              </select>
              <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option disabled :value="null">กรุณาเลือกสถานี</option>
                <option v-for="(trafAr, index) in trafficArae" :key="index">{{ trafAr }}</option>
              </select>
            </div>
          </div>
          <div class="flex flex-col">
            <label class="_label-lg">ชนิดของราง</label>
            <label class="_label-sm">มาตรฐานและเกรด</label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select v-model="railSurvey.railType" id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option disabled :value="null">กรุณาเลือกประเภทของเกจ</option>
                <option v-for="(g ,index) in guageType" :key="index" :value="g.value">{{ g.name }}</option>
              </select>
            </div>
          </div>
        </div>
      </Border>
      <Border :error="v$.damageSeverity.$error">
        <label class="_label-lg">ความรุนแรงของความเสียหาย</label>
        <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.damageSeverity" name="positionDamage" :items="damagesLevel"></RadioBtn>
        </div>
      </Border>
      <Border>
        <label class="_label-lg">ตำแหน่งที่เกิดความเสียหายของราง</label>
        <RadioImageBtn v-model="railSurvey.railDamagePoint" name="positionDamage" :items="positionDamage" imageLabel="title" imagePath="img">
          <!-- <template #label="{ item }">
            <div v-if="Array.isArray(item)" class="flex flex-row md:flex-col">
              <div v-for="(label, index) in item" :key="index">
                <input type="radio" value="" name="rail" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label class="ml-4 text-sm font-medium text-gray-900 dark:text-gray-300">{{ label }}</label>
              </div>
            </div>
            <div v-else>{{ item }}</div>
          </template> -->
        </RadioImageBtn>
        <!-- <div class="flex flex-wrap gap-8">
          <div class="flex items-center">
            <img src="@/assets/positionDamage/Picture1.png" alt="positionDamage" class="h-40">
          </div>
          <div class="ml-12">
            <div>
              <input type="radio" value="" name="rail" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <label class="ml-4 text-sm font-medium text-gray-900 dark:text-gray-300">หัวราง</label>
            </div>
            <div>
              <input type="radio" value="" name="rail" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <label class="ml-4 text-sm font-medium text-gray-900 dark:text-gray-300">หัวราง</label>
            </div>
            <div>
              <input type="radio" value="" name="rail" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <label class="ml-4 text-sm font-medium text-gray-900 dark:text-gray-300">หัวราง</label>
            </div>
          </div>
        </div> -->
      </Border>
      <Border :error="v$.natureDamage.$error">
        <label class="_label-lg">ลักษณะความเสียหาย</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.natureDamage" name="positionDamage" :items="damageProperties"></RadioBtn>
        </div>
      </Border>
      <Border :error="v$.railScar.$error">
        <label class="_label-lg">ให้ระบุลักษณะแผล โดยดูรูปต่อไปนี้ประกอบ</label>
        <RadioImageBtn v-model="railSurvey.railScar" name="scar" :items="scar" imageLabel="title" imagePath="img">
        </RadioImageBtn>
      </Border>
      <Border :error="v$.natureAreaDamage.$error">
        <label class="_label-lg">ลักษณะพื้นที่ที่เกิดความเสียหาย</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.natureAreaDamage" name="damageAraePrperties" :items="damageAraePrperties"></RadioBtn>
        </div>
      </Border>
      <Border :error="v$.integrityRail.$error || v$.trackGeometry.$error ">
        <div class="flex flex-col gap-4">
          <div>
            <label class="_label-lg">ความสมบูรณ์ของทาง</label>
            <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
              <RadioBtn v-model="railSurvey.integrityRail" name="pt" :items="integrity"></RadioBtn>
            </div>
          </div>
          <div>
            <label class="_label-lg">Track Geometry</label>
            <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
              <RadioBtn v-model="railSurvey.trackGeometry" name="tg" :items="integrity"></RadioBtn>
            </div>
          </div>
        </div>
      </Border>
      <Border :error="v$.irregularTrackGeometryPattern.$error">
        <label class="_label-lg">รูปแบบ Track Geometry ที่ผิดปกติ</label>
        <RadioImageBtn v-model="railSurvey.irregularTrackGeometryPattern" name="abtg" :items="trackGeometry" imageLabel="title" imagePath="img"></RadioImageBtn>
      </Border>
      <Border :error="v$.ballast.$error">
        <label class="_label-lg">หินโรยทาง (Ballast)</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.ballast" name="ballast" :items="ballast"></RadioBtn>
        </div>
      </Border>
      <Border :error="v$.sleeper.$error">
        <label class="_label-lg">หมอนรองทาง (Sleeper)</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.sleeper" name="sleeper" :items="sleeper"></RadioBtn>
        </div>
      </Border>
      <Border :error="v$.track.$error">
        <label class="_label-lg">คันทาง</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.track" name="track" :items="integrity"></RadioBtn>
        </div>
      </Border>
      <Border :error="compMARec">
        <label class="_label-lg">ประวัติการซ่อมบำรุง</label>
        <div class="flex flex-col gap-4">
          <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
            <RadioBtn v-model="railSurvey.maintenanceRecord" name="his" :items="['เคย', 'ไม่เคย']"></RadioBtn>
          </div>
          <div class="flex md:flex-row flex-col gap-4">
            <div class="flex-1">
              <label class="_label-sm">การซ่อมบำรุงครั้งล่าสุด</label>
              <input v-model="railSurvey.lastMaintenance" type="date" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required>
              <p v-if="v$.lastMaintenance.$error" class="text-sm text-red-600">{{ v$.lastMaintenance.$errors[0].$message }}</p>
            </div>
            <div class="flex-1">
              <label class="_label-sm">ความถี่ในการซ่อมบำรุงในรอบปี</label>
              <input v-model="railSurvey.manyTimeMaintenance" type="number" :min="0" :max="365" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
              <p v-if="v$.manyTimeMaintenance.$error" class="text-sm text-red-600">{{ v$.manyTimeMaintenance.$errors[0].$message }}</p>
            </div>
          </div>
          <div>
            <label class="_label-lg">วิธีซ่อมบำรุง</label>
            <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
              <RadioBtn v-model="railSurvey.maintenanceMethod" name="ma" :items="['เชื่อมซ่อม', 'ตัดเปลี่ยนราง']"></RadioBtn>
            </div>
          </div>
        </div>
      </Border>
      <Border :error="v$.analyzeDamage.$error">
        <label class="_label-lg">ควรส่งห้องปฏิบัติการเพื่อทำการวิเคราะห์สาเหตุของความเสียหาย</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.analyzeDamage" name="positionDamage" :items="analyse"></RadioBtn>
        </div>
      </Border>
      <Border>
        <label class="_label-lg">ความคิดเห็นของผู้สำรวจความเสียหาย</label>
        <textarea v-model="railSurvey.damageSurveyorOpinion" rows="4" class="_input" placeholder=""></textarea>
      </Border>
      <div class="flex justify-end">
        <div class="w-1/2">
          <Border>
            <div class="h-20">
              <VueSignaturePad ref="signaturePad" />
            </div>
            <label class="pt-2 flex flex-col items-center text-sm font-medium text-gray-900 dark:text-white">ผู้สำรวจและบันทึกความเสียหาย</label>
          </Border>
        </div>
      </div>
      <div class="flex mx-auto">
        <button class="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400" @click="save">Save</button>
        <button class="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400" @click="undo">Undo</button>
        <button class="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400" @click="clear">Clear</button>
        <button class="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400" @click="handleSubmit()">Submit</button>
      </div>
    </div>
  </div>
</template>