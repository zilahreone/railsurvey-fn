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
// import { Loader } from '@googlemaps/js-api-loader'
import variable from '@/assets/variable.json'
import api from '@/services'
import { nullableTypeAnnotation } from '@babel/types'
import { useRouter } from 'vue-router'
import IndexDB from '@/IndexedDB'
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

const railForm = {
  date: null,
  zone: null,
  coordinates: null,
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
  defectTrackGeometry: null,
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
  signature: null,
  createdAt: null,
  createdBy: null
}

const railSurvey = reactive(Object.assign({}, railForm, { date: new Date().toISOString().substring(0, 10) }))

const rules2 = computed(() => {
  const rule = {}
  Object.keys(railForm).forEach((key) => {
    rule[key] = { required }
  })
  return rule
})

const v$ = useVuelidate(rules2, railSurvey, { $autoDirty: true })

onMounted(() => {
  navigator.geolocation.getCurrentPosition((position)=> {
    const p = position.coords;
    railSurvey.coordinates = `${p.latitude}/${p.longitude}`
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
const _base64ToArrayBuffer = (base64) => {
    var binary_string = window.atob(base64);
    console.log(binary_string);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
const convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
});
const convertImage = async () => {
  console.log('convert')
  const { isEmpty, data } = signaturePad.value.saveSignature()
  // const b4 = Buffer.from(data, 'base64')
  // console.log(data);
  // let blob = new Blob(["<html>…</html>"], {type: 'text/html'});
  // const blob = await fetch(data).then(resp => resp.blob());
  // const blob1 = await base64Response.blob();
  if (!isEmpty) {
    // const asd = Buffer.from(data)
    // console.log(asd)
    // const buff = Buffer.from(data).toString('base64')
    api.post('/api/rail-survey', { id: '123', blob: data}, null).then((res) => {
      // res.json().then((json) => {
      //   console.log(json);
      // })
    })
  }

  // const base64String = await convertBlobToBase64(blob);
  // console.log(base64String);
  // fetch(data)
  //   .then(res => res.blob())
  //   .then(blob => {

  //     // console.log(blob);
  //     // const a = URL.createObjectURL(blob)
  //     // console.log(a);
  //     // api.post('/api/rail-survey', { id: '123', blob: a }, null).then((res) => {
  //     //   res.json().then((json) => {
  //     //     console.log(json);
  //     //   })
  //     // })
  //     // var a = document.createElement("a"), url = URL.createObjectURL(blob);
  //     //   a.href = url;
  //     //   a.download = 'asd.png';
  //     // document.body.appendChild(a);
  //     // a.click();
  //   })
  // api.get('/api/rail-survey/943b777b-7866-4aa7-aedf-13cf22204bab', null).then((res) => {
  //   res.json().then((json) => {
  //     console.log(json);
  //     var uri = URL.createObjectURL(json.blob);
  //     var img = new Image();
  //     img.src = uri;
  //     document.body.appendChild(img);
  //     // const myFile = new File([json.blob], 'image.png', {
  //     //     type: json.blob.type,
  //     // });
  //     // console.log(myFile);
  //     // var blob = new Blob([json.blob.data], {type: json.blob.type});
  //     // console.log(blob);
  //     // console.log(readAsArrayBuffer(json.blob))
  //     // const url = URL.createObjectURL(new Blob([data], {type: type}));
  //     // console.log(JSON.stringify(json));
  //     // var blob = new Blob([json.blob.data], {type: json.blob.type});
  //     // console.log(blob);
  //     // var link = document.createElement('a');
  //     // link.href = window.URL.createObjectURL(blob);
  //     // var fileName = 'asd.png';
  //     // link.download = fileName;
  //     // link.click()
  //   })
  // })
}

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
  // Object.assign(railSurvey, { zone: value })
  // console.log(value)
  const zones = variable.zone.map((z) => z.value)
  let be = null
  let af = null
  if (!!zones[zones.indexOf(value) - 1] && !!zones[zones.indexOf(value) + 1]) {
    // railSurvey.nearby = [zones[zones.indexOf(value) - 1], zones[zones.indexOf(value) + 1]]
    be = zones[zones.indexOf(value) - 1]
    af = zones[zones.indexOf(value) + 1]
  } else {
    if (!zones[zones.indexOf(value) - 1]) {
      // railSurvey.nearby = [value, zones[zones.indexOf(value) + 1]]
      be = value
      af = zones[zones.indexOf(value) + 1]
    }
    if (!zones[zones.indexOf(value) + 1]) {
      // railSurvey.nearby = [zones[zones.indexOf(value) - 1], value]
      be = zones[zones.indexOf(value) - 1]
      af = value
    }
    railSurvey.nearby.stationBefore = be
    railSurvey.nearby.stationAfter = af
  }
}

const handleUploadImage = (event) => {
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
    <button @click="convertImage">convertImage</button>
    <!-- {{ store.state }} -->
    <!-- <button @click="store.commit('increment')">+</button>
    <button @click="store.commit('toggleDarkMode')">Toggle</button>
    <DarkModeToggle></DarkModeToggle> -->
    <div class="flex flex-col gap-4">
      <Border>
        <div class="flex md:flex-row flex-col gap-4">
          <div class="flex-1">
            <label class="_label-sm">วันที่สำรวจ</label>
            <input v-model="railSurvey.date" type="date" id="date" :class="v$.date.$error ? '_input_error' : '_input'" required>
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
              <input v-if="railSurvey.zone" v-for="(value, key) in railSurvey.nearby" :key="key" :value="value" disabled type="text" id="nearBy" class="_input">
              <input v-else v-for="(nb, index_) in 2" :key="index_" :value="null" disabled type="text" id="nearBy" :class="v$.zone.$error ? '_input_error' : '_input'">
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
      <Border>
        <div class="flex flex-col gap-4">
          <div>
            <label class="_label-lg">ตำแหน่งความเสียหายบนราง</label>
            <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
              <RadioBtn v-model="railSurvey.defectSituation.railPositionDefect" name="areaCondition" :items="variable.positionDamage.topRail"></RadioBtn>
            </div>
          </div>
          <div>
            <label class="_label-lg">บริเวณความเสียหาย</label>
            <RadioImageBtn v-model="railSurvey.defectSituation.railAreaDefect" name="areaDamage" :items="variable.positionDamage.damageArea" imageLabel="title" imagePath="img"></RadioImageBtn>
          </div>
        </div>
      </Border>
      <Border>
        <label class="_label-lg">ลักณะความเสียหายที่เกิดขึ้น</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.defectPattern" name="positionDamage" :items="variable.damageProperties"></RadioBtn>
        </div>
      </Border>
      <Border v-if="railSurvey.defectPattern?.includes('surfaceDefect')" :error="v$.surfaceDefect.$error">
        <label class="_label-lg">ให้ระบุลักษณะแผล โดยดูรูปต่อไปนี้ประกอบ</label>
        <RadioImageBtn v-model="railSurvey.surfaceDefect" name="scar" :items="variable.scar" imageLabel="title" imagePath="img"></RadioImageBtn>
      </Border>
      <label class="_label-lg">สำรวจความเสียหายของทาง</label>
      <Border>
        <label class="_label-lg">ความสมบูรณ์ของทาง</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.railCondition" name="railCondition" :items="variable.integrity"></RadioBtn>
        </div>
      </Border>
      <Border>
        <div class="flex flex-col gap-4">
          <div>
            <label class="_label-lg">Track Geometry</label>
            <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
              <RadioBtn v-model="railSurvey.trackGeometryCondition" name="trackGeometryCondition" :items="variable.integrity"></RadioBtn>
            </div>
          </div>
          <div v-if="railSurvey.trackGeometryCondition === 'imperfect'">
            <label class="_label-lg">รูปแบบ Track Geometry ที่ผิดปกติ</label>
            <RadioImageBtn v-model="railSurvey.defectTrackGeometry" name="defectTrackGeometry" :items="variable.trackGeometry" imageLabel="title" imagePath="img"></RadioImageBtn>
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
            <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" @click="handleUploadImages()">Upload</button>
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
      <Border>
        <label class="_label-lg">ประวัติการซ่อมบำรุง</label>
        <div class="flex flex-col gap-4">
          <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
            <RadioBtn v-model="railSurvey.hasMaintenanceRecord" name="hasMaintenanceRecord" :items="variable.maintenanceRecord"></RadioBtn>
          </div>
          <div v-if="railSurvey.hasMaintenanceRecord" class="flex flex-col gap-4">
            <div class="flex md:flex-row flex-col gap-4">
              <div class="flex-1">
                <label class="_label-sm">การซ่อมบำรุงครั้งล่าสุด</label>
                <input v-model="railSurvey.lastMaintenanceDate" type="date" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required>
                <p v-if="v$.lastMaintenanceDate.$error" class="text-sm text-red-600">{{ v$.lastMaintenanceDate.$errors[0].$message }}</p>
              </div>
              <div class="flex-1">
                <label class="_label-sm">ความถี่ในการซ่อมบำรุงในรอบปี</label>
                <input v-model="railSurvey.yearlyMaintenanceTimes" type="number" :min="0" :max="365" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
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
      <div class="flex justify-end mt-8">
        <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" @click="handleSubmit()">Submit</button>
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