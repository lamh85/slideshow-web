import React from 'react'
import { useSlideshowContext } from '../SlideshowContext'

export function ImageInfo() {
  const { city, country, date, isLoadingGeoNames } = useSlideshowContext()

  if (isLoadingGeoNames) {
    return (
      <div className="image-info loading-location">
        <div className="date">{date}</div>
      </div>
    )
  }

  return (
    <div className="image-info">
      <div className="city-name">{city}</div>
      <img
        className="flag"
        src={`https://flagcdn.com/${country.toLowerCase()}.svg`}
        alt={`Flag of ${country}`}
      />
      <div className="date">{date}</div>
    </div>
  )
}
