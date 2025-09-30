import React, { useContext } from 'react'
import { SlideshowContext } from '../SlideshowContext'

type ButtonProps = {
  onClick: (event?) => void
  style?: object
  content: React.ReactNode
  caption?: string
}

export function ButtonsRow() {
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

  const buttonData: ButtonProps[] = [
    {
      onClick: navigateToHome,
      content: '⏮',
    },
    {
      onClick: handleShuffleClick,
      content: '🔀',
    },
    {
      onClick: handleToggleObjectFit,
      content: '▣',
      caption: objectFit,
    },
    {
      onClick: () => handleSortDate(dateSorting === 'asc' ? 'desc' : 'asc'),
      content: '📅',
      caption: dateSorting,
    },
    {
      onClick: navigateToEnd,
      content: '⏭',
    },
    {
      onClick: () => window.open(currentImage?.blob, '_blank').focus(),
      content: '👁',
    },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      {buttonData.map((item, index) => (
        <Button
          key={index}
          onClick={item.onClick}
          style={item.style}
          content={item.content}
          caption={item.caption}
        />
      ))}
    </div>
  )
}

function Button({
  onClick = () => {},
  style = {},
  content,
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
        {content}
      </button>
      <div style={{ fontSize: '15px' }}>{caption}</div>
    </div>
  )
}
