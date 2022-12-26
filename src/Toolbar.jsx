import { useState } from 'react'

const MONTHS_BY_INDEX = [
  null,
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const Toolbar = ({
  handleShuffleClick,
  thumbnails,
  currentImage,
  handleToggleObjectFit,
  dateSorting,
  handleSortDate,
  navigateToHome,
  navigateToEnd,
  city,
  country,
  countryFlag,
  objectFit,
}) => {
  const [shouldVisible, setShouldVisible] = useState(true)

  const handleMouseEnter = () => setShouldVisible(true)

  const handleMouseLeave = () => setShouldVisible(false)

  const getDate = (fileName) => {
    // EG: IMG_20191114_145429
    if (fileName.slice(0, 3) == 'IMG') {
      const dateRaw = fileName.slice(4, 12)
      const year = dateRaw.slice(0, 4)
      const month = dateRaw.slice(4, 6)
      const day = dateRaw.slice(6, 9)

      return `${Number(day)} ${MONTHS_BY_INDEX[Number(month)]} ${year}`
    } else {
      // EG: 2017-04-14 12.05.33
      const dateRaw = fileName.slice(0, 10)
      const dateParts = dateRaw.split('-')
      const year = dateParts[0]
      const month = dateParts[1]
      const day = dateParts[2]
      return `${Number(day)} ${MONTHS_BY_INDEX[Number(month)]} ${year}`
    }
  }

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
        {thumbnails.map((url) => {
          const isCurrent = url == currentImage.blob

          return (
            <img
              src={url}
              style={{
                width: '100px',
                height: '50px',
                border: isCurrent ? '3px solid yellow' : 'none',
              }}
              key={url}
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
          <div>{getDate(currentImage.name)}</div>
          <div>
            {city.length > 0 && country.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <img
                  src={countryFlag}
                  height="25px"
                  style={{
                    marginRight: '5px',
                    border: '1px solid lightgrey',
                    borderRadius: '3px',
                  }}
                />
                <div>{city}</div>
              </div>
            ) : (
              'No location data found.'
            )}
          </div>
        </div>
        <ButtonsRow
          navigateToHome={navigateToHome}
          handleShuffleClick={handleShuffleClick}
          handleToggleObjectFit={handleToggleObjectFit}
          objectFit={objectFit}
          handleSortDate={handleSortDate}
          dateSorting={dateSorting}
          navigateToEnd={navigateToEnd}
        />
      </div>
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

const ButtonsRow = ({
  navigateToHome,
  handleShuffleClick,
  handleToggleObjectFit,
  objectFit,
  handleSortDate,
  dateSorting,
  navigateToEnd
}) => {
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
        <Button onClick={handleSortDate}>📅</Button>
        <div style={{ fontSize: '15px' }}>{dateSorting}</div>
      </div>
      <Button onClick={navigateToEnd}>⏭</Button>
    </div>
  )
}
