import { useEffect, useState } from 'react'
import EXIF from 'exif-js'

interface ImageT {
  blob: string
  name: string
  timeStamp: string
  fileData: FileSystemFileEntry
}

type ImageIndexT = number

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

function useImagePlayer(images: ImageT[]) {
  const [playlistCursor, setPlaylistCursor] = useState(0)
  const [playlist, setPlaylist] = useState<number[] | []>([])
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [exifExtracted, setExifExtracted] = useState({})
  const [objectFit, setObjectFit] = useState('cover')
  const [dateSorting, setDateSorting] = useState('')

  const getThumbnails = () => {
    const thumbCountBefore = 2
    const thumbCountAfter = 2

    const sliceStart = Math.max(0, playlistCursor - thumbCountBefore)
    const sliceAfter = Math.min(
      playlist.length,
      playlistCursor + thumbCountAfter + 1
    )
    const imageIndices = playlist.slice(sliceStart, sliceAfter)
    return imageIndices.map((query) => images[query].blob)
  }

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

    // EG: IMG_20191114_145429
    if (fileName.slice(0, 3) === 'IMG') {
      const dateRaw = fileName.slice(4, 12)
      const year = dateRaw.slice(0, 4)
      const month = dateRaw.slice(4, 6)
      const day = dateRaw.slice(6, 9)

      return `${Number(day)} ${MONTHS_BY_INDEX[Number(month)]} ${year}`
    } else {
      // EG: 2017-04-14 12.05.33
      const dateRaw = fileName.slice(0, 10)
      const dateParts = dateRaw.split('-')
      const year = dateParts[0]
      const month = dateParts[1]
      const day = dateParts[2]
      return `${Number(day)} ${MONTHS_BY_INDEX[Number(month)]} ${year}`
    }
  }

  const getExifData = async (file) => {
    const arrayBuffer = await file.arrayBuffer()
    return EXIF.readFromBinaryFile(arrayBuffer)
  }

  const getGpsFromExif = (exifOverride?) => {
    const exifToAnalyze = exifOverride || exifExtracted

    if (Object.keys(exifToAnalyze).length === 0) {
      return { isValid: false }
    }

    const { GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef } =
      exifToAnalyze

    if (
      [GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef].includes(
        undefined
      )
    ) {
      return { isValid: false }
    }

    return {
      GPSLatitude,
      GPSLatitudeRef,
      GPSLongitude,
      GPSLongitudeRef,
      isValid: true,
    }
  }

  const updateGeoOnChange = async () => {
    setExifExtracted({})
    const imageIndex = playlist[playlistCursor]
    const imageObj = images[imageIndex]
    const fileData = imageObj?.fileData

    if (!fileData) {
      return
    }

    const exif = await getExifData(fileData)
    setExifExtracted(exif)

    const extractedGps = getGpsFromExif(exif)
    if (!extractedGps.isValid) {
      console.log('No GPS data found in Exif.')
      setCity('')
      setCountry('')
      return
    }

    const { GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef } =
      extractedGps

    const res = await fetch(`
      http://localhost:3001/geo_names?longtitude=${GPSLongitude[0]}°${GPSLongitude[1]}&longtitudeDirection=${GPSLongitudeRef}&latitude=${GPSLatitude[0]}°${GPSLatitude[1]}&latitudeDirection=${GPSLatitudeRef}
    `)

    const responseJson = await res.json()
    setCity(responseJson.city)
    setCountry(responseJson.country)
  }

  const handleToggleObjectFit = () => {
    const nextState = objectFit === 'contain' ? 'cover' : 'contain'
    setObjectFit(nextState)
  }

  const handleSortDate = (override?: 'asc' | 'desc') => {
    let nextState = ''
    if (override) {
      nextState = override
    } else {
      nextState = dateSorting === 'asc' ? 'desc' : 'asc'
    }

    setDateSorting(nextState)
    setPlaylistCursor(0)

    const toSort = [...images].map((image, index) => {
      return { ...image, imagesIndex: index }
    })

    const sorted = toSort.sort((a, b) => {
      if (a.timeStamp > b.timeStamp) {
        return nextState === 'asc' ? 1 : -1
      } else {
        return nextState === 'asc' ? -1 : 1
      }
    })

    const newPlaylist = sorted.map((image) => image.imagesIndex)
    setPlaylist(newPlaylist)
  }

  const randomizeArray = (array) => {
    return array.sort((a, b) => {
      const randomNumber = Math.random()

      if (randomNumber > 0.5) {
        return 1
      } else {
        return -1
      }
    })
  }

  const handleShuffleClick = (_event) => {
    console.log('shuffling')
    setPlaylist(randomizeArray(playlist))
    setDateSorting('random')
  }

  const navigatePlaylist = (increment) => {
    const maxPosition = images.length - 1

    if (increment > 0 && playlistCursor === maxPosition) {
      setPlaylistCursor(0)
    } else if (increment < 0 && playlistCursor === 0) {
      setPlaylistCursor(maxPosition)
    } else {
      setPlaylistCursor(playlistCursor + increment)
    }
  }

  const keyDownHandler = (event) => {
    const { code } = event

    let increment = 0

    if (['ArrowDown', 'ArrowRight'].includes(code)) {
      increment = 1
    }

    if (['ArrowUp', 'ArrowLeft'].includes(code)) {
      increment = -1
    }

    navigatePlaylist(increment)
  }

  useEffect(() => {
    const htmlElem = document.querySelector('html')
    htmlElem?.removeEventListener('keydown', keyDownHandler)
    htmlElem?.addEventListener('keydown', keyDownHandler)

    return () => {
      htmlElem?.removeEventListener('keydown', keyDownHandler)
    }
    // Must update the event handler to prevent stale states in the handler functions.
    // Dependencies should include every state required to run the handler
    // and its recursively called functions.
  }, [playlistCursor, images])

  useEffect(() => {
    updateGeoOnChange()
  }, [playlist, playlistCursor, images])

  useEffect(() => {
    handleSortDate('asc')
  }, [])

  return {
    thumbnails: getThumbnails(),
    mainImage: getMainImage(),
    date: getDate(),
    city,
    country,
    objectFit,
    gpsFromExif: getGpsFromExif(),
    exifExtracted,
    dateSorting,
    keyDownHandler,
    sort: handleSortDate,
    navigate: navigatePlaylist,
    setObjectFit: handleToggleObjectFit,
    randomizeSort: handleShuffleClick,
  }
}

export default useImagePlayer
