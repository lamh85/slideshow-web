import React from 'react'
import styles from './styles.module.scss'
import { useSlideshowContext } from '../SlideshowContext'

export function ImageInfo() {
  const { city, country, date, isLoadingGeoNames } = useSlideshowContext()

  if (isLoadingGeoNames) {
    return (
      <div className={`${styles.imageInfo} ${styles.loadingLocation}`}>
        <div className={styles.date}>{date}</div>
      </div>
    )
  }

  return (
    <div className={styles.imageInfo}>
      <div className={styles.cityName}>{city}</div>
      <img
        className={styles.flag}
        src={`https://flagcdn.com/${country.toLowerCase()}.svg`}
        alt={`Flag of ${country}`}
      />
      <div className={styles.date}>{date}</div>
    </div>
  )
}
