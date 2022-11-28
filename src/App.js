import { ThemeProvider } from '@emotion/react'
import { Routes, Route } from 'react-router-dom'
import theme from './theme'
import Index from './pages'
import Auth from './pages/auth'
import { useContext } from 'react'

import { FeedbackWrapper, ThemeModeContext, UserWrapper } from './contexts'
import { CssBaseline } from '@mui/material'

function App() {
  const { mode } = useContext(ThemeModeContext)

  return (
    <ThemeProvider theme={theme(mode)}>
      <CssBaseline />
      <UserWrapper>
        <FeedbackWrapper>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Index />} />
          </Routes>
        </FeedbackWrapper>
      </UserWrapper>
    </ThemeProvider>
  )
}

export default App
