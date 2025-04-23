import { useCallback, useEffect, useState } from 'react'
import EXIF from 'exif-js'
import env from 'react-dotenv'

interface ExifReadResultT {
  GPSLatitude?: number[]
  GPSLatitudeRef?: 'N' | 'S'
  GPSLongitude?: number[]
  GPSLongitudeRef?: 'W' | 'E'
}

function useExif(fileData: FileSystemFileEntry) {
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [exifExtracted, setExifExtracted] = useState({})
  const [isLoadingGeoNames, setIsLoadingGeoNames] = useState(false)

  const getExifData = async (file): Promise<ExifReadResultT> => {
    const arrayBuffer = await file.arrayBuffer()
    return EXIF.readFromBinaryFile(arrayBuffer)
  }

  const getGpsFromExif = useCallback(
    (exifOverride?): ExifReadResultT => {
      const exifToAnalyze = exifOverride || exifExtracted

      const { GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef } =
        exifToAnalyze

      return {
        GPSLatitude,
        GPSLatitudeRef,
        GPSLongitude,
        GPSLongitudeRef,
      }
    },
    [exifExtracted]
  )

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

  useEffect(() => {
    const updateGeoOnChange = async () => {
      setIsLoadingGeoNames(true)
      setExifExtracted({})

      if (!fileData) {
        return
      }

      const exif = await getExifData(fileData)
      setExifExtracted(exif)

      const extractedGps = getGpsFromExif(exif)

      const isValidGps = Object.values(extractedGps).every((item) => !!item)

      if (!isValidGps) {
        setCity(null)
        setCountry(null)
        setIsLoadingGeoNames(false)
        return
      }

      const location = await getLocationName(extractedGps)
      setCity(location.city)
      setCountry(location.country)
      setIsLoadingGeoNames(false)
    }

    updateGeoOnChange()
  }, [fileData])

  return {
    city,
    country,
    gpsFromExif: getGpsFromExif(),
    exifExtracted,
    isLoadingGeoNames,
  }
}

export default useExif
