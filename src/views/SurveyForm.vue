<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import BorderRadioBtn from '@/components/BorderRadioBtn.vue'
import Border from '@/components/Border.vue'
import RadioBtnRow from '@/components/RadioBtnRow.vue'
import RadioBtn from '@/components/RadioBtn.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import RadioImageBtn from '@/components/RadioImageBtn.vue'

onMounted(() => {
  navigator.geolocation.getCurrentPosition((position)=> {
      const p = position.coords;
      console.log(p.latitude, p.longitude);
  })
})

const store = useStore()
const damagesLevel = [
  'ระดับที่ 1 ไม่รุนแรงและรอซ่อมบำรุงในวาระ',
  'ระดับที่ 2 ควรเร่งซ่อม',
  'ระดับที่ 3 รุนแรงและควรซ่อมอย่างเร่งด่วน',
  'ระดับที่ 4 รุนแรงและเกิดความเสียหายต่อทรัพย์สิน/เกิดผลกระทบต่อสิ่งแวดล้อม',
  'ระดับที่ 5 รุนแรงและเกิดความเสียหายต่อทรัพย์สิน/เกิดผลกระทบต่อสิ่งแวดล้อมเป็นวงกว้าง'
]
const damageProperties = [ 'แตกหัก', 'แตกร้าว', 'สึกหรอ', 'รางคดงอ', 'เกิดสนิม/กัดกร่อน', 'เป็นแผล/เสียรูป เสียเนื้อโลหะ/เพียงบางส่วน' ]
const damageAraePrperties = [
  'พื้นที่ลาดชัน',
  'พื้นที่รัสมีโค้ง',
  'ใกล้สถานีรถไฟ',
  'บริเวณอุโมงค์',
  'สะพาน',
  'มีน้ำท่วมขัง'
]
const integrity = ['สมบูรณ์', 'ไม่สมบูรณ์']
const ballast = ['สมบูรณ์', 'ไม่สมบูรณ์', 'พร่อง', 'มีลักษณะกลม']
const sleeper = ['สมบูรณ์', 'ไม่สมบูรณ์', 'ทรุดตัว', 'แตกหัก', 'ให้ตัวได้', 'ประกับยึดรางหลวม']
const analyse = ['เห็นควรดำเนินการ', 'ไม่จำเป็นต้องส่งวิเคราะห์']
const positionDamage = [
  {
    title: 'รอยต่อราง (Fish Plate)',
    img: 'positionDamage/Picture2.png'
  },
  {
    title: 'แนวเชื่อมต่อราง',
    img: 'positionDamage/Picture3.png'
  },
  {
    title: 'รางปกติ',
    img: 'positionDamage/Picture4.png'
  },
  {
    title: 'รอยเชื่อมซ่อม',
    img: 'positionDamage/Picture5.png'
  },
  {
    title: 'ประแจ',
    img: 'positionDamage/Picture6.png'
  },
  {
    title: 'จุดตัดราง',
    img: 'positionDamage/Picture7.png'
  }
]
const scar = [
  {
    title: 'Crushed Head',
    img: 'scar/Picture1.png'
  },
  {
    title: 'Head Checking',
    img: 'scar/Picture2.png'
  },
  {
    title: 'Spalling',
    img: 'scar/Picture3.png'
  },
  {
    title: 'Side Wear',
    img: 'scar/Picture4.png'
  },
  {
    title: 'Shelling',
    img: 'scar/Picture5.png'
  },
  {
    title: 'Burned Rail',
    img: 'scar/Picture6.png'
  },
]
const trackGeometry = [
  {
    title: 'Alignment',
    img: 'trackGeometry/Picture1.png'
  },
  {
    title: 'Track Guage',
    img: 'trackGeometry/Picture2.png'
  },
  {
    title: 'Longitudinal Level',
    img: 'trackGeometry/Picture3.png'
  },
  {
    title: 'Super Elevation',
    img: 'trackGeometry/Picture4.png'
  },
  {
    title: 'Twist',
    img: 'trackGeometry/Picture5.png'
  }
]
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
</script>
<template>
  <div class="container">
    {{ store.state }}
    <button @click="store.commit('increment')">+</button>
    <button @click="store.commit('toggleDarkMode')">Toggle</button>
    <DarkModeToggle></DarkModeToggle>
    <div class="flex flex-col gap-4">
      <!-- วันที่สำรวจ -->
      <Border>
        <div class="flex md:flex-row flex-col gap-4">
          <div class="flex-1">
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">วันที่สำรวจ</label>
            <input type="date" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required>
          </div>
          <div class="flex-1">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เขตการเดินรถ</label>
            <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option>United States</option>
              <option>Canada</option>
              <option>France</option>
              <option>Germany</option>
            </select>
          </div>
        </div>
      </Border>
      <!-- พื้นที่เกิดความเสียหาย -->
      <Border>
        <label class="block mb-2 text-lg font-semibold text-gray-900 dark:text-white">พื้นที่เกิดความเสียหาย</label>
        <div class="flex flex-col gap-4">
          <div class="flex md:flex-row flex-col gap-4">
            <div class="flex-1">
              <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">พิกัด GPS</label>
              <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required>
            </div>
            <div class="flex-1">
              <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">หลักกิโลเมตร/เสาโทรเลข</label>
              <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required>
            </div>
          </div>
          <div class="flex flex-col">
            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">สถานีรถไฟใกล้เคียง</label>
            <div class="flex md:flex-row flex-col gap-4">
              <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option>United States</option>
                <option>Canada</option>
                <option>France</option>
                <option>Germany</option>
              </select>
              <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option>United States</option>
                <option>Canada</option>
                <option>France</option>
                <option>Germany</option>
              </select>
            </div>
          </div>
          <div class="flex flex-col">
            <label class="block mb-2 text-lg font-semibold text-gray-900 dark:text-white">ชนิดของราง</label>
            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">มาตรฐานและเกรด</label>
            <div class="max-w-md">
              <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option>United States</option>
                <option>Canada</option>
                <option>France</option>
                <option>Germany</option>
              </select>
            </div>
          </div>
        </div>
      </Border>
      <Border>
        <label class="block mb-4 text-lg font-semibold text-gray-900 dark:text-white">ความรุนแรงของความเสียหาย</label>
        <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn name="positionDamage" :items="damagesLevel"></RadioBtn>
        </div>
      </Border>
      <Border>
        <p class="text-lg font-semibold mb-4">ตำแหน่งที่เกิดความเสียหายของราง</p>
        <div class="flex flex-wrap gap-8">
          <div class="flex items-center">
            <img src="@/assets/positionDamage/Picture1.png" alt="positionDamage" class="h-40">
          </div>
          <div class="ml-12">
            <div>
              <input id="rail" type="radio" value="" name="rail" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <label for="rail" class="ml-4 text-sm font-medium text-gray-900 dark:text-gray-300">หัวราง</label>
            </div>
            <div>
              <input id="rail" type="radio" value="" name="rail" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <label for="rail" class="ml-4 text-sm font-medium text-gray-900 dark:text-gray-300">หัวราง</label>
            </div>
            <div>
              <input id="rail" type="radio" value="" name="rail" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <label for="rail" class="ml-4 text-sm font-medium text-gray-900 dark:text-gray-300">หัวราง</label>
            </div>
          </div>
          <RadioImageBtn name="positionDamage" :items="positionDamage" imageLabel="title" imagePath="img"></RadioImageBtn>
          <!-- <RadioBtnRow labelTitle="title" labelImage="img" :items="positionDamage"></RadioBtnRow> -->
        </div>
      </Border>
      <Border>
        <label class="block mb-4 text-lg font-semibold text-gray-900 dark:text-white">ลักษณะความเสียหาย</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn name="positionDamage" :items="damageProperties"></RadioBtn>
        </div>
      </Border>
      <Border>
        <label class="block mb-4 text-lg font-semibold text-gray-900 dark:text-white">ให้ระบุลักษณะแผล โดยดูรูปต่อไปนี้ประกอบ</label>
        <RadioImageBtn name="scar" :items="scar" imageLabel="title" imagePath="img"></RadioImageBtn>
      </Border>
      <!-- <BorderRadioBtn title="ประวัติการซ่อมบำรุง" :items="['เคย', 'ไม่เคย']"></BorderRadioBtn> -->
      <Border>
        <label for="message" class="block mb-4 text-lg font-semibold text-gray-900 dark:text-white">ลักษณะพื้นที่ที่เกิดความเสียหาย</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn name="damageAraePrperties" :items="damageAraePrperties"></RadioBtn>
        </div>
      </Border>
      <Border>
        <div class="flex flex-col gap-4">
          <label for="message" class="block text-lg font-semibold text-gray-900 dark:text-white">ความสมบูรณ์ของทาง</label>
          <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
            <RadioBtn name="pt" :items="integrity"></RadioBtn>
          </div>
          <label for="message" class="block text-lg font-semibold text-gray-900 dark:text-white">Track Geometry</label>
          <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
            <RadioBtn name="tg" :items="integrity"></RadioBtn>
          </div>
        </div>
      </Border>
      <Border>
        <label for="message" class="block mb-4 text-lg font-semibold text-gray-900 dark:text-white">รูปแบบ Track Geometry ที่ผิดปกติ</label>
        <RadioImageBtn name="abtg" :items="trackGeometry" imageLabel="title" imagePath="img"></RadioImageBtn>
      </Border>
      <Border>
        <label for="message" class="block mb-4 text-lg font-semibold text-gray-900 dark:text-white">หินโรยทาง (Ballast)</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn name="ballast" :items="ballast"></RadioBtn>
        </div>
      </Border>
      <Border>
        <label for="message" class="block mb-4 text-lg font-semibold text-gray-900 dark:text-white">หมอนรองทาง (Sleeper)</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn name="sleeper" :items="sleeper"></RadioBtn>
        </div>
      </Border>
      <Border>
        <label for="message" class="block mb-4 text-lg font-semibold text-gray-900 dark:text-white">คันทาง</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn name="track" :items="integrity"></RadioBtn>
        </div>
      </Border>
      <Border>
        <label class="block mb-4 text-lg font-semibold text-gray-900 dark:text-white">ประวัติการซ่อมบำรุง</label>
        <div class="flex flex-col gap-4">
          <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
            <RadioBtn name="his" :items="['เคย', 'ไม่เคย']"></RadioBtn>
          </div>
          <div class="flex md:flex-row flex-col gap-4">
            <div class="flex-1">
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">การซ่อมบำรุงครั้งล่าสุด</label>
              <input type="date" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required>
            </div>
            <div class="flex-1">
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ความถี่ในการซ่อมบำรุงในรอบปี</label>
              <input type="number" :min="0" :max="365" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
            </div>
          </div>
          <label class="block text-lg font-semibold text-gray-900 dark:text-white">วิธีซ่อมบำรุง</label>
          <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
            <RadioBtn name="ma" :items="['เชื่อมซ่อม', 'ตัดเปลี่ยนราง']"></RadioBtn>
          </div>
        </div>
      </Border>
      <Border>
        <label for="message" class="block mb-4 text-lg font-semibold text-gray-900 dark:text-white">ควรส่งห้องปฏิบัติการเพื่อทำการวิเคราะห์สาเหตุของความเสียหาย</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn name="positionDamage" :items="analyse"></RadioBtn>
        </div>
      </Border>
      <Border>
        <label for="message" class="block mb-4 text-lg font-semibold text-gray-900 dark:text-white">ความคิดเห็นของผู้สำรวจความเสียหาย</label>
        <textarea id="message" rows="4" class="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
      </Border>
      <div class="flex justify-end">
        <div class="w-1/2">
          <Border>
            <div class="h-20">
              <VueSignaturePad ref="signaturePad" />
            </div>
            <label for="message" class="pt-2 flex flex-col items-center text-sm font-medium text-gray-900 dark:text-white">ผู้สำรวจและบันทึกความเสียหาย</label>
          </Border>
        </div>
      </div>
      <div>
        <button @click="save">Save</button>
        <button @click="undo">Undo</button>
        <button @click="clear">Clear</button>
      </div>
    </div>
  </div>
</template>