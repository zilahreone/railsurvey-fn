// import { useVuelidate } from '@vuelidate/core'
import { required, helpers, requiredIf, minValue, maxValue, minLength, decimal, maxLength, integer } from '@vuelidate/validators'

export default function (railForm, railSurvey) {
  const rule = {}
  const uploadImage = {
    originalname: { required },
    originalPath: { required },
    mimetype: { required },
    // destination: { required },
    // filename: { required },
    size: { maxValue: helpers.withMessage(`Maximum value allowed is 5MB`, maxValue(5 * 1024 * 1024)) }
  }
  Object.keys(railForm).forEach((key1) => {
    if (['generalSurvey', 'railDamageSurvey', 'trackDamageSurvey', 'maintenanceRate'].includes(key1)) {
      rule[key1] = {}
      if (key1 === 'generalSurvey') {
        Object.keys(railForm[key1]).forEach((key2) => {
          rule[key1][key2] = {}
          if (key2 !== 'kilometer') {
            if (['coordinates', 'nearby', 'railType', 'telegram'].includes(key2)) { 
              if (key2 === 'coordinates') {
                Object.keys(railForm[key1][key2]).forEach((key3) => {
                  rule[key1][key2][key3] = { decimal, custom: helpers.withMessage('Value must be positive decimal', (value) => value && value > 0) }
                })
              } else if (key2 === 'railType') {
                Object.keys(railForm[key1][key2]).forEach((key3) => {
                  if (key3 === 'weight') {
                    rule[key1][key2][key3] = { required, integer }
                  } else {
                    rule[key1][key2][key3] = { required }
                  }
                })
              } else if (key2 === 'telegram') {
                Object.keys(railForm[key1][key2]).forEach((key3) => {
                  rule[key1][key2][key3] = { required, custom: helpers.withMessage('Value must be pattern Number/Number', (value) => new RegExp('^[0-9]+\/[0-9]+$', 'g').test(value)) }
                })
              } else {
                Object.keys(railForm[key1][key2]).forEach((key3) => {
                  rule[key1][key2][key3] = { required }
                })
              }
            } else if (key2 === 'areaCondition') {
              rule[key1][key2] = { required, minLength: minLength(1) }
            } else {
              rule[key1][key2] = { required }
            }
          }
        })
      } else if (key1 === 'railDamageSurvey') {
        Object.keys(railForm[key1]).forEach((key2) => {
          // CHECK LENGTH OF UPLOADIMAGES
          if (key2 === 'uploadImages') {
            rule[key1][key2] = {
              // requiredif: requiredIf(() => {
              //   return railSurvey[key1][key2].filter(upload => upload.isUploaded).length > 0
              // })
              $each: helpers.forEach(uploadImage),
              maxLength: maxLength(3)
            }
            // railSurvey[key1][key2].forEach(element => {
            //   if (!element.isUploaded) {

            //   }
            // })
            // if (railSurvey[key1][key2].length > 0) {
            // }
          } else if (key2 === 'surfaceDefectPattern') {
            rule[key1][key2] = { surfaceDefectPattern: requiredIf(() => railSurvey[key1]['defectPattern'].includes('surfaceDefect')) }
          } else {
            rule[key1][key2] = { required, minLength: minLength(1) }
          }
        })
      } else if (key1 === 'trackDamageSurvey') {
        Object.keys(railForm[key1]).forEach((key2) => {
          if (['trackGeometryCondition', 'ballastCondition', 'sleeperCondition'].includes(key2)) {
            rule[key1][key2] = {}
            Object.keys(railForm[key1][key2]).forEach((key3) => {
              if (key3 === 'condition') {
                rule[key1][key2][key3] = { isPerfect: requiredIf(() => railSurvey[key1][key2]['isPerfect'] === 'imperfect' || railSurvey[key1][key2]['isPerfect'] === 'defective'), minLength: minLength(1) }
              } else {
                rule[key1][key2][key3] = { required }
              }
            })
          } else if (key2 === 'uploadImages') {
            rule[key1][key2] = {
              $each: helpers.forEach(uploadImage),
              maxLength: maxLength(3)
            }
          } else {
            rule[key1][key2] = { required }
          }
        })
      } else if (key1 === 'maintenanceRate') {
        Object.keys(railForm[key1]).forEach((key2) => {
          if (key2 !== 'comment') {
            if (key2 === 'maintenanceRecord') {
              rule[key1][key2] = {}
              Object.keys(railForm[key1][key2]).forEach((key3) => {
                if (key3 === 'hasMaintenanceRecord') {
                  rule[key1][key2][key3] = { required }
                } else {
                  rule[key1][key2][key3] = { hasMaintenanceRecord: requiredIf(() => railSurvey[key1][key2]['hasMaintenanceRecord']) }
                }
              })
            } else if (key2 === 'maintenanceMethod') {
              // rule[key1][key2] = { required, minLength: minLength(1) }
            } else {
              rule[key1][key2] = { required }
            }
          }
        })
      }
    } else {
      rule[key1] = { required }
    }
  })
  return rule
}