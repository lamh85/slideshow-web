import { useEffect } from 'react'
import { Image } from '../types'

interface Options {
  playlistCursor: number
  images: Image[]
  playlist: number[]
  setPlaylistCursor: (number) => void
  dateSorting: 'asc' | 'desc' | 'random'
}

type NavigateArgsT = {
  increment: number
  index: number
}

const useNavigation = (options: Options) => {
  const { images, playlistCursor, playlist, setPlaylistCursor, dateSorting } =
    options

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

  return {
    keyDownHandler,
    navigate: navigatePlaylist,
    navigateToDate,
  }
}

export default useNavigation
