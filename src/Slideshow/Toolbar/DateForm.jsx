import { useContext } from 'react'
import { SlideshowContext } from '../SlideshowContext'

export const DateForm = () => {
  const { images, dateSorting } = useContext(SlideshowContext)
  console.log(images.map((image) => image.timeStamp))
  console.log(dateSorting)

  if (dateSorting === 'random') {
    return <div>Sort by date to enable date navigation.</div>
  }

  return <div>date form!!!</div>
}
