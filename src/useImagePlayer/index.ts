import { useEffect, useState } from 'react'
import useExif from './useExif.ts'
import { fileNameToMoment } from '../helpers/time'

export interface ImageT {
  blob: string
  name: string
  timeStamp: string
  fileData: FileSystemFileEntry
}

const MONTHS_BY_INDEX = [
  null,
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

type NavigateArgsT = {
  increment: number
  index: number
}

export type ThumbnailT = {
  playlistCursor: number
  blob: string
}

function useImagePlayer(images: ImageT[]) {
  const [playlistCursor, setPlaylistCursor] = useState(0)
  // Each number is an index of `images` array
  // image = [{}, {}, {}]
  // playlist = [2, 0, 1]
  const [playlist, setPlaylist] = useState<number[] | []>([])

  const [objectFit, setObjectFit] = useState<'cover' | 'contain'>('cover')
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

  const getMainImage = () => {
    const imageIndex = playlist[playlistCursor]

    return images[imageIndex]
  }

  const getDate = () => {
    const mainImage = getMainImage()

    if (!mainImage) {
      return ''
    }

    const fileName = mainImage.name

    const momentDate = fileNameToMoment(fileName)
    const date = momentDate.date()
    const monthName = MONTHS_BY_INDEX[momentDate.month()]
    const year = momentDate.year()

    return `${date} ${monthName} ${year}`
  }

  const handleToggleObjectFit = () => {
    const nextState = objectFit === 'contain' ? 'cover' : 'contain'
    setObjectFit(nextState)
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

  const incrementPlaylistCursor = (increment: number) => {
    const maxPosition = images.length - 1

    if (increment > 0 && playlistCursor === maxPosition) {
      setPlaylistCursor(0)
    } else if (increment < 0 && playlistCursor === 0) {
      setPlaylistCursor(maxPosition)
    } else {
      setPlaylistCursor(playlistCursor + increment)
    }
  }

  const navigatePlaylist = (args: Partial<NavigateArgsT>) => {
    if (args.increment) {
      incrementPlaylistCursor(args.increment)
      return
    } else if (args.index) {
      setPlaylistCursor(args.index)
    }
  }

  const navigateToDate = (selectedDate: string) => {
    if (
      !['asc', 'desc'].includes(dateSorting) ||
      // Must be YYYY or YYYY-MM
      selectedDate.match(/[0-9]{4}(-[0-9]{2})?/) === null
    ) {
      return
    }

    const playlistWithDates = playlist.map((imageIndex: number) => ({
      index: imageIndex,
      timeStamp: images[imageIndex].timeStamp,
    }))

    const filteredByDate = playlistWithDates.filter((image) => {
      if (dateSorting === 'asc') {
        return image.timeStamp >= selectedDate
      } else {
        return image.timeStamp <= selectedDate
      }
    })

    const playlistIndex = playlist.findIndex(
      (imageIndex) => imageIndex === filteredByDate[0].index
    )

    navigatePlaylist({ index: playlistIndex })
  }

  const keyDownHandler = (event) => {
    const { code } = event

    let increment = 0

    if (['ArrowDown', 'ArrowRight'].includes(code)) {
      increment = 1
    }

    if (['ArrowUp', 'ArrowLeft'].includes(code)) {
      increment = -1
    }

    navigatePlaylist({ increment })
  }

  useEffect(() => {
    const htmlElem = document.querySelector('html')
    htmlElem?.removeEventListener('keydown', keyDownHandler)
    htmlElem?.addEventListener('keydown', keyDownHandler)

    return () => {
      htmlElem?.removeEventListener('keydown', keyDownHandler)
    }
    // Must update the event handler to prevent stale states in the handler functions.
    // Dependencies should include every state required to run the handler
    // and its recursively called functions.
  }, [playlistCursor, images])

  useEffect(() => {
    handleSortDate('asc')
  }, [])

  const { city, country, gpsFromExif, exifExtracted, isLoadingGeoNames } =
    useExif({
      playlist,
      playlistCursor,
      images,
    })

  return {
    thumbnails: getThumbnails(),
    mainImage: getMainImage(),
    date: getDate(),
    city,
    country,
    objectFit,
    gpsFromExif,
    exifExtracted,
    isLoadingGeoNames,
    dateSorting,
    keyDownHandler,
    sort: handleSortDate,
    navigate: navigatePlaylist,
    navigateToDate,
    setObjectFit: handleToggleObjectFit,
    randomizeSort: handleShuffleClick,
  }
}

export default useImagePlayer
