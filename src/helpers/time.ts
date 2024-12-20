import moment from 'moment'

export const fileNameToMoment = (fileName) => {
  let momentInput = ''

  if (fileName.includes(' ')) {
    // EG: 2017-04-14 12.05.33
    momentInput = fileName.split(' ')[0]
  } else {
    // IMG_20191114_145429
    momentInput = fileName.split('_')[1]
  }

  return moment(momentInput)
}
