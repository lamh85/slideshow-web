import { useEffect } from 'react'
import { Toolbar } from './Toolbar'
import useImagePlayer from '../useImagePlayer.ts'

const Slideshow = ({ isLoadingImages, images }) => {
  const {
    thumbnails,
    mainImage,
    date,
    city,
    country,
    objectFit,
    gpsFromExif,
    exifExtracted,
    dateSorting,
    keyDownHandler,
    sort,
    navigate,
    setObjectFit,
    randomizeSort,
  } = useImagePlayer(images)

  const getGpsString = () => {
    if (!gpsFromExif?.isValid) {
      return ''
    }

    const { GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef } =
      exifExtracted

    return `${GPSLatitude[0]}°${GPSLatitude[1]}'${GPSLatitude[2]}"${GPSLatitudeRef} ${GPSLongitude[0]}°${GPSLongitude[1]}'${GPSLongitude[2]}"${GPSLongitudeRef}`
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <img
        alt="something"
        src={mainImage?.blob || ''}
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
        handleShuffleClick={randomizeSort}
        thumbnails={thumbnails}
        currentImage={mainImage}
        handleToggleObjectFit={setObjectFit}
        dateSorting={dateSorting}
        handleSortDate={sort}
        navigateToHome={() => navigate(0)}
        navigateToEnd={() => navigate(images.length - 1)}
        city={city}
        country={country}
        objectFit={objectFit}
        date={date}
      />
    </div>
  )
}

export default Slideshow
