import { useContext } from 'react'
import { SlideshowContext } from '../SlideshowContext'

export const DateForm = () => {
  const { dateSorting, navigateToDate } = useContext(SlideshowContext)

  if (dateSorting === 'random') {
    return <div>Sort by date to enable date navigation.</div>
  }

  return (
    <div>
      <button onClick={() => navigateToDate('2020-01')}>NAVIGATE!</button>
    </div>
  )
}
