import React, { createContext } from 'react'
import useExif from '../hooks/useExif'
import useImagePlayer, { ImageT, ThumbnailT } from '../hooks/usePlaylist'

type ContextPropsT = {
  images: ImageT[]
  handleShuffleClick: (event: any) => void
  thumbnails: ThumbnailT[]
  currentImage: ImageT
  handleToggleObjectFit: () => void
  dateSorting: 'asc' | 'desc' | 'random'
  handleSortDate: (override?: string) => void
  navigateToHome: () => void
  navigateToEnd: () => void
  navigateToIndex: (index: number) => void
  navigateToDate: (date: string) => void
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
    playlist,
    playlistCursor,
    thumbnails,
    mainImage,
    date,
    objectFit,
    dateSorting,
    keyDownHandler,
    sort,
    navigate,
    navigateToDate,
    setObjectFit,
    randomizeSort,
  } = useImagePlayer(props.images)

  const getCurrentImageFileData = () => {
    const imageIndex = playlist[playlistCursor]
    const imageObj = props.images[imageIndex]
    return imageObj?.fileData
  }

  const { city, country, gpsFromExif, exifExtracted, isLoadingGeoNames } =
    useExif(getCurrentImageFileData())

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
        images: props.images,
        handleShuffleClick: randomizeSort,
        thumbnails,
        currentImage: mainImage,
        handleToggleObjectFit: setObjectFit,
        dateSorting: dateSorting,
        handleSortDate: sort,
        navigateToHome: () => navigate({ index: 0 }),
        navigateToEnd: () => navigate({ index: props.images.length - 1 }),
        navigateToIndex: (index) => navigate({ index }),
        navigateToDate,
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
