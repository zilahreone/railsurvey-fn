<script setup>
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { font } from '@/assets/fonts/font'
import Modal from './Modal.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import moment from 'moment'
import variable from '@/variable.json'

const props = defineProps({
  surveyPreview: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['update:modelValue'])
// let surveyForm = reactive()
// const isReady = ref(false)
const surveyForm = props.surveyPreview
const bgs = ['bg-green-400', 'bg-yellow-400', 'bg-orange-600', 'bg-red-800', 'bg-black']
onMounted(async() => {
  // console.log(props.surveyPreview);
  // const calSur = await calSurveyForm()
  // surveyForm = calSur
  // isReady.value = true
  // sf.value = calSur
})
</script>
<template>
  <div id="testtest" class="px-10 py-0">
    <div class="border-b-4 border-blue-900 flex flex-row justify-between items-end">
      <div class="flex items-center gap-4 mb-1">
        <img class="object-contain h-10" :src="(require('@/assets/rmt-logo.png'))" alt="rmt-logo">
        <img class="object-contain h-20" :src="(require('@/assets/srt-title.jpg'))" alt="srt-title">
      </div>
      <p class="pb-2">วันที่รายงาน: {{ surveyForm.datetime }}</p>
    </div>
    <div class="pb-4 text-center text-lg font-semibold">
      บันทึกความเสียหายของ รางรถไฟ
    </div>
    <div class="border-[3px] border-blue-900 px-2 py-2 text-sm">
      <div class="underline underline-offset-2 font-bold mb-4">ข้อมูลการสำรวจเบื้องต้น</div>
      <table class="mb-4 w-full text-left">
        <tbody class="text-black">
          <tr class="">
            <td class="w-[15%]">วันที่สำรวจ:</td>
            <th class="w-[20%] border-b pl-4 pb-2">{{ surveyForm.generalSurvey.date }}</th>
            <td class="pl-8 w-[25%]">พิกัด GPS</td>
            <th class="border-b pl-4 pb-2">{{ surveyForm.generalSurvey.coordinates}}</th>
          </tr>
          <tr class="">
            <td>เขตการเดินรถ:</td>
            <th class="border-b pl-4 pb-2">{{ surveyForm.generalSurvey.area }}</th>
            <td class="pl-8">หลักกิโลเมตร:</td>
            <th class="border-b pl-4 pb-2">{{ surveyForm.generalSurvey.kilometers }}</th>
          </tr>
          <tr class="">
            <td>แขวง:</td>
            <th class="border-b pl-4 pb-2">{{ surveyForm.generalSurvey.zone }}</th>
            <td class="pl-8">เสาโทรเลข:</td>
            <td class="border-b pl-4 pb-2"><strong>{{ surveyForm.generalSurvey.telegram.telegramBefore }}</strong>&ensp; ระหว่าง &ensp;<strong>{{ surveyForm.generalSurvey.telegram.telegramAfter }}</strong></td>
          </tr>
          <tr class="">
            <td>สถานี:</td>
            <th class="border-b pl-4 pb-2">{{ surveyForm.generalSurvey.station }}</th>
            <td class="pl-8">เกรดของราง:</td>
            <th class="border-b pl-4 pb-2">{{ surveyForm.generalSurvey.railType.type }}</th>
          </tr>
          <tr class="">
            <td>สถานีรถไฟก่อนหน้า:</td>
            <th class="border-b pl-4 pb-2">{{ surveyForm.generalSurvey.zoneBe }}</th>
            <td class="pl-8">ขนาดของราง (ปอนด์/หลา):</td>
            <th class="border-b pl-4 pb-2">{{ surveyForm.generalSurvey.railType.weight }}</th>
          </tr>
          <tr class="">
            <td>สถานีรถไฟถัดไป:</td>
            <th class="border-b pl-4 pb-2">{{ surveyForm.generalSurvey.zoneAf }}</th>
            <td class="pl-8">ลักษณะพื้นที่ที่เกิดความเสียหาย:</td>
            <th class="pl-4 pb-2"><p class="decoration-gray-300 decoration-1 underline underline-offset-2">{{ surveyForm.generalSurvey.areaCondition }}</p></th>
            <!-- <th class="border-b pl-4 pb-2">{{ surveyForm.generalSurvey.areaCondition }}</th> -->
          </tr>
        </tbody>
      </table>
      <div class="border-[4px] border-blue-400 rounded-xl px-2 py-0">
        <div class="flex flex-row gap-2">
          <div class="w-[60%] flex flex-col gap-1 justify-between">
            <div class="underline underline-offset-4 font-bold pb-4">การสำรวจความเสียหายของราง</div>
            <div class="pt-8">
              <p class="pb-4">รูปภาพความเสียหายของราง</p>
              <div class="flex gap-1 self-end">
                <template v-for="index in 3">
                  <img v-if="surveyForm.railDamageSurvey.uploadImages[index - 1]" class="object-contain h-32 border border-black" :src="(surveyForm.railDamageSurvey.uploadImages[index - 1])" :alt="index">
                  <div v-else class="border-2 border-black h-32 w-44 text-center pt-10">ภาพที่ {{ index }}</div>
                </template>
              </div>
            </div>
          </div>
          <div class="w-[40%] border-2 border-black mt-2">
            <div class="flex">
              <div>
                <img v-if="surveyForm.railDamageSurvey.plan" :src="surveyForm.railDamageSurvey.plan" class="object-contain" alt="" :style="{backgroundImage: `url(${require('@/assets/rail/rail_1.jpg')})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center top'
                }">
                <img v-else :src="surveyForm.railImgs[0]" class="object-contain" alt="">
                <img v-if="surveyForm.railDamageSurvey.elevation" :src="surveyForm.railDamageSurvey.elevation" class="object-contain" alt="" :style="{backgroundImage: `url(${require('@/assets/rail/rail_2.jpg')})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center top'
                }">
                <img v-else :src="surveyForm.railImgs[1]" class="object-contain" alt="">
              </div>
              <div>
                <img v-if="surveyForm.railDamageSurvey.section" :src="surveyForm.railDamageSurvey.section" class="object-contain" alt="" :style="{backgroundImage: `url(${require('@/assets/rail/rail_3.jpg')})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center top'
                }">
                <img v-else :src="surveyForm.railImgs[2]" class="object-contain" alt="">
              </div>
            </div>
          </div>
        </div>
        <table class="mb-4 w-full text-left">
        <tbody class="text-black">
          <tr class="h-8">
            <td class="w-[25%]">ความเสียหายของราง:</td>
            <th class="pl-4"><p class="decoration-gray-300 underline underline-offset-2">{{ surveyForm.railDamageSurvey.situation }}</p></th>
            <!-- <th class="border-b pl-4 pb-2">{{ surveyForm.railDamageSurvey.situation }}</th> -->
          </tr>
          <tr class="h-8">
            <td class="">ตำแหน่งที่เกิดความเสียหายของราง:</td>
            <th class="border-b pl-4 pb-2">{{ surveyForm.railDamageSurvey.location }}</th>
          </tr>
          <tr class="h-8">
            <td class="">ลักณะความเสียหายที่เกิดขึ้น:</td>
            <th class="border-b pl-4 pb-2">{{ surveyForm.railDamageSurvey.defectPattern }}</th>
          </tr>
          <tr class="h-8">
            <td class="">รูปแบบ Surface Defect:</td>
            <th class="border-b pl-4 pb-2 text-blue-400">{{ surveyForm.railDamageSurvey.surfaceDefectPattern }}</th>
          </tr>
        </tbody>
      </table>
      </div>
      <div class="flex gap-4">
        <div class="w-[60%]">
          <div class="underline underline-offset-2 font-bold pb-4 pt-0">การสำรวจความเสียหายของทาง</div>
          <table class="mb-4 w-full text-left">
            <tbody class="text-black">
              <tr class="">
                <td class="w-[28%]">มิติทางเรขาคณิต:</td>
                <th class="w-[18%] pl-4">{{ surveyForm.trackDamageSurvey.trackGeometryCondition.isPerfect }}</th>
                <th class="pl-4 pb-2"><p class="decoration-gray-300 underline underline-offset-4">{{ surveyForm.trackDamageSurvey.trackGeometryCondition.condition }}</p></th>
              </tr>
              <tr class="">
                <td class="">สภาพหินโรยทาง:</td>
                <th class="pl-4">{{ surveyForm.trackDamageSurvey.ballastCondition.isPerfect }}</th>
                <th class="pl-4 pb-2"><p class="decoration-gray-300 underline underline-offset-4">{{ surveyForm.trackDamageSurvey.ballastCondition.condition }}</p></th>
                <!-- <th class="border-b pl-4">{{ surveyForm.trackDamageSurvey.ballastCondition.condition }}</th> -->
              </tr>
              <tr class="">
                <td class="">วาระการอัดหินโรยทาง:</td>
                <th class="border-b pl-4 pb-2" colspan="2">{{ surveyForm.trackDamageSurvey.ballastCompaction }}</th>
              </tr>
              <tr class="">
                <td class="">ชนิดของหมอนรองทาง:</td>
                <th class="border-b pl-4 pb-2" colspan="2">{{ surveyForm.trackDamageSurvey.sleeperType }}</th>
              </tr>
              <tr class="">
                <td class="">สภาพหมอนรองทาง:</td>
                <th class="pl-4">{{ surveyForm.trackDamageSurvey.sleeperCondition.isPerfect }}</th>
                <th class="pl-4 pb-2"><p class="decoration-gray-300 underline underline-offset-4">{{ surveyForm.trackDamageSurvey.sleeperCondition.condition }}</p></th>
                <!-- <th class="border-b pl-4">{{ surveyForm.trackDamageSurvey.sleeperCondition.condition }}</th> -->
              </tr>
              <tr class="">
                <td class="">คันทาง:</td>
                <th class="border-b pl-4 pb-2" colspan="2">{{ surveyForm.trackDamageSurvey.trackFoundationCondition }}</th>
              </tr>
            </tbody>
          </table>
          <p class="pb-4">รูปภาพความเสียหายของทาง</p>
          <div class="flex gap-1">
            <template v-for="index in 3">
              <img v-if="surveyForm.trackDamageSurvey.uploadImages[index - 1]" class="object-contain h-32 border border-black" :src="(surveyForm.trackDamageSurvey.uploadImages[index - 1])" :alt="index">
              <div v-else class="border-2 border-black h-32 w-44 text-center pt-10">ภาพที่ {{ index }}</div>
            </template>
          </div>
        </div>
        <div class="w-[40%]">
          <div>
            <div class="underline underline-offset-2 font-bold pb-4 pt-0">การซ่อมบำรุง</div>
            <div>
              <ul class="pl-4 list-disc list-outside">
                <div class="w-full flex">
                  <li>ประวัติการซ่อมบำรุง</li>
                  <div class="inline-flex items-start pl-4 grow border-b-2 pb-2 border-black">
                    <strong>
                      {{ surveyForm.maintenanceRate.maintenanceRecord.hasMaintenanceRecord }}
                    </strong>
                  </div>
                </div>
                <div class="w-full flex">
                  <div>การซ่อมบำรุงครั้งล่าสุด</div>
                  <div class="inline-flex items-start pl-4 grow border-b-2 pb-2 border-black">
                    <strong>
                      {{ surveyForm.maintenanceRate.maintenanceRecord.lastMaintenanceTimes }}
                    </strong>
                  </div>
                </div>
                <div class="w-full flex">
                  <div>ความถี่ในการซ่อมบำรุง</div>
                  <div class="inline-flex items-start pl-4 grow border-b-2 pb-2 border-black">
                    <strong>
                      {{ surveyForm.maintenanceRate.maintenanceRecord.yearlyMaintenanceTimes }}
                    </strong>
                  </div>
                </div>
              </ul>
            </div>
          </div>
          <div>
            <div class="underline underline-offset-2 font-bold pb-2">การประเมินความเสียหาย</div>
            <div>
              <ul class="pl-4 list-disc list-outside">
                <li>ความรุนแรงของความเสียหาย<strong class="pl-1 underline underline-offset-2">{{ surveyForm.maintenanceRate.severity }}</strong></li>
                <!-- <li>ความรุนแรงของความเสียหาย <div class="underline underline-offset-2 font-bold">{{ surveyForm.maintenanceRate.severity }}</div></li> -->
              </ul>
            </div>
            <table class="border-collapse border w-full mt-4 mb-2 text-center">
              <tbody>
                <tr class=""><td v-for="index in 5" :class="`pb-4 border border-black ${surveyForm.maintenanceRate.severity.includes(index) ?  `${bgs[index-1]} text-white`: ''}` ">ระดับ {{ index }}</td></tr>
              </tbody>
            </table>
            <div>
              <ul class="pl-4 list-disc list-outside">
                <li>ควรส่งห้องปฏิบัติการเพื่อทำการวิเคราะห์สาเหตุของความเสียหาย<strong class="pl-1 underline underline-offset-2">{{ surveyForm.maintenanceRate.isAnalyzeDamage }}</strong></li>
              </ul>
            </div>
            <div class="my-4 mb-2">ข้อคิดเห็น/คำแนะนำ/หมายเหตุ</div>
            <textarea disabled class="w-full h-20" name="" :value="surveyForm.maintenanceRate.comment" id="comment-m"></textarea>
            <!-- <div class="h-16 border-2">
            </div> -->
            <div class="flex flex-col items-center pb-2">
              <div class="border border-black w-44">
                <img :src="surveyForm.signature" alt="signature">
              </div>
              <label>{{ surveyForm.createdByName }}</label>
              <label>(ผู้สำรวจและบันทึกความเสียหาย)</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-1">
      <img class="object-contain h-10" :src="(require('@/assets/logo-nstda.png'))" alt="nstda-logo">
      <img class="object-contain h-10" :src="(require('@/assets/logo-mtec.png'))" alt="mtec-logo">
      <img class="object-contain h-10" :src="(require('@/assets/logo-nectec.png'))" alt="nectec-logo">
    </div>
  </div>
</template>