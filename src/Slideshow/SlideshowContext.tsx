import React, { createContext } from 'react'
import useImagePlayer, { ImageT, ThumbnailT } from '../useImagePlayer'

type ContextPropsT = {
  handleShuffleClick: (event: any) => void
  thumbnails: ThumbnailT[]
  currentImage: ImageT
  handleToggleObjectFit: () => void
  dateSorting: string
  handleSortDate: (override?: string) => void
  navigateToHome: () => void
  navigateToEnd: () => void
  navigateToIndex: (index: number) => void
  city: string
  country: string
  isLoadingGeoNames: boolean
  objectFit: string
  date: string
  gpsFromExif: object
  exifExtracted: object
  keyDownHandler: (event: any) => void
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

  return (
    <SlideshowContext.Provider
      value={{
        handleShuffleClick: randomizeSort,
        thumbnails,
        currentImage: mainImage,
        handleToggleObjectFit: setObjectFit,
        dateSorting: dateSorting,
        handleSortDate: sort,
        navigateToHome: () => navigate({ index: 0}),
        navigateToEnd: () => navigate({ index: props.images.length - 1}),
        navigateToIndex: (index) => navigate({ index }),
        city,
        country,
        isLoadingGeoNames,
        objectFit,
        date,
        gpsFromExif,
        exifExtracted,
        keyDownHandler,
      }}
    >
      {props.children}
    </SlideshowContext.Provider>
  )
}