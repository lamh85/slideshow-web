import React from 'react'
import { useAppContext } from '../App'

export function Gallery() {
  const { toggleGallery, galleryImages, playlistCursor, setPlaylistCursor } =
    useAppContext()

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'top' }}>
      <div>
        <img
          src={galleryImages[playlistCursor].blob}
          alt="Thumbnail"
          style={{ width: '300px', height: '150px' }}
        />
        <button onClick={toggleGallery}>EXIT GALLERY</button>
      </div>
      <div style={{ height: '450px', overflowY: 'scroll' }}>
        {galleryImages.map((image, index) => {
          const style = {
            ...(index === playlistCursor ? { border: '3px solid yellow' } : {}),
            pointer: 'cursor',
            width: '100px',
            height: '50px',
          }

          return (
            <img
              key={image.blob}
              src={image.blob}
              onClick={() => setPlaylistCursor(index)}
              style={style}
              alt="Thumbnail"
            />
          )
        })}
      </div>
    </div>
  )
}
