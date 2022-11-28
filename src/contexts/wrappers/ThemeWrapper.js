import { createContext, useReducer } from 'react'
import themeReducer from '../reducers/theme-reducer'

export const ThemeModeContext = createContext()
const ThemeModeProvider = ThemeModeContext.Provider

export function ThemeModeWrapper({ children }) {
  const defaultMode = 'light'
  const storedThemeMode = localStorage.getItem('theme_mode')
  const [mode, dispatchThemeMode] = useReducer(
    themeReducer,
    storedThemeMode || defaultMode,
  )

  return (
    <ThemeModeProvider value={{ mode, dispatchThemeMode, defaultMode }}>
      {children}
    </ThemeModeProvider>
  )
}
