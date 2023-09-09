import { useState, useEffect, useRef } from 'react'
import { Toolbar } from './Toolbar'
import EXIF from 'exif-js'

const Slideshow = ({
  isLoadingImages,
  playlist,
  setPlaylist,
  setPlaylistCursor,
  playlistCursor,
  images,
  setImages,
  played,
  setPlayed,
}) => {
  // Because playlist doesn't work as dependency for useEffect
  const [shuffleCount, setShuffleCount] = useState(0)
  const [objectFit, setObjectFit] = useState('cover')
  const [dateSorting, setDateSorting] = useState()
  const [thumbnails, setThumbnails] = useState([])
  const [exifExtracted, setExifExtracted] = useState({})
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')

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
    const htmlElem = document.querySelector('html')
    htmlElem.removeEventListener('keydown', keyDownHandler)
    htmlElem.addEventListener('keydown', keyDownHandler)

    return () => {
      htmlElem.removeEventListener('keydown', keyDownHandler)
    }
    // Must update the event handler to prevent stale states in the handler functions.
    // Dependencies should include every state required to run the handler
    // and its recursively called functions.
  }, [playlistCursor, images])

  useEffect(() => {
    const imagePlayed = playlist[playlistCursor]
    setPlayed([...played, imagePlayed])

    updateThumbnails()
    updateGeoOnChange()
  }, [playlistCursor])

  useEffect(updateThumbnails, [JSON.stringify(images), shuffleCount])

  useEffect(() => {
    updateGeoOnChange()
  }, [shuffleCount])

  useEffect(() => {
    const toSort = [...images]
    const sorted = toSort.sort((a, b) => {
      if (a.timeStamp > b.timeStamp) {
        return dateSorting === 'asc' ? 1 : -1
      } else {
        return dateSorting === 'asc' ? -1 : 1
      }
    })

    setImages(sorted)

    const newPlaylist = Array(sorted.length)
      .fill('')
      .map((_item, index) => index)

    setPlaylist(newPlaylist)
  }, [dateSorting])

  const getExifData = async (file) => {
    const arrayBuffer = await file.arrayBuffer()
    return EXIF.readFromBinaryFile(arrayBuffer)
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

  const getGpsFromExif = (exifOverride) => {
    const exifToAnalyze = exifOverride || exifExtracted

    if (Object.keys(exifToAnalyze).length === 0) {
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

  const navigatePlaylist = (increment) => {
    const maxPosition = images.length - 1

    if (increment > 0 && playlistCursor === maxPosition) {
      setPlaylistCursor(0)
    } else if (increment < 0 && playlistCursor === 0) {
      setPlaylistCursor(maxPosition)
    } else {
      setPlaylistCursor(playlistCursor + increment)
    }
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

    navigatePlaylist(increment)
  }

  const getCurrentImage = () => {
    const imageIndex = playlist[playlistCursor]
    return images[imageIndex]
  }

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

  const handleToggleObjectFit = () => {
    const nextState = objectFit === 'contain' ? 'cover' : 'contain'
    setObjectFit(nextState)
  }

  const handleSortDate = () => {
    const nextState = dateSorting === 'asc' ? 'desc' : 'asc'
    setDateSorting(nextState)
    setPlaylistCursor(0)
  }

  const handleShuffleClick = (_event) => {
    console.log('shuffling')
    setShuffleCount(shuffleCount + 1)
    setPlaylist(randomizeArray(playlist))
    setDateSorting('random')
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <img
        alt="something"
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
        objectFit={objectFit}
      />
    </div>
  )
}

export default Slideshow
