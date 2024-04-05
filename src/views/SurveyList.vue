<script setup>
import Table from '@/components/Table.vue'
import variable from '@/variable.json'
// import store from '@/store'
import { useStore } from 'vuex'
import { onMounted, ref, computed } from 'vue'
import api from '@/services'
import moment from 'moment'
import tz from 'moment-timezone'
import TailTable from '@/components/TailTable.vue'
import { useToast } from 'vue-toastification'
import pdfMake from 'pdfmake'
import srt from '@/assets/logo-srt.png'
const toast = useToast()
const store = useStore()

const surveyList = ref([])
// const indexedDBList = ref([])
const count = ref(0)
const perPage = ref(20)
const page = ref(1)

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
const getBase64ImageFromURL = (url) => {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    console.log(url);

    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      var dataURL = canvas.toDataURL("image/png");

      resolve(dataURL);
    };

    img.onerror = error => {
      reject(error);
    };

    img.src = url;
  });
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

const calSurveyForm = (sl) => {
  return new Promise((resolve, reject) => {
    let serveyForm = {
      id: sl.id,
      generalSurvey: {
        coordinates: {
          latitude: sl.generalSurvey.coordinates.latitude,
          longitude: sl.generalSurvey.coordinates.longitude,
        },
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
        station: variable.areas.filter(area => area.value === sl.generalSurvey.area)[0]?.zones.filter(zone => zone.value === sl.generalSurvey.zone)[0]?.stations.filter(station => station.value === sl.generalSurvey.station)[0]?.key,
        date: moment.utc(sl.generalSurvey.date).local().format('DD-MM-YYYY HH:mm:ss'),
        zoneBe: variable.zone.filter((z) => z.value === sl.generalSurvey.nearby.stationBefore)[0]?.key.split(/\s/)[0],
        zoneAf: variable.zone.filter((z) => z.value === sl.generalSurvey.nearby.stationAfter)[0]?.key.split(/\s/)[0],
        kilometers: sl.generalSurvey.kilometers ? sl.generalSurvey.kilometers : '-',
        areaCondition: sl.generalSurvey.areaCondition.map((ac, index) => variable.damageAreaPrperties.find(dap => dap.value === ac)?.key.split(/\s/)[0] || ac),
      },
      railDamageSurvey: {
        uploadImages: sl.railDamageSurvey.uploadImages.map(async (img) => await toDataURL(`${process.env.VUE_APP_BACK_END_URL}/${process.env.VUE_APP_IMAGE_DIR}/${img}`)),
        situation: sl.railDamageSurvey.situation.map(sit => variable.situation.find(v => v.value === sit)?.key.split(/\s/)[0] || sit),
        location: sl.railDamageSurvey.location.map(loc => variable.location.find(v => v.value === loc)?.key.split(/\s/)[0]),
        defectPattern: sl.railDamageSurvey.defectPattern.map(def => variable.defectPattern.find(v => v.value === def)?.key.split(/\s/)[0]),
        surfaceDefectPattern: sl.railDamageSurvey.surfaceDefectPattern.map(sdef => variable.surfaceDefect.find(v => v.value === sdef)?.key),
        plan: sl.railDamageSurvey.plan,
        elevation: sl.railDamageSurvey.elevation,
        section: sl.railDamageSurvey.section
      },
      trackDamageSurvey: {
        uploadImages: sl.trackDamageSurvey.uploadImages.map(img => `${process.env.VUE_APP_BACK_END_URL}/${process.env.VUE_APP_IMAGE_DIR}/${img}`),
        trackGeometryCondition: sl.trackDamageSurvey.trackGeometryCondition.map(track => [...variable.integrity, ...variable.trackGeometry].find(v => v.value === track)?.key),
        ballastCondition: sl.trackDamageSurvey.ballastCondition.map(bal => [...variable.ballast, ...variable.ballastCondition].find(v => v.value === bal)?.key.split(/\(/)[0].trim()),
        ballastCompaction: variable.ballastCompaction.find(v => v.value === sl.trackDamageSurvey.ballastCompaction)?.key,
        sleeperCondition: sl.trackDamageSurvey.sleeperCondition.map(sc => [...variable.sleeper, ...variable.sleeperCondition].find(v => v.value === sc)?.key.split(/\s/)[0]),
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
    };
    Promise.resolve()
      .then(() => sl.railDamageSurvey.uploadImages.map((img) => toDataURL(`${process.env.VUE_APP_BACK_END_URL}/${process.env.VUE_APP_IMAGE_DIR}/${img}`)))
      .then((promArr) => Promise.all(promArr))
      .then((uploadImages) => { serveyForm.railDamageSurvey.uploadImages = uploadImages })
      .then(() => sl.trackDamageSurvey.uploadImages.map(img => toDataURL(`${process.env.VUE_APP_BACK_END_URL}/${process.env.VUE_APP_IMAGE_DIR}/${img}`)))
      .then((promArr) => Promise.all(promArr))
      .then((uploadImages) => { serveyForm.trackDamageSurvey.uploadImages = uploadImages })
      .then(() => toDataURL(require('@/assets/logo-nstda.png')))
      .then((image) => { serveyForm['imagesFooter'] = image })
      // .then(() => console.log(serveyForm))
      .then(() => resolve(serveyForm))
      .catch((err) => reject(err));
  })
}
const handleDownloadPDF = async (sl) => {
  console.log(sl);
  const surveyForm = await calSurveyForm(sl)
  const dateTimeFormat = (datetime) => {
    const date = datetime.split(/\s/)[0].split('-')
    const mounth = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
    return `${date[0]} ${mounth[parseInt(date[1]) - 1]} ${parseInt(date[2]) + 543} ${datetime.split(/\s/)[1]} น.`
  }
  const tableAreaCondition = () => {
    let areaCondition = []
    if (surveyForm.generalSurvey.areaCondition.length < 4) {
      areaCondition.push(['', '', 'ลักษณะพื้นที่ที่เกิดความเสียหาย:', { text: `${surveyForm.generalSurvey.areaCondition.join(', ')}`, style: 'fieldValue' }])
    } else {
      areaCondition.push(['', '', 'ลักษณะพื้นที่ที่เกิดความเสียหาย:', { text: surveyForm.generalSurvey.areaCondition.filter((areaCondition, index) => index < 3).join(', '), style: 'fieldValue' }],
        ['', '', { colSpan: 2, text: surveyForm.generalSurvey.areaCondition.filter((areaCondition, index) => index > 2).join(', '), style: 'fieldValue' }])
    }
    return areaCondition
  }
  const railPES  = () => {
    let pesArr = []
    if (surveyForm.railDamageSurvey.plan) {
      pesArr.push(
        {
          absolutePosition: { x: 352, y: tableAreaCondition().length > 1 ? 269 : 249 },
          image: surveyForm.railDamageSurvey.plan,
          width: 120
        }
      )
    }
    if (surveyForm.railDamageSurvey.elevation) {
      pesArr.push(
        {
          absolutePosition: { x: 353, y: tableAreaCondition().length > 1 ? 331.5 : 311.5 },
          image: surveyForm.railDamageSurvey.elevation,
          width: 120
        }
      )
    }
    if (surveyForm.railDamageSurvey.section) {
      pesArr.push(
        {
          absolutePosition: { x: 483, y: tableAreaCondition().length > 1 ? 267 : 247 },
          image: surveyForm.railDamageSurvey.section,
          width: 80
        }
      )
    }
    return pesArr
  }
  const images = () => {
    return new Promise((resolve, reject) => {
      let images = []
      Promise.resolve()
        .then(() => Promise.all(['rmt-logo.png', 'srt-title.jpg', 'logo-nstda.png', 'logo-mtec.png', 'logo-nectec.png', 'rail/rail_1.png', 'rail/rail_2.jpg', 'rail/rail_3.jpg'].map(img => toDataURL(require(`@/assets/${img}`)))))
        .then((result) => images = result)
        // .then(() => console.log(images))
        .then(() => resolve(images))
        .catch((err) => reject(err))
    })
  }
  const imgs = await images()
  // console.log(imgs[0])
  pdfMake.fonts = {
    // download default Roboto font from cdnjs.com
    Roboto: {
      normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
      bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
      italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
      bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
    },
    Kanit: {
      normal: 'https://fonts.cdnfonts.com/s/15799/Kanit-Regular.woff',
      bold: 'https://fonts.cdnfonts.com/s/15799/Kanit-Medium.woff',
      italics: 'https://fonts.cdnfonts.com/s/15799/Kanit-ThinItalic.woff',
      bolditalics: 'https://fonts.cdnfonts.com/s/15799/Kanit-LightItalic.woff'
    }
  }
  const docDefinition = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [40, 0, 40, 0],
    // watermark: { text: 'test watermark', color: 'blue', opacity: 0.3, bold: false, italics: false, fontSize: 10, angle: 70 },
    info: {
      title: 'awesome Document',
      author: 'john doe',
      subject: 'subject of document',
      keywords: 'keywords for document',
    },
    content: [
      {
        absolutePosition: { x: 30, y: 0 },
        columnGap: 10,
        columns: [
          { image: imgs[0], width: 70, margin: [0, 25, 0, 0] },
          { image: imgs[1], width: 60, margin: [0, 5, 0, 0] },
        ],
      },
      { text: dateTimeFormat(moment.utc(new Date()).local().format('DD-MM-YYYY HH:mm:ss')), alignment: 'right', margin: [0, 50, 0, 0] },
      { canvas: [{ type: 'line', x1: -20, y1: 0, x2: 595 - (40 * 2) + 20, y2: 0, lineWidth: 3 }] },
      { text: 'บันทึกความเสียหายของ รางรถไฟ', style: ['anotherStyle'], margin: [0, 5, 0, 5] },
      { text: 'ข้อมูลการสำรวจเบื้องต้น', decoration: 'underline', margin: [0, 5, 0, 5] },
      {
        layout: 'noBorders',
        // absolutePosition: {x: 30 + 10, y: 125},
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          // headerRows: 0,
          widths: ['auto', 'auto', 'auto', 'auto'],
          body: [
            ['วันที่สำรวจ:', { text: dateTimeFormat(surveyForm.generalSurvey.date), style: 'fieldValue' }, 'พิกัด GPS:', { text: `${surveyForm.generalSurvey.coordinates.latitude}, ${surveyForm.generalSurvey.coordinates.longitude}`, style: 'fieldValue' }],
            ['เขตการเดินรถ:', { text: `${surveyForm.generalSurvey.area}`, style: 'fieldValue' }, 'หลักกิโลเมตร:', { text: `${surveyForm.generalSurvey.kilometers}`, style: 'fieldValue' }],
            ['แขวง:', { text: `${surveyForm.generalSurvey.zone}`, style: 'fieldValue' }, 'เสาโทรเลข:', { text: `${surveyForm.generalSurvey.telegram.telegramBefore} ระหว่าง ${surveyForm.generalSurvey.telegram.telegramAfter}`, style: 'fieldValue' }],
            ['สถานีรถไฟก่อนหน้า:', { text: `${surveyForm.generalSurvey.zoneBe}`, style: 'fieldValue' }, 'เกรดของราง:', { text: `${surveyForm.generalSurvey.railType.type}`, style: 'fieldValue' }],
            ['สถานีรถไฟถัดไป:', { text: `${surveyForm.generalSurvey.zoneAf}`, style: 'fieldValue' }, 'ขนาดของราง (ปอนด์/หลา):', { text: `${surveyForm.generalSurvey.railType.weight}`, style: 'fieldValue' }],
            ...tableAreaCondition()
            // [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
          ]
        }
      },
      {
        columnGap: 10,
        columns: [
          {
            width: '60%',
            columns: [
              [
                { text: 'การสำรวจความเสียหายของราง', decoration: 'underline', margin: [0, 5, 0, 0] },
                { text: 'รูปภาพความเสียหายของราง', margin: [5, 15, 0, 5] },
                {
                  columnGap: 2,
                  margin: [5, 0, 0, 0],
                  columns: surveyForm.railDamageSurvey.uploadImages.length > 0
                    // ? surveyForm.railDamageSurvey.uploadImages.map((image) => Object.assign({ image: image, width: 95 }))
                    ? surveyForm.railDamageSurvey.uploadImages.map((image) => Object.assign({ image: image, fit: [95, 75] }))
                    : [{
                      table: {
                        widths: [90, 90, 90], heights: 65,
                        body: [[{ text: 'ภาพที่ 1', alignment: 'center', margin: [0, 25, 0, 0] },
                        { text: 'ภาพที่ 2', alignment: 'center', margin: [0, 25, 0, 0] },
                        { text: 'ภาพที่ 3', alignment: 'center', margin: [0, 25, 0, 0] }
                        ]]
                      }
                    }]
                }
              ],
            ]
          },
          {
            margin: [0, 10, 0, 0],
            columns: [
              [
                { image: imgs[5], width: 120 },
                { image: imgs[6], width: 120 }
              ],
              { image: imgs[7], width: 80 }
            ]
          }
        ]
      },
      ...railPES(),
      {
        layout: 'noBorders',
        table: {
          widths: ['auto', '*'],
          body: [
            ['ความเสียหายของราง:', {
              text: `${surveyForm.railDamageSurvey.situation.join(', ')}`, style: 'fieldValue'
            }],
            ['ตำแหน่งที่เกิดความเสียหายของราง:', { text: `${surveyForm.railDamageSurvey.location.join(', ')}`, style: 'fieldValue' }],
            ['ลักษณะความเสียหายที่เกิดขึ้น:', { text: `${surveyForm.railDamageSurvey.defectPattern.join(', ')}`, style: 'fieldValue' }],
            ['รูปแบบ Surface Defect:', { text: `${surveyForm.railDamageSurvey.surfaceDefectPattern.join(', ')}`, color: '#3498DB', style: 'fieldValue' }]
          ]
        }
      },
      // BORDER การสำรวจความเสียหายของราง
      {
        absolutePosition: { x: 40, y: tableAreaCondition().length > 1 ? 260 : 240 },
        canvas: [
          {
            type: 'rect',
            x: -10,
            y: 0,
            w: 552 - (10 * 2) + 3,
            h: tableAreaCondition().length > 1 ? 210 : 200,
            r: 10,
            lineColor: '#CCCCCC',
            lineWidth: 3
          },
        ]
      },
      {
        margin: [0, 5, 0, 0],
        columnGap: 30,
        columns: [
          {
            width: '60%',
            columns: [
              [
                { text: 'การสำรวจความเสียหายของทาง', decoration: 'underline', margin: [0, 5, 0, 5] },
                {
                  layout: 'noBorders',
                  table: {
                    widths: ['auto', 'auto', '*'],
                    body: [
                      [
                        'มิติทางเรขาคณิต:', surveyForm.trackDamageSurvey.trackGeometryCondition.includes('สมบูรณ์') ? 'สมบูรณ์' : 'ไม่สมบูรณ์',
                        surveyForm.trackDamageSurvey.trackGeometryCondition.includes('สมบูรณ์') ? '' : { text: surveyForm.trackDamageSurvey.trackGeometryCondition.join(', '), style: 'fieldValue' }
                      ],
                      [
                        'สภาพหินโรยทาง:', surveyForm.trackDamageSurvey.ballastCondition.includes('สมบูรณ์หรือเต็มมาตรฐาน') ? 'สมบูรณ์หรือเต็มมาตรฐาน' : 'ไม่สมบูรณ์',
                        surveyForm.trackDamageSurvey.ballastCondition.includes('สมบูรณ์หรือเต็มมาตรฐาน') ? '' : { text: surveyForm.trackDamageSurvey.ballastCondition.join(', '), style: 'fieldValue' }
                      ],
                      ['วาระการอัดหินโรยทาง', { colSpan: 2, text: surveyForm.trackDamageSurvey.ballastCompaction, style: 'fieldValue' }],
                      ['ชนิดของหมอนรองทาง', { colSpan: 2, text: surveyForm.trackDamageSurvey.sleeperType, style: 'fieldValue' }],
                      [
                        'สภาพของหมอนรองทาง:', surveyForm.trackDamageSurvey.sleeperCondition.filter(sc => ['ดี', 'พอใช้'].includes(sc)).length > 0 ? surveyForm.trackDamageSurvey.sleeperCondition[0] : 'ชำรุด',
                        surveyForm.trackDamageSurvey.sleeperCondition.filter(sc => ['ดี', 'พอใช้'].includes(sc)).length > 0 ? '' : { text: surveyForm.trackDamageSurvey.sleeperCondition.join(', '), style: 'fieldValue' }
                      ],
                      ['คันทาง:', { text: surveyForm.trackDamageSurvey.trackFoundationCondition, style: 'fieldValue' }, '']
                    ]
                  }
                },
                { text: 'รูปภาพความเสียหายของทาง', margin: [0, 15, 0, 5] },
                {
                  columnGap: 2,
                  columns: surveyForm.trackDamageSurvey.uploadImages.length > 0
                  // ? surveyForm.trackDamageSurvey.uploadImages.map((image) => Object.assign({ image: image, width: 95 }))
                    ? surveyForm.trackDamageSurvey.uploadImages.map((image) => Object.assign({ image: image, fit: [95, 75] }))
                    : [{
                      table: {
                        widths: [90, 90, 90], heights: 65,
                        body: [[{ text: 'ภาพที่ 1', alignment: 'center', margin: [0, 25, 0, 0] },
                        { text: 'ภาพที่ 2', alignment: 'center', margin: [0, 25, 0, 0] },
                        { text: 'ภาพที่ 3', alignment: 'center', margin: [0, 25, 0, 0] }
                        ]]
                      }
                    }]
                }
              ]
            ]
          },
          {
            // width: '40%',
            columns: [
              [
                { text: 'การซ่อมบำรุง', style: 'fieldValue', margin: [0, 5, 0, 5] },
                {
                  ul: [
                    {
                      text: [
                        { text: 'ประวัติการซ่อมบำรุง' },
                        { text: `${surveyForm.maintenanceRate.maintenanceRecord.hasMaintenanceRecord}\n`, style: 'fieldValue' },
                        { text: 'การซ่อมบำรุงครั้งล่าสุด' },
                        { text: `${surveyForm.maintenanceRate.maintenanceRecord.lastMaintenanceTimes}\n`, style: 'fieldValue' },
                        { text: 'ความถี่ในการซ่อมบำรุงในรอบปี' },
                        { text: `${surveyForm.maintenanceRate.maintenanceRecord.yearlyMaintenanceTimes}`, style: 'fieldValue' }
                      ],
                    }
                  ]
                },
                { text: 'การประเมินความเสียหาย', style: 'fieldValue', margin: [0, 5, 0, 5] },
                {
                  ul: [
                    {
                      text: [
                        { text: 'ความรุนแรงของความเสียหาย' },
                        { text: `${surveyForm.maintenanceRate.severity}`, style: 'fieldValue' },
                      ],
                    }
                  ]
                },
                {
                  margin: [0, 5, 0, 5],
                  table: {
                    body: [
                      ['ระดับ 1', 'ระดับ 2', 'ระดับ 3', 'ระดับ 4', 'ระดับ 5']
                    ]
                  },
                  layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                      return surveyForm.maintenanceRate.severity.includes(columnIndex + 1) ? '#CCCCCC' : null;
                    }
                  }
                },
                {
                  ul: [
                    {
                      text: [
                        { text: 'ควรส่งห้องปฏิบัติการเพื่อทำการวิเคราะห์สาเหตุ\nของความเสียหาย' },
                        { text: `${surveyForm.maintenanceRate.isAnalyzeDamage}`, style: 'fieldValue' },
                      ],
                    }
                  ]
                },
                { text: 'ข้อคิดเห็น/คำแนะนำ/หมายเหตุ', margin: [0, 5, 0, 5] },
                { text: surveyForm.maintenanceRate.comment },
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: -5,
                      y: -15,
                      w: 210,
                      h: 40,
                      r: 0,
                      lineColor: '#CCCCCC',
                      lineWidth: 1
                    },
                  ]
                },
                {
                  margin: [(210 / 2) - 35, 10, 0, 0],
                  image: surveyForm.signature,
                  width: 70
                },
                {
                  // absolutePosition: { x: 40, y: 90 },
                  canvas: [
                    {
                      type: 'rect',
                      x: (210 / 2) - 40,
                      y: -25,
                      w: 80,
                      h: 30,
                      r: 0,
                      lineColor: 'black',
                      lineWidth: 1
                    },
                  ]
                },
                { text: surveyForm.createdByName, margin: [0, 5, 0, 0], alignment: 'center' },
                { text: '(ผู้สำรวจและบันทึกความเสียหาย)', margin: [0, -2, 0, 0], alignment: 'center' }
              ]
            ]
          }
        ]
      },
      // DOT BETWEEN การสำรวจความเสียหายของทาง
      {
        canvas: [
          {
            type: 'line',
            x1: 305, y1: -310,
            x2: 305, y2: 0,
            dash: { length: 2, space: 2 }, lineWidth: 2
          },
        ]
      },
      // MAIN BORDER
      {
        absolutePosition: { x: 40, y: 90 },
        canvas: [
          {
            type: 'rect',
            x: -20 + 1.5,
            y: 10,
            w: 595 - ((20 + 1.5) * 2),
            h: 700,
            r: 0,
            lineColor: 'black',
            lineWidth: 3
          },
        ]
      },
      {
        absolutePosition: { x: 30, y: 800 },
        columns: [
          {
            image: imgs[2],
            width: 70
          },
          {
            image: imgs[3],
            width: 70
          },
          {
            image: imgs[4],
            width: 70
          }
        ]
      },
      {
        canvas: [
          // {
          //   type: 'rect',
          //   x: 0,
          //   y: 0,
          //   w: 0,
          //   h: 290,
          //   r: 2,
          //   dash: { length: 5 },
          //   // lineWidth: 10,
          //   lineColor: 'blue',
          // },
          // {
          //   type: 'rect',
          //   x: 1,
          //   y: 1,
          //   w: 308,
          //   h: 288,
          //   r: 4,
          //   lineColor: 'red',
          //   color: '#ffffe0',
          // },
          // { type: 'line', x1: 0, y1: 280, x2: 0, y2: 0, dash: {length: 2, space: 2}, lineWidth: 2 },
          // {
          //   type: 'polyline',
          //   lineWidth: 3,
          //   closePath: true,
          //   points: [{ x: 10, y: 10 }, { x: 35, y: 40 }, { x: 100, y: 40 }, { x: 125, y: 10 }]
          // },
          // {
          //   type: 'polyline',
          //   lineWidth: 2,
          //   color: 'blue',
          //   lineColor: 'red',
          //   points: [{ x: 10, y: 110 }, { x: 35, y: 140 }, { x: 100, y: 140 }, { x: 125, y: 110 }, { x: 10, y: 110 }]
          // },
          // {
          //   type: 'line',
          //   x1: 40, y1: 80,
          //   x2: 260, y2: 80,
          //   lineWidth: 10,
          //   lineCap: 'round'
          // },
          // {
          //   type: 'line',
          //   x1: 40, y1: 100,
          //   x2: 260, y2: 100,
          //   lineWidth: 10,
          //   lineCap: 'square'
          // },
          // {
          //   type: 'ellipse',
          //   x: 150, y: 140,
          //   color: 'red',
          //   fillOpacity: 0.5,
          //   r1: 80, r2: 60
          // },
          // {
          //   type: 'rect',
          //   x: 150,
          //   y: 200,
          //   w: 150,
          //   h: 50,
          // },
          // {
          //   type: 'rect',
          //   x: 10, y: 200, w: 100, h: 10,
          //   linearGradient: ['red', 'blue']
          // },
          // {
          //   type: 'rect',
          //   x: 10, y: 215, w: 100, h: 10,
          //   linearGradient: ['red', 'green', 'blue']
          // },
          // {
          //   type: 'rect',
          //   x: 10, y: 230, w: 100, h: 10,
          //   linearGradient: ['red', 'yellow', 'green', 'blue']
          // },
          // {
          //   type: 'ellipse',
          //   x: 260, y: 140,
          //   r1: 30, r2: 20,
          //   linearGradient: ['red', 'green', 'blue', 'red'],
          // },
          // {
          //   type: 'rect',
          //   x: 10, y: 250, w: 50, h: 30,
          //   color: ['stripe45d', 'blue'],
          // }
        ]
      }
    ],
    styles: {
      fieldValue: {
        decoration: 'underline',
        decorationColor: '#DCDCDC'
      },
      header: {
        fontSize: 22,
        bold: true
      },
      anotherStyle: {
        fontSize: 16,
        alignment: 'center'
      }
    },
    defaultStyle: {
      font: 'Kanit',
      fontSize: 10
    }
  }
  pdfMake.createPdf(docDefinition).download(`${surveyForm.id}.pdf`);
}
const compSurveyList = computed(() => {
  // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
  return surveyList.value.map(sl => {
    return {
      id: sl.id,
      // date: sl.generalSurvey.date,
      area: variable.areas.filter(area => area.value === sl.generalSurvey.area)[0]?.key,
      zone: variable.areas.filter(area => area.value === sl.generalSurvey.area)[0]?.zones.filter(zone => zone.value === sl.generalSurvey.zone)[0]?.key,
      station: variable.areas.filter(area => area.value === sl.generalSurvey.area)[0]?.zones.filter(zone => zone.value === sl.generalSurvey.zone)[0]?.stations.filter(station => station.value === sl.generalSurvey.station)[0]?.key,
      date: moment.utc(sl.generalSurvey.date).local().format('DD-MM-YYYY HH:mm:ss'),
      zoneBe: variable.zone.filter((z) => z.value === sl.generalSurvey.nearby.stationBefore)[0]?.key.split(/\s/)[0],
      zoneAf: variable.zone.filter((z) => z.value === sl.generalSurvey.nearby.stationAfter)[0]?.key.split(/\s/)[0],
      kilometers: sl.generalSurvey.kilometers ? sl.generalSurvey.kilometers : '-',
      // areaCondition: sl.generalSurvey.areaCondition.map((ac) => variable.damageAreaPrperties.filter((area) => area.value === ac)[0]).map((all) => all.key.split(/\s/)[0]), // check specific
      areaCondition: sl.generalSurvey.areaCondition.map((ac, index) => variable.damageAreaPrperties.find(dap => dap.value === ac)?.key.split(/\s/)[0] || ac),
      createAt: moment.utc(sl.createdAt).local().format('DD-MM-YYYY HH:mm:ss'),
      createdBy: sl.createdByName ? { username: sl.createdByName} : { username: '-' },
      modifiedBy: sl.modifiedByName ? { username: sl.modifiedByName } : { username: '-' },
      modifiedAt: sl.modifiedAt ? moment.utc(sl.modifiedAt).local().format('DD-MM-YYYY HH:mm:ss') : '-',
      survey: sl
      // createdAt: sl.createdAt
    }
  })
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
            <router-link :to="{ path: `form/${item.id}` }" class="capitalize hover:text-blue-500">{{ item.date
            }}</router-link>
          </td>
          <!-- <td class="py-2 px-4">
          </td> -->
          <td class="py-2 px-4">
            <router-link :to="{ path: `form/${item.id}` }" class="capitalize hover:text-blue-500">{{ item.area
            }}</router-link>
          </td>
          <td class="py-2 px-4">
            <router-link :to="{ path: `form/${item.id}` }" class="capitalize hover:text-blue-500">{{ item.zone
            }}</router-link>
          </td>
          <td class="py-2 px-4">
            <router-link :to="{ path: `form/${item.id}` }" class="capitalize hover:text-blue-500">{{ item.station
            }}</router-link>
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
            <router-link :to="{ path: `form/${item.id}` }" class="capitalize hover:text-blue-500">{{
              item.createdBy.username
            }}</router-link>
          </td>
          <td class="py-2 px-4">
            <router-link :to="{ path: `form/${item.id}` }" class="capitalize hover:text-blue-500">{{
              item.modifiedBy.username
            }}</router-link>
          </td>
          <!-- <td class="py-2 px-4">
            <router-link :to="{ path: `form/${item.id}`}" class="capitalize hover:text-blue-500">{{ item.createAt }}</router-link>
          </td> -->
          <td class="py-2 px-4">
            <router-link :to="{ path: `form/${item.id}` }" class="capitalize hover:text-blue-500">{{ item.modifiedAt
            }}</router-link>
          </td>
          <!-- <td class="py-2 px-4">
            <button type="button" @click="handleClickDelete(index, item.id)">
              <svg class="w-6 h-6 text-red-500 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </td> -->
          <td class="py-2 px-4">
            <button @click="handleDownloadPDF(item.survey)" type="button"
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
    <TailTable :count="count" :page="page" :per-page="perPage" @page="getSurveyList2($event)"></TailTable>
    <!-- <button @click="formData()">FORMDATA</button> -->
  </div>
</template>