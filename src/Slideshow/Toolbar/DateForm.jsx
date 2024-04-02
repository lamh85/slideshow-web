import { useState, useContext } from 'react'
import { SlideshowContext } from '../SlideshowContext'

export const DateForm = () => {
  const { images, dateSorting, navigateToDate } = useContext(SlideshowContext)

  const getImageYears = () => {
    const duplicated = images.map((x) => x.timeStamp.split('-')[0])
    const deduped = new Set(duplicated).values().toArray()
    return deduped.sort()
  }

  const [yearSelected, setYearSelected] = useState(() => getImageYears()[0])

  if (dateSorting === 'random') {
    return <div>Sort by date to enable date navigation.</div>
  }

  return (
    <div>
      <select
        value={yearSelected}
        onChange={(event) => setYearSelected(event.target.value)}
      >
        {getImageYears().map((year, index) => (
          <option key={index}>{year}</option>
        ))}
      </select>
      <button onClick={() => navigateToDate(yearSelected)}>NAVIGATE!</button>
    </div>
  )
}
