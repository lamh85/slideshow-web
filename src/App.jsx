import { useState } from 'react'
import './App.css'
import Slideshow from './Slideshow'
import { fileNameToMoment } from './helpers/time'

function App() {
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [images, setImages] = useState([]) // List of blob URLs

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

  return (
    <div className="App" style={{ width: '100%', height: '100%' }}>
      {!isLoadingImages ? (
        <Slideshow isLoadingImages={isLoadingImages} images={images} />
      ) : (
        <button onClick={uploadClickHandler}>Select a folder of images</button>
      )}
    </div>
  )
}

export default App
