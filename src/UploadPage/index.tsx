import React from 'react'
import { useAppContext } from '../App'
import { fileNameToMoment } from '../helpers/time'

export function UploadPage() {
  const { setImages, setIsLoadingImages } = useAppContext()

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
