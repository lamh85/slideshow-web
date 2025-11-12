import { useState } from 'react'

export const useGallery = () => {
  const [showingGallery, setShowingGallery] = useState<boolean>(false)

  const toggleGallery = () => setShowingGallery(!showingGallery)

  return {
    showingGallery,
    toggleGallery,
  }
}
