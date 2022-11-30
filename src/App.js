import { useState, useEffect, useRef } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [images, setImages] = useState([])
  const [playlist, setPlaylist] = useState([]) // Image indices
  const [played, setPlayed] = useState([]) // Image indices
  const [playlistCursor, setPlaylistCursor] = useState(0)

  const loadingRef = useRef(isLoadingImages)
  const imagesRef = useRef(images)
  const playlistCursorRef = useRef(playlistCursor)

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

  useEffect(() => {
    loadingRef.current = isLoadingImages
    imagesRef.current = images
    playlistCursorRef.current = playlistCursor
  })

  useEffect(() => {
    const htmlElem = document.querySelector('html')
    htmlElem.addEventListener('keydown', keyDownHandler)
  }, [])

  useEffect(() => {})

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
          <div
            style={{
              position: 'absolute',
              bottom: 100,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'white',
              padding: '1em',
              fontWeight: 'bold',
              borderRadius: '1em',
              opacity: 0.5,
              display: 'flex',
            }}
          >
            <button onClick={handleShuffleClick}>SHUFFLE</button>
          </div>
        </div>
      ) : (
        <button onClick={uploadClickHandler}>CLICK ME</button>
      )}
    </div>
  )
}

export default App
