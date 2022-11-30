import { useState, useEffect, useRef } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [playlist, setPlaylist] = useState() // Image indices
  const [viewedPosition, setViewedPosition] = useState(0)

  const loadingRef = useRef(isLoadingImages)
  const imageDataUrlRef = useRef(playlist)
  const viewedPositionRef = useRef(viewedPosition)

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

    setPlaylist(objectUrls)

    setIsLoadingImages(false)
  }

  const navigatePlaylist = (increment) => {
    const maxPosition = imageDataUrlRef.current.length - 1

    if (increment > 0 && viewedPositionRef.current == maxPosition) {
      setViewedPosition(0)
    } else if (increment < 0 && viewedPositionRef.current == 0) {
      setViewedPosition(maxPosition)
    } else {
      setViewedPosition(viewedPositionRef.current + increment)
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

  useEffect(() => {
    loadingRef.current = isLoadingImages
    imageDataUrlRef.current = playlist
    viewedPositionRef.current = viewedPosition
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
            src={playlist[viewedPosition]}
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
