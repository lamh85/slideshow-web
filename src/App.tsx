import React, { createContext, useContext } from 'react'
import './App.css'
import usePlaylist from './hooks/usePlaylist'
import { useGallery } from './hooks/useGallery'
import { Router } from './Router'

const AppContext = createContext(null)

export const useAppContext = () => useContext(AppContext)

function App() {
  const useGalleryProps = useGallery()
  const usePlaylistProps = usePlaylist()

  return (
    <AppContext.Provider value={{ ...useGalleryProps, ...usePlaylistProps }}>
      <div className="App" style={{ width: '100%', height: '100%' }}>
        <Router />
      </div>
    </AppContext.Provider>
  )
}

export default App
