import { useState, useContext } from 'react'
import { SlideshowContext } from './SlideshowContext'

export const Toolbar = () => {
  const [shouldVisible, setShouldVisible] = useState(true)

  const handleMouseEnter = () => setShouldVisible(true)

  const handleMouseLeave = () => setShouldVisible(false)

  const { thumbnails, currentImage, navigateToIndex, date } =
    useContext(SlideshowContext)

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'absolute',
        bottom: 100,
        background: 'white',
        padding: '1em',
        fontWeight: 'bold',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        left: '50%',
        transform: 'translateX(-50%)',
        opacity: shouldVisible ? 1 : 0.1,
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

const Button = (props) => {
  return (
    <button
      {...props}
      style={{
        fontSize: '20px',
        height: '40px',
        padding: '5px',
        width: '55px',
      }}
    >
      {props.children}
    </button>
  )
}

const ButtonsRow = () => {
  const {
    navigateToHome,
    handleShuffleClick,
    handleToggleObjectFit,
    objectFit,
    handleSortDate,
    dateSorting,
    navigateToEnd,
    currentImage,
  } = useContext(SlideshowContext)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      <Button onClick={navigateToHome}>⏮</Button>
      <Button onClick={handleShuffleClick}>🔀</Button>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Button style={{ fontSize: '30px' }} onClick={handleToggleObjectFit}>
          ▣
        </Button>
        <div style={{ fontSize: '15px' }}>{objectFit}</div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Button
          onClick={() => handleSortDate(dateSorting === 'asc' ? 'desc' : 'asc')}
        >
          📅
        </Button>
        <div style={{ fontSize: '15px' }}>{dateSorting}</div>
      </div>
      <Button onClick={navigateToEnd}>⏭</Button>
      <Button onClick={() => window.open(currentImage?.blob, '_blank').focus()}>
        👁
      </Button>
    </div>
  )
}
