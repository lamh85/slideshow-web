import { useState, useEffect, useRef } from 'react'
import logo from './logo.svg'
import './App.css'
import { Toolbar } from './Toolbar'
import EXIF from 'exif-js'

function App() {
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [images, setImages] = useState([]) // List of blob URLs
  const [playlist, setPlaylist] = useState([]) // Image indices
  const [played, setPlayed] = useState([]) // Image indices
  const [playlistCursor, setPlaylistCursor] = useState()
  const [thumbnails, setThumbnails] = useState([])
  // Because playlist doesn't work as dependency for useEffect
  const [shuffleCount, setShuffleCount] = useState(0)
  const [objectFit, setObjectFit] = useState('cover')
  const [dateSorting, setDateSorting] = useState()
  const [exifExtracted, setExifExtracted] = useState({})
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')

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

  const handleSortDate = () => {
    const nextState = dateSorting == 'asc' ? 'desc' : 'asc'
    setDateSorting(nextState)
    setPlaylistCursor(0)
  }

  const getTimeStamp = (fileName) => {
    // EG: IMG_20191114_145429
    if (fileName.slice(0, 3) == 'IMG') {
      const dateRaw = fileName.slice(4, 12)
      const year = dateRaw.slice(0, 4)
      const month = dateRaw.slice(4, 6)
      const day = dateRaw.slice(6, 9)

      return `${year}-${month}-${day}`
    } else {
      // EG: 2017-04-14 12.05.33
      const dateRaw = fileName.slice(0, 10)
      const dateParts = dateRaw.split('-')
      const year = dateParts[0]
      const month = dateParts[1]
      const day = dateParts[2]
      return `${year}-${month}-${day}`
    }
  }

  const getExifData = async (file) => {
    const arrayBuffer = await file.arrayBuffer()
    return EXIF.readFromBinaryFile(arrayBuffer)
  }

  const uploadClickHandler = async () => {
    const dirHandle = await window.showDirectoryPicker()

    const images = []

    for await (const entry of dirHandle.values()) {
      const { name } = entry

      if (!name.includes('.jpg')) {
        continue
      }

      const fileHandle = await dirHandle.getFileHandle(name)
      const fileData = await fileHandle.getFile()
      const blob = URL.createObjectURL(fileData)

      const image = {
        blob,
        name,
        timeStamp: getTimeStamp(name),
        fileData,
      }

      images.push(image)
    }

    setImages(images)
    setIsLoadingImages(false)
    setPlayed([0])
    setPlaylistCursor(0)

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

  const getGpsFromExif = (exifOverride) => {
    const exifToAnalyze = exifOverride || exifExtracted

    if (Object.keys(exifToAnalyze).length == 0) {
      return { isValid: false }
    }

    const { GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef } =
      exifToAnalyze

    if (
      [GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef].includes(
        undefined
      )
    ) {
      return { isValid: false }
    }

    return {
      GPSLatitude,
      GPSLatitudeRef,
      GPSLongitude,
      GPSLongitudeRef,
      isValid: true,
    }
  }

  const getGpsString = () => {
    const extractedGps = getGpsFromExif()

    if (!extractedGps.isValid) {
      return ''
    }

    const { GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef } =
      exifExtracted

    return `${GPSLatitude[0]}°${GPSLatitude[1]}'${GPSLatitude[2]}"${GPSLatitudeRef} ${GPSLongitude[0]}°${GPSLongitude[1]}'${GPSLongitude[2]}"${GPSLongitudeRef}`
  }

  const updateGeoOnChange = async () => {
    setExifExtracted({})
    const imageIndex = playlist[playlistCursor]
    const imageObj = images[imageIndex]
    const fileData = imageObj?.fileData

    if (!fileData) {
      return
    }

    const exif = await getExifData(fileData)
    setExifExtracted(exif)

    const extractedGps = getGpsFromExif(exif)
    if (!extractedGps.isValid) {
      console.log('No GPS data found in Exif.')
      setCity('')
      setCountry('')
      return
    }

    const { GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef } =
      extractedGps

    const res = await fetch(`
      http://localhost:3001/geo_names?longtitude=${GPSLongitude[0]}°${GPSLongitude[1]}&longtitudeDirection=${GPSLongitudeRef}&latitude=${GPSLatitude[0]}°${GPSLatitude[1]}&latitudeDirection=${GPSLatitudeRef}
    `)

    const responseJson = await res.json()
    setCity(responseJson.city)
    setCountry(responseJson.country)
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
    updateGeoOnChange()
  }, [playlistCursor])

  useEffect(updateThumbnails, [JSON.stringify(images), shuffleCount])

  useEffect(() => {
    const toSort = [...images]
    const sorted = toSort.sort((a, b) => {
      if (a.timeStamp > b.timeStamp) {
        return dateSorting == 'asc' ? 1 : -1
      } else {
        return dateSorting == 'asc' ? -1 : 1
      }
    })

    setImages(sorted)

    const newPlaylist = Array(sorted.length)
      .fill('')
      .map((_item, index) => index)
    setPlaylist(newPlaylist)
  }, [dateSorting])

  return (
    <div className="App" style={{ width: '100%', height: '100%' }}>
      {!isLoadingImages ? (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <img
            src={getCurrentImage().blob}
            style={{ width: '100%', height: '100%', objectFit }}
            onKeyDown={keyDownHandler}
          />
          <div
            style={{
              background: 'white',
              left: 0,
              bottom: 0,
              position: 'absolute',
            }}
          >
            {getGpsString()}
          </div>
          <Toolbar
            handleShuffleClick={handleShuffleClick}
            thumbnails={thumbnails}
            currentImage={getCurrentImage()}
            handleToggleObjectFit={handleToggleObjectFit}
            dateSorting={dateSorting}
            handleSortDate={handleSortDate}
            navigateToHome={() => setPlaylistCursor(0)}
            navigateToEnd={() => setPlaylistCursor(playlist.length - 1)}
            city={city}
            country={country}
          />
        </div>
      ) : (
        <button onClick={uploadClickHandler}>CLICK ME</button>
      )}
    </div>
  )
}

export default App
