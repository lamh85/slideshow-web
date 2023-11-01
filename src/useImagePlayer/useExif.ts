import { useEffect, useState } from 'react'
import EXIF from 'exif-js'
import env from 'react-dotenv'

interface ImageT {
  blob: string
  name: string
  timeStamp: string
  fileData: FileSystemFileEntry
}

interface InitialStatesT {
  playlist: number[] | []
  playlistCursor: number
  images: ImageT[]
}

function useExif({ playlist, playlistCursor, images }: InitialStatesT) {
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [exifExtracted, setExifExtracted] = useState({})

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

    const fetchOptions = {
      headers: {
        Accept: 'application/json',
      },
    }

    const res = await fetch(
      `
      ${env.API_URL}/locations?longtitude=${GPSLongitude[0]}°${GPSLongitude[1]}&longtitudeDirection=${GPSLongitudeRef}&latitude=${GPSLatitude[0]}°${GPSLatitude[1]}&latitudeDirection=${GPSLatitudeRef}
    `,
      fetchOptions
    )

    const responseJson = await res.json()
    const location = responseJson[0]
    setCity(location.name)
    setCountry(location.country)
  }

  useEffect(() => {
    updateGeoOnChange()
  }, [playlist, playlistCursor, images])

  return {
    city,
    country,
    gpsFromExif: getGpsFromExif(),
    exifExtracted,
  }
}

export default useExif
