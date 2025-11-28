import { useState } from 'react'

type UseGalleryResults = {
  showingGallery: boolean
  toggleGallery: () => void
}

export const useGallery = (): UseGalleryResults => {
  const [showingGallery, setShowingGallery] = useState<boolean>(false)

  const toggleGallery = () => {
    setShowingGallery(!showingGallery)
  }

  return {
    showingGallery,
    toggleGallery,
  }
}
