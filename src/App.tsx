import React, { createContext, useContext, useState } from 'react'
import './App.css'
import Slideshow from './Slideshow'
import { Gallery } from './Gallery'
import usePlaylist, { type UsePlaylistResult } from './hooks/usePlaylist'
import { useGallery, UseGalleryResults } from './hooks/useGallery'
import { fileNameToMoment } from './helpers/time'

type AppContextT = UsePlaylistResult & UseGalleryResults

const AppContext = createContext<AppContextT>({
  playlist: [],
  playlistCursor: 0,
  setPlaylistCursor: () => {},
  thumbnails: [],
  dateSorting: 'asc',
  sort: () => {},
  randomizeSort: () => {},
  images: [],
  setImages: () => {},
  showingGallery: false,
  toggleGallery: () => {},
  galleryImages: [],
})

export const useAppContext = () => {
  return useContext(AppContext)
}

const UploadPage = ({ setIsLoadingImages }) => {
  const { setImages } = useAppContext()

  const getTimeStamp = (fileName) => {
    return fileNameToMoment(fileName).toISOString().split('T')[0]
  }

  const uploadClickHandler = async () => {
    const dirHandle = await window.showDirectoryPicker()

    const images = []

    for await (const entry of dirHandle.values()) {
      const { name } = entry

      if (!name.includes('.jpg')) {
        continue
      }

      const fileHandle = await dirHandle.getFileHandle(name)
      const fileData = await fileHandle.getFile()
      const blob = URL.createObjectURL(fileData)

      const image = {
        blob,
        name,
        timeStamp: getTimeStamp(name),
        fileData,
      }

      images.push(image)
    }

    setImages(images)
    setIsLoadingImages(false)
  }

  return <button onClick={uploadClickHandler}>Select a folder of images</button>
}

const AppWithoutProvider = () => {
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const { showingGallery } = useAppContext()

  let currentPage = 'UPLOAD'
  if (showingGallery) {
    currentPage = 'GALLERY'
  } else if (!isLoadingImages) {
    currentPage = 'SLIDESHOW'
  }

  return (
    <div className="App" style={{ width: '100%', height: '100%' }}>
      {currentPage === 'UPLOAD' && (
        <UploadPage setIsLoadingImages={setIsLoadingImages} />
      )}
      {currentPage === 'SLIDESHOW' && <Slideshow />}
      {currentPage === 'GALLERY' && <Gallery />}
    </div>
  )
}

function App() {
  const useGalleryProps = useGallery()
  const usePlaylistProps = usePlaylist()

  return (
    <AppContext.Provider value={{ ...useGalleryProps, ...usePlaylistProps }}>
      <AppWithoutProvider />
    </AppContext.Provider>
  )
}

export default App
