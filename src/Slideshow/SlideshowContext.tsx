import { createContext } from 'react'
import { ImageT, ThumbnailT } from '../useImagePlayer'

type ContextPropsT = {
  handleShuffleClick: () => void
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
}

export const SlideshowContext = createContext<ContextPropsT>(null)