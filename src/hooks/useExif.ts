import { useEffect, useState } from 'react'
import EXIF from 'exif-js'
import env from 'react-dotenv'
import type { EXIFType } from '../types'

function useExif(fileData: FileSystemFileEntry) {
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [exifExtracted, setExifExtracted] = useState<EXIFType>({})
  const [isLoadingGeoNames, setIsLoadingGeoNames] = useState(false)

  const getExifData = async (file): Promise<EXIFType> => {
    const arrayBuffer = await file.arrayBuffer()
    return EXIF.readFromBinaryFile(arrayBuffer)
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

  const isExifPresent = (exifOverride?): boolean => {
    const exifToAnalyze = exifOverride || exifExtracted

    const gpsKeys = [
      'GPSLatitude',
      'GPSLatitudeRef',
      'GPSLongitude',
      'GPSLongitudeRef',
    ]

    return gpsKeys.every((keyName) => !!exifToAnalyze[keyName])
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

      const isValidExif = isExifPresent(exif)

      if (!isValidExif) {
        setCity(null)
        setCountry(null)
        setIsLoadingGeoNames(false)
        return
      }

      const location = await getLocationName(exif)
      setCity(location.city)
      setCountry(location.country)
      setIsLoadingGeoNames(false)
    }

    updateGeoOnChange()
  }, [fileData])

  return {
    city,
    country,
    exifExtracted,
    isExifPresent,
    isLoadingGeoNames,
  }
}

export default useExif
