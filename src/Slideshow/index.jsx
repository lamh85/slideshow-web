import { Toolbar } from './Toolbar'
import { SlideshowProvider } from './SlideshowContext'

const Slideshow = ({ isLoadingImages, images }) => {
  // const getGpsString = () => {
  //   if (!gpsFromExif?.isValid) {
  //     return ''
  //   }

  //   const { GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef } =
  //     exifExtracted

  //   return `${GPSLatitude[0]}°${GPSLatitude[1]}'${GPSLatitude[2]}"${GPSLatitudeRef} ${GPSLongitude[0]}°${GPSLongitude[1]}'${GPSLongitude[2]}"${GPSLongitudeRef}`
  // }

  return (
    <SlideshowProvider>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {/* TODO: move to component  */}
        <img
          alt="something"
          src={mainImage?.blob || ''}
          style={{ width: '100%', height: '100%', objectFit }}
          onKeyDown={keyDownHandler}
        />
        {/* TODO: move to component  */}
        {/* <div
          style={{
            background: 'white',
            left: 0,
            bottom: 0,
            position: 'absolute',
          }}
        >
          {getGpsString()}
        </div> */}
        <Toolbar />
      </div>
    </SlideshowProvider>
  )
}

export default Slideshow
