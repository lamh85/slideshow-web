import React from 'react'
import { useAppContext } from './App'
import { Gallery } from './GalleryPage'
import Slideshow from './SlideshowPage'
import { UploadPage } from './UploadPage'

export function Router() {
  const { showingGallery, isLoadingImages } = useAppContext()

  let currentPage = 'UPLOAD'
  if (showingGallery) {
    currentPage = 'GALLERY'
  } else if (!isLoadingImages) {
    currentPage = 'SLIDESHOW'
  }

  return {
    UPLOAD: <UploadPage />,
    GALLERY: <Gallery />,
    SLIDESHOW: <Slideshow />,
  }[currentPage]
}
