import React, { useContext } from 'react'
import { SlideshowContext } from './SlideshowContext'

export const GpsBar = () => {
  const { exifExtracted, isExifPresent } = useContext(SlideshowContext)

  const gpsString = () => {
    if (!isExifPresent) {
      return ''
    }

    const { GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef } =
      exifExtracted

    return `${GPSLatitude[0]}°${GPSLatitude[1]}'${GPSLatitude[2]}"${GPSLatitudeRef} ${GPSLongitude[0]}°${GPSLongitude[1]}'${GPSLongitude[2]}"${GPSLongitudeRef}`
  }

  return (
    <div
      style={{
        background: 'white',
        left: 0,
        bottom: 0,
        position: 'absolute',
      }}
    >
      {gpsString()}
    </div>
  )
}
