import { useState, useContext } from 'react'
import { SlideshowContext } from '../SlideshowContext'
import { useAppContext } from '../../App'

export const DateForm = () => {
  const { navigateToDate } = useContext(SlideshowContext)

  const { images, dateSorting } = useAppContext()

  const getImageYears = () => {
    const duplicated = images.map((x) => x.timeStamp.split('-')[0])
    const deduped = new Set(duplicated).values().toArray()
    return deduped.sort()
  }

  const [yearSelected, setYearSelected] = useState(() => getImageYears()[0])

  const baseStyles = { marginLeft: '10px' }
  const fontStyle = { fontSize: '17px' }

  if (dateSorting === 'random') {
    return (
      <div style={{ ...baseStyles, ...fontStyle, textAlign: 'left' }}>
        Sort by date to <br /> enable date navigation.
      </div>
    )
  }

  return (
    <div style={baseStyles}>
      <div style={{ ...fontStyle, marginBottom: '10px' }}>Date Navigation</div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <select
          value={yearSelected}
          onChange={(event) => setYearSelected(event.target.value)}
        >
          {getImageYears().map((year, index) => (
            <option key={index}>{year}</option>
          ))}
        </select>
        <button onClick={() => navigateToDate(yearSelected)}>Submit</button>
      </div>
    </div>
  )
}
