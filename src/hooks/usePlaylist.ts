import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { Image } from '../types'

export type ThumbnailT = {
  playlistCursor: number
  blob: string
}

type DateSortOptions = 'asc' | 'desc' | 'random'
type Playlist = number[]

type UsePlaylistResult = {
  playlist: Playlist
  playlistCursor: number
  setPlaylistCursor: Dispatch<SetStateAction<number>>
  thumbnails: ThumbnailT[]
  dateSorting: DateSortOptions
  sort: (override?: DateSortOptions) => void
  randomizeSort: (_event: any) => void
  images: Image[]
  setImages: Dispatch<SetStateAction<Image[]>>
  galleryImages: Image[]
}

function usePlaylist(): UsePlaylistResult {
  const [playlistCursor, setPlaylistCursor] = useState(0)
  // Each number is an index of `images` array
  // playlist = [2, 0, 1]
  const [playlist, setPlaylist] = useState<Playlist>([])
  const [images, setImages] = useState<Image[]>([])

  const [dateSorting, setDateSorting] = useState<'asc' | 'desc' | 'random'>(
    'asc'
  )

  const getThumbnails = (): ThumbnailT[] => {
    const thumbCountBefore = 2
    const thumbCountAfter = 2

    const sliceStart = Math.max(0, playlistCursor - thumbCountBefore)
    const sliceAfter = Math.min(
      playlist.length,
      playlistCursor + thumbCountAfter + 1
    )
    const imageIndices = playlist.slice(sliceStart, sliceAfter)

    return imageIndices.map((imageIndex) => {
      return {
        playlistCursor: playlist.findIndex((item) => item === imageIndex),
        blob: images[imageIndex].blob,
      }
    })
  }

  const handleSortDate = (override?: 'asc' | 'desc') => {
    let nextState = ''
    if (override) {
      nextState = override
    } else {
      nextState = dateSorting === 'asc' ? 'desc' : 'asc'
    }

    setDateSorting(nextState)
    setPlaylistCursor(0)

    const toSort = [...images].map((image, index) => {
      return { ...image, imagesIndex: index }
    })

    const sorted = toSort.sort((a, b) => {
      if (a.timeStamp > b.timeStamp) {
        return nextState === 'asc' ? 1 : -1
      } else {
        return nextState === 'asc' ? -1 : 1
      }
    })
    const newPlaylist = sorted.map((image) => image.imagesIndex)
    setPlaylist(newPlaylist)
  }

  const randomizeArray = (array) => {
    return [...array].sort((a, b) => {
      const randomNumber = Math.random()

      if (randomNumber > 0.5) {
        return 1
      } else {
        return -1
      }
    })
  }

  const handleShuffleClick = (_event) => {
    const newPlaylist = randomizeArray(playlist)
    setPlaylist(newPlaylist)
    setPlaylistCursor(0)
    setDateSorting('random')
  }

  const galleryImages = playlist.map((imageIndex) => images[imageIndex])

  useEffect(() => {
    handleSortDate('asc')
  }, [images])

  return {
    playlist,
    playlistCursor,
    setPlaylistCursor,
    thumbnails: getThumbnails(),
    dateSorting,
    sort: handleSortDate,
    randomizeSort: handleShuffleClick,
    images,
    setImages,
    galleryImages,
  }
}

export default usePlaylist
