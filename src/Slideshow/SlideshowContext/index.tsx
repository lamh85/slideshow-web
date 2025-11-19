import React, { createContext } from 'react'
import { useAppContext } from '../../App'
import useExif from './useExif'
import useMainImage from './useMainImage'
import useNavigation from './useNavigation'
import { Image } from '../../types'
import type { EXIFType } from '../../types'

type ContextPropsT = {
  currentImage: Image
  handleToggleObjectFit: () => void
  navigateToHome: () => void
  navigateToEnd: () => void
  navigateToIndex: (index: number) => void
  navigateToDate: (date: string) => void
  city: string
  country: string
  isExifPresent: () => boolean
  isLoadingGeoNames: boolean
  objectFit: 'cover' | 'contain'
  date: string
  exifExtracted: EXIFType
  keyDownHandler: (event: any) => void
}

export const SlideshowContext = createContext<ContextPropsT>(null)

type ProviderPropsT = {
  children: React.ReactNode
}

export const SlideshowProvider = (props: ProviderPropsT) => {
  const { playlist, playlistCursor, setPlaylistCursor, dateSorting, images } =
    useAppContext()

  const { mainImage, date, objectFit, setObjectFit } = useMainImage({
    playlist,
    playlistCursor,
    images,
  })

  const getCurrentImageFileData = () => {
    const imageIndex = playlist[playlistCursor]
    const imageObj = images[imageIndex]
    return imageObj?.fileData
  }

  const { city, country, exifExtracted, isExifPresent, isLoadingGeoNames } =
    useExif(getCurrentImageFileData())

  const { keyDownHandler, navigate, navigateToDate } = useNavigation({
    playlistCursor,
    images,
    playlist,
    setPlaylistCursor,
    dateSorting,
  })

  return (
    <SlideshowContext.Provider
      value={{
        currentImage: mainImage,
        handleToggleObjectFit: setObjectFit,
        navigateToHome: () => navigate({ index: 0 }),
        navigateToEnd: () => navigate({ index: images.length - 1 }),
        navigateToIndex: (index) => navigate({ index }),
        navigateToDate,
        city,
        country,
        isExifPresent,
        isLoadingGeoNames,
        objectFit,
        date,
        exifExtracted,
        keyDownHandler,
      }}
    >
      {props.children}
    </SlideshowContext.Provider>
  )
}
