import React, { createContext } from 'react'
import useExif from '../hooks/useExif'
import usePlaylist, { ThumbnailT } from '../hooks/usePlaylist'
import useMainImage from '../hooks/useMainImage'
import useNavigation from '../hooks/useNavigation'
import { Image } from '../types'

type ContextPropsT = {
  images: Image[]
  handleShuffleClick: (event: any) => void
  thumbnails: ThumbnailT[]
  currentImage: Image
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
}

export const SlideshowContext = createContext<ContextPropsT>(null)

type ProviderPropsT = {
  images: Image[]
  children: React.ReactNode
}

export const SlideshowProvider = (props: ProviderPropsT) => {
  const {
    playlist,
    playlistCursor,
    setPlaylistCursor,
    thumbnails,
    dateSorting,
    sort,
    randomizeSort,
  } = usePlaylist(props.images)

  const { mainImage, date, objectFit, setObjectFit } = useMainImage({
    playlist,
    playlistCursor,
    images: props.images,
  })

  const getCurrentImageFileData = () => {
    const imageIndex = playlist[playlistCursor]
    const imageObj = props.images[imageIndex]
    return imageObj?.fileData
  }

  const { city, country, gpsFromExif, exifExtracted, isLoadingGeoNames } =
    useExif(getCurrentImageFileData())

  const { keyDownHandler, navigate, navigateToDate } = useNavigation({
    playlistCursor,
    images: props.images,
    playlist,
    setPlaylistCursor,
    dateSorting,
  })

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
      }}
    >
      {props.children}
    </SlideshowContext.Provider>
  )
}
