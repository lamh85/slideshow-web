import { useState } from 'react'
import { getImages } from '../api/getImages'
import { Image } from '../../types'

type ReturnType = {
  handleClickUpload: () => void
  images: Image[]
  isLoadingImages: boolean
}

export function useImages(): ReturnType {
  const [images, setImages] = useState<Image[]>([])
  const [isLoadingImages, setIsLoadingImages] = useState(true)

  const handleClickUpload = async () => {
    setIsLoadingImages(true)
    const images = await getImages()
    setImages(images)
    setIsLoadingImages(false)
  }

  return {
    images,
    handleClickUpload,
    isLoadingImages,
  }
}
