// contexts/SettingsContext.tsx
'use client'
import React, { createContext, useState, useContext, useEffect } from 'react'

interface SettingsContextType {
  primaryColor: string
  setPrimaryColor: (color: string) => void
  fontSize: string
  setFontSize: (size: string) => void
  isDarkMode: boolean
  setIsDarkMode: (isDark: boolean) => void
  language: string
  setLanguage: (lang: string) => void
  fontFamily: string
  setFontFamily: (font: string) => void
  borderRadius: string
  setBorderRadius: (radius: string) => void
  animationsEnabled: boolean
  setAnimationsEnabled: (enabled: boolean) => void
  sidebarPosition: 'left' | 'right'
  setSidebarPosition: (position: 'left' | 'right') => void
  contentWidth: 'full' | 'limited'
  setContentWidth: (width: 'full' | 'limited') => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState('#007bff')
  const [fontSize, setFontSize] = useState('16')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [language, setLanguage] = useState('ar')
  const [fontFamily, setFontFamily] = useState('Arial')
  const [borderRadius, setBorderRadius] = useState('4')
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>('right')
  const [contentWidth, setContentWidth] = useState<'full' | 'limited'>('limited')

  useEffect(() => {
    const savedSettings = localStorage.getItem('siteSettings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setPrimaryColor(settings.primaryColor || '#007bff')
      setFontSize(settings.fontSize || '16')
      setIsDarkMode(settings.isDarkMode || false)
      setLanguage(settings.language || 'ar')
      setFontFamily(settings.fontFamily || 'Arial')
      setBorderRadius(settings.borderRadius || '4')
      setAnimationsEnabled(settings.animationsEnabled !== false)
      setSidebarPosition(settings.sidebarPosition || 'right')
      setContentWidth(settings.contentWidth || 'limited')
    }
  }, [])

  useEffect(() => {
    const settings = {
      primaryColor,
      fontSize,
      isDarkMode,
      language,
      fontFamily,
      borderRadius,
      animationsEnabled,
      sidebarPosition,
      contentWidth
    }
    localStorage.setItem('siteSettings', JSON.stringify(settings))

    // Apply settings to document
    document.documentElement.style.setProperty('--primary-color', primaryColor)
    document.documentElement.style.fontSize = `${fontSize}px`
    document.documentElement.style.fontFamily = fontFamily
    document.documentElement.style.setProperty('--border-radius', `${borderRadius}px`)
    document.documentElement.classList.toggle('dark', isDarkMode)
    document.documentElement.classList.toggle('rtl', language === 'ar')
    document.documentElement.classList.toggle('animations-enabled', animationsEnabled)
    document.documentElement.setAttribute('data-sidebar', sidebarPosition)
    document.documentElement.setAttribute('data-content-width', contentWidth)
  }, [primaryColor, fontSize, isDarkMode, language, fontFamily, borderRadius, animationsEnabled, sidebarPosition, contentWidth])

  return (
    <SettingsContext.Provider value={{
      primaryColor, setPrimaryColor,
      fontSize, setFontSize,
      isDarkMode, setIsDarkMode,
      language, setLanguage,
      fontFamily, setFontFamily,
      borderRadius, setBorderRadius,
      animationsEnabled, setAnimationsEnabled,
      sidebarPosition, setSidebarPosition,
      contentWidth, setContentWidth
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}