import React, { useContext } from 'react'
import { AppContext } from '../App'

export function Gallery() {
  const { toggleGallery } = useContext(AppContext)

  return (
    <div>
      <div>this is a gallery</div>
      <button onClick={toggleGallery}>EXIT GALLERY</button>
    </div>
  )
}
