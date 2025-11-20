import { useState, useContext } from 'react'
import { useAppContext } from '../../App'
import { SlideshowContext } from '../SlideshowContext'
import { DateForm } from './DateForm'
import { ButtonsRow } from './ButtonRow'

export const Toolbar = () => {
  const [shouldVisible, setShouldVisible] = useState(true)

  const handleMouseEnter = () => setShouldVisible(true)

  const handleMouseLeave = () => setShouldVisible(false)

  const { thumbnails } = useAppContext()

  const { currentImage, navigateToIndex, date } = useContext(SlideshowContext)

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'absolute',
        background: 'white',
        padding: '1em',
        fontWeight: 'bold',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: shouldVisible ? 0.75 : 0.1,
        bottom: 0,
        left: 0,
        right: 0,
        height: '150px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        {thumbnails.map((thumbnail) => {
          const isCurrent = thumbnail.blob === currentImage.blob

          return (
            <img
              src={thumbnail.blob}
              style={{
                width: '100px',
                height: '50px',
                border: isCurrent ? '3px solid yellow' : 'none',
                cursor: 'pointer',
              }}
              key={thumbnail.blob}
              alt="Thumbnail"
              onClick={() => navigateToIndex(thumbnail.playlistCursor)}
            />
          )
        })}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          fontSize: '2em',
          alignItems: 'center',
        }}
      >
        <div
          style={{ fontSize: '20px', marginRight: '5px', whiteSpace: 'nowrap' }}
        >
          <div>{date}</div>
          <Location />
        </div>
        <ButtonsRow />
        <DateForm />
      </div>
    </div>
  )
}

const Location = () => {
  const { city, country, isLoadingGeoNames } = useContext(SlideshowContext)

  if (isLoadingGeoNames) {
    return <div>Loading city and country...</div>
  }

  if (!city || !country || city.length === 0 || country.length === 0) {
    return <div>No location data found.</div>
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <img
        src={`https://flagcdn.com/${country.toLowerCase()}.svg`}
        style={{
          height: '1em',
          marginRight: '5px',
          border: '1px solid lightgrey',
          borderRadius: '3px',
        }}
        alt={`Flag of ${country}`}
      />
      <div>{city}</div>
    </div>
  )
}
