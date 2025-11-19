import React from 'react'
import { useAppContext } from '../App'

export function Gallery() {
  const { toggleGallery } = useAppContext()

  return (
    <div>
      <div>this is a gallery</div>
      <button onClick={toggleGallery}>EXIT GALLERY</button>
    </div>
  )
}
