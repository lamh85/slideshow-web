import { Toolbar } from './Toolbar'
import { SlideshowProvider } from './SlideshowContext'
import { GpsBar } from './GpsBar'
import { MainImage } from './MainImage'

const Slideshow = ({ isLoadingImages, images }) => {
  return (
    <SlideshowProvider images={images}>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <MainImage />
        <Toolbar />
        <GpsBar />
      </div>
    </SlideshowProvider>
  )
}

export default Slideshow
