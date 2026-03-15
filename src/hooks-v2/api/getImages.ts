import { fileNameToMoment } from '../../helpers/time'
import { Image } from '../../types'

const getTimeStamp = (fileName: string) => {
  return fileNameToMoment(fileName).toISOString().split('T')[0]
}

// TODO: Convert this to a hook, and use React Query to cache results.
export async function getImages(): Promise<Image[]> {
  const dirHandle = await window.showDirectoryPicker()

  const images: Image[] = []

  for await (const entry of dirHandle.values()) {
    const { name } = entry

    if (!name.includes('.jpg')) {
      continue
    }

    const fileHandle = await dirHandle.getFileHandle(name)
    const fileData = await fileHandle.getFile()
    const blob = URL.createObjectURL(fileData)

    const image: Image = {
      blob,
      name,
      timeStamp: getTimeStamp(name),
      fileData,
    }

    images.push(image)
  }

  return images
}
