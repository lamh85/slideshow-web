import React, { useContext } from 'react'
import { useAppContext } from '../../App'
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
    handleToggleObjectFit,
    objectFit,
    navigateToEnd,
    currentImage,
  } = useContext(SlideshowContext)

  const { randomizeSort, sort, dateSorting, toggleGallery } = useAppContext()

  const buttonData: ButtonProps[] = [
    {
      onClick: navigateToHome,
      content: '⏮',
    },
    {
      onClick: randomizeSort,
      content: '🔀',
    },
    {
      onClick: handleToggleObjectFit,
      content: '▣',
      caption: objectFit,
    },
    {
      onClick: () => sort(dateSorting === 'asc' ? 'desc' : 'asc'),
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
    {
      onClick: toggleGallery,
      content: '⋮⋮⋮',
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
