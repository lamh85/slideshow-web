import React, { createContext } from 'react'
import useImagePlayer, { ImageT, ThumbnailT } from '../useImagePlayer'

type ContextPropsT = {
  handleShuffleClick: (event: any) => void
  thumbnails: ThumbnailT[]
  currentImage: ImageT
  handleToggleObjectFit: () => void
  dateSorting: 'asc' | 'desc' | 'random'
  handleSortDate: (override?: string) => void
  navigateToHome: () => void
  navigateToEnd: () => void
  navigateToIndex: (index: number) => void
  city: string
  country: string
  isLoadingGeoNames: boolean
  objectFit: 'cover' | 'contain'
  date: string
  gpsFromExif: object
  exifExtracted: object
  keyDownHandler: (event: any) => void
  gpsString: string
}

export const SlideshowContext = createContext<ContextPropsT>(null)

type ProviderPropsT = {
  images: ImageT[]
  children: React.ReactNode
}

export const SlideshowProvider = (props: ProviderPropsT) => {
  const {
    thumbnails,
    mainImage,
    date,
    city,
    country,
    objectFit,
    gpsFromExif,
    exifExtracted,
    isLoadingGeoNames,
    dateSorting,
    keyDownHandler,
    sort,
    navigate,
    setObjectFit,
    randomizeSort,
  } = useImagePlayer(props.images)

  const getGpsString = () => {
    const isValidGps = Object.values(gpsFromExif).every((item) => !!item)

    if (!isValidGps) {
      return ''
    }

    const { GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef } =
      exifExtracted

    return `${GPSLatitude[0]}°${GPSLatitude[1]}'${GPSLatitude[2]}"${GPSLatitudeRef} ${GPSLongitude[0]}°${GPSLongitude[1]}'${GPSLongitude[2]}"${GPSLongitudeRef}`
  }

  return (
    <SlideshowContext.Provider
      value={{
        handleShuffleClick: randomizeSort,
        thumbnails,
        currentImage: mainImage,
        handleToggleObjectFit: setObjectFit,
        dateSorting: dateSorting,
        handleSortDate: sort,
        navigateToHome: () => navigate({ index: 0 }),
        navigateToEnd: () => navigate({ index: props.images.length - 1 }),
        navigateToIndex: (index) => navigate({ index }),
        city,
        country,
        isLoadingGeoNames,
        objectFit,
        date,
        gpsFromExif,
        exifExtracted,
        keyDownHandler,
        gpsString: getGpsString(),
      }}
    >
      {props.children}
    </SlideshowContext.Provider>
  )
}
