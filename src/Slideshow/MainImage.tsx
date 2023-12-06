import React, { useContext } from 'react'
import { SlideshowContext } from './SlideshowContext'

export const MainImage = () => {
  const { currentImage, objectFit, keyDownHandler } = useContext(SlideshowContext)

  return (
    <img
      alt="something"
      src={currentImage?.blob || ''}
      style={{ width: '100%', height: '100%', objectFit: objectFit }}
      onKeyDown={keyDownHandler}
    />
  )
}