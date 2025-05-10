import { Image } from '../types'

type Options = {
  playlist: number[]
  playlistCursor: number
  images: Image[]
}

const useMainImage = (options: Options) => {
  const { playlist, playlistCursor, images } = options

  const getMainImage = () => {
    const imageIndex = playlist[playlistCursor]

    return images[imageIndex]
  }

  return {
    mainImage: getMainImage(),
  }
}

export default useMainImage
