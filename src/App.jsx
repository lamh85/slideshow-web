import { useState } from 'react'
import './App.css'
import Slideshow from './Slideshow'

function App() {
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [images, setImages] = useState([]) // List of blob URLs

  const getTimeStamp = (fileName) => {
    // EG: IMG_20191114_145429
    if (fileName.slice(0, 3) === 'IMG') {
      const dateRaw = fileName.slice(4, 12)
      const year = dateRaw.slice(0, 4)
      const month = dateRaw.slice(4, 6)
      const day = dateRaw.slice(6, 9)

      return `${year}-${month}-${day}`
    } else {
      // EG: 2017-04-14 12.05.33
      const dateRaw = fileName.slice(0, 10)
      const dateParts = dateRaw.split('-')
      const year = dateParts[0]
      const month = dateParts[1]
      const day = dateParts[2]
      return `${year}-${month}-${day}`
    }
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
