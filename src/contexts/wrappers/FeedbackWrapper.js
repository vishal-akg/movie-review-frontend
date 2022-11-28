import { Alert, Snackbar } from '@mui/material'
import { createContext, useEffect, useReducer, useState } from 'react'
import feedbackReducer from '../reducers/feedback-reducer'

export const FeedbackContext = createContext()

export function FeedbackWrapper({ children }) {
  const [feedback, dispatchFeedback] = useReducer(feedbackReducer, {
    open: false,
    status: '',
    message: '',
  })
  const [open, setOpen] = useState(false)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  useEffect(() => {
    if (feedback.open) {
      setOpen(true)
    }
  }, [feedback])

  return (
    <FeedbackContext.Provider value={{ feedback, dispatchFeedback }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert sx={{ width: '100%' }} severity={feedback.status || 'info'}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </FeedbackContext.Provider>
  )
}
