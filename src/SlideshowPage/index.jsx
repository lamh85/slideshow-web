import { Toolbar } from './Toolbar'
import { SlideshowProvider } from './SlideshowContext'
import { GpsBar } from './GpsBar'
import { MainImage } from './MainImage'
import styles from './Slideshowpage.module.css'

const Slideshow = () => {
  return (
    <SlideshowProvider>
      <div className={styles.container}>
        <MainImage />
        <Toolbar />
        <GpsBar />
      </div>
    </SlideshowProvider>
  )
}

export default Slideshow
