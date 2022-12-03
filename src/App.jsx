import { useState, useEffect, useRef } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [images, setImages] = useState([]) // List of blob URLs
  const [playlist, setPlaylist] = useState([]) // Image indices
  const [played, setPlayed] = useState([]) // Image indices
  const [playlistCursor, setPlaylistCursor] = useState(0)
  const [thumbnails, setThumbnails] = useState([])
  // Because playlist doesn't work as dependency for useEffect
  const [shuffleCount, setShuffleCount] = useState(0)
  const [objectFit, setObjectFit] = useState('cover')

  const loadingRef = useRef(isLoadingImages)
  const imagesRef = useRef(images)
  const playlistRef = useRef(playlist)
  const playlistCursorRef = useRef(playlistCursor)
  const playedRef = useRef(played)

  const randomizeArray = (array) => {
    return array.sort((a, b) => {
      const randomNumber = Math.random()

      if (randomNumber > 0.5) {
        return 1
      } else {
        return -1
      }
    })
  }

  const handleShuffleClick = (_event) => {
    console.log('shuffling')
    setShuffleCount(shuffleCount + 1)
    setPlaylist(randomizeArray(playlist))
  }

  const handleToggleObjectFit = () => {
    const nextState = objectFit == 'contain' ? 'cover' : 'contain'
    setObjectFit(nextState)
  }

  const uploadClickHandler = async () => {
    const dirHandle = await window.showDirectoryPicker()

    const images = []

    for await (const entry of dirHandle.values()) {
      const { name } = entry
      const fileHandle = await dirHandle.getFileHandle(name)
      const fileData = await fileHandle.getFile()
      const objectUrl = URL.createObjectURL(fileData)

      const image = {
        blob: objectUrl,
        name,
      }

      images.push(image)
    }

    setImages(images)
    setIsLoadingImages(false)
    setPlayed([0])

    const indices = Array(images.length)
      .fill('')
      .map((_item, index) => index)
    setPlaylist(indices)
  }

  const navigatePlaylist = (increment) => {
    const maxPosition = imagesRef.current.length - 1

    if (increment > 0 && playlistCursorRef.current == maxPosition) {
      setPlaylistCursor(0)
    } else if (increment < 0 && playlistCursorRef.current == 0) {
      setPlaylistCursor(maxPosition)
    } else {
      setPlaylistCursor(playlistCursorRef.current + increment)
    }
  }

  const keyDownHandler = (event) => {
    if (loadingRef.current) {
      return
    }

    const { code } = event

    let increment = 0

    if (['ArrowDown', 'ArrowRight'].includes(code)) {
      increment = 1
    }

    if (['ArrowUp', 'ArrowLeft'].includes(code)) {
      increment = -1
    }

    navigatePlaylist(increment)
  }

  const getCurrentImage = () => {
    const imageIndex = playlist[playlistCursor]
    return images[imageIndex]
  }

  const updateThumbnails = () => {
    const thumbCountBefore = 2
    const thumbCountAfter = 2

    const sliceStart = Math.max(0, playlistCursor - thumbCountBefore)
    const sliceAfter = Math.min(
      playlist.length,
      playlistCursor + thumbCountAfter + 1
    )
    const imageIndices = playlist.slice(sliceStart, sliceAfter)
    const imageUrls = imageIndices.map((query) => images[query].blob)

    setThumbnails(imageUrls)
  }

  useEffect(() => {
    loadingRef.current = isLoadingImages
    imagesRef.current = images
    playlistRef.current = playlist
    playlistCursorRef.current = playlistCursor
    playedRef.current = played
  })

  useEffect(() => {
    const htmlElem = document.querySelector('html')
    htmlElem.addEventListener('keydown', keyDownHandler)

    return () => {
      htmlElem.removeEventListener('keydown', keyDownHandler)
    }
  }, [])

  useEffect(() => {
    const imagePlayed = playlist[playlistCursor]
    setPlayed([...played, imagePlayed])

    updateThumbnails()
  }, [playlistCursor])

  useEffect(updateThumbnails, [JSON.stringify(images), shuffleCount])

  return (
    <div
      className="App"
      style={{ width: '100%', height: '100%' }}
      // onKeyDown={keyDownHandler}
    >
      {!isLoadingImages ? (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <img
            src={getCurrentImage().blob}
            style={{ width: '100%', height: '100%', objectFit }}
            onKeyDown={keyDownHandler}
          />
          <Toolbar
            handleShuffleClick={handleShuffleClick}
            thumbnails={thumbnails}
            currentImage={getCurrentImage()}
            handleToggleObjectFit={handleToggleObjectFit}
          />
        </div>
      ) : (
        <button onClick={uploadClickHandler}>CLICK ME</button>
      )}
    </div>
  )
}

export default App

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

const Toolbar = ({
  handleShuffleClick,
  thumbnails,
  currentImage,
  handleToggleObjectFit,
}) => {
  const [shouldVisible, setShouldVisible] = useState(true)

  const handleMouseEnter = () => setShouldVisible(true)

  const handleMouseLeave = () => setShouldVisible(false)

  const getDate = (fileName) => {
    // EG: IMG_20191114_145429
    if (fileName.slice(0, 3) == 'IMG') {
      const dateRaw = fileName.slice(4, 12)
      const year = dateRaw.slice(0, 4)
      const month = dateRaw.slice(4, 6)
      const day = dateRaw.slice(6, 9)

      return `${Number(day)} ${MONTHS_BY_INDEX[Number(month)]} ${year}`
    } else {
      // EG: 2017-04-14 12.05.33
      const dateRaw = fileName.slice(0, 10)
      const dateParts = dateRaw.split('-')
      const year = dateParts[0]
      const month = dateParts[1]
      const day = dateParts[2]
      return `${Number(day)} ${MONTHS_BY_INDEX[Number(month)]} ${year}`
    }
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'absolute',
        bottom: 100,
        background: 'white',
        padding: '1em',
        fontWeight: 'bold',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        left: '50%',
        transform: 'translateX(-50%)',
        opacity: shouldVisible ? 1 : 0.1,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        {thumbnails.map((url) => {
          const isCurrent = url == currentImage.blob

          return (
            <img
              src={url}
              style={{
                width: '100px',
                height: '50px',
                border: isCurrent ? '3px solid yellow' : 'none',
              }}
              key={url}
            />
          )
        })}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          fontSize: '2em',
        }}
      >
        <div>{getDate(currentImage.name)}</div>
        <button onClick={handleShuffleClick} style={{ fontSize: '1em' }}>
          🔀
        </button>
        <button onClick={handleToggleObjectFit} style={{ fontSize: '1em' }}>
          ▣
        </button>
      </div>
    </div>
  )
}
