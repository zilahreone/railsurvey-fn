<script setup>
import Table from '@/components/Table.vue'
import variable from '@/variable.json'
import base64Images from '@/assets/base64Images.json'
// import store from '@/store'
import { useStore } from 'vuex'
import { onMounted, ref, computed, reactive, watch } from 'vue'
import api from '@/services'
import moment from 'moment'
import tz from 'moment-timezone'
import TailTable from '@/components/TailTable.vue'
import HtmlPdf from '@/views/HtmlPdf.vue'
import { useToast } from 'vue-toastification'
import pdfMake from 'pdfmake'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { font } from '@/assets/fonts/font'
import PDFPreview from '@/components/PDFPreview.vue'
import Modal from '@/components/Modal.vue'
import { Parser } from '@json2csv/plainjs'

const toast = useToast()
const store = useStore()

const surveyList = ref([])
// const indexedDBList = ref([])
const count = ref(0)
const perPage = ref(20)
const page = ref(1)

const isReady = ref(false)
const modalActive = ref(false)
const isWaitPdf = ref(false)

const pdfForm = ref()

onMounted(() => {
  getCount()
  getOfflineForm()
  getSurveyList2()
  if (navigator.onLine) {
    // handleDeleteOldCache()
  } else {
    // console.log('offline');
  }
})
const getSurveyList2 = (p) => {
  if (p) page.value = p
  api.get(`/api/rail-survey/?offset=${(perPage.value * page.value) - perPage.value}`, null).then((resp) => {
    if (resp.status === 200) {
      resp.json().then((json) => {
        surveyList.value = json
      })
    }
  }).catch((err) => {
    if (navigator.onLine) {
      toast.error('เกิดความผิดพลาดกับระบบ')
    } else {
      toast.warning('ระบบอยู่ในสถานะออฟไลน์')
    }
  })
  // store.state.token
}
// const generateId = (length = 8) => {
//   let result = ''
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
//   const charactersLength = characters.length
//   let counter = 0
//   while (counter < length) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength))
//     counter += 1
//   }
//   return result
// }
// const handleDeleteOldCache = () => {
//   caches.keys().then((cacheNames) => {
//     cacheNames.forEach(cacheName => {
//       // console.log(`cache name: ${cacheName}`);
//       if (cacheName === 'rail-cache') {
//         caches.open(cacheName).then((cache) => {
//           // cache.delete(`${process.env.VUE_APP_BACK_END_URL}/api/rail-survey/${id}`).then((response) => {
//           // })
//         })
//       }
//     })
//   })
// }
const getOfflineForm = () => {
  const dbName = 'workbox-background-sync'
  const dbVersion = 3
  const storeName = 'requests'
  let items = []
  const responseOptions = { status: 200, statusText: 'OK', headers: { 'content-type': 'application/json' } }
  if (!window.indexedDB) {
    console.warn(`Your browser doesn't support IndexedDB`)
  } else {
    indexedDB.databases().then(dbs => {
      dbs.forEach(db => {
        if (db.name === dbName) {
          const dbOpen = indexedDB.open(dbName, dbVersion)
          dbOpen.onsuccess = (event) => {
            const db = event.target.result
            const getAll = db.transaction(storeName).objectStore(storeName).getAll();
            getAll.onsuccess = () => {
              const result = getAll.result;
              result?.forEach((request, index) => {
                // let fomdata = new FormData(request.requestData?.body)
                // console.log(fomdata);
                const regex = /^\{.*\}$/gm
                const body = request.requestData?.body
                if (body) {
                  if (('TextDecoder' in window)) {
                    const enc = new TextDecoder('utf-8')
                    // console.log(enc.decode(body));
                    let parse = JSON.parse(enc.decode(body).match(regex)[0])
                    let clone = JSON.parse(JSON.stringify(parse))
                    // console.log(parse);
                    Object.keys(parse).forEach(key => {
                      if (key === 'createdBy') {
                        clone[key] = { id: parse.createdBy, username: `offline-cache` }
                      }
                    })
                    items.push(clone)
                  }
                }
              })
              caches.keys().then((cacheNames) => {
                cacheNames.forEach(cacheName => {
                  // console.log(`cache name: ${cacheName}`);
                  if (cacheName === 'rail-cache') {
                    caches.open(cacheName).then((cache) => {
                      // console.log(`items: ${items}`);
                      items.forEach((item, index) => {
                        if (item.id) {
                          cache.put(`${process.env.VUE_APP_BACK_END_URL}/api/rail-survey/${item.id}`, new Response(JSON.stringify(item), responseOptions))
                        } else {
                          const genId = `offline-${index + 1}`
                          fetch(`${process.env.VUE_APP_BACK_END_URL}/api/rail-survey/?offset=0`).then(response => {
                            response.json().then(json => {
                              const form = { id: genId, ...item }
                              let fetchCache = json.filter(item => !item.id.includes('offline'))
                              // console.log(json)
                              cache.put(`${process.env.VUE_APP_BACK_END_URL}/api/rail-survey/${genId}`, new Response(JSON.stringify(form), responseOptions))
                              cache.put(`${process.env.VUE_APP_BACK_END_URL}/api/rail-survey/?offset=0`, new Response(JSON.stringify([form, ...fetchCache]), responseOptions))
                              cache.put(`${process.env.VUE_APP_BACK_END_URL}/api/rail-survey/count`, new Response(fetchCache.length + 1, responseOptions))
                              getSurveyList2()
                            })
                          })
                        }
                      })
                    })
                  }
                })
              })
            }
            getAll.onerror = (err) => {
              console.error(`Error to get all ${err}`)
            }
          }
        }
      })
    })
  }
}
const getCount = () => {
  api.get('/api/rail-survey/count', null).then((resp) => {
    if (resp.status === 200) {
      resp.json().then((json) => {
        count.value = json
      })
    }
  }).catch((err) => {
  })
}
const getSurveyList = () => {
  // IndexDB.getAllContacts('railway-survey', 1, function (items) {
  //   console.log(items);
  //   list.value = items
  // })
  Promise.resolve()
    .then(() => IndexDB.getAllContacts2('railway-survey', 1))
    .then((arr) => {
      list.value = arr;
    })
    .catch((err) => console.error(err))
}
const handleClickDelete = (index, id) => {
  hadleDelete(id)
}
const hadleDelete = (id) => {
  api.delete(`/api/rail-survey/${id}`, store.state.token).then((resp) => {
    if (resp.status === 200) {
      // resp.json().then((json) => {
      //   surveyList.value = json
      // })
      getCount()
      getSurveyList2()
    }
  }).catch((err) => {
  })
}
const toDataURL = async (url) => {
  // console.log(url);
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  })
}
const compRailSurveyForm = (sl) => {
  const dateTimeFormat = (datetime) => {
    const date = datetime.split(/\s/)[0].split('-')
    const mounth = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
    let dt = `${date[0]} ${mounth[parseInt(date[1]) - 1]} ${parseInt(date[2]) + 543}`
    if (datetime.split(/\s/)[1]) {
      dt = `${dt} ${datetime.split(/\s/)[1]} น.`
    }
    return dt
  }
  const serForm = {
    id: sl.id,
    datetime: dateTimeFormat(moment.utc(new Date()).local().format('DD-MM-YYYY')),
    railImgs: ['rail/rail_1.png', 'rail/rail_2.jpg', 'rail/rail_3.jpg'],
    generalSurvey: {
      coordinates: {
        latitude: sl.generalSurvey.coordinates.latitude,
        longitude: sl.generalSurvey.coordinates.longitude,
      },
      coordinates: sl.generalSurvey.coordinates.latitude && sl.generalSurvey.coordinates.longitude ? `${sl.generalSurvey.coordinates.latitude}, ${sl.generalSurvey.coordinates.longitude}` : '-',
      telegram: {
        telegramBefore: sl.generalSurvey.telegram.telegramBefore,
        telegramAfter: sl.generalSurvey.telegram.telegramAfter,
      },
      railType: {
        type: variable.guageType.filter(gt => gt.value === sl.generalSurvey.railType.type)[0]?.key,
        weight: sl.generalSurvey.railType.weight
      },
      area: variable.areas.filter(area => area.value === sl.generalSurvey.area)[0]?.key,
      zone: variable.areas.filter(area => area.value === sl.generalSurvey.area)[0]?.zones.filter(zone => zone.value === sl.generalSurvey.zone)[0]?.key,
      station: variable.areas.filter(area => area.value === sl.generalSurvey.area)[0]?.zones.filter(zone => zone.value === sl.generalSurvey.zone)[0]?.stations.filter(station => station.value === sl.generalSurvey.station)[0]?.key.split(/\s/)[0],
      date: dateTimeFormat(moment.utc(sl.generalSurvey.date).local().format('DD-MM-YYYY HH:mm:ss')),
      zoneBe: variable.zone.filter((z) => z.value === sl.generalSurvey.nearby.stationBefore)[0]?.key.split(/\s/)[0],
      zoneAf: variable.zone.filter((z) => z.value === sl.generalSurvey.nearby.stationAfter)[0]?.key.split(/\s/)[0],
      kilometers: sl.generalSurvey.kilometers ? sl.generalSurvey.kilometers : '-',
      areaCondition: sl.generalSurvey.areaCondition.map((ac, index) => variable.damageAreaPrperties.find(dap => dap.value === ac)?.key.split(/\s/)[0] || ac).join(', '),
    },
    railDamageSurvey: {
      uploadImages: sl.railDamageSurvey.uploadImages.map(img => `${process.env.VUE_APP_BACK_END_URL}/${process.env.VUE_APP_IMAGE_DIR}/${img}`),
      situation: sl.railDamageSurvey.situation.map(sit => variable.situation.find(v => v.value === sit)?.key.split(/\s/)[0] || sit).join(', '),
      location: sl.railDamageSurvey.location.map(loc => variable.location.find(v => v.value === loc)?.key.split(/\s/)[0]).join(', '),
      defectPattern: sl.railDamageSurvey.defectPattern.map(def => variable.defectPattern.find(v => v.value === def)?.key.split(/\s/)[0]).join(', '),
      surfaceDefectPattern: sl.railDamageSurvey.surfaceDefectPattern.map(sdef => variable.surfaceDefect.find(v => v.value === sdef)?.key).join(', '),
      plan: sl.railDamageSurvey.plan,
      elevation: sl.railDamageSurvey.elevation,
      section: sl.railDamageSurvey.section
    },
    trackDamageSurvey: {
      uploadImages: sl.trackDamageSurvey.uploadImages.map(img => `${process.env.VUE_APP_BACK_END_URL}/${process.env.VUE_APP_IMAGE_DIR}/${img}`),
      // trackGeometryCondition: sl.trackDamageSurvey.trackGeometryCondition.map(track => [...variable.integrity, ...variable.trackGeometry].find(v => v.value === track)?.key),
      trackGeometryCondition: sl.trackDamageSurvey.trackGeometryCondition.includes('perfect') ? { isPerfect: 'สมบูรณ์', condition: [].join(', ') } : { isPerfect: 'ไม่สมบูรณ์', condition: sl.trackDamageSurvey.trackGeometryCondition.map(track => variable.trackGeometry.find(v => v.value === track)?.key).join(', ')},
      // ballastCondition: sl.trackDamageSurvey.ballastCondition.map(bal => [...variable.ballast, ...variable.ballastCondition].find(v => v.value === bal)?.key.split(/\(/)[0].trim()),
      ballastCondition: sl.trackDamageSurvey.ballastCondition.includes('perfect') ? { isPerfect: 'สมบูรณ์', condition: [].join(', ') } : { isPerfect: 'ไม่สมบูรณ์', condition: sl.trackDamageSurvey.ballastCondition.map(bc => variable.ballastCondition.find(v => v.value === bc)?.key.split(/\(/)[0].trim()).join(', ')},
      ballastCompaction: variable.ballastCompaction.find(v => v.value === sl.trackDamageSurvey.ballastCompaction)?.key,
      // sleeperCondition: sl.trackDamageSurvey.sleeperCondition.map(sc => [...variable.sleeper, ...variable.sleeperCondition].find(v => v.value === sc)?.key.split(/\s/)[0]),
      sleeperCondition: sl.trackDamageSurvey.sleeperCondition.includes('defective') ? { isPerfect: 'ชำรุด', condition: sl.trackDamageSurvey.sleeperCondition.map(sc => variable.sleeperCondition.find(v => v.value === sc)?.key).join(', ')} : { isPerfect: variable.sleeper.find(v => v.value === sl.trackDamageSurvey.sleeperCondition[0])?.key, condition: [].join(', ') },
      sleeperType: variable.sleeperType.find(st => st.value === sl.trackDamageSurvey.sleeperType)?.key,
      trackFoundationCondition: variable.integrity.find(v => v.value === sl.trackDamageSurvey.trackFoundationCondition)?.key || sl.trackDamageSurvey.trackFoundationCondition
    },
    maintenanceRate: {
      severity: variable.damagesLevel.filter(damage => damage.value === sl.maintenanceRate.severity)[0].key,
      isAnalyzeDamage: variable.analyse.filter(an => an.value === sl.maintenanceRate.isAnalyzeDamage)[0].key,
      comment: sl.maintenanceRate.comment || ' ',
      maintenanceRecord: {
        hasMaintenanceRecord: variable.maintenanceRecord.filter(mr => mr.value === sl.maintenanceRate.maintenanceRecord.hasMaintenanceRecord)[0].key,
        lastMaintenanceTimes: sl.maintenanceRate.maintenanceRecord.lastMaintenanceTimes ? variable.lastMaintenance.filter(lm => lm.value === sl.maintenanceRate.maintenanceRecord.lastMaintenanceTimes)[0].key : '-',
        yearlyMaintenanceTimes: sl.maintenanceRate.maintenanceRecord.yearlyMaintenanceTimes ? variable.maintenanceTime.filter(mt => mt.value === sl.maintenanceRate.maintenanceRecord.yearlyMaintenanceTimes)[0].key : '-'
      }
    },
    signature: sl.signature,
    createdByName: sl.createdByName
  }
  return serForm
}
const calSurveyForm = (sl) => {
  let serForm = compRailSurveyForm(sl)
  return new Promise((resolve, reject) => {
    Promise.resolve()
      .then(() => serForm.railDamageSurvey.uploadImages.map((img) => toDataURL(`${img}`)))
      .then((promArr) => Promise.all(promArr))
      .then((uploadImages) => { serForm.railDamageSurvey.uploadImages = uploadImages })
      .then(() => serForm.trackDamageSurvey.uploadImages.map(img => toDataURL(`${img}`)))
      .then((promArr) => Promise.all(promArr))
      .then((uploadImages) => { serForm.trackDamageSurvey.uploadImages = uploadImages })
      .then(() => serForm.railImgs.map((img) => toDataURL(require(`@/assets/${img}`))))
      .then((promArr) => Promise.all(promArr))
      .then((image) => { serForm.railImgs = image })
      // .then(() => console.log(serveyForm))
      .then(() => resolve(serForm))
      .catch((err) => reject(err))
  })
}
const downloadPDF = () => {
  isWaitPdf.value = true
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true
  })
  const report = document.getElementById('testtest')
  const sWidth =  report.style.width
  const smaxWidth =  report.style.maxWidth
  const sminWidth =  report.style.minHeight
  const width = '1000px'
  report.style.width = width
  report.style.maxWidth = width
  report.style.minWidth = width
  report.style.display="block";
  // document.getElementById("header").style.backgroundColor = 'red';
  // const body = document.body
  // body.css({ "width": "1000px", "max-width": "1000px", "min-width": "1000px" });
  // report.css({ "width": "1000px", "max-width": "1000px", "min-width": "1000px", "display": "block" });
  // EQCSS.apply()
  
  
  // body.css({ "width": "100%", "max-width": "100%", "min-width": "100%" });
  // report.css({ "display": "none" });
  // EQCSS.apply();
  // doc.addFileToVFS('Sarabun-Thin.ttf', font);
  // doc.addFont('Sarabun-Thin.ttf', 'Sarabun', 'normal')
  // doc.setFont('Sarabun')
  // doc.text("Hello, World!", 100, 100);
  // doc.save("customFonts.pdf");
  // console.log('11111');
  const scale = 2
  html2canvas(document.getElementById('testtest'), { scale }).then((canvas) => {
    // report.style = style
    report.style.width = sWidth
    report.style.maxWidth = smaxWidth
    report.style.minWidth = sminWidth
    // console.log(canvas);
    const imgData = canvas.toDataURL('image/png')
    const ratio = doc.internal.pageSize.getWidth() / canvas.width
    const width = canvas.width * ratio
    const height = canvas.height * ratio
    doc.addImage(imgData, 'PNG', 0, 0, width, height)
    doc.save(`${pdfForm.value.id}.pdf`)
    isWaitPdf.value = false
    modalActive.value = false
  })
  // console.log('22222');
}
const downloadCSV = () => {
  const surList = surveyList.value.map((survey, index) => {
    const surveyForm = compRailSurveyForm(survey)
    const outForm = {
      'ข้อมูลการสำรวจเบื้องต้น.วันที่สำรวจ': surveyForm.generalSurvey.date,
      'ข้อมูลการสำรวจเบื้องต้น.เขตการเดินรถ': surveyForm.generalSurvey.area,
      'ข้อมูลการสำรวจเบื้องต้น.แขวง': surveyForm.generalSurvey.zone,
      'ข้อมูลการสำรวจเบื้องต้น.สถานี': surveyForm.generalSurvey.station,
      'ข้อมูลการสำรวจเบื้องต้น.สถานีรถไฟก่อนหน้า': surveyForm.generalSurvey.zoneBe,
      'ข้อมูลการสำรวจเบื้องต้น.สถานีรถไฟถัดไป': surveyForm.generalSurvey.zoneAf,
      'ข้อมูลการสำรวจเบื้องต้น.พิกัด GPS': surveyForm.generalSurvey.coordinates,
      'ข้อมูลการสำรวจเบื้องต้น.หลักกิโลเมตร': surveyForm.generalSurvey.kilometers,
      'ข้อมูลการสำรวจเบื้องต้น.เสาโทรเลข.0': surveyForm.generalSurvey.telegram.telegramBefore,
      'ข้อมูลการสำรวจเบื้องต้น.เสาโทรเลข.1': surveyForm.generalSurvey.telegram.telegramAfter,
      'ข้อมูลการสำรวจเบื้องต้น.เกรดของราง': surveyForm.generalSurvey.railType.type,
      'ข้อมูลการสำรวจเบื้องต้น.ขนาดของราง (ปอนด์/หลา)': surveyForm.generalSurvey.railType.weight,
      'ข้อมูลการสำรวจเบื้องต้น.ลักษณะพื้นที่ความเสียหาย': `${surveyForm.generalSurvey.areaCondition}`,
      'การสำรวจความเสียหายของราง.ความเสียหายของราง': surveyForm.railDamageSurvey.situation,
      'การสำรวจความเสียหายของราง.ตำแหน่งที่เกิดความเสียหายของราง': surveyForm.railDamageSurvey.location,
      'การสำรวจความเสียหายของราง.ลักณะความเสียหายที่เกิดขึ้น': surveyForm.railDamageSurvey.defectPattern,
      'การสำรวจความเสียหายของราง.รูปแบบ Surface Defect': surveyForm.railDamageSurvey.surfaceDefectPattern,
      'การสำรวจความเสียหายของทาง.มิติทางเรขาคณิต.ความสมบูรณ์': surveyForm.trackDamageSurvey.trackGeometryCondition.isPerfect,
      'การสำรวจความเสียหายของทาง.มิติทางเรขาคณิต.เงื่อนไข': surveyForm.trackDamageSurvey.trackGeometryCondition.condition,
      'การสำรวจความเสียหายของทาง.สภาพหินโรยทาง.ความสมบูรณ์': surveyForm.trackDamageSurvey.ballastCondition.isPerfect,
      'การสำรวจความเสียหายของทาง.สภาพหินโรยทาง.เงื่อนไข': surveyForm.trackDamageSurvey.ballastCondition.condition,
      'การสำรวจความเสียหายของทาง.วาระการอัดหินโรยทาง': surveyForm.trackDamageSurvey.ballastCompaction,
      'การสำรวจความเสียหายของทาง.ชนิดของหมอนรองทาง': surveyForm.trackDamageSurvey.sleeperType,
      'การสำรวจความเสียหายของทาง.สภาพหมอนรองทาง.ความสมบูรณ์': surveyForm.trackDamageSurvey.sleeperCondition.isPerfect,
      'การสำรวจความเสียหายของทาง.สภาพหมอนรองทาง.เงื่อนไข': surveyForm.trackDamageSurvey.sleeperCondition.condition,
      'การสำรวจความเสียหายของทาง.คันทาง': surveyForm.trackDamageSurvey.trackFoundationCondition,
      'การซ่อมบำรุง.ประวัติการซ่อมบำรุง': surveyForm.maintenanceRate.maintenanceRecord.hasMaintenanceRecord,
      'การซ่อมบำรุง.การซ่อมบำรุงครั้งล่าสุด': surveyForm.maintenanceRate.maintenanceRecord.lastMaintenanceTimes,
      'การซ่อมบำรุง.ความถี่ในการซ่อมบำรุง': surveyForm.maintenanceRate.maintenanceRecord.yearlyMaintenanceTimes,
      'การซ่อมบำรุง.การประเมินความเสียหาย.ความรุนแรงของความเสียหาย': surveyForm.maintenanceRate.severity,
      'การซ่อมบำรุง.การประเมินความเสียหาย.ควรส่งห้องปฏิบัติการเพื่อทำการวิเคราะห์สาเหตุของความเสียหาย': surveyForm.maintenanceRate.isAnalyzeDamage,
      'การซ่อมบำรุง.ข้อคิดเห็น/คำแนะนำ/หมายเหตุ': surveyForm.maintenanceRate.comment,
      'การซ่อมบำรุง.ผู้สำรวจและบันทึกความเสียหาย': surveyForm.createdByName
    }
    return outForm
  })
  const json2csvParser = new Parser()
  const csv = json2csvParser.parse(surList)
  // console.log(csv)
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
  const objUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', objUrl)
  link.setAttribute('download', 'survey-list')
  link.textContent = 'Click to Download'
  link.click()
  // document.body.removeChild(link);
  // document.querySelector('body').append(link)
}
const handleDownloadPDF = async (form) => {
  const formPreview = await calSurveyForm(form)
  // console.log(formPreview);
  pdfForm.value = formPreview
  isReady.value = true
  modalActive.value = true
}
const compSurveyList = computed(() => {
  // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
  return surveyList.value.map(sl => {
    return {
      id: sl.id,
      // date: sl.generalSurvey.date,
      date: moment.utc(sl.generalSurvey.date).local().format('DD-MM-YYYY HH:mm:ss'),
      area: variable.areas.filter(area => area.value === sl.generalSurvey.area)[0]?.key,
      zone: variable.areas.filter(area => area.value === sl.generalSurvey.area)[0]?.zones.filter(zone => zone.value === sl.generalSurvey.zone)[0]?.key,
      station: variable.areas.filter(area => area.value === sl.generalSurvey.area)[0]?.zones.filter(zone => zone.value === sl.generalSurvey.zone)[0]?.stations.filter(station => station.value === sl.generalSurvey.station)[0]?.key,
      // areaCondition: sl.generalSurvey.areaCondition.map((ac) => variable.damageAreaPrperties.filter((area) => area.value === ac)[0]).map((all) => all.key.split(/\s/)[0]), // check specific
      createAt: moment.utc(sl.createdAt).local().format('DD-MM-YYYY HH:mm:ss'),
      // createdBy: sl.createdBy ? sl.createdBy : { username: '-' },
      // modifiedBy: sl.modifiedBy ? sl.modifiedBy : { username: '-' },
      createdBy: sl.createdByName ? { username: sl.createdByName} : { username: '-' },
      modifiedBy: sl.modifiedByName ? { username: sl.modifiedByName } : { username: '-' },
      modifiedAt: sl.modifiedAt ? moment.utc(sl.modifiedAt).local().format('DD-MM-YYYY HH:mm:ss') : '-',
      // createdAt: sl.createdAt
    }
  })
})
watch(() => modalActive.value, (n, o) => {
  if (n) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
  // console.log(n, o);
})
</script>
<template>
  <!-- {{ indexedDBList }} -->
  <!-- {{ surveyList.map(l => l.createdAt) }} -->
  <div class="px-10 flex flex-col h-full">
    <!-- <pre>{{ surveyList }}</pre> -->
    <div class="grow">
      <Table :tbody="compSurveyList">
        <template #thead>
          <th class="py-3 px-6">วันที่สำรวจ</th>
          <!-- <th class="py-3 px-6">วันที่สร้างฟอร์ม</th> -->
          <!-- <th class="py-3 px-6">รหัสฟอร์ม</th> -->
          <th class="py-3 px-6">เขตการเดินรถ</th>
          <th class="py-3 px-6">แขวง</th>
          <th class="py-3 px-6">สถานี</th>
          <!-- <th class="py-3 px-6">สถานีก่อนหน้า</th>
          <th class="py-3 px-6">สถานีถัดไป</th> -->
          <!-- <th class="py-3 px-6">หลักกิโลเมตร</th> -->
          <th class="py-3 px-6">สร้างโดย</th>
          <th class="py-3 px-6">แก้ไขโดย</th>
          <th class="py-3 px-6">แก้ไขเมื่อ</th>
          <th class="py-3 px-6">ดาวน์โหลด</th>
        </template>
        <template #tbody="{ item, index }">
          <td class="py-2 px-4">
            <router-link :to="{ path: `form/${item.id}` }" class="capitalize hover:text-blue-500">{{ item.date }}</router-link>
          </td>
          <!-- <td class="py-2 px-4">
          </td> -->
          <td class="py-2 px-4">
            <router-link :to="{ path: `form/${item.id}` }" class="capitalize hover:text-blue-500">{{ item.area }}</router-link>
          </td>
          <td class="py-2 px-4">
            <router-link :to="{ path: `form/${item.id}` }" class="capitalize hover:text-blue-500">{{ item.zone }}</router-link>
          </td>
          <td class="py-2 px-4">
            <router-link :to="{ path: `form/${item.id}` }" class="capitalize hover:text-blue-500">{{ item.station }}</router-link>
          </td>
          <!-- <td class="py-2 px-4">
            {{ item.zoneBe }}
          </td>
          <td class="py-2 px-4">
            {{ item.zoneAf }}
          </td> -->
          <!-- <td class="py-2 px-4">
            <router-link :to="{ path: `form/${item.id}`}" class="capitalize hover:text-blue-500">{{ item.kilometers }}</router-link>
          </td> -->
          <td class="py-2 px-4">
            <router-link :to="{ path: `form/${item.id}` }" class="capitalize hover:text-blue-500">{{item.createdBy.username}}</router-link>
          </td>
          <td class="py-2 px-4">
            <router-link :to="{ path: `form/${item.id}` }" class="capitalize hover:text-blue-500">{{item.modifiedBy.username}}</router-link>
          </td>
          <!-- <td class="py-2 px-4">
            <router-link :to="{ path: `form/${item.id}`}" class="capitalize hover:text-blue-500">{{ item.createAt }}</router-link>
          </td> -->
          <td class="py-2 px-4">
            <router-link :to="{ path: `form/${item.id}` }" class="capitalize hover:text-blue-500">{{ item.modifiedAt }}</router-link>
          </td>
          <!-- <td class="py-2 px-4">
            <button type="button" @click="handleClickDelete(index, item.id)">
              <svg class="w-6 h-6 text-red-500 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </td> -->
          <td class="py-2 px-4">
            <!-- <button @click="handleDownloadPDF(index)" type="button" -->
            <button @click="handleDownloadPDF(surveyList[index])" type="button"
              class="text-blue-500 hover:text-blue-800 font-medium text-sm p-2.5 text-center inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
              </svg>
              <span class="sr-only">Download</span>
            </button>
          </td>
        </template>
      </Table>
    </div>
    <!-- <div class="inline-flex justify-end mt-4">
      <button type="button" class="_button" @click="downloadCSV()">ดาวน์โหลด CSV</button>
    </div> -->
    <TailTable :count="count" :page="page" :per-page="perPage" @page="getSurveyList2($event)"></TailTable>
    <!-- <button @click="formData()">FORMDATA</button> -->
    <!-- <HtmlPdf></HtmlPdf> -->
    <div id="content">
      <Modal content v-model="modalActive">
        <template #content>
          <PDFPreview :survey-preview="pdfForm" ></PDFPreview>
        </template>
        <template #footer>
          <button @click="modalActive = false" data-modal-hide="extralarge-modal" type="button"
            class="_button-error">ยกเลิก</button>
          <button :disabled="isWaitPdf" @click="downloadPDF()" data-modal-hide="extralarge-modal" type="button" :class="isWaitPdf ? '_button-disable' : '_button'">
            <svg v-if="isWaitPdf" aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
            </svg>
            ดาวน์โหลด
          </button>
          <!-- <button type="button" class="_button" @click="downloadCSV()">ดาวน์โหลด CSV</button> -->
        </template>
      </Modal>
    </div>
  </div>
</template>
<style>
/* html, body{
  overflow: auto;
} */
/* #container1{
    height: 100%;
    width: 100%;
    overflow: hidden;
}

 #container2{
    height: 100%;
    width: 100%;
    overflow: auto;
    padding-right: 20px;
} */
</style>