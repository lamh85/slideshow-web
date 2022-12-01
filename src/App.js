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

  const uploadClickHandler = async () => {
    const dirHandle = await window.showDirectoryPicker()

    const objectUrls = []

    for await (const entry of dirHandle.values()) {
      const { name } = entry
      const fileHandle = await dirHandle.getFileHandle(name)
      const fileData = await fileHandle.getFile()
      const objectUrl = URL.createObjectURL(fileData)

      objectUrls.push(objectUrl)
    }

    setImages(objectUrls)
    setIsLoadingImages(false)
    setPlayed([0])

    const indices = Array(objectUrls.length)
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
    const imageUrls = imageIndices.map((query) => images[query])

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
            src={getCurrentImage()}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onKeyDown={keyDownHandler}
          />
          <Toolbar
            handleShuffleClick={handleShuffleClick}
            thumbnails={thumbnails}
            currentImage={getCurrentImage()}
          />
        </div>
      ) : (
        <button onClick={uploadClickHandler}>CLICK ME</button>
      )}
    </div>
  )
}

export default App

const Toolbar = ({ handleShuffleClick, thumbnails, currentImage }) => {
  return (
    <div
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
          const isCurrent = url == currentImage

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
        }}
      >
        <button onClick={handleShuffleClick}>SHUFFLE</button>
      </div>
    </div>
  )
}
