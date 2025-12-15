import React from 'react'
import {
  FaBackwardFast,
  FaShuffle,
  FaArrowsUpDown,
  FaClock,
  FaForwardFast,
  FaMaximize,
  FaTableCells,
} from 'react-icons/fa6'
import { type IconType } from 'react-icons'
import { useAppContext } from '../../App'
import { useSlideshowContext } from '../SlideshowContext'

type ButtonProps = {
  onClick: (event?) => void
  style?: object
  icon: IconType
  caption?: string
}

export function ButtonsRow() {
  const {
    navigateToHome,
    handleToggleObjectFit,
    objectFit,
    navigateToEnd,
    currentImage,
  } = useSlideshowContext()

  const { randomizeSort, sort, dateSorting, toggleGallery } = useAppContext()

  const buttonData: ButtonProps[] = [
    {
      onClick: navigateToHome,
      icon: FaBackwardFast,
    },
    {
      onClick: randomizeSort,
      icon: FaShuffle,
    },
    {
      onClick: handleToggleObjectFit,
      icon: FaArrowsUpDown,
      caption: objectFit,
    },
    {
      onClick: () => sort(dateSorting === 'asc' ? 'desc' : 'asc'),
      icon: FaClock,
      caption: dateSorting,
    },
    {
      onClick: navigateToEnd,
      icon: FaForwardFast,
    },
    {
      onClick: () => window.open(currentImage?.blob, '_blank').focus(),
      icon: FaMaximize,
    },
    {
      onClick: toggleGallery,
      icon: FaTableCells,
      style: { fontWeight: 'bold', letterSpacing: '0.1px' },
    },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      {buttonData.map((item, index) => (
        <Button
          key={index}
          onClick={item.onClick}
          style={item.style}
          caption={item.caption}
          icon={item.icon}
        ></Button>
      ))}
    </div>
  )
}

function Button({
  onClick = () => {},
  style = {},
  icon,
  caption,
}: ButtonProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <button
        onClick={onClick}
        style={{
          fontSize: '20px',
          height: '40px',
          padding: '5px',
          width: '55px',
          ...style,
        }}
      >
        {icon({})}
      </button>
      <div style={{ fontSize: '15px' }}>{caption}</div>
    </div>
  )
}
