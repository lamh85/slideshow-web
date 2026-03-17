import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fileNameToMoment } from '../../helpers/time'
import { Image } from '../../types'

const getTimeStamp = (fileName: string) => {
  return fileNameToMoment(fileName).toISOString().split('T')[0]
}

// TODO: Convert this to a hook, and use React Query to cache results.
export function useImages(): UseQueryResult<Image[], unknown> {
  const queryFn = async () => {
    // FileSystemDirectoryHandle
    const dirHandle = await window.showDirectoryPicker()

    const images: Image[] = []

    // AsyncIterable<FileSystemHandle>
    for await (const entry of dirHandle.values()) {
      const { name } = entry

      if (!name.includes('.jpg')) {
        continue
      }

      // Promise<FileSystemFileHandle>
      const fileHandle = await dirHandle.getFileHandle(name)
      // Promise<File>
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

  const result = useQuery({
    // TODO: If possible, use the directory as the key
    queryKey: ['images'],
    queryFn,
  })

  return result
}
