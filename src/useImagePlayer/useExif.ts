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

interface ExifReadResultT {
  GPSLatitude?: number[]
  GPSLatitudeRef?: 'N' | 'S'
  GPSLongitude?: number[]
  GPSLongitudeRef?: 'W' | 'E'
}

function useExif({ playlist, playlistCursor, images }: InitialStatesT) {
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [exifExtracted, setExifExtracted] = useState({})

  const getExifData = async (file): Promise<ExifReadResultT> => {
    const arrayBuffer = await file.arrayBuffer()
    return EXIF.readFromBinaryFile(arrayBuffer)
  }

  const getGpsFromExif = (
    exifOverride?
  ): ExifReadResultT & { isValid: boolean } => {
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

  const getLocationName = async (exifData) => {
    const { GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef } =
      exifData

    const [latitudeDegrees, latitudeMinutes] = GPSLatitude
    const [longitudeDegrees, longitudeMinutes] = GPSLongitude

    const params = new URLSearchParams()
    const paramPairs = [
      ['longitude_degrees', longitudeDegrees],
      ['longitude_minutes', longitudeMinutes],
      ['longitude_direction', GPSLongitudeRef],
      ['latitude_degrees', latitudeDegrees],
      ['latitude_minutes', latitudeMinutes],
      ['latitude_direction', GPSLatitudeRef],
    ]
    paramPairs.forEach((pair) => params.set(pair[0], pair[1]))

    const fetchOptions = {
      headers: {
        Accept: 'application/json',
      },
    }

    const res = await fetch(
      `${env.API_URL}/locations?${params.toString()}`,
      fetchOptions
    )

    return await res.json()
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

    const location = await getLocationName(extractedGps)
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
