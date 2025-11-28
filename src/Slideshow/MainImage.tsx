import React from 'react'
import { useSlideshowContext } from './SlideshowContext'

export const MainImage = () => {
  const { currentImage, objectFit, keyDownHandler } = useSlideshowContext()

  return (
    <img
      alt="something"
      src={currentImage?.blob || ''}
      style={{ width: '100%', height: '100%', objectFit: objectFit }}
      onKeyDown={keyDownHandler}
    />
  )
}
