import React, { useContext } from 'react'
import { SlideshowContext } from './SlideshowContext'

export const GpsBar = () => {
  const { gpsString } = useContext(SlideshowContext)

  return (
    <div
      style={{
        background: 'white',
        left: 0,
        bottom: 0,
        position: 'absolute',
      }}
    >
      {gpsString}
    </div>
  )
}
