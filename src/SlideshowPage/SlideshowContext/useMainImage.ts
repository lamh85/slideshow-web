import { useState } from 'react'
import { Image } from '../../types'
import { fileNameToMoment } from '../../helpers/time'
import { useAppContext } from '../../App'

const MONTHS_BY_INDEX = [
  null,
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const useMainImage = () => {
  const { playlist, playlistCursor, images } = useAppContext()
  const [objectFit, setObjectFit] = useState<'cover' | 'contain'>('cover')

  const getMainImage = () => {
    const imageIndex = playlist[playlistCursor]

    return images[imageIndex]
  }

  const getDate = () => {
    const mainImage = getMainImage()

    if (!mainImage) {
      return ''
    }

    const fileName = mainImage.name

    const momentDate = fileNameToMoment(fileName)
    const date = momentDate.date()
    const monthName = MONTHS_BY_INDEX[momentDate.month()]
    const year = momentDate.year()

    return `${date} ${monthName} ${year}`
  }

  const handleToggleObjectFit = () => {
    const nextState = objectFit === 'contain' ? 'cover' : 'contain'
    setObjectFit(nextState)
  }

  return {
    mainImage: getMainImage(),
    date: getDate(),
    objectFit,
    setObjectFit: handleToggleObjectFit,
  }
}

export default useMainImage
